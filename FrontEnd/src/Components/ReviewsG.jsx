import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar, FaGoogle } from "react-icons/fa";
import { HiArrowLeft, HiArrowRight, HiExternalLink } from "react-icons/hi";
import PropTypes from "prop-types";
import staticReviews from "../data/reviews.json";

const GOOGLE_BUSINESS_URL =
  "https://www.google.com/maps/place/360+drive+academy/@51.5285262,-0.2664044,36955m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2969c8788eb3c3c5:0x598f032241ff1769!8m2!3d51.5286416!4d-0.1015987!16s%2Fg%2F11yjjwwbr2?entry=ttu&g_ep=EgoyMDI2MDIxOC4wIKXMDSoASAFQAw%3D%3D";

const AUTOPLAY_DELAY = 5000;
const CHAR_LIMIT = 180;

// ─── Review Text with Read More ───────────────────────────────────────────────
const ReviewText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text && text.length > CHAR_LIMIT;
  const displayed = isLong && !expanded ? text.slice(0, CHAR_LIMIT).trimEnd() + "…" : text;

  return (
    <div className="mb-6">
      <p className="text-gray-700 text-[1.05rem] leading-relaxed italic">
        {displayed}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors duration-150 focus:outline-none"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const avatarColors = [
  "from-red-500 to-rose-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
];

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ─── Stars ───────────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 14, className = "" }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const color = "text-amber-400";
    if (rating >= i) {
      stars.push(
        <FaStar key={i} size={size} className={color} />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <FaStarHalfAlt key={i} size={size} className={color} />
      );
    } else {
      stars.push(
        <FaRegStar key={i} size={size} className="text-amber-200" />
      );
    }
  }
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>{stars}</div>
  );
};

Stars.propTypes = {
  rating: PropTypes.number.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
};

// ─── Card variants ────────────────────────────────────────────────────────────
const variants = {
  enter: (d) => ({
    x: d > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (d) => ({
    x: d > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.96,
    filter: "blur(4px)",
    transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] },
  }),
};

// ─── Carousel ─────────────────────────────────────────────────────────────────
const ReviewCarousel = ({ reviews }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoplayRef = useRef(null);
  const progressRef = useRef(null);
  const progressStart = useRef(null);
  const touchStartX = useRef(null);

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) /
        reviews.length
      : 0;

  const goTo = useCallback(
    (index, dir) => {
      setDirection(dir ?? (index > activeIndex ? 1 : -1));
      setActiveIndex((index + reviews.length) % reviews.length);
      setProgress(0);
      progressStart.current = performance.now();
    },
    [activeIndex, reviews.length]
  );

  const next = useCallback(() => goTo(activeIndex + 1, 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1, -1), [activeIndex, goTo]);

  // Smooth progress animation
  useEffect(() => {
    if (paused) return;

    const animate = (now) => {
      if (!progressStart.current) progressStart.current = now;
      const elapsed = now - progressStart.current;
      const pct = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        progressRef.current = requestAnimationFrame(animate);
      }
    };

    progressRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(progressRef.current);
  }, [activeIndex, paused]);

  // Autoplay
  useEffect(() => {
    if (paused) return;
    autoplayRef.current = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(autoplayRef.current);
  }, [next, paused]);

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const current = reviews[activeIndex];
  const colorClass = avatarColors[activeIndex % avatarColors.length];

  return (
    <section className="relative w-full py-20 px-4 overflow-hidden bg-white">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-50 opacity-40 blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-widest text-red-500 uppercase mb-2">
            Student Reviews
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
            What our students say
          </h2>

          {/* Rating + Google link */}
          <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
            <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2">
              <span className="text-2xl font-bold text-gray-900 leading-none">
                {avg.toFixed(1)}
              </span>
              <Stars rating={avg} size={15} />
            </div>

            <a
              href={GOOGLE_BUSINESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:border-red-200 hover:shadow-md transition-all duration-200 group"
            >
              <FaGoogle className="text-[#4285F4] group-hover:text-red-500 transition-colors" size={14} />
              <span>View on Google</span>
              <HiExternalLink size={13} className="text-gray-400 group-hover:text-red-400 transition-colors" />
            </a>
          </div>
        </div>

        {/* Card slider */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-100 rounded-full overflow-hidden z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-red-400 to-red-600 origin-left"
              style={{ scaleX: progress / 100 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.05, ease: "linear" }}
            />
          </div>

          {/* Animated card */}
          <div className="flex items-stretch w-full">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-7 md:p-9">
                  {/* Quote mark */}
                  <div className="text-5xl font-serif text-red-100 leading-none mb-3 select-none">
                    &ldquo;
                  </div>

                  {/* Review text */}
                  <ReviewText key={activeIndex} text={current.text} />

                  {/* Divider */}
                  <div className="w-12 h-px bg-gray-200 mb-5" />

                  {/* Author row */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {current.profilePhoto ? (
                      <img
                        src={current.profilePhoto}
                        alt={current.author}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow"
                      />
                    ) : (
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-sm font-bold shadow`}
                      >
                        {getInitials(current.author)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {current.author}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <Stars rating={current.rating ?? 5} size={11} />
                        {current.relativeTime && (
                          <span className="text-xs text-gray-400">
                            · {current.relativeTime}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Source badge */}
                    {current.url ? (
                      <a
                        href={current.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#4285F4] transition-colors ml-auto shrink-0"
                      >
                        <FaGoogle size={12} />
                        <HiExternalLink size={11} />
                      </a>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-300 ml-auto shrink-0">
                        <FaGoogle size={12} />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 active:scale-95"
            >
              <HiArrowLeft size={16} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-5 h-2 bg-red-500"
                      : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next review"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 active:scale-95"
            >
              <HiArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <a
            href={GOOGLE_BUSINESS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors duration-200 group"
          >
            <FaGoogle size={13} className="text-[#4285F4] group-hover:text-red-500 transition-colors" />
            Read all reviews on Google
            <HiExternalLink size={12} className="text-gray-400 group-hover:text-red-400" />
          </a>
        </div>
      </div>
    </section>
  );
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const ReviewSkeleton = () => (
  <div className="max-w-2xl mx-auto px-4 py-20">
    <div className="text-center mb-10 space-y-3">
      <div className="h-3 w-28 bg-gray-100 rounded-full mx-auto animate-pulse" />
      <div className="h-8 w-56 bg-gray-100 rounded-full mx-auto animate-pulse" />
      <div className="h-8 w-36 bg-gray-100 rounded-full mx-auto animate-pulse" />
    </div>
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-9 space-y-4 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-5/6" />
      <div className="h-4 bg-gray-100 rounded w-4/6" />
      <div className="w-12 h-px bg-gray-100 my-2" />
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gray-100" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-2 w-20 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Main export ──────────────────────────────────────────────────────────────
const Reviews = () => {
  const sentinelRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [reviews, setReviews] = useState(staticReviews?.reviews ?? null);
  const [hidden, setHidden] = useState(false);
  const [source, setSource] = useState(
    staticReviews?.reviews ? "static" : null
  );

  const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) {
      if (reviews) setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reviews]);

  useEffect(() => {
    if (!visible) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const fetchReviews = async () => {
      try {
        const url = BASE ? `${BASE}/api/reviews` : `/api/reviews`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          if (!reviews?.length) setHidden(true);
          return;
        }
        const data = await res.json();
        if (!data?.reviews?.length) {
          if (!reviews?.length) setHidden(true);
          return;
        }
        setReviews(data.reviews);
        setSource(data.source ?? "google");
      } catch {
        if (!reviews?.length) setHidden(true);
      } finally {
        clearTimeout(timeout);
      }
    };

    if (source !== "google") fetchReviews();
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [visible, BASE, reviews, source]);

  if (hidden) return null;

  return (
    <div ref={sentinelRef}>
      {!visible && reviews && <ReviewCarousel reviews={reviews} />}
      {visible && reviews === null && <ReviewSkeleton />}
      {visible && reviews !== null && <ReviewCarousel reviews={reviews} />}
    </div>
  );
};

export default Reviews;