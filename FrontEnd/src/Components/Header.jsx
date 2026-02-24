import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaStar, FaClock, FaCar } from "react-icons/fa";
import emailjs from "@emailjs/browser";

import easydrive from "../assets/easydrive.png";
import west from "../assets/west.png";
import ed from "../assets/ed.png";
import mockup from "../assets/mock.png";

/* ---------- small count-up hook ---------- */
function useCountUp(target = 0, { duration = 1200, start = 0, enabled = true } = {}) {
  const [value, setValue] = useState(start);
  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    let rafId = null;
    let startTime = null;
    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + (target - start) * easeOutCubic(progress);
      setValue(current);
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start, enabled]);
  return value;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function formatNumber(n) {
  return new Intl.NumberFormat().format(Math.round(n));
}

/**
 * Safe environment accessor for browser builds
 * - Supports CRA (process.env.REACT_APP_*)
 * - Supports Vite (import.meta.env.VITE_*)
 * - Falls back to provided default
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

/* ---------- Header component ---------- */
const Header = () => {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedBooking, setSavedBooking] = useState(null); // <-- store saved booking for confirmation

  const modalRef = useRef(null);
  const lastFocusedRef = useRef(null);

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
      bookingMode: "manual",
      location: "",
      honeypot: "",
      packageName: "General Enq", // default package name
    },
  });

  const contactMethod = watch("contactMethod");
  const bookingMode = watch("bookingMode");

  useEffect(() => {
    if (isSubmitSuccessful) {
      const tid = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(tid);
    }
  }, [isSubmitSuccessful]);

  useEffect(() => {
    document.body.style.overflow = mobileModalOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileModalOpen]);

  /* Listen for global event to open mobile booking modal */
  useEffect(() => {
    const handler = () => setMobileModalOpen(true);
    window.addEventListener("openMobileBooking", handler);
    return () => window.removeEventListener("openMobileBooking", handler);
  }, []);

  /* Modal focus trap & ESC */
  useEffect(() => {
    if (!mobileModalOpen) return;
    lastFocusedRef.current = document.activeElement;
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    setTimeout(() => first?.focus?.(), 0);

    function onKey(e) {
      if (e.key === "Escape") setMobileModalOpen(false);
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      try {
        lastFocusedRef.current?.focus?.();
      } catch {}
    };
  }, [mobileModalOpen]);

  const inputBase =
    "w-full px-3 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-sm";
  const primary = "bg-gradient-to-r from-red-600 to-red-500";

  const focusVisibleField = (method) => {
    const inlineId = method === "email" ? "email" : "phone";
    const modalId = method === "email" ? "m_email" : "m_phone";
    setTimeout(() => {
      const el = document.getElementById(inlineId) || document.getElementById(modalId);
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

  const apiBase = getClientEnv("REACT_APP_API_BASE_URL", "https://three60drivingschool.onrender.com");
  // Use the /booking path (matching your other usage). If your backend uses /api/bookings instead, change to "/api/bookings"
  const bookingsUrl = `${apiBase.replace(/\/$/, "")}/booking`;

  // EmailJS credentials (use environment variables; fallbacks provided for dev)
  const EMAILJS_SERVICE_ID = getClientEnv("REACT_APP_EMAILJS_SERVICE_ID", "service_koye8l9");
  const EMAILJS_TEMPLATE_ID = getClientEnv("REACT_APP_EMAILJS_TEMPLATE_ID", "template_nvi7azv");
  const EMAILJS_PUBLIC_KEY = getClientEnv("REACT_APP_EMAILJS_PUBLIC_KEY", "gaRLXY6TuKISguOB0");

  // Initialize EmailJS once when component mounts (public key required)
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
      console.warn("EmailJS public key not set; email notifications will be skipped.");
    }
    // We intentionally do NOT include the EMAILJS_* constants in deps to avoid re-initializing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // Build payload matching server controller (include both old + new field names)
    const payload = {
      // legacy fields
      name: data.fullName,
      telephone: data.phone || "",
      postCode: data.location,
      timetocontact: data.contactMethod,
      transmissionType: data.bookingMode,
      packagename: data.packageName || "General Enq",
      // modern fields
      fullName: data.fullName,
      phone: data.phone || "",
      location: data.location,
      contactMethod: data.contactMethod,
      bookingMode: data.bookingMode,
      packageName: data.packageName || "General Enq",
      email: data.email || "",
      honeypot: data.honeypot || "",
      metadata: {
        site: typeof window !== "undefined" ? window.location.hostname || "" : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
    };

    try {
      // 1) Save booking to the DB
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

      // store saved booking and show improved confirmation (do not auto-close mobile modal)
      setSavedBooking(saved);
      setShowSuccess(true);
      setToast({
        type: "success",
        message: "Booking saved — see confirmation below for details.",
      });

      // clear form values while keeping confirmation visible
      reset();

      // 2) Send email notification via EmailJS (only after DB save)
      const templateParams = {
        to_name: "Admin",
        full_name: saved.fullName || payload.fullName,
        email: saved.email || payload.email || "",
        phone: saved.phone || payload.phone || "",
        contact_method: saved.contactMethod || payload.contactMethod,
        booking_mode: saved.bookingMode || payload.bookingMode,
        location: saved.location || payload.location,
        package_name: saved.packageName || payload.packageName,
        site: payload.metadata.site,
        booking_id: saved._id || saved.id || "",
        created_at: saved.createdAt || "",
        manage_url: `${typeof window !== "undefined" ? window.location.origin : ""}/admin/bookings/${saved._id || saved.id || ""}`,
        message: saved.notes || "",
      };

      let emailSent = false;
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        try {
          // emailjs.init(publicKey) was called in useEffect; use the 3-arg send signature
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
          emailSent = true;
        } catch (emailErr) {
          // Log but don't fail the entire flow — booking is saved
          // eslint-disable-next-line no-console
          console.warn("EmailJS send failed:", emailErr);
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn("EmailJS credentials missing, skipping email send.");
      }

      // update toast with email status if needed
      setToast({
        type: "success",
        message: emailSent
          ? "Booking saved and notification sent — we'll contact you shortly."
          : "Booking saved — notification email could not be sent.",
      });
    } catch (err) {
      // Save failed or other error
      setToast({
        type: "error",
        message: err?.message || "Submission failed. Try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handler to dismiss confirmation (used by both inline aside and mobile modal)
  const handleDone = () => {
    setShowSuccess(false);
    setSavedBooking(null);
    setToast(null);
    reset();
    setMobileModalOpen(false);
  };

  const stats = [
    {
      id: "students",
      end: 500,
      label: "Students Passed",
      sub: "First-time passes",
      icon: FaGraduationCap,
      suffix: "+",
    },
    {
      id: "passrate",
      end: 90,
      label: "First-time Pass Rate",
      sub: "Successful first attempts",
      icon: FaStar,
      suffix: "%",
    },
    {
      id: "lessons",
      end: 3000,
      label: "Lessons Delivered",
      sub: "Hours of practice",
      icon: FaClock,
      suffix: "+",
    },
    {
      id: "years",
      end: 10,
      label: "Years Teaching",
      sub: "Professional instructors",
      icon: FaCar,
      suffix: "+",
    },
  ];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const counts = stats.map((s) =>
    useCountUp(s.end, { duration: 1400, start: 0, enabled: statsInView })
  );

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 110, damping: 14 },
    },
  };

  const MobileModal = ({ children }) =>
    typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileModalOpen(false)}
              aria-hidden="true"
            />
            <div className="relative w-full sm:max-w-md sm:mx-4">{children}</div>
          </div>,
          document.body
        )
      : null;

  /* ── Reusable booking form fields (shared between inline + modal) ── */
  const BookingFormFields = ({ idPrefix = "" }) => (
    <>
      <div className="sm:col-span-2">
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
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Contact by
        </label>
        <div
          className="inline-flex rounded-lg bg-gray-100 p-1 w-full sm:w-auto"
          role="tablist"
          aria-label="Contact method"
        >
          {["email", "phone"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleContactMethod(m)}
              aria-pressed={contactMethod === m}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm transition ${
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
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Gearbox
        </label>
        <div
          className="inline-flex rounded-lg bg-gray-100 p-1 w-full sm:w-auto"
          role="tablist"
          aria-label="Booking mode"
        >
          {["manual", "automatic"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleBookingMode(m)}
              aria-pressed={bookingMode === m}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm capitalize transition ${
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
        <div className="sm:col-span-2">
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
        <div className="sm:col-span-2">
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

      <div className="sm:col-span-2">
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

      {/* Package name hidden field (defaulted in form state) */}
      <input
        type="hidden"
        {...register("packageName")}
        value="General Enq"
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

  return (
    <header className="font-Poppins">
      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <div
        className="relative bg-[url('/src/assets/header.png')] bg-cover bg-center min-h-[420px] sm:min-h-[500px]"
        ref={heroRef}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* ── Left: branding + CTA ── */}
            <div className="text-white flex flex-col items-center md:items-start">
              {/* Logo — hidden on mobile, shown md+ */}
              <div className="mb-5 hidden md:block">
                
              </div>

              {/* Mobile logo (smaller, centered) */}
              <div className="mb-4 flex md:hidden">
                
              </div>

              <div className="text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold leading-relaxed max-w-lg"
                >
                  Welcome to 360 Academy. We specialize in professional driving
                  lessons with exceptional instructors, offering over 10 years
                  of industry expertise. Drive with confidence and pass your
                  test on the first attempt!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="mt-3 text-xs sm:text-sm text-white/80 max-w-sm mx-auto md:mx-0"
                >
                  Professional instructors • Flexible scheduling • Mock tests available
                </motion.p>

                <div className="mt-5 flex flex-wrap gap-3 items-center justify-center md:justify-start">
                  <Link to="/courses">
                    <button className="bg-white text-black font-medium px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:bg-red-600 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/60 text-sm">
                      View Courses
                    </button>
                  </Link>

                  {/* Quick Book — visible on mobile only */}
                  <button
                    onClick={() => setMobileModalOpen(true)}
                    className="bg-red-600 text-white font-medium px-5 py-2.5 rounded-lg shadow-md hover:bg-red-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-red-300 text-sm md:hidden"
                    aria-haspopup="dialog"
                  >
                    Quick Book
                  </button>
                </div>
              </div>

              <div className="mt-5 text-xs text-white/70 text-center md:text-left">
                <strong className="text-white/90">Free consultation</strong> —
                we'll help you choose the right package and instructor.
              </div>
            </div>

            {/* ── Right: inline booking form (md+) ── */}
            <motion.aside
              id="inline-booking-aside"
              className="hidden md:flex flex-col bg-white rounded-2xl shadow-xl p-5 lg:p-6 border border-gray-100 w-full max-w-md ml-auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Form header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  
                  <div>
                    <h2 className="text-base lg:text-lg font-semibold text-gray-900 leading-tight">
                      Request a lesson
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      We'll confirm availability by phone or email.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Trusted
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    Avg. response{" "}
                    <strong className="text-gray-700">24h</strong>
                  </span>
                </div>
              </div>

              {/* Improved confirmation — show detailed panel when savedBooking is available */}
              {showSuccess && savedBooking ? (
                <div className="mb-3 rounded-lg bg-green-50 border border-green-100 p-3 text-green-700 flex items-start gap-3">
                  <div className="flex-shrink-0 bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-green-800">Booking Confirmed</div>
                    <div className="text-xs text-green-700 mt-1">
                      Thank you — your booking request has been saved. We'll contact you soon to confirm availability.
                    </div>

                    <div className="mt-3 text-sm text-green-800 grid grid-cols-1 gap-2">
                      <div><strong>Booking ID:</strong> <span className="font-mono">{savedBooking._id || savedBooking.id || "—"}</span></div>
                      <div><strong>Package / Course:</strong> {savedBooking.packageName || savedBooking.packagename || "—"}</div>
                      <div><strong>Transmission:</strong> {savedBooking.transmissionType || savedBooking.bookingMode || "—"}</div>
                      <div><strong>Preferred contact:</strong> {savedBooking.contactMethod || savedBooking.timetocontact || "—"}</div>
                      <div><strong>Contact:</strong> {savedBooking.phone || savedBooking.email || savedBooking.telephone || "—"}</div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={handleDone}
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
              ) : null}

              {/* Success banner (fallback small) */}
              {!savedBooking && showSuccess && (
                <div className="mb-3 rounded-lg bg-green-50 border border-green-100 p-3 text-green-700 flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-600 text-white rounded-full p-1.5 flex-shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <div className="text-sm font-semibold">Request sent!</div>
                    <div className="text-xs">
                      We'll contact you to confirm your booking.
                    </div>
                  </div>
                </div>
              )}

              {/* INLINE FORM (hidden when confirmation with savedBooking is showing) */}
              {!savedBooking && (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  noValidate
                  aria-live="polite"
                >
                  <BookingFormFields idPrefix="" />

                  <div className="sm:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-1">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`${primary} text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm`}
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

                    <Link
                      to="/courses"
                      className="text-sm text-gray-500 underline-offset-2 hover:underline text-center sm:text-left"
                    >
                      View all courses →
                    </Link>
                  </div>

                  <div className="sm:col-span-2 text-xs text-gray-400 leading-relaxed">
                    By submitting you agree to our{" "}
                    <a href="/privacy" className="text-gray-600 underline">
                      privacy policy
                    </a>
                    . We only use your details to contact you about your booking.
                  </div>

                  {toast && (
                    <div className="sm:col-span-2">
                      <div
                        className={`rounded-lg px-3 py-2.5 text-sm ${
                          toast.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-100"
                            : "bg-red-50 text-red-800 border border-red-100"
                        }`}
                      >
                        {toast.message}
                      </div>
                    </div>
                  )}
                </form>
              )}
            </motion.aside>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STATISTICS — full-width red, responsive grid
      ══════════════════════════════════════════ */}
      <section
        ref={statsRef}
        className="w-full bg-gradient-to-br from-red-700 via-red-600 to-red-700"
        aria-label="Key statistics"
      >
        <h2 className="sr-only">Our impact</h2>

        <motion.div
          className="w-full grid grid-cols-2 lg:grid-cols-4
                     divide-y divide-white/15 lg:divide-y-0
                     divide-x-0 sm:divide-x sm:divide-white/15"
          variants={container}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          role="list"
        >
          {stats.map((s, i) => {
            const Icon = s.icon;
            const count = counts[i];
            const display =
              s.suffix === "%"
                ? `${Math.round(count)}${s.suffix}`
                : `${formatNumber(count)}${s.suffix}`;

            return (
              <motion.article
                key={s.id}
                className="flex flex-col items-center justify-center text-center
                           text-white px-4 sm:px-6 py-8 sm:py-10 lg:py-14 gap-2 sm:gap-3
                           hover:bg-white/5 transition-colors duration-200"
                variants={item}
                role="listitem"
                aria-labelledby={`stat-${s.id}-label`}
              >
                {/* Icon circle */}
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20
                             flex items-center justify-center mb-1"
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                {/* Animated number */}
                <motion.div
                  aria-live="polite"
                  aria-atomic="true"
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                             leading-none tracking-tight tabular-nums"
                  initial={{ opacity: 0, y: 12 }}
                  animate={
                    statsInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 12 }
                  }
                  transition={{ type: "spring", stiffness: 110, damping: 14 }}
                >
                  {display}
                </motion.div>

                {/* Main label */}
                <div
                  id={`stat-${s.id}-label`}
                  className="text-sm sm:text-base font-semibold text-white leading-snug px-2"
                >
                  {s.label}
                </div>

                {/* Sub label */}
                <div className="text-xs text-white/55 hidden sm:block">
                  {s.sub}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          MOBILE BOOKING MODAL (portal)
      ══════════════════════════════════════════ */}
      {mobileModalOpen &&
        MobileModal({
          children: (
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-booking-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="w-full"
            >
              <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92dvh] overflow-y-auto">
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                  <div className="w-10 h-1 rounded-full bg-gray-300" aria-hidden="true" />
                </div>

                <div className="px-5 pb-8 pt-3 sm:p-6">
                  {/* Modal header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3
                        id="mobile-booking-title"
                        className="text-lg font-semibold text-gray-900"
                      >
                        Quick Booking
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        We'll follow up to confirm your lesson.
                      </p>
                    </div>
                    <button
                      onClick={() => setMobileModalOpen(false)}
                      aria-label="Close booking modal"
                      className="p-1.5 -mr-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M6 18L18 6M6 6l12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* If we've saved a booking show detailed confirmation in mobile modal */}
                  {showSuccess && savedBooking ? (
                    <div className="mb-4 rounded-md border border-green-100 bg-green-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg">
                          ✓
                        </div>
                        <div className="flex-1">
                          <h4 className="text-md font-semibold text-green-800">Booking Confirmed</h4>
                          <p className="text-xs text-green-700 mt-1">Thanks — your booking request has been saved. We'll contact you shortly to confirm availability.</p>

                          <div className="mt-3 text-sm text-green-800 grid grid-cols-1 gap-2">
                            <div><strong>Booking ID:</strong> <span className="font-mono">{savedBooking._id || savedBooking.id || "—"}</span></div>
                            <div><strong>Package / Course:</strong> {savedBooking.packageName || savedBooking.packagename || "—"}</div>
                            <div><strong>Transmission:</strong> {savedBooking.transmissionType || savedBooking.bookingMode || "—"}</div>
                            <div><strong>Preferred contact:</strong> {savedBooking.contactMethod || savedBooking.timetocontact || "—"}</div>
                            <div><strong>Contact:</strong> {savedBooking.phone || savedBooking.email || savedBooking.telephone || "—"}</div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button onClick={handleDone} className="bg-green-700 text-white px-3 py-2 rounded-md text-sm">Done</button>
                            <button onClick={() => { setShowSuccess(false); setSavedBooking(null); }} className="px-3 py-2 rounded-md text-sm border border-green-700 text-green-700 bg-white">Make another request</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Reuse fields with mobile prefix — inline grid is col-span-1 so we override */}
                  {!savedBooking && (
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="grid grid-cols-1 gap-3"
                      noValidate
                      aria-live="polite"
                    >
                      <div>
                        <label
                          htmlFor="m_fullName"
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          Full name
                        </label>
                        <input
                          id="m_fullName"
                          {...register("fullName", { required: true })}
                          className={inputBase}
                          placeholder="Jane Doe"
                          autoComplete="name"
                        />
                        {errors.fullName && (
                          <p className="text-red-600 text-xs mt-1">Required</p>
                        )}
                      </div>

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
                                  : "text-gray-500"
                              }`}
                            >
                              {m === "email" ? "Email" : "Telephone"}
                            </button>
                          ))}
                        </div>
                      </div>

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
                                  : "text-gray-500"
                              }`}
                            >
                              {m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {contactMethod === "email" ? (
                        <div>
                          <label
                            htmlFor="m_email"
                            className="block text-xs font-medium text-gray-700 mb-1"
                          >
                            Email address
                          </label>
                          <input
                            id="m_email"
                            type="email"
                            {...register("email")}
                            className={inputBase}
                            placeholder="you@example.com"
                            autoComplete="email"
                          />
                          {errors.email && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <label
                            htmlFor="m_phone"
                            className="block text-xs font-medium text-gray-700 mb-1"
                          >
                            Phone number
                          </label>
                          <input
                            id="m_phone"
                            type="tel"
                            {...register("phone")}
                            className={inputBase}
                            placeholder="+44 7..."
                            autoComplete="tel"
                          />
                          {errors.phone && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      )}

                      <div>
                        <label
                          htmlFor="m_location"
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          Location / postcode
                        </label>
                        <input
                          id="m_location"
                          {...register("location", { required: true })}
                          className={inputBase}
                          placeholder="e.g. West London / SW6"
                          autoComplete="postal-code"
                        />
                        {errors.location && (
                          <p className="text-red-600 text-xs mt-1">Required</p>
                        )}
                      </div>

                      {/* Hidden package and honeypot */}
                      <input type="hidden" {...register("packageName")} value="General Enq" />
                      <input
                        {...register("honeypot")}
                        className="hidden"
                        aria-hidden="true"
                        tabIndex={-1}
                      />

                      <div className="flex items-center gap-3 mt-1">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-red-600 text-white font-semibold px-4 py-2.5 rounded-lg shadow hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 transition-all flex items-center justify-center gap-2 text-sm"
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
                            setMobileModalOpen(false);
                          }}
                          className="px-3 py-2.5 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed">
                        By submitting you agree to our{" "}
                        <a href="/privacy" className="underline text-gray-600">
                          privacy policy
                        </a>
                        .
                      </p>

                      {toast && (
                        <div
                          className={`rounded-lg px-3 py-2.5 text-sm ${
                            toast.type === "success"
                              ? "bg-green-50 text-green-800 border border-green-100"
                              : "bg-red-50 text-red-800 border border-red-100"
                          }`}
                        >
                          {toast.message}
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          ),
        })}
    </header>
  );
};

export default Header;