import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaClock, FaArrowRight } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import axios from "axios";

const API_BASE_URL  = "https://three60drivingschool.onrender.com/blog";
const IMAGE_BASE    = "https://three60drivingschool.onrender.com/";
const CARD_FALLBACK = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80";

/* ─── Helpers ─────────────────────────────────────────── */
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return iso; }
}

function readingTime(text = "") {
  const words = (text || "").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ─── Skeleton ───────────────────────────────────────── */
function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm animate-pulse">
          <div className="aspect-video bg-gray-100" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-4/5" />
            <div className="h-3 bg-gray-100 rounded w-2/3 mt-2" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Blog Card ──────────────────────────────────────── */
function BlogCard({ post, index }) {
  const imgSrc = post.image ? `${IMAGE_BASE}${post.image}` : CARD_FALLBACK;
  const tag    = (post.tags || [])[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/blog/${post.slug || post._id}`}
        className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 h-full"
        style={{ textDecoration: "none" }}
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={imgSrc}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Tag badge */}
          {tag && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[0.6rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md">
              {tag}
            </span>
          )}
          {/* Read time */}
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white text-[0.65rem] font-semibold px-2 py-1 rounded-full">
            <FaClock size={9} />
            {readingTime(post.content)} min
          </span>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col">
          {/* Date */}
          <time className="text-xs text-gray-400 font-medium tracking-wide mb-2 block">
            {formatDate(post.createdAt)}
          </time>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-[1.05rem] leading-snug mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
            {post.excerpt || post.content}
          </p>

          {/* Divider */}
          <div className="w-8 h-px bg-gray-200 mb-4" />

          {/* Read more */}
          <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold tracking-widest uppercase group-hover:gap-2.5 transition-all duration-200">
            Read article
            <span className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all duration-200">
              <FaArrowRight size={8} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main Component ───────���─────────────────────────── */
export default function HomeBlogPreview() {
  const sentinelRef  = useRef(null);
  const [posts,    setPosts]    = useState(null);
  const [visible,  setVisible]  = useState(false);
  const [error,    setError]    = useState(false);

  /* Intersection observer — lazy load when section scrolls into view */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) { setVisible(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const load = async () => {
      try {
        const res = await axios.get(API_BASE_URL, {
          params: { page: 1, limit: 3, published: true },
        });
        const data = res.data.blogs || res.data || [];
        setPosts(data.slice(0, 3));
      } catch {
        setError(true);
      }
    };
    load();
  }, [visible]);

  if (error) return null;

  return (
    <section ref={sentinelRef} className="relative w-full py-20 px-4 overflow-hidden bg-white">

      {/* Background decoration — mirrors Reviews section */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-50 opacity-40 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-widest text-red-500 uppercase mb-2">
            From the blog
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
            Tips, guides & advice
          </h2>
          <p className="text-gray-500 text-[0.95rem] max-w-md mx-auto leading-relaxed">
            Practical driving tips and expert advice from the team at 360 Drive Academy.
          </p>
        </div>

        {/* ── Cards ── */}
        {!visible || posts === null ? (
          <BlogSkeleton />
        ) : posts.length === 0 ? null : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <BlogCard key={post._id} post={post} index={i} />
            ))}
          </div>
        )}

        {/* ── View all CTA — mirrors Reviews Google link ── */}
        {posts && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-red-600 hover:border-red-200 hover:shadow-md transition-all duration-200 group"
              style={{ textDecoration: "none" }}
            >
              View all articles
              <HiArrowRight
                size={15}
                className="text-gray-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all duration-200"
              />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}