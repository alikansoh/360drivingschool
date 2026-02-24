import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";

/**
 * FormModal
 * - Mirrors the header form fields (no "best time to contact" selector).
 * - Receives `selectedItem` from the page (package/course + transmission).
 * - Shows improved confirmation after save.
 * - Larger, more prominent close (exit) control.
 *
 * NOTE: Hooks must be called in the same order on every render.
 * The EmailJS init useEffect and the EmailJS-related constants are placed
 * above the early `if (!isVisible) return null;` check so the hook count
 * never changes between renders (fixes "Rendered more hooks..." error).
 */

function getClientEnv(key, fallback = "") {
  try {
    if (typeof process !== "undefined" && process?.env && process.env[key]) {
      return process.env[key];
    }
    if (typeof import.meta !== "undefined" && import.meta?.env) {
      if (import.meta.env[key]) return import.meta.env[key];
      if (key.startsWith("REACT_APP_")) {
        const viteKey = "VITE_" + key.slice("REACT_APP_".length);
        if (import.meta.env[viteKey]) return import.meta.env[viteKey];
      }
      const alt = key.replace(/^REACT_APP_/, "VITE_");
      if (import.meta.env[alt]) return import.meta.env[alt];
    }
  } catch (err) {
    // swallow and return fallback
  }
  return fallback;
}

const FormModal = ({ isVisible, onClose, selectedItem }) => {
  // --- Hooks and state (must be declared before any early return) ---
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedBooking, setSavedBooking] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      contactMethod: "phone",
      bookingMode: (selectedItem?.transmission || "Manual").toLowerCase(),
      location: "",
      packageName: selectedItem?.name || "General Enq",
      honeypot: "",
    },
  });

  // Watch the bookingMode so the UI can reflect changes immediately
  const contactMethod = watch("contactMethod");
  const bookingMode = watch("bookingMode");

  useEffect(() => {
    if (isSubmitSuccessful) {
      const tid = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(tid);
    }
  }, [isSubmitSuccessful]);

  // EmailJS credentials (prefer env variables)
  // Provide your real keys in environment variables instead of hard-coding.
  const EMAILJS_SERVICE_ID = getClientEnv(
    "REACT_APP_EMAILJS_SERVICE_ID",
    getClientEnv("VITE_EMAILJS_SERVICE_ID", "service_koye8l9")
  );
  const EMAILJS_TEMPLATE_ID = getClientEnv(
    "REACT_APP_EMAILJS_TEMPLATE_ID",
    getClientEnv("VITE_EMAILJS_TEMPLATE_ID", "template_nvi7azv")
  );
  const EMAILJS_PUBLIC_KEY = getClientEnv(
    "REACT_APP_EMAILJS_PUBLIC_KEY",
    getClientEnv("VITE_EMAILJS_PUBLIC_KEY", "gaRLXY6TuKISguOB0")
  );

  // Initialize EmailJS once when component mounts (public key optional but recommended)
  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("EmailJS init failed:", err);
      }
    } else {
      // eslint-disable-next-line no-console
      console.info("EmailJS public key not provided; skipping init.");
    }
    // Intentionally empty deps to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep packageName & bookingMode in sync with selectedItem
  useEffect(() => {
    if (!selectedItem) return;
    if (selectedItem.transmission) {
      setValue("bookingMode", selectedItem.transmission.toLowerCase(), {
        shouldDirty: true,
      });
    }
    if (selectedItem.name) {
      setValue("packageName", selectedItem.name, { shouldDirty: true });
    }
    // focus first field whenever modal opens/selectedItem changes
    setTimeout(() => {
      const el = document.getElementById("modal_fullName");
      el?.focus?.();
    }, 80);
  }, [selectedItem, setValue, isVisible]);

  // --- Early return if not visible (safe because hooks were already declared) ---
  if (!isVisible) return null;

  // --- Non-hook helpers + variables ---
  const inputBase =
    "w-full px-3 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-sm";
  const primary = "bg-gradient-to-r from-red-600 to-red-500";

  const focusVisibleField = (method) => {
    const modalId = method === "email" ? "modal_email" : "modal_phone";
    setTimeout(() => {
      const el = document.getElementById(modalId);
      el?.focus?.();
    }, 0);
  };

  const toggleContactMethod = (method) => {
    setValue("contactMethod", method, { shouldDirty: true, shouldTouch: true });
    if (method === "email") setValue("phone", "");
    else setValue("email", "");
    focusVisibleField(method);
  };

  const toggleBookingMode = (mode) => {
    setValue("bookingMode", mode, { shouldDirty: true, shouldTouch: true });
  };

  const apiBase = getClientEnv(
    "REACT_APP_API_BASE_URL",
    "https://three60drivingschool.onrender.com"
  );
  const bookingsUrl = `${apiBase.replace(/\/$/, "")}/booking`;

  const onSubmit = async (data) => {
    if (data.honeypot) {
      setToast({ type: "error", message: "Bot suspected — submission blocked." });
      return;
    }
    if (!data.fullName?.trim()) {
      setToast({ type: "error", message: "Please enter your name." });
      return;
    }
    if (!data.location?.trim()) {
      setToast({ type: "error", message: "Please enter your location." });
      return;
    }
    if (
      data.contactMethod === "email" &&
      !/^\S+@\S+\.\S+$/.test(data.email || "")
    ) {
      setToast({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (
      data.contactMethod === "phone" &&
      !/^[0-9+\-\s()]{6,20}$/.test(data.phone || "")
    ) {
      setToast({ type: "error", message: "Please enter a valid phone number." });
      return;
    }

    setSubmitting(true);
    setToast(null);
    setShowSuccess(false);
    setSavedBooking(null);

    const payload = {
      // legacy
      name: data.fullName,
      telephone: data.phone || "",
      postCode: data.location,
      timetocontact: data.contactMethod,
      transmissionType: data.bookingMode,
      packagename: data.packageName || "General Enq",
      // modern
      fullName: data.fullName,
      phone: data.phone || "",
      location: data.location,
      contactMethod: data.contactMethod,
      bookingMode: data.bookingMode,
      packageName: data.packageName || "General Enq",
      email: data.email || "",
      honeypot: data.honeypot || "",
      // include selectedItem metadata
      selectedItem: {
        id: selectedItem?._id || selectedItem?.id || null,
        type: selectedItem?.type || null,
        name: selectedItem?.name || null,
        transmission: selectedItem?.transmission || null,
      },
      metadata: {
        site:
          typeof window !== "undefined" ? window.location.hostname || "" : "",
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
    };

    try {
      const res = await fetch(bookingsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to save booking (status ${res.status})`);
      }

      const saved = await res.json();
      setSavedBooking(saved);
      setShowSuccess(true);
      setToast({
        type: "success",
        message: "Booking saved — you can see confirmation below.",
      });
      reset();

      // send optional email notification via EmailJS
      const bookingId = saved._id || saved.id || "";
      const createdAt = saved.createdAt || new Date().toISOString();
      const site = payload.metadata.site || "";

      const manageUrl =
        typeof window !== "undefined" && bookingId
          ? `${window.location.origin}/admin/bookings/${bookingId}`
          : "";

      const message =
        (saved.notes || saved.message) ||
        (selectedItem
          ? `${selectedItem.type || "Package"}: ${selectedItem.name || ""}`
          : "");

      const templateParams = {
        to_name: "Admin",
        booking_id: bookingId,
        site,
        created_at: createdAt,
        full_name: saved.fullName || payload.fullName || "",
        email: saved.email || payload.email || "",
        phone: saved.phone || payload.phone || "",
        contact_method:
          saved.contactMethod || saved.timetocontact || payload.contactMethod || "",
        booking_mode:
          saved.bookingMode || saved.transmissionType || payload.bookingMode || "",
        location: saved.location || saved.postCode || payload.location || "",
        package_name:
          saved.packageName || saved.packagename || payload.packageName || "General Enq",
        message,
        manage_url: manageUrl,
        selected_item: selectedItem ? JSON.stringify(selectedItem) : "",
      };

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
        try {
          // Use 3-arg send if init(publicKey) was called above; otherwise include public key as 4th arg.
          if (EMAILJS_PUBLIC_KEY) {
            await emailjs.send(
              EMAILJS_SERVICE_ID,
              EMAILJS_TEMPLATE_ID,
              templateParams
            );
          } else {
            await emailjs.send(
              EMAILJS_SERVICE_ID,
              EMAILJS_TEMPLATE_ID,
              templateParams,
              EMAILJS_PUBLIC_KEY || undefined
            );
          }
          setToast({
            type: "success",
            message: "Booking saved — notification email sent.",
          });
        } catch (emailErr) {
          // don't fail the flow — booking is saved
          // eslint-disable-next-line no-console
          console.warn("EmailJS send failed:", emailErr);
          setToast({
            type: "success",
            message:
              "Booking saved — notification email could not be sent (logged).",
          });
        }
      } else {
        // eslint-disable-next-line no-console
        console.info("EmailJS not configured; skipping email send.");
      }
    } catch (err) {
      setToast({
        type: "error",
        message: err?.message || "Submission failed. Try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const BookingFormFields = ({ idPrefix = "" }) => {
    // derive displayable gearbox label from bookingMode (watch)
    const gearboxLabel =
      bookingMode && typeof bookingMode === "string"
        ? bookingMode.charAt(0).toUpperCase() + bookingMode.slice(1)
        : selectedItem?.transmission || "Manual";

    return (
      <>
        <div>
          <label
            htmlFor={`${idPrefix}fullName`}
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Full name
          </label>
          <input
            id={`${idPrefix}fullName`}
            {...register("fullName", { required: true })}
            className={inputBase}
            placeholder="Jane Doe"
            autoComplete="name"
          />
          {errors.fullName && (
            <p className="text-red-600 text-xs mt-1">Required</p>
          )}
        </div>

        {/* Contact method toggle */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Contact by
          </label>
          <div
            className="inline-flex rounded-lg bg-gray-100 p-1 w-full"
            role="tablist"
            aria-label="Contact method"
          >
            {["email", "phone"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleContactMethod(m)}
                aria-pressed={contactMethod === m}
                className={`flex-1 px-3 py-1.5 rounded-md text-sm transition ${
                  contactMethod === m
                    ? "bg-white shadow-sm font-semibold text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {m === "email" ? "Email" : "Telephone"}
              </button>
            ))}
          </div>
        </div>

        {/* Booking mode toggle */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Gearbox
          </label>
          <div
            className="inline-flex rounded-lg bg-gray-100 p-1 w-full"
            role="tablist"
            aria-label="Booking mode"
          >
            {["manual", "automatic"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleBookingMode(m)}
                aria-pressed={bookingMode === m}
                className={`flex-1 px-3 py-1.5 rounded-md text-sm capitalize transition ${
                  bookingMode === m
                    ? "bg-white shadow-sm font-semibold text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Email OR Phone */}
        {contactMethod === "email" ? (
          <div>
            <label
              htmlFor={`${idPrefix}email`}
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id={`${idPrefix}email`}
              type="email"
              {...register("email")}
              className={inputBase}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        ) : (
          <div>
            <label
              htmlFor={`${idPrefix}phone`}
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Phone number
            </label>
            <input
              id={`${idPrefix}phone`}
              type="tel"
              {...register("phone")}
              className={inputBase}
              placeholder="+44 7..."
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor={`${idPrefix}location`}
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Location / postcode
          </label>
          <input
            id={`${idPrefix}location`}
            {...register("location", { required: true })}
            className={inputBase}
            placeholder="e.g. West London / SW6"
            autoComplete="postal-code"
          />
          {errors.location && (
            <p className="text-red-600 text-xs mt-1">Required</p>
          )}
        </div>

        {/* Show selected package/course info inline for clarity (non-editable). */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Selected
          </label>
          <div className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-md px-3 py-2">
            <div className="font-medium">{selectedItem?.name || "General Enquiry"}</div>
            {selectedItem?.type && (
              <div className="text-xs text-gray-500">
                {selectedItem.type} • {gearboxLabel}
              </div>
            )}
          </div>
        </div>

        {/* Package name hidden field */}
        <input
          type="hidden"
          {...register("packageName")}
          value={selectedItem?.name || "General Enq"}
          aria-hidden="true"
        />

        {/* Honeypot */}
        <input
          {...register("honeypot")}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Booking form"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        {/* Larger exit symbol */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
          aria-label="Close booking form"
        >
          <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Header */}
        <header className="bg-red-600 text-white py-4 mb-4 rounded-md">
          <div className="max-w-5xl mx-auto text-center px-2">
            <h1 className="text-lg font-bold">Book Your Driving Lessons</h1>
            <p className="text-sm mt-1">
              {selectedItem?.type === "course" ? "Enroll in" : "Selected"}{" "}
              <strong>{selectedItem?.name || "General Enquiry"}</strong>
            </p>
          </div>
        </header>

        {/* Confirmation */}
        {showSuccess && savedBooking ? (
          <div className="rounded-md border border-green-100 bg-green-50 p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800">Booking Confirmed</h3>
                <p className="text-sm text-green-700 mt-1">
                  Thank you — your booking request has been saved. We'll contact you to confirm availability.
                </p>

                <div className="mt-3 text-sm text-green-800 grid grid-cols-1 gap-2">
                  <div><strong>Booking ID:</strong> <span className="font-mono">{savedBooking._id || savedBooking.id || "—"}</span></div>
                  <div><strong>Package / Course:</strong> {savedBooking.packageName || savedBooking.packagename || "—"}</div>
                  <div><strong>Transmission:</strong> {savedBooking.transmissionType || savedBooking.bookingMode || "—"}</div>
                  <div><strong>Contact:</strong> {savedBooking.phone || savedBooking.email || savedBooking.telephone || "—"}</div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setShowSuccess(false);
                      setSavedBooking(null);
                      onClose();
                    }}
                    className="bg-green-700 text-white px-3 py-1.5 rounded-md text-sm"
                  >
                    Done
                  </button>

                  <button
                    onClick={() => {
                      setShowSuccess(false);
                      setSavedBooking(null);
                    }}
                    className="px-3 py-1.5 rounded-md text-sm border border-green-700 text-green-700 bg-white"
                  >
                    Make another request
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Form */}
        {!showSuccess && (
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3" noValidate>
            <BookingFormFields idPrefix="modal_" />

            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className={`${primary} text-white font-semibold px-4 py-2.5 rounded-lg shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm flex-1`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  "Request Booking"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="px-3 py-2.5 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
            </div>

            <div className="text-xs text-gray-400 leading-relaxed">
              By submitting you agree to our{" "}
              <a href="/privacy" className="text-gray-600 underline">
                privacy policy
              </a>
              . We only use your details to contact you about your booking.
            </div>

            {toast && (
              <div className={`rounded-lg px-3 py-2.5 text-sm ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-100" : "bg-red-50 text-red-800 border border-red-100"}`}>
                {toast.message}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default FormModal;