import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaArrowRight,
  FaPhoneAlt,
  FaCar,
  FaStar,
  FaShieldAlt,
  FaGraduationCap,
  FaClock,
  FaMedal,
  FaUserCheck,
  FaRoute,
  FaThumbsUp,
  FaCalendarAlt,
  FaAward,
} from "react-icons/fa";
import Reviews from "../Components/ReviewsG";

/* ─────────────────────────────────────────────────────────────
   Environment helpers
───────────────────────────────────────────────────────────── */
function getClientEnv(key, fallback = "") {
  try {
    if (typeof process !== "undefined" && process?.env?.[key]) return process.env[key];
    if (typeof import.meta !== "undefined" && import.meta?.env) {
      if (import.meta.env[key]) return import.meta.env[key];
      if (key.startsWith("REACT_APP_")) {
        const viteKey = "VITE_" + key.slice("REACT_APP_".length);
        if (import.meta.env[viteKey]) return import.meta.env[viteKey];
      }
      const alt = key.replace(/^REACT_APP_/, "VITE_");
      if (import.meta.env[alt]) return import.meta.env[alt];
    }
  } catch (_) {}
  return fallback;
}

const EMAILJS_SERVICE_ID  = getClientEnv("REACT_APP_EMAILJS_SERVICE_ID",  getClientEnv("VITE_EMAILJS_SERVICE_ID",  "service_koye8l9"));
const EMAILJS_TEMPLATE_ID = getClientEnv("REACT_APP_EMAILJS_TEMPLATE_ID", getClientEnv("VITE_EMAILJS_TEMPLATE_ID", "template_nvi7azv"));
const EMAILJS_PUBLIC_KEY  = getClientEnv("REACT_APP_EMAILJS_PUBLIC_KEY",  getClientEnv("VITE_EMAILJS_PUBLIC_KEY",  "gaRLXY6TuKISguOB0"));

/* ─────────────────────────────────────────────────────────────
   Animation helpers
───────────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-40px" },
  transition:  { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ─────────────────────────────────────────────────────────────
   Static data
───────────────────────────────────────────────────────────── */
const WHY_ITEMS = [
  { icon: FaShieldAlt,   title: "DVSA-Approved Instructors",  body: "Every instructor holds a full ADI qualification and is regularly assessed — so you always learn from the best." },
  { icon: FaMedal,       title: "90% First-Time Pass Rate",   body: "Our structured lesson plans and mock tests consistently beat the national average by a significant margin." },
  { icon: FaUserCheck,   title: "DBS-Checked & Insured",      body: "Full enhanced DBS checks and comprehensive insurance on every vehicle for your complete peace of mind." },
  { icon: FaRoute,       title: "Local Road Knowledge",       body: "Instructors who live and teach locally know every test-route junction, roundabout, and hazard intimately." },
  { icon: FaCalendarAlt, title: "Flexible 7-Day Booking",     body: "Morning, afternoon, or evening — we fit around your schedule. Online booking available 24/7." },
  { icon: FaAward,       title: "1,000+ Students Passed",     body: "A proven track record across West London with hundreds of verified 5-star reviews from real students." },
];

const TRUST_ITEMS = [
  { icon: FaStar,          text: "5-Star Rated" },
  { icon: FaShieldAlt,     text: "DVSA Approved" },
  { icon: FaCar,           text: "Manual & Automatic" },
  { icon: FaThumbsUp,      text: "90% First-Time Pass" },
  { icon: FaGraduationCap, text: "1,000+ Passed" },
  { icon: FaClock,         text: "7 Days a Week" },
];

/* ─────────────────────────────────────────────────────────────
   Schema helpers — validated against Google Rich Results spec
───────────────────────────────────────────────────────────── */
function buildDrivingSchoolSchema({ areaName, areaSlug, metaDescription, phone, postcode, faqs }) {
  const faqList = faqs.length ? faqs : [
    { q: `How much do driving lessons cost in ${areaName}?`,       a: `Our driving lessons in ${areaName} start from competitive rates. Get in touch for the latest pricing and any current offers — we often run discounts for block bookings.` },
    { q: `Which driving test centres are near ${areaName}?`,       a: `We prepare students for tests at all local DVSA-approved test centres near ${areaName}. Your instructor will be familiar with the test routes and common hazards.` },
    { q: `Do you offer automatic driving lessons in ${areaName}?`, a: `Yes — we offer both manual and automatic driving lessons in ${areaName}${postcode ? ` (${postcode})` : ""}. Automatic lessons are ideal if you want to learn faster or find manual gear changes challenging.` },
    { q: `How quickly can I start lessons in ${areaName}?`,        a: `We typically have availability within a few days. Contact us or book online and we'll match you with a local instructor in ${areaName} as quickly as possible.` },
  ];

  const drivingSchool = {
    "@context":     "https://schema.org",
    "@type":        "DrivingSchool",
    name:           "360 Drive Academy",
    description:    metaDescription,
    telephone:      phone,
    priceRange:     "££",
    openingHours:   ["Mo-Su 07:00-21:00"],
    url:            `https://360driveacademy.co.uk/areas/${areaSlug}`,
    image:          "https://360driveacademy.co.uk/og-image.jpg",
    areaServed: {
      "@type": "City",
      name:    areaName,
    },
    address: {
      "@type":           "PostalAddress",
      addressLocality:   areaName,
      postalCode:        postcode,
      addressCountry:    "GB",          // ← plain ISO-3166-1 alpha-2 string, NOT an object
    },
    aggregateRating: {
      "@type":       "AggregateRating",
      ratingValue:   "5",              // strings preferred by Google validator
      bestRating:    "5",
      worstRating:   "1",
      reviewCount:   "18",
    },
  };

  const faqPage = {
    "@context":  "https://schema.org",
    "@type":     "FAQPage",
    mainEntity:  faqList.map(({ q, a }) => ({
      "@type":       "Question",
      name:          q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return { drivingSchool, faqPage };
}

/* ─────────────────────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────────────────────── */
function useCountUp(target, duration = 1600, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

function StatCounter({ num, suffix, label, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref   = useRef(null);
  const count = useCountUp(num, 1400, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="ap-stat"
      role="listitem"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <span className="ap-stat-num" aria-label={`${count}${suffix}`}>
        {count}<span className="ap-stat-suffix" aria-hidden="true">{suffix}</span>
      </span>
      <span className="ap-stat-label">{label}</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Toast notification
───────────────────────────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <motion.div
      role="alert"
      aria-live="polite"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className={`rounded-lg px-3 py-2.5 text-sm ${
        isSuccess
          ? "bg-green-50 text-green-800 border border-green-100"
          : "bg-red-50 text-red-800 border border-red-100"
      }`}
    >
      {toast.message}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Booking form fields — memoised to prevent re-render on every
   parent state change
───────────────────────────────────────────────────────────── */
const BookingFormFields = memo(function BookingFormFields({
  idPrefix = "m_",
  register,
  errors,
  contactMethod,
  bookingMode,
  toggleContactMethod,
  toggleBookingMode,
  areaName,
  postcode,
  inputBase,
}) {
  const gearboxLabel = bookingMode
    ? bookingMode.charAt(0).toUpperCase() + bookingMode.slice(1)
    : "Manual";

  return (
    <>
      {/* Full name */}
      <div>
        <label htmlFor={`${idPrefix}fullName`} className="block text-xs font-medium text-gray-700 mb-1">
          Full name
        </label>
        <input
          id={`${idPrefix}fullName`}
          {...register("fullName", { required: "Required" })}
          className={inputBase}
          placeholder="Jane Doe"
          autoComplete="name"
        />
        {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      {/* Contact method toggle */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Contact by</label>
        <div className="inline-flex rounded-lg bg-gray-100 p-1 w-full" role="tablist" aria-label="Contact method">
          {["email", "phone"].map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={contactMethod === m}
              onClick={() => toggleContactMethod(m)}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm transition-all ${
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

      {/* Gearbox toggle */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Gearbox</label>
        <div className="inline-flex rounded-lg bg-gray-100 p-1 w-full" role="tablist" aria-label="Gearbox preference">
          {["manual", "automatic"].map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={bookingMode === m}
              onClick={() => toggleBookingMode(m)}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm capitalize transition-all ${
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

      {/* Email or phone */}
      <AnimatePresence mode="wait" initial={false}>
        {contactMethod === "email" ? (
          <motion.div
            key="email"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
          >
            <label htmlFor={`${idPrefix}email`} className="block text-xs font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id={`${idPrefix}email`}
              type="email"
              {...register("email", {
                validate: (v) =>
                  !v || /^\S+@\S+\.\S+$/.test(v) || "Enter a valid email",
              })}
              className={inputBase}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
          </motion.div>
        ) : (
          <motion.div
            key="phone"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
          >
            <label htmlFor={`${idPrefix}phone`} className="block text-xs font-medium text-gray-700 mb-1">
              Phone number
            </label>
            <input
              id={`${idPrefix}phone`}
              type="tel"
              {...register("phone", {
                validate: (v) =>
                  !v || /^[0-9+\-\s()]{6,20}$/.test(v) || "Enter a valid phone number",
              })}
              className={inputBase}
              placeholder="+44 7…"
              autoComplete="tel"
            />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location */}
      <div>
        <label htmlFor={`${idPrefix}location`} className="block text-xs font-medium text-gray-700 mb-1">
          Location / postcode
        </label>
        <input
          id={`${idPrefix}location`}
          {...register("location", { required: "Required" })}
          className={inputBase}
          placeholder="e.g. West London / SW6"
          autoComplete="postal-code"
        />
        {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location.message}</p>}
      </div>

      {/* Summary pill */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Selected area</label>
        <div className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-md px-3 py-2">
          <div className="font-medium">{areaName}</div>
          {postcode && <div className="text-xs text-gray-500">{postcode}</div>}
          <div className="text-xs text-gray-500 mt-1">
            Gearbox: <strong className="text-gray-700">{gearboxLabel}</strong>
          </div>
        </div>
      </div>

      {/* Honeypot — visually hidden from humans, accessible to bots */}
      <input
        {...register("honeypot")}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
      />
    </>
  );
});

/* ─────────────────────────────────────────────────────────────
   Booking modal portal
───────────────────────────────────────────────────────────── */
function ModalPortal({ children }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="relative w-full sm:max-w-md sm:mx-4">{children}</div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────
   SEO meta updater hook
───────────────────────────────────────────────────────────── */
function useSeoMeta({ areaName, areaSlug, postcode, metaDescription }) {
  useEffect(() => {
    const pageTitle = `Driving Lessons in ${areaName}${postcode ? ` ${postcode}` : ""} | 360 Drive Academy`;
    document.title = pageTitle;

    const setMeta = (key, val, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    const canonicalUrl = `https://360driveacademy.co.uk/areas/${areaSlug}`;
    const ogImage      = "https://360driveacademy.co.uk/og-image.jpg";

    setMeta("description",    metaDescription);
    setMeta("robots",         "index, follow");
    setMeta("og:title",       pageTitle,       "property");
    setMeta("og:description", metaDescription, "property");
    setMeta("og:url",         canonicalUrl,    "property");
    setMeta("og:image",       ogImage,         "property");
    setMeta("og:type",        "website",       "property");
    setMeta("twitter:card",   "summary_large_image");
    setMeta("twitter:title",  pageTitle);
    setMeta("twitter:description", metaDescription);

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    return () => { document.title = "360 Drive Academy"; };
  }, [areaName, areaSlug, postcode, metaDescription]);
}

/* ─────────────────────────────────────────────────────────────
   Focus trap hook for modal
───────────────────────────────────────────────────────────── */
function useFocusTrap(ref, active) {
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    lastFocusedRef.current = document.activeElement;
    const modal = ref.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([tabindex="-1"]), select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    setTimeout(() => first?.focus?.(), 50);

    function onKeyDown(e) {
      if (e.key === "Escape") {
        modal.dispatchEvent(new CustomEvent("modal:close", { bubbles: true }));
      }
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first?.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      try { lastFocusedRef.current?.focus?.(); } catch (_) {}
    };
  }, [active, ref]);
}

/* ─────────────────────────────────────────────────────────────
   EmailJS submission helper
───────────────────────────────────────────────────────────── */
async function sendEmailNotification({ saved, data, areaName, postcode }) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.info("EmailJS not configured — skipping notification.");
    return;
  }

  const bookingId = saved._id || saved.id || "";
  const createdAt = saved.createdAt || new Date().toISOString();
  const site      = typeof window !== "undefined" ? window.location.hostname : "";
  const manageUrl = typeof window !== "undefined" && bookingId
    ? `${window.location.origin}/admin/bookings/${bookingId}`
    : "";

  const templateParams = {
    to_name:        "Admin",
    booking_id:     bookingId,
    site,
    created_at:     createdAt,
    full_name:      saved.fullName      || data.fullName      || "",
    email:          saved.email         || data.email         || "",
    phone:          saved.phone         || data.phone         || "",
    contact_method: saved.contactMethod || saved.timetocontact || data.contactMethod || "",
    booking_mode:   saved.bookingMode   || saved.transmissionType || data.bookingMode || "",
    location:       saved.location      || saved.postCode     || data.location || "",
    package_name:   saved.packageName   || saved.packagename  || `Area Enquiry – ${areaName}`,
    message:        `Area page enquiry for ${areaName}${postcode ? ` (${postcode})` : ""}`,
    manage_url:     manageUrl,
    selected_item:  JSON.stringify({ type: "area", name: areaName, postcode }),
  };

  // emailjs.init() was called on mount; use 3-arg send
  await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
}

/* ─────────────────────────────────────────────────────────────
   AreaPage — main component
───────────────────────────────────────────────────────────── */
const AreaPage = ({
  areaName        = "Your Area",
  areaSlug        = "your-area",
  postcode        = "",
  metaDescription = "",
  seoDescription  = "",
  introText       = "",
  bodyText        = "",
  services        = [],
  nearbyAreas     = [],
  mapEmbedUrl     = "",
  phone           = "07894718590",
  faqs            = [],
}) => {
  /* ── Scroll parallax ── */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const smoothY   = useSpring(parallaxY, { stiffness: 50, damping: 18 });

  /* ── Modal state ── */
  const [modalOpen,    setModalOpen]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [toast,        setToast]        = useState(null);
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [savedBooking, setSavedBooking] = useState(null);
  const modalRef = useRef(null);

  /* ── Form ── */
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName:      "",
      email:         "",
      phone:         "",
      contactMethod: "phone",
      bookingMode:   "manual",
      location:      "",
      honeypot:      "",
    },
  });

  const contactMethod = watch("contactMethod");
  const bookingMode   = watch("bookingMode");

  /* ── SEO ── */
  useSeoMeta({ areaName, areaSlug, postcode, metaDescription });

  /* ── Schema ── */
  const { drivingSchool: dsSchema, faqPage: faqSchema } = buildDrivingSchoolSchema({
    areaName, areaSlug, metaDescription, phone, postcode, faqs,
  });

  /* ── EmailJS init ── */
  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      try { emailjs.init(EMAILJS_PUBLIC_KEY); }
      catch (err) { console.warn("EmailJS init:", err); }
    }
  }, []);

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  /* ── Focus trap ── */
  useFocusTrap(modalRef, modalOpen);

  /* ── Listen for modal:close from focus trap ── */
  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    const handler = () => setModalOpen(false);
    el.addEventListener("modal:close", handler);
    return () => el.removeEventListener("modal:close", handler);
  }, [modalOpen]);

  /* ── Auto-dismiss toast ── */
  useEffect(() => {
    if (!toast) return;
    const tid = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(tid);
  }, [toast]);

  /* ── Toggle helpers ── */
  const toggleContactMethod = useCallback((method) => {
    setValue("contactMethod", method, { shouldDirty: true });
    if (method === "email") setValue("phone", "");
    else setValue("email", "");
    setTimeout(() => {
      const id = method === "email"
        ? (modalOpen ? "m_email" : "email")
        : (modalOpen ? "m_phone" : "phone");
      document.getElementById(id)?.focus?.();
    }, 0);
  }, [setValue, modalOpen]);

  const toggleBookingMode = useCallback((mode) => {
    setValue("bookingMode", mode, { shouldDirty: true });
  }, [setValue]);

  const handleOpenModal = useCallback(() => setModalOpen(true), []);
  const handleCloseModal = useCallback(() => {
    reset();
    setModalOpen(false);
    setShowSuccess(false);
    setSavedBooking(null);
    setToast(null);
  }, [reset]);

  /* ── Form submit ── */
  const BOOKINGS_URL = "https://three60drivingschool.onrender.com/booking";

  const onSubmit = async (data) => {
    /* Honeypot check */
    if (data.honeypot) {
      setToast({ type: "error", message: "Bot suspected — submission blocked." });
      return;
    }

    /* Client-side guard (react-hook-form already validates, but belt-and-braces) */
    if (data.contactMethod === "email" && !/^\S+@\S+\.\S+$/.test(data.email || "")) {
      setToast({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (data.contactMethod === "phone" && !/^[0-9+\-\s()]{6,20}$/.test(data.phone || "")) {
      setToast({ type: "error", message: "Please enter a valid phone number." });
      return;
    }

    setSubmitting(true);
    setToast(null);
    setShowSuccess(false);
    setSavedBooking(null);

    try {
      const res = await fetch(BOOKINGS_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          /* Legacy field names (keep for backwards compat) */
          name:             data.fullName,
          telephone:        data.phone || "",
          postCode:         data.location,
          timetocontact:    data.contactMethod,
          transmissionType: data.bookingMode,
          packagename:      `Area Enquiry – ${areaName}`,
          /* Current field names */
          fullName:      data.fullName,
          phone:         data.phone || "",
          email:         data.email || "",
          location:      data.location,
          contactMethod: data.contactMethod,
          bookingMode:   data.bookingMode,
          packageName:   `Area Enquiry – ${areaName}`,
          area:          areaName,
          metadata: {
            site:      typeof window    !== "undefined" ? window.location.hostname : "",
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent      : "",
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Submission failed (HTTP ${res.status})`);
      }

      const saved = await res.json();
      setSavedBooking(saved);
      setShowSuccess(true);

      reset(
        { fullName: "", email: "", phone: "", contactMethod: "phone", bookingMode: data.bookingMode, location: "" },
        { keepValues: false }
      );
      setValue("bookingMode", data.bookingMode, { shouldDirty: false });

      /* EmailJS notification (non-blocking) */
      try {
        await sendEmailNotification({ saved, data, areaName, postcode });
        setToast({ type: "success", message: "Booking saved — confirmation email sent." });
      } catch (emailErr) {
        console.warn("EmailJS:", emailErr);
        setToast({ type: "success", message: "Booking saved — we'll be in touch shortly." });
      }

    } catch (err) {
      setToast({ type: "error", message: err?.message || "Submission failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Derived content ── */
  const locationSeoDesc = seoDescription || (
    `360 Drive Academy has been helping learners in ${areaName}${postcode ? ` (${postcode})` : ""} pass their driving test first time for years. ` +
    `Our local DVSA-approved instructors know every road, roundabout, and test-route in and around ${areaName}, giving you a real advantage on test day. ` +
    `Whether you're a complete beginner, returning after a break, or need an intensive course, we have a lesson package to suit you.`
  );

  const heroParagraphs = locationSeoDesc.split(". ").slice(0, 2);

  const inputBase =
    "w-full px-3 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-sm transition-shadow";

  const defaultFaqs = [
    { q: `How much do driving lessons cost in ${areaName}?`,       a: `Our driving lessons in ${areaName} start from competitive rates. Get in touch for the latest pricing and any current offers — we often run discounts for block bookings.` },
    { q: `Which driving test centres are near ${areaName}?`,       a: `We prepare students for tests at all local DVSA-approved test centres near ${areaName}. Your instructor will be familiar with the test routes and common hazards.` },
    { q: `Do you offer automatic driving lessons in ${areaName}?`, a: `Yes — we offer both manual and automatic driving lessons in ${areaName}${postcode ? ` (${postcode})` : ""}. Automatic lessons are ideal if you want to learn faster or find manual gear changes challenging.` },
    { q: `How quickly can I start lessons in ${areaName}?`,        a: `We typically have availability within a few days. Contact us or book online and we'll match you with a local instructor in ${areaName} as quickly as possible.` },
  ];
  const resolvedFaqs = faqs.length ? faqs : defaultFaqs;

  /* ──────────────────────────────────────────────────────────
     Render
  ────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── Structured data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --red:      #d92b1e;
          --red-deep: #b52217;
          --red-soft: rgba(217,43,30,0.08);
          --red-glow: rgba(217,43,30,0.28);
          --ink:      #1a1d23;
          --ink2:     #22252d;
          --slate:    #6b7280;
          --line:     #e8eaed;
          --line2:    #f0f2f5;
          --surface:  #f8f9fb;
          --white:    #ffffff;
          --font:     -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Helvetica Neue', Arial, sans-serif;
          --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
        }

        html { scroll-behavior: smooth; }
        .ap { font-family: var(--font); background: var(--white); color: var(--ink); -webkit-font-smoothing: antialiased; }

        /* ══ HERO ══ */
        .ap-hero {
          position: relative; min-height: 100svh;
          background: var(--ink); overflow: hidden;
          display: flex; flex-direction: column;
        }
        .ap-hero-bg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 70% at -5% 60%,  rgba(217,43,30,0.11) 0%, transparent 55%),
            radial-gradient(ellipse 55% 55% at 105% 15%, rgba(255,122,107,0.06) 0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 50% 105%, rgba(217,43,30,0.045) 0%, transparent 60%);
        }
        .ap-hero-rule {
          position: absolute; left: clamp(18px,6vw,80px); right: 0; top: 0;
          height: 1px; z-index: 3;
          background: linear-gradient(90deg, var(--red) 0%, rgba(217,43,30,0.2) 18%, transparent 55%);
        }
        .ap-hero-grid {
          position: relative; z-index: 3;
          display: grid; grid-template-columns: 1fr; flex: 1;
        }
        @media (min-width: 1000px) { .ap-hero-grid { grid-template-columns: 52% 48%; } }

        .ap-hero-left {
          display: flex; flex-direction: column; justify-content: center;
          padding: clamp(56px,7vw,110px) clamp(18px,6vw,84px) clamp(48px,6vw,88px);
          position: relative;
        }
        .ap-hero-ghost {
          position: absolute; bottom: -50px; left: -10px; z-index: 0;
          font-size: clamp(120px,22vw,260px); font-weight: 800; line-height: 1;
          color: rgba(255,255,255,0.04); pointer-events: none; user-select: none;
          letter-spacing: -0.04em; white-space: nowrap; mix-blend-mode: soft-light;
          animation: floatGhost 6s ease-in-out infinite;
        }
        @keyframes floatGhost {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        .ap-eyebrow { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 24px; position: relative; z-index: 1; }
        .ap-eyebrow-line { width: 32px; height: 1.5px; background: var(--red); border-radius: 1px; }
        .ap-eyebrow-tag  { font-size: 0.64rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); }

        .ap-h1 { font-size: clamp(3rem,6.5vw,5.2rem); font-weight: 800; line-height: 1.02; letter-spacing: -0.03em; color: var(--white); position: relative; z-index: 1; }
        .ap-h1-sub { display: block; font-weight: 300; color: rgba(255,255,255,0.48); font-size: 0.82em; letter-spacing: -0.01em; }
        .ap-h1-place {
          display: block;
          background: linear-gradient(120deg, #ff7a6b 0%, var(--red) 45%, #b52217 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          white-space: nowrap;
        }
        .ap-pc-pill {
          display: inline-flex; align-items: center; gap: 7px; margin-top: 16px;
          background: rgba(217,43,30,0.07); border: 1px solid rgba(217,43,30,0.18);
          border-radius: 4px; padding: 6px 12px;
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; color: rgba(217,43,30,0.75);
          width: fit-content; position: relative; z-index: 1;
        }
        .ap-hero-desc {
          font-size: 0.98rem; color: rgba(255,255,255,0.58); line-height: 1.85;
          max-width: 540px; margin: 30px 0 38px; position: relative; z-index: 1;
        }
        .ap-hero-desc strong { color: rgba(255,255,255,0.9); font-weight: 700; }

        .ap-stats {
          display: flex; flex-wrap: wrap; align-items: stretch; gap: 0;
          margin-bottom: 42px; position: relative; z-index: 1;
          border: 1px solid rgba(255,255,255,0.06); border-radius: 14px;
          overflow: hidden; width: fit-content; max-width: 100%;
          background: rgba(255,255,255,0.03);
        }
        .ap-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 20px 30px; position: relative; }
        .ap-stat + .ap-stat::before { content: ''; position: absolute; left: 0; top: 14px; bottom: 14px; width: 1px; background: rgba(255,255,255,0.06); }
        .ap-stat-num    { font-size: 2rem; font-weight: 800; color: var(--white); line-height: 1; letter-spacing: -0.04em; }
        .ap-stat-suffix { color: var(--red); }
        .ap-stat-label  { font-size: 0.6rem; font-weight: 600; color: rgba(255,255,255,0.24); text-transform: uppercase; letter-spacing: 0.12em; white-space: nowrap; }

        .ap-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; position: relative; z-index: 1; }

        /* Buttons */
        .ap-btn-primary {
          display: inline-flex; align-items: center; gap: 11px;
          background: var(--red); color: var(--white);
          font-size: 0.875rem; font-weight: 600; letter-spacing: 0.01em;
          padding: 16px 28px; border-radius: 10px; text-decoration: none;
          position: relative; overflow: hidden; border: none; cursor: pointer;
          box-shadow: 0 6px 18px rgba(181,34,28,0.12), 0 2px 0 var(--red-deep), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: box-shadow 0.25s var(--ease-expo), transform 0.2s var(--ease-expo), background 0.2s;
          white-space: nowrap;
        }
        .ap-btn-primary::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%); pointer-events: none; }
        .ap-btn-primary:hover  { background: var(--red-deep); box-shadow: 0 0 48px var(--red-glow), 0 2px 0 var(--red-deep), inset 0 1px 0 rgba(255,255,255,0.16); transform: translateY(-3px) scale(1.01); }
        .ap-btn-primary:focus-visible { outline: 3px solid rgba(255,255,255,0.5); outline-offset: 2px; }
        .ap-btn-arrow { width: 24px; height: 24px; background: rgba(255,255,255,0.18); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; transition: background 0.2s, transform 0.2s; position: relative; z-index: 1; }
        .ap-btn-primary:hover .ap-btn-arrow { background: rgba(255,255,255,0.28); transform: translateX(3px); }

        .ap-btn-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          color: rgba(255,255,255,0.6); font-size: 0.875rem; font-weight: 500;
          padding: 15px 22px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);
          text-decoration: none; transition: color 0.2s, border-color 0.2s, background 0.2s;
          white-space: nowrap; cursor: pointer; background: transparent;
        }
        .ap-btn-ghost:hover { color: var(--white); border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.04); }
        .ap-btn-ghost:focus-visible { outline: 3px solid rgba(255,255,255,0.4); outline-offset: 2px; }
        .ap-phone-ico { width: 30px; height: 30px; background: rgba(217,43,30,0.12); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: var(--red); flex-shrink: 0; }

        /* Map panel */
        .ap-hero-right { position: relative; overflow: hidden; min-height: 380px; }
        .ap-hero-right iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; filter: saturate(0.65) brightness(0.78) contrast(1.05) sepia(0.05); }
        .ap-hero-right::before { content: ''; position: absolute; inset: 0; z-index: 2; pointer-events: none; background: linear-gradient(270deg, transparent 46%, rgba(26,29,35,0.46) 100%), linear-gradient(0deg, rgba(26,29,35,0.18) 0%, transparent 12%, transparent 88%, rgba(26,29,35,0.18) 100%); }
        .ap-map-label { position: absolute; bottom: 32px; right: 28px; z-index: 10; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; pointer-events: none; }
        .ap-map-area-name { font-size: clamp(1.8rem,4vw,2.8rem); font-weight: 700; color: rgba(255,255,255,0.12); letter-spacing: -0.02em; line-height: 1; user-select: none; }
        .ap-map-postcode  { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; color: rgba(217,43,30,0.5); }

        /* Trust bar */
        .ap-trust-bar   { position: relative; z-index: 3; border-top: 1px solid rgba(255,255,255,0.04); background: rgba(255,255,255,0.015); }
        .ap-trust-inner { display: flex; overflow-x: auto; scrollbar-width: none; max-width: 1200px; margin: 0 auto; padding: 0 clamp(16px,5vw,60px); }
        .ap-trust-inner::-webkit-scrollbar { display: none; }
        .ap-trust-item  { display: flex; align-items: center; gap: 9px; padding: 14px 24px; font-size: 0.71rem; font-weight: 500; color: rgba(255,255,255,0.3); white-space: nowrap; flex-shrink: 0; border-right: 1px solid rgba(255,255,255,0.04); letter-spacing: 0.03em; transition: color 0.2s; }
        .ap-trust-item:first-child { padding-left: 0; }
        .ap-trust-item:last-child  { border-right: none; }
        .ap-trust-item:hover { color: rgba(255,255,255,0.5); }
        .ap-trust-ico { color: var(--red); font-size: 10px; flex-shrink: 0; opacity: 0.7; }

        /* ══ BODY ══ */
        .ap-body { max-width: 1140px; margin: 0 auto; padding: 96px 24px 104px; display: flex; flex-direction: column; gap: 96px; }

        .ap-tag { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 12px; }
        .ap-tag-line { width: 20px; height: 2px; background: var(--red); border-radius: 2px; }
        .ap-tag-text { font-size: 0.63rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--red); }

        .ap-sec-h2  { font-size: clamp(1.55rem,3vw,2.1rem); font-weight: 700; color: var(--ink); letter-spacing: -0.025em; line-height: 1.18; margin: 0 0 10px; }
        .ap-sec-sub { font-size: 0.9rem; color: var(--slate); line-height: 1.8; margin: 0 0 34px; max-width: 560px; }

        .ap-two { display: grid; grid-template-columns: 1fr; gap: 60px; }
        @media (min-width: 840px) { .ap-two { grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; } }

        .ap-prose { font-size: 0.94rem; color: #505663; line-height: 1.85; }
        .ap-prose p { margin: 0 0 18px; }
        .ap-prose strong { color: var(--ink); font-weight: 600; }

        .ap-services { display: flex; flex-direction: column; gap: 7px; }
        .ap-svc { display: flex; align-items: center; gap: 14px; padding: 14px 18px; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; font-size: 0.875rem; color: #374151; font-weight: 500; transition: border-color 0.22s, background 0.22s, transform 0.22s; }
        .ap-svc:hover { border-color: rgba(217,43,30,0.25); background: rgba(217,43,30,0.04); transform: translateX(5px); }
        .ap-svc-ico { color: var(--red); font-size: 12px; flex-shrink: 0; }

        .ap-why-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(258px, 1fr)); gap: 14px; }
        .ap-why-card { background: var(--white); border: 1px solid var(--line); border-radius: 16px; padding: 30px 26px; transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s; position: relative; overflow: hidden; }
        .ap-why-card:hover { border-color: rgba(217,43,30,0.2); box-shadow: 0 10px 40px rgba(217,43,30,0.07); transform: translateY(-3px); }
        .ap-why-ico-wrap { width: 46px; height: 46px; background: rgba(217,43,30,0.06); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
        .ap-why-ico-wrap svg { color: var(--red); font-size: 18px; }
        .ap-why-card-h { font-size: 0.9rem; font-weight: 700; color: var(--ink); margin: 0 0 9px; }
        .ap-why-card-p { font-size: 0.82rem; color: var(--slate); line-height: 1.75; }

        .ap-kw-block { background: var(--surface); border: 1px solid var(--line); border-radius: 20px; padding: 40px; }
        .ap-kw-grid  { display: grid; grid-template-columns: repeat(2,1fr); gap: 9px; margin-top: 24px; }
        @media (min-width: 540px) { .ap-kw-grid { grid-template-columns: repeat(3,1fr); } }
        @media (min-width: 860px) { .ap-kw-grid { grid-template-columns: repeat(4,1fr); } }
        .ap-kw { display: flex; align-items: center; gap: 9px; background: var(--white); border: 1px solid var(--line); border-radius: 8px; padding: 10px 14px; font-size: 0.75rem; color: #374151; font-weight: 500; transition: border-color 0.2s, color 0.2s; }
        .ap-kw:hover { border-color: var(--red); color: var(--red); }
        .ap-kw-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--red); opacity: 0.35; flex-shrink: 0; }

        .ap-faqs { display: flex; flex-direction: column; gap: 9px; margin-top: 26px; }
        .ap-faq  { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--white); }
        .ap-faq summary { list-style: none; padding: 19px 24px; font-size: 0.9rem; font-weight: 600; color: var(--ink); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 14px; transition: background 0.18s; user-select: none; }
        .ap-faq summary::-webkit-details-marker { display: none; }
        .ap-faq summary:hover { background: var(--surface); }
        .ap-faq[open] summary { background: rgba(217,43,30,0.05); color: var(--red); }
        .ap-faq-chevron { width: 22px; height: 22px; background: var(--line2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 9px; color: var(--slate); transition: background 0.18s, transform 0.28s; }
        .ap-faq[open] .ap-faq-chevron { background: rgba(217,43,30,0.12); color: var(--red); transform: rotate(180deg); }
        .ap-faq-ans { padding: 0 24px 22px; font-size: 0.875rem; color: #4b5563; line-height: 1.85; border-top: 1px solid var(--line2); }

        .ap-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .ap-chip  { display: inline-flex; align-items: center; gap: 8px; background: var(--white); border: 1px solid var(--line); border-radius: 100px; padding: 9px 18px; font-size: 0.8rem; color: #374151; font-weight: 500; text-decoration: none; transition: border-color 0.2s, color 0.2s, background 0.2s; }
        .ap-chip:hover { border-color: var(--red); color: var(--red); background: rgba(217,43,30,0.04); }
        .ap-chip:focus-visible { outline: 2px solid var(--red); outline-offset: 2px; }
        .ap-chip-ico { color: var(--red); font-size: 9px; opacity: 0.45; }

        /* ══ CTA SECTION ══ */
        .ap-cta { background: var(--ink); position: relative; overflow: hidden; padding: 100px 24px; text-align: center; }
        .ap-cta-orb1 { position: absolute; bottom: -120px; left: -80px; width: 420px; height: 420px; border-radius: 50%; pointer-events: none; background: radial-gradient(circle, rgba(217,43,30,0.10) 0%, transparent 65%); }
        .ap-cta-orb2 { position: absolute; top: -80px; right: -60px; width: 340px; height: 340px; border-radius: 50%; pointer-events: none; background: radial-gradient(circle, rgba(217,43,30,0.06) 0%, transparent 65%); }
        .ap-cta-rule  { width: 40px; height: 2px; background: var(--red); margin: 0 auto 20px; border-radius: 1px; }
        .ap-cta-inner { position: relative; z-index: 1; max-width: 580px; margin: 0 auto; }
        .ap-cta-kicker { font-size: 0.63rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(217,43,30,0.7); margin-bottom: 18px; }
        .ap-cta-h2   { font-size: clamp(1.8rem,5vw,3rem); font-weight: 800; color: var(--white); letter-spacing: -0.025em; line-height: 1.12; margin: 0 0 16px; }
        .ap-cta-h2 em { color: #f87171; font-style: normal; }
        .ap-cta-desc  { color: rgba(255,255,255,0.35); font-size: 0.9rem; line-height: 1.8; margin: 0 0 38px; }
        .ap-cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        /* ══ RESPONSIVE ══ */
        @media (max-width: 639px) {
          .ap-hero-left { padding: 44px 18px 32px; }
          .ap-h1 { font-size: clamp(2.6rem,11vw,3.2rem); }
          .ap-hero-desc { font-size: 0.875rem; margin: 22px 0 30px; }
          .ap-stats { width: 100%; border-radius: 12px; }
          .ap-stat  { padding: 16px 18px; flex: 1; }
          .ap-stat-num { font-size: 1.6rem; }
          .ap-hero-actions { flex-direction: column; gap: 10px; }
          .ap-btn-primary, .ap-btn-ghost { width: 100%; justify-content: center; }
          .ap-hero-right { min-height: 270px; }
          .ap-map-label  { display: none; }
          .ap-body { padding: 60px 16px 76px; gap: 68px; }
          .ap-kw-block { padding: 24px 18px; }
          .ap-faq summary { padding: 16px 18px; font-size: 0.87rem; }
          .ap-faq-ans { padding: 0 18px 18px; }
          .ap-cta { padding: 68px 18px; }
          .ap-cta-actions { flex-direction: column; gap: 10px; }
          .ap-cta-actions .ap-btn-primary,
          .ap-cta-actions .ap-btn-ghost { width: 100%; justify-content: center; }
        }

        /* ══ PRINT ══ */
        @media print {
          .ap-hero-right, .ap-trust-bar, .ap-hero-actions, .ap-cta { display: none; }
          .ap-body { padding: 24px 0; gap: 40px; }
        }
      `}</style>

      <main className="ap" id="main-content">
        {/* ── Skip link for keyboard users ── */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Skip to main content
        </a>

        {/* ───────── HERO ───────── */}
        <header className="ap-hero" ref={heroRef}>
          <div className="ap-hero-bg" aria-hidden="true" />
          <div className="ap-hero-rule" aria-hidden="true" />

          <div className="ap-hero-grid">
            {/* Left panel */}
            <motion.div className="ap-hero-left" style={{ y: smoothY }}>
              <div className="ap-hero-ghost" aria-hidden="true">
                {areaName.replace(/\s+/g, "").toUpperCase().slice(0, 4)}
              </div>

              <motion.div
                className="ap-eyebrow"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                aria-hidden="true"
              >
                <div className="ap-eyebrow-line" />
                <span className="ap-eyebrow-tag">360 Drive Academy</span>
              </motion.div>

              <motion.h1
                className="ap-h1"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.18 }}
              >
                Driving
                <span className="ap-h1-sub">Lessons in</span>
                <span className="ap-h1-place">{areaName}</span>
              </motion.h1>

              {postcode && (
                <motion.div
                  className="ap-pc-pill"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.38, delay: 0.42 }}
                >
                  <FaMapMarkerAlt style={{ fontSize: "8px" }} aria-hidden="true" />
                  <span>{postcode}</span>
                </motion.div>
              )}

              <motion.p
                className="ap-hero-desc"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {heroParagraphs.map((sentence, i) => {
                  const html = sentence
                    .replace(new RegExp(areaName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), `<strong>${areaName}</strong>`)
                    .replace(postcode ? new RegExp(postcode, "g") : /ZZZZ/, `<strong>${postcode}</strong>`);
                  return (
                    <span
                      key={i}
                      dangerouslySetInnerHTML={{ __html: html + (i < heroParagraphs.length - 1 ? ". " : ".") }}
                    />
                  );
                })}
              </motion.p>

              <div className="ap-stats" role="list" aria-label="Key statistics">
                <StatCounter num={90}   suffix="%" label="Pass Rate" delay={0.44} />
                <StatCounter num={1000} suffix="+" label="Students"  delay={0.51} />
                <motion.div
                  className="ap-stat"
                  role="listitem"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.58 }}
                >
                  <span className="ap-stat-num" aria-label="5 star rating">
                    5<span className="ap-stat-suffix" aria-hidden="true">★</span>
                  </span>
                  <span className="ap-stat-label">Stars</span>
                </motion.div>
              </div>

              <motion.div
                className="ap-hero-actions"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.62 }}
              >
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="ap-btn-primary"
                  aria-haspopup="dialog"
                >
                  Book a Lesson
                  <span className="ap-btn-arrow" aria-hidden="true"><FaArrowRight /></span>
                </button>
                <a href={`tel:${phone}`} className="ap-btn-ghost">
                  <span className="ap-phone-ico" aria-hidden="true"><FaPhoneAlt /></span>
                  {phone}
                </a>
              </motion.div>
            </motion.div>

            {/* Right panel — map */}
            <motion.div
              className="ap-hero-right"
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.3 }}
            >
              {mapEmbedUrl ? (
                <iframe
                  src={mapEmbedUrl}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`360 Drive Academy coverage map — ${areaName}`}
                />
              ) : (
                <div
                  style={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: "12px", color: "rgba(255,255,255,0.15)",
                  }}
                >
                  <FaMapMarkerAlt style={{ fontSize: "3.5rem" }} aria-hidden="true" />
                  <span style={{ fontSize: "0.85rem" }}>Map not available</span>
                </div>
              )}
              <motion.div
                className="ap-map-label"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                aria-hidden="true"
              >
                <span className="ap-map-area-name">{areaName}</span>
                {postcode && <span className="ap-map-postcode">{postcode}</span>}
              </motion.div>
            </motion.div>
          </div>

          {/* Trust bar */}
          <div className="ap-trust-bar" role="region" aria-label="Trust signals">
            <div className="ap-trust-inner">
              {[
                ...TRUST_ITEMS,
                { icon: FaMapMarkerAlt, text: `Local to ${areaName}` },
              ].map(({ icon: Icon, text }) => (
                <div className="ap-trust-item" key={text}>
                  <Icon className="ap-trust-ico" aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ───────── BODY ───────── */}
        <div className="ap-body">

          {/* About + Services */}
          <div className="ap-two">
            {services.length > 0 && (
              <motion.section {...fadeUp(0)} aria-labelledby="svc-h">
                <div className="ap-tag"><div className="ap-tag-line" /><span className="ap-tag-text">What We Offer</span></div>
                <h2 id="svc-h" className="ap-sec-h2">Lesson Services in {areaName}</h2>
                <p className="ap-sec-sub">Tuition tailored to learners at every stage — beginner to test-ready.</p>
                <div className="ap-services" role="list">
                  {services.map((s, i) => (
                    <motion.div
                      key={i}
                      role="listitem"
                      className="ap-svc"
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.32, delay: i * 0.05 }}
                    >
                      <FaCheckCircle className="ap-svc-ico" aria-hidden="true" />
                      {s}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            <motion.section {...fadeUp(services.length ? 0.08 : 0)} aria-labelledby="about-h">
              <div className="ap-tag"><div className="ap-tag-line" /><span className="ap-tag-text">About {areaName}</span></div>
              <h2 id="about-h" className="ap-sec-h2">
                Driving Lessons — {areaName}{postcode ? `, ${postcode}` : ""}
              </h2>
              <div className="ap-prose">
                {introText ? (
                  <p>{introText}</p>
                ) : (
                  <p>
                    <strong>360 Drive Academy</strong> delivers expert{" "}
                    <strong>driving lessons in {areaName}</strong>
                    {postcode ? ` (${postcode})` : ""}. Our fully qualified,{" "}
                    <strong>DVSA-approved instructors</strong> live and teach in the local area — they
                    know every road, hazard, and test-route junction, giving every student a genuine
                    advantage on test day.
                  </p>
                )}
                {bodyText ? (
                  <p>{bodyText}</p>
                ) : (
                  <>
                    <p>
                      Whether you need <strong>beginner driving lessons</strong>, a fast-track{" "}
                      <strong>intensive course</strong>, or{" "}
                      <strong>automatic lessons near {areaName}</strong>, we design every lesson
                      around your pace and learning style.
                    </p>
                    <p>
                      All instructors are <strong>DBS-checked</strong> and experienced with learners
                      of every ability. We offer lessons{" "}
                      <strong>7 days a week including evenings</strong>, and you can book online in
                      minutes.
                    </p>
                  </>
                )}
              </div>
            </motion.section>
          </div>

          {/* Why choose us */}
          <motion.section {...fadeUp(0.05)} aria-labelledby="why-h">
            <div className="ap-tag"><div className="ap-tag-line" /><span className="ap-tag-text">Why Choose Us</span></div>
            <h2 id="why-h" className="ap-sec-h2">Why 360 Drive Academy in {areaName}</h2>
            <p className="ap-sec-sub">
              Hundreds of learners across West London have trusted us to get them through their driving test.
            </p>
            <div className="ap-why-grid">
              {WHY_ITEMS.map(({ icon: Icon, title, body: cardBody }, i) => (
                <motion.div
                  key={i}
                  className="ap-why-card"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <div className="ap-why-ico-wrap"><Icon aria-hidden="true" /></div>
                  <h3 className="ap-why-card-h">{title}</h3>
                  <p className="ap-why-card-p">{cardBody}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Popular searches */}
          <motion.section {...fadeUp(0.04)} aria-labelledby="kw-h">
            <div className="ap-kw-block">
              <div className="ap-tag"><div className="ap-tag-line" /><span className="ap-tag-text">Popular Searches</span></div>
              <h2 id="kw-h" className="ap-sec-h2" style={{ marginBottom: 0 }}>
                Find the Right Lesson in {areaName}
              </h2>
              <div className="ap-kw-grid" role="list" aria-label="Popular search terms">
                {[
                  `Driving lessons ${areaName}`,
                  `Automatic lessons ${areaName}`,
                  `Manual lessons ${areaName}`,
                  `Intensive course ${areaName}`,
                  `Driving instructor ${areaName}`,
                  `Pass Plus ${areaName}`,
                  `Mock driving test ${areaName}`,
                  `Cheap driving lessons ${areaName}`,
                  `Theory test help ${areaName}`,
                  postcode ? `Driving lessons ${postcode}` : `Lessons near ${areaName}`,
                  `DVSA test centre ${areaName}`,
                  `Learn to drive ${areaName}`,
                  `Beginner lessons ${areaName}`,
                  `Block booking ${areaName}`,
                  `Refresher lessons ${areaName}`,
                  `Motorway lessons ${areaName}`,
                ].map((kw, i) => (
                  <motion.div
                    key={i}
                    role="listitem"
                    className="ap-kw"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.26, delay: i * 0.025 }}
                  >
                    <span className="ap-kw-dot" aria-hidden="true" />
                    {kw}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* FAQs */}
          <motion.section {...fadeUp(0.04)} aria-labelledby="faq-h">
            <div className="ap-tag"><div className="ap-tag-line" /><span className="ap-tag-text">FAQs</span></div>
            <h2 id="faq-h" className="ap-sec-h2">Frequently Asked Questions — {areaName}</h2>
            <p className="ap-sec-sub">Everything you need to know before booking your first lesson.</p>
            <div className="ap-faqs">
              {resolvedFaqs.map(({ q, a }, i) => (
                <motion.details
                  key={i}
                  className="ap-faq"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <summary>
                    {q}
                    <span className="ap-faq-chevron" aria-hidden="true">▾</span>
                  </summary>
                  <div className="ap-faq-ans">{a}</div>
                </motion.details>
              ))}
            </div>
          </motion.section>

          {/* Nearby areas */}
          {nearbyAreas.length > 0 && (
            <motion.section {...fadeUp(0.04)} aria-labelledby="nearby-h">
              <div className="ap-tag"><div className="ap-tag-line" /><span className="ap-tag-text">Also Covered</span></div>
              <h2 id="nearby-h" className="ap-sec-h2">Driving Lessons near {areaName}</h2>
              <p className="ap-sec-sub">
                We cover {areaName} and all surrounding areas. Tap any location to explore lessons near you.
              </p>
              <nav aria-label="Nearby areas">
                <div className="ap-chips">
                  {nearbyAreas.map(({ name, href }, i) => (
                    <motion.a
                      key={i}
                      href={href || "#"}
                      className="ap-chip"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.26, delay: i * 0.04 }}
                    >
                      <FaMapMarkerAlt className="ap-chip-ico" aria-hidden="true" />
                      {name}
                    </motion.a>
                  ))}
                </div>
              </nav>
            </motion.section>
          )}
        </div>

        {/* Google Reviews */}
        <section aria-label="Customer reviews">
          <Reviews />
        </section>

        {/* ───────── Bottom CTA ───────── */}
        <section className="ap-cta" aria-labelledby="cta-h">
          <div className="ap-cta-orb1" aria-hidden="true" />
          <div className="ap-cta-orb2" aria-hidden="true" />
          <motion.div
            className="ap-cta-inner"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div className="ap-cta-rule" aria-hidden="true" />
            <p className="ap-cta-kicker">Ready to get started?</p>
            <h2 id="cta-h" className="ap-cta-h2">
              Book Your First Lesson<br />in <em>{areaName}</em> Today
            </h2>
            <p className="ap-cta-desc">
              Flexible slots available 7 days a week, including evenings. We'll match you with a local
              instructor in {areaName}{postcode ? ` (${postcode})` : ""} and get you on the road fast.
            </p>
            <div className="ap-cta-actions">
              <button
                type="button"
                onClick={handleOpenModal}
                className="ap-btn-primary"
                aria-haspopup="dialog"
              >
                Book a Lesson
                <span className="ap-btn-arrow" aria-hidden="true"><FaArrowRight /></span>
              </button>
              <a href={`tel:${phone}`} className="ap-btn-ghost">
                <span className="ap-phone-ico" aria-hidden="true"><FaPhoneAlt /></span>
                {phone}
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ───────── Booking Modal ───────── */}
      <AnimatePresence>
        {modalOpen && (
          <ModalPortal>
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="w-full"
            >
              <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92dvh] overflow-y-auto">
                {/* Drag handle (mobile) */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden" aria-hidden="true">
                  <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>

                <div className="px-5 pb-8 pt-3 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 id="booking-title" className="text-lg font-semibold text-gray-900">
                        Request a lesson
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        We'll confirm availability by phone or email.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      aria-label="Close booking modal"
                      className="p-2 -mr-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Success confirmation */}
                  {showSuccess && savedBooking ? (
                    <div className="mb-4 rounded-md border border-green-100 bg-green-50 p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="flex-shrink-0 bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
                          aria-hidden="true"
                        >
                          ✓
                        </div>
                        <div className="flex-1">
                          <h4 className="text-md font-semibold text-green-800">Booking Confirmed</h4>
                          <p className="text-xs text-green-700 mt-1">
                            Thanks — your booking request has been saved. We&apos;ll contact you shortly.
                          </p>
                          <dl className="mt-3 text-sm text-green-800 grid grid-cols-1 gap-2">
                            <div>
                              <dt className="inline font-bold">Booking ID: </dt>
                              <dd className="inline font-mono">{savedBooking._id || savedBooking.id || "—"}</dd>
                            </div>
                            <div>
                              <dt className="inline font-bold">Area: </dt>
                              <dd className="inline">{savedBooking.area || areaName}</dd>
                            </div>
                            <div>
                              <dt className="inline font-bold">Transmission: </dt>
                              <dd className="inline capitalize">{savedBooking.bookingMode || savedBooking.transmissionType || bookingMode || "—"}</dd>
                            </div>
                            <div>
                              <dt className="inline font-bold">Contact: </dt>
                              <dd className="inline">{savedBooking.phone || savedBooking.email || "—"}</dd>
                            </div>
                          </dl>
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={handleCloseModal}
                              className="bg-green-700 text-white px-3 py-2 rounded-md text-sm hover:bg-green-800 transition"
                            >
                              Done
                            </button>
                            <button
                              type="button"
                              onClick={() => { setShowSuccess(false); setSavedBooking(null); }}
                              className="px-3 py-2 rounded-md text-sm border border-green-700 text-green-700 bg-white hover:bg-green-50 transition"
                            >
                              Another request
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Booking form */
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="grid grid-cols-1 gap-3"
                      noValidate
                    >
                      <BookingFormFields
                        idPrefix="m_"
                        register={register}
                        errors={errors}
                        contactMethod={contactMethod}
                        bookingMode={bookingMode}
                        toggleContactMethod={toggleContactMethod}
                        toggleBookingMode={toggleBookingMode}
                        areaName={areaName}
                        postcode={postcode}
                        inputBase={inputBase}
                      />

                      <div className="flex items-center gap-3 mt-1">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-red-600 text-white font-semibold px-4 py-2.5 rounded-lg shadow hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 active:scale-[0.98] disabled:opacity-60 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          {submitting ? (
                            <>
                              <svg
                                className="animate-spin w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                              >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                              <span aria-live="polite">Sending…</span>
                            </>
                          ) : (
                            "Request Booking"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="px-3 py-2.5 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed">
                        By submitting you agree to our{" "}
                        <a href="/privacy" className="underline text-gray-600 hover:text-gray-900 transition-colors">
                          privacy policy
                        </a>.
                      </p>

                      <AnimatePresence>
                        {toast && <Toast key="toast" toast={toast} />}
                      </AnimatePresence>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </>
  );
};

export default AreaPage;