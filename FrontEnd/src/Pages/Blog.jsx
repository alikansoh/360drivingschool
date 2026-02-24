import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClock, FaSearch, FaTimes, FaArrowRight,
  FaChevronLeft, FaChevronRight, FaTags
} from "react-icons/fa";

const API_BASE_URL  = "https://three60drivingschool.onrender.com/blog";
const IMAGE_BASE    = "https://three60drivingschool.onrender.com/";
const PAGE_LIMIT    = 9;
const FALLBACK_IMG  = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80";
const CARD_FALLBACK = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80";

/* ─── Animations ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

const cardAnim = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, scale: 0.97 },
  transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
};

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

/* ─── Featured Card ───────────────────────────────────── */
function FeaturedCard({ post }) {
  const imgSrc = post.image ? `${IMAGE_BASE}${post.image}` : FALLBACK_IMG;
  return (
    <Link to={`/blog/${post.slug || post._id}`} className="featured-card block">
      <div className="featured-image-wrap">
        <img src={imgSrc} alt={post.title} className="featured-img" loading="eager" />
        <div className="featured-gradient" />
        <div className="featured-content">
          <div className="featured-badges">
            <span className="featured-badge">✦ Featured</span>
            {(post.tags || []).slice(0, 2).map((t) => (
              <span key={t} className="featured-tag">{t}</span>
            ))}
          </div>
          <h2 className="featured-title">{post.title}</h2>
          {post.excerpt && <p className="featured-excerpt">{post.excerpt}</p>}
          <div className="featured-footer">
            <div className="featured-meta">
              <span>{post.author || "360 Drive Academy"}</span>
              <span className="meta-dot" />
              <span>{formatDate(post.createdAt)}</span>
              <span className="meta-dot" />
              <FaClock style={{ fontSize: "0.6rem" }} />
              <span>{readingTime(post.content)} min read</span>
            </div>
            <span className="featured-cta">
              Read article <FaArrowRight style={{ fontSize: "0.6rem" }} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Post Card ───────────────────────────────────────── */
function PostCard({ post }) {
  const imgSrc = post.image ? `${IMAGE_BASE}${post.image}` : CARD_FALLBACK;
  const tag    = (post.tags || [])[0];
  return (
    <motion.article {...cardAnim} className="post-card">
      <Link
        to={`/blog/${post.slug || post._id}`}
        style={{ display: "flex", flexDirection: "column", height: "100%", textDecoration: "none" }}
      >
        <div className="post-card-image-wrap">
          <img src={imgSrc} alt={post.title} className="post-card-img" loading="lazy" />
          <div className="post-card-overlay" />
          {tag && (
            <span className="post-card-tag">
              <FaTags style={{ fontSize: "0.55rem" }} /> {tag}
            </span>
          )}
          <span className="post-card-readtime">
            <FaClock style={{ fontSize: "0.58rem" }} /> {readingTime(post.content)} min
          </span>
        </div>
        <div className="post-card-body">
          <time className="post-card-date">{formatDate(post.createdAt)}</time>
          <h3 className="post-card-title">{post.title}</h3>
          <p className="post-card-excerpt">{post.excerpt || post.content}</p>
          <div className="post-card-read">
            Read article
            <span className="post-card-arrow">
              <FaArrowRight style={{ fontSize: "0.58rem" }} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ─── Skeleton Card ──────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="post-card" style={{ cursor: "default", pointerEvents: "none" }}>
      <div style={{
        aspectRatio: "16/9",
        background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
        backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
      }} />
      <div className="post-card-body">
        <div className="skeleton-line" style={{ width: "32%", height: 11 }} />
        <div className="skeleton-line" style={{ width: "88%", height: 17, marginTop: 8 }} />
        <div className="skeleton-line" style={{ width: "70%", height: 17 }} />
        <div className="skeleton-line" style={{ width: "100%", height: 11, marginTop: 10 }} />
        <div className="skeleton-line" style={{ width: "80%", height: 11 }} />
        <div className="skeleton-line" style={{ width: "55%", height: 11 }} />
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */
export default function PublicBlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page") || 1);
  const tagParam  = searchParams.get("tag") || "";
  const qParam    = searchParams.get("q")   || "";

  const [posts,     setPosts]     = useState([]);
  const [page,      setPage]      = useState(pageParam);
  const [pages,     setPages]     = useState(1);
  const [loading,   setLoading]   = useState(false);
  const [tagFilter, setTagFilter] = useState(tagParam);
  const [query,     setQuery]     = useState(qParam);
  const [inputVal,  setInputVal]  = useState(qParam);

  useEffect(() => {
    setPage(pageParam); setTagFilter(tagParam);
    setQuery(qParam);   setInputVal(qParam);
  }, [pageParam, tagParam, qParam]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_BASE_URL, {
          params: {
            page, limit: PAGE_LIMIT,
            search: query || undefined,
            tag: tagFilter || undefined,
            published: true,
          },
        });
        setPosts(res.data.blogs || res.data || []);
        setPages(res.data.pages || 1);
      } catch (err) {
        console.error("Failed to load blog list", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, tagFilter, query]);

  const applyTag = (t) => {
    const next = t === tagFilter ? "" : t;
    setSearchParams((prev) => {
      next ? prev.set("tag", next) : prev.delete("tag");
      prev.set("page", "1"); return prev;
    });
    setPage(1); setTagFilter(next);
  };

  const doSearch = (e) => {
    e.preventDefault();
    setQuery(inputVal);
    setSearchParams((prev) => {
      inputVal ? prev.set("q", inputVal) : prev.delete("q");
      prev.set("page", "1"); return prev;
    });
    setPage(1);
  };

  const clearAll = () => {
    setInputVal(""); setQuery(""); setTagFilter("");
    setSearchParams({ page: "1" }); setPage(1);
  };

  const changePage = (next) => {
    const n = Math.max(1, Math.min(pages, next));
    setPage(n);
    setSearchParams((prev) => { prev.set("page", String(n)); return prev; });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featured   = posts[0];
  const rest       = posts.slice(1);
  const hasFilters = !!(query || tagFilter);
  const ALL_TAGS   = ["Test Tips", "Instructor Advice", "Pass First Time", "Motorway", "Intensive"];

  return (
    <>
      <Helmet>
        <title>Blog — 360 Drive Academy</title>
        <meta name="description" content="Tips, news and guides from 360 Drive Academy." />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }

        body { background: #F7F7F5; }

        /* ── Header typography ── */
        .bl-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.67rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #dc2626;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .bl-eyebrow::after {
          content: ''; display: inline-block;
          width: 24px; height: 2px;
          background: #dc2626; border-radius: 2px;
        }
        .bl-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3.4rem);
          font-weight: 900; line-height: 1.06;
          letter-spacing: -0.025em; color: #0f0f0f;
        }
        .bl-headline em { font-style: italic; color: #dc2626; }
        .bl-sub {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem; line-height: 1.72; color: #6b7280;
          max-width: 36rem;
        }

        /* ── Search ── */
        .search-wrap {
          display: flex; align-items: center;
          background: #fff; border: 1.5px solid #e5e7eb;
          border-radius: 12px; overflow: hidden;
          width: 100%; max-width: 420px;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .search-wrap:focus-within {
          border-color: #dc2626;
          box-shadow: 0 0 0 4px rgba(220,38,38,0.07);
        }
        .search-icon {
          padding: 0 0 0 13px; color: #9ca3af;
          font-size: 0.78rem; flex-shrink: 0;
        }
        .search-input {
          flex: 1; padding: 0.65rem 0.7rem;
          border: none; outline: none; background: transparent;
          font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #111;
          min-width: 0;
        }
        .search-input::placeholder { color: #9ca3af; }
        .search-btn {
          padding: 0.65rem 1rem;
          background: #111; color: #fff; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 700;
          transition: background 0.2s; flex-shrink: 0; letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .search-btn:hover { background: #dc2626; }

        /* ── Filter chips ── */
        .fchip {
          display: inline-flex; align-items: center; gap: 6px;
          background: #111; color: #fff;
          font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 600;
          padding: 4px 10px 4px 12px; border-radius: 999px;
        }
        .fchip-x {
          display: flex; align-items: center; justify-content: center;
          width: 16px; height: 16px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: none;
          cursor: pointer; color: #fff; font-size: 0.52rem;
          transition: background 0.15s;
        }
        .fchip-x:hover { background: rgba(255,255,255,0.32); }

        /* ── Featured card ── */
        .featured-card { cursor: pointer; display: block; text-decoration: none; }
        .featured-image-wrap {
          position: relative; border-radius: 18px; overflow: hidden;
          aspect-ratio: 16 / 9;
          background: #1a1a1a;
          box-shadow: 0 16px 48px rgba(0,0,0,0.14);
        }
        @media (max-width: 640px) {
          .featured-image-wrap { aspect-ratio: 4/3; border-radius: 14px; }
        }
        .featured-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 8s ease;
        }
        .featured-card:hover .featured-img { transform: scale(1.04); }
        .featured-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.88) 0%,
            rgba(0,0,0,0.45) 45%,
            transparent 75%
          );
        }
        .featured-content {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: clamp(1rem, 3.5vw, 2rem);
        }
        .featured-badges {
          display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
          margin-bottom: 0.6rem;
        }
        .featured-badge {
          display: inline-flex; align-items: center;
          background: #dc2626; color: #fff;
          font-family: 'Inter', sans-serif; font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 3px 9px; border-radius: 6px;
        }
        .featured-tag {
          display: inline-block;
          color: rgba(255,255,255,0.72); background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.09em; text-transform: uppercase;
          padding: 3px 9px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.18);
        }
        .featured-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.15rem, 2.8vw, 2rem);
          font-weight: 900; color: #fff; line-height: 1.14;
          margin-bottom: 0.45rem;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .featured-excerpt {
          color: rgba(255,255,255,0.68);
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem; line-height: 1.6;
          max-width: 520px; margin-bottom: 0.9rem;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        @media (max-width: 480px) { .featured-excerpt { display: none; } }
        .featured-footer {
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 8px;
        }
        .featured-meta {
          display: flex; align-items: center; flex-wrap: wrap; gap: 5px;
          color: rgba(255,255,255,0.52);
          font-family: 'Inter', sans-serif; font-size: 0.75rem;
        }
        .meta-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(255,255,255,0.3); flex-shrink: 0;
        }
        .featured-cta {
          display: inline-flex; align-items: center; gap: 6px;
          color: #fff; font-family: 'Inter', sans-serif;
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.18);
          padding: 7px 14px; border-radius: 999px; transition: all 0.2s;
          white-space: nowrap;
        }
        .featured-card:hover .featured-cta { background: #dc2626; border-color: #dc2626; }

        /* ── Post card ── */
        .post-card {
          background: #fff; border-radius: 14px; overflow: hidden;
          border: 1px solid #eeeeec;
          transition: box-shadow 0.28s cubic-bezier(0.16,1,0.3,1),
                      transform  0.28s cubic-bezier(0.16,1,0.3,1);
          display: flex; flex-direction: column;
        }
        .post-card:hover {
          box-shadow: 0 14px 42px rgba(0,0,0,0.09);
          transform: translateY(-3px);
        }
        .post-card-image-wrap {
          aspect-ratio: 16 / 9;
          overflow: hidden; background: #e9e9e7;
          position: relative; flex-shrink: 0;
        }
        .post-card-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.55s cubic-bezier(0.16,1,0.3,1);
        }
        .post-card:hover .post-card-img { transform: scale(1.07); }
        .post-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 55%);
        }
        .post-card-tag {
          position: absolute; top: 10px; left: 10px;
          display: inline-flex; align-items: center; gap: 4px;
          background: rgba(220,38,38,0.9); backdrop-filter: blur(6px);
          color: #fff; font-family: 'Inter', sans-serif;
          font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 3px 8px; border-radius: 5px;
        }
        .post-card-readtime {
          position: absolute; bottom: 9px; right: 10px;
          display: flex; align-items: center; gap: 3px;
          color: rgba(255,255,255,0.88); font-family: 'Inter', sans-serif;
          font-size: 0.65rem; font-weight: 600;
          background: rgba(0,0,0,0.32); backdrop-filter: blur(6px);
          padding: 2px 7px; border-radius: 999px;
        }
        .post-card-body {
          padding: 1.15rem 1.15rem 1.3rem;
          display: flex; flex-direction: column; flex: 1;
        }
        .post-card-date {
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem; font-weight: 500; color: #9ca3af;
          letter-spacing: 0.04em; margin-bottom: 0.4rem; display: block;
        }
        .post-card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.06rem; font-weight: 700; line-height: 1.3;
          color: #0f0f0f; margin-bottom: 0.45rem;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          transition: color 0.2s;
        }
        .post-card:hover .post-card-title { color: #dc2626; }
        .post-card-excerpt {
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem; line-height: 1.65; color: #6b7280;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          flex: 1; margin-bottom: 0.9rem;
        }
        .post-card-read {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 700;
          color: #dc2626; text-transform: uppercase; letter-spacing: 0.08em;
          margin-top: auto;
        }
        .post-card-arrow {
          display: flex; align-items: center; justify-content: center;
          width: 20px; height: 20px; border-radius: 50%;
          background: #fef2f2; transition: all 0.2s;
        }
        .post-card:hover .post-card-arrow { background: #dc2626; color: #fff; }

        /* ── Skeleton ── */
        .skeleton-line {
          background: linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite;
          border-radius: 5px; margin-bottom: 7px;
        }

        /* ── Sidebar ── */
        .sidebar-card {
          background: #fff; border: 1px solid #eeeeec;
          border-radius: 14px; padding: 1.3rem;
        }
        .sidebar-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1rem; font-weight: 700; color: #0f0f0f; margin-bottom: 0.85rem;
        }
        .tag-pill {
          display: inline-flex; align-items: center;
          font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 600;
          padding: 5px 13px; border-radius: 999px; cursor: pointer;
          transition: all 0.2s; border: 1.5px solid #e5e7eb;
          color: #555; background: #fff; letter-spacing: 0.02em;
        }
        .tag-pill:hover { border-color: #dc2626; color: #dc2626; background: #fef2f2; }
        .tag-pill.active { background: #111; color: #fff; border-color: #111; }

        /* ── Pagination ── */
        .page-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 5px;
          min-width: 36px; height: 36px; border-radius: 9px;
          font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 600;
          border: 1.5px solid #e5e7eb; background: #fff; color: #555;
          cursor: pointer; transition: all 0.2s; padding: 0 10px;
        }
        .page-btn:hover:not(:disabled) { border-color: #111; color: #111; }
        .page-btn.active { background: #111; color: #fff; border-color: #111; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        /* ── CTA band — red & white only ── */
        .cta-band {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 60%, #991b1b 100%);
          padding: 4.5rem 0; margin-top: 4rem;
          position: relative; overflow: hidden;
        }
        .cta-band::before {
          content: ''; position: absolute; top: -60px; right: -60px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-band::after {
          content: ''; position: absolute; bottom: -50px; left: 80px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-band-inner { position: relative; z-index: 1; }
        .cta-label {
          font-family: 'Inter', sans-serif; font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 0.5rem;
        }
        .cta-hl {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.7rem, 3.8vw, 2.6rem);
          font-weight: 900; color: #fff; line-height: 1.12;
        }
        .cta-hl em { font-style: italic; color: rgba(255,255,255,0.85); }
        .cta-sub-text {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem; line-height: 1.72;
          color: rgba(255,255,255,0.65); max-width: 28rem;
        }
        .btn-cta-white {
          background: #fff; color: #dc2626;
          border: none; border-radius: 11px;
          padding: 0.75rem 1.6rem;
          font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 700;
          cursor: pointer; letter-spacing: 0.02em; transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
        }
        .btn-cta-white:hover {
          background: #fff1f1; transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.16);
        }
        .btn-cta-outline-white {
          background: transparent; color: rgba(255,255,255,0.85);
          border: 1.5px solid rgba(255,255,255,0.4); border-radius: 11px;
          padding: 0.75rem 1.6rem;
          font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-cta-outline-white:hover {
          border-color: #fff; color: #fff;
          background: rgba(255,255,255,0.08);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .blog-sidebar { display: none; }
        }
        @media (max-width: 640px) {
          .cta-band { padding: 3rem 0; }
          .featured-image-wrap { aspect-ratio: 4/3; }
        }
        @media (max-width: 400px) {
          .page-btn span { display: none; }
        }
      `}</style>

      <main style={{ background: "#F7F7F5", minHeight: "100vh" }}>

        {/* ── Page Header ── */}
        <section style={{ paddingTop: "3rem", paddingBottom: "2.25rem", borderBottom: "1px solid #ebebea" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

              <motion.div {...fadeUp(0)} style={{ maxWidth: "34rem" }}>
                <p className="bl-eyebrow mb-3">Insights & Advice</p>
                <h1 className="bl-headline mb-3">
                  From the<br /><em>driving seat</em>
                </h1>
                <p className="bl-sub">
                  Practical tips, instructor insight, and student stories from the team at 360 Drive Academy.
                </p>
              </motion.div>

              <motion.div {...fadeUp(0.1)} style={{ width: "100%", maxWidth: 420 }}>
                <form onSubmit={doSearch} className="search-wrap">
                  <span className="search-icon"><FaSearch /></span>
                  <input
                    className="search-input"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Search articles…"
                  />
                  <button type="submit" className="search-btn">Search</button>
                </form>
              </motion.div>
            </div>

            {/* Active filters */}
            <AnimatePresence>
              {hasFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: "1rem" }}
                >
                  {query && (
                    <span className="fchip">
                      "{query}"
                      <button className="fchip-x" onClick={() => {
                        setInputVal(""); setQuery("");
                        setSearchParams((p) => { p.delete("q"); return p; });
                      }}><FaTimes /></button>
                    </span>
                  )}
                  {tagFilter && (
                    <span className="fchip">
                      {tagFilter}
                      <button className="fchip-x" onClick={() => {
                        setTagFilter("");
                        setSearchParams((p) => { p.delete("tag"); return p; });
                      }}><FaTimes /></button>
                    </span>
                  )}
                  <button
                    onClick={clearAll}
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.73rem", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Clear all
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Content ── */}
        <section style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* ── Main column ── */}
              <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

                {/* Featured */}
                {!loading && !hasFilters && featured && (
                  <motion.div {...fadeUp(0.05)}>
                    <FeaturedCard post={featured} />
                  </motion.div>
                )}

                {/* Section label */}
                {!loading && posts.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 700,
                      color: "#9ca3af", letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>
                      {hasFilters ? `${posts.length} result${posts.length !== 1 ? "s" : ""}` : "Latest articles"}
                    </span>
                    <span style={{ flex: 1, height: 1, background: "#ebebea" }} />
                  </div>
                )}

                {/* Cards grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                  gap: "1.25rem",
                }}>
                  <AnimatePresence mode="wait">
                    {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

                    {!loading && posts.length === 0 && (
                      <motion.div
                        key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 1rem" }}
                      >
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#d1d5db", fontWeight: 700, marginBottom: "0.4rem" }}>
                          No articles found
                        </p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#9ca3af" }}>
                          Try adjusting your search or clearing filters
                        </p>
                        <button onClick={clearAll} style={{
                          marginTop: "1rem", fontFamily: "'Inter', sans-serif",
                          fontSize: "0.78rem", fontWeight: 700, color: "#dc2626",
                          background: "none", border: "none", cursor: "pointer",
                        }}>
                          Clear filters
                        </button>
                      </motion.div>
                    )}

                    {!loading && (hasFilters ? posts : rest).map((p) => (
                      <PostCard key={p._id} post={p} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", paddingTop: "0.25rem" }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#9ca3af" }}>
                      Page {page} of {pages}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                      <button onClick={() => changePage(page - 1)} disabled={page === 1} className="page-btn">
                        <FaChevronLeft style={{ fontSize: "0.6rem" }} />
                        <span>Prev</span>
                      </button>
                      {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                        const p = Math.max(1, Math.min(pages - 4, page - 2)) + i;
                        return (
                          <button key={p} onClick={() => changePage(p)} className={`page-btn ${p === page ? "active" : ""}`}>
                            {p}
                          </button>
                        );
                      })}
                      <button onClick={() => changePage(page + 1)} disabled={page === pages} className="page-btn">
                        <span>Next</span>
                        <FaChevronRight style={{ fontSize: "0.6rem" }} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Sidebar ── */}
              <aside className="blog-sidebar" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                <motion.div {...fadeUp(0.06)}>
                  <div className="sidebar-card" style={{ background: "linear-gradient(145deg,#111 0%,#1f1010 100%)", border: "none" }}>
                    <div style={{ width: 26, height: 3, background: "#dc2626", borderRadius: 3, marginBottom: "0.85rem" }} />
                    <h4 className="sidebar-title" style={{ color: "#fff" }}>About our blog</h4>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                      Practical driving tips, student success stories and expert advice to help you pass with confidence.
                    </p>
                  </div>
                </motion.div>

                <motion.div {...fadeUp(0.08)}>
                  <div className="sidebar-card">
                    <h4 className="sidebar-title">Browse by topic</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {ALL_TAGS.map((t) => (
                        <button key={t} onClick={() => applyTag(t)} className={`tag-pill ${t === tagFilter ? "active" : ""}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div {...fadeUp(0.1)}>
                  <div className="sidebar-card">
                    <h4 className="sidebar-title">Quick links</h4>
                    <div>
                      {[
                        { label: "Explore Courses", to: "/courses" },
                        { label: "Book a Lesson",   to: "/" },
                        { label: "Contact Us",      to: "/contact-us" },
                      ].map((l, i, arr) => (
                        <Link
                          key={l.to} to={l.to}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "0.6rem 0",
                            borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
                            fontFamily: "'Inter', sans-serif", fontSize: "0.84rem",
                            color: "#374151", fontWeight: 600,
                            textDecoration: "none", transition: "color 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
                        >
                          {l.label}
                          <FaArrowRight style={{ fontSize: "0.58rem", color: "#dc2626", flexShrink: 0 }} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>

              </aside>
            </div>
          </div>
        </section>

        {/* ── CTA Band — red & white only ── */}
        <div className="cta-band">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 cta-band-inner">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
              className="sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <p className="cta-label">Personalised lessons</p>
                <h3 className="cta-hl" style={{ marginBottom: "0.75rem" }}>
                  Ready to pass<br /><em>first time?</em>
                </h3>
                <p className="cta-sub-text">
                  Our instructors tailor every lesson to your pace. Start your journey with 360 Drive Academy today.
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", flexShrink: 0 }}>
                <Link to="/courses">
                  <button className="btn-cta-white">Explore Courses</button>
                </Link>
                <Link to="/contact-us">
                  <button className="btn-cta-outline-white">Contact Us →</button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}