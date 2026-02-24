import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaCalendarAlt, FaUser, FaTags, FaArrowLeft, FaLink, FaCheck } from "react-icons/fa";

const API_BASE_URL = "https://three60drivingschool.onrender.com/blog";
const IMAGE_BASE   = "https://three60drivingschool.onrender.com/";

/* ─── Animations ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.62, delay, ease: [0.16, 1, 0.3, 1] },
});
const stagger = { animate: { transition: { staggerChildren: 0.09 } } };

/* ─── Helpers ──────────────────────────────────────��──── */
function renderDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return iso; }
}
function readingTime(text = "") {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ─── Simple Markdown Renderer ────────────────────────── */
function SimpleRenderer({ text }) {
  if (!text) return null;
  return (
    <div className="blog-prose">
      {text.split("\n").map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} className="prose-spacer" />;
        if (t.startsWith("# "))   return <h1 key={i} className="prose-h1">{t.slice(2)}</h1>;
        if (t.startsWith("## "))  return <h2 key={i} className="prose-h2">{t.slice(3)}</h2>;
        if (t.startsWith("### ")) return <h3 key={i} className="prose-h3">{t.slice(4)}</h3>;
        const parts = t.split(/(\*\*[^*]+\*\*)/g).map((seg, idx) =>
          seg.startsWith("**") && seg.endsWith("**")
            ? <strong key={idx} className="prose-strong">{seg.slice(2, -2)}</strong>
            : seg
        );
        return <p key={i} className="prose-p">{parts}</p>;
      })}
    </div>
  );
}

/* ─── Reading Progress ────────────────────────────────── */
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-700 via-red-500 to-red-600 z-50"
    />
  );
}

/* ─── Skeleton ───────────────────────────────────────── */
function Skeleton() {
  return (
    <main className="bg-[#FAFAF8] min-h-screen">
      <div className="max-w-2xl mx-auto px-5 pt-20 pb-16 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        <div className="h-9 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-9 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="w-full bg-gray-200 rounded-2xl animate-pulse" style={{ aspectRatio: "16/9" }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${78 + (i % 4) * 6}%` }} />
        ))}
      </div>
    </main>
  );
}

/* ─── Main Component ─────────────────────────────────── */
export default function PublicBlogPost() {
  const { slug }     = useParams();
  const navigate     = useNavigate();
  const [post, setPost]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied]     = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/${encodeURIComponent(slug)}`);
        setPost(res.data);
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true);
        else console.error("Failed to load post", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return <Skeleton />;

  if (notFound || !post) {
    return (
      <main className="bg-[#FAFAF8] min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-[7rem] font-black text-gray-100 leading-none select-none">404</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1 mb-3">Post not found</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
            We couldn't find the blog post you're looking for.
          </p>
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors duration-300"
          >
            <FaArrowLeft className="text-xs" /> Back to blog
          </button>
        </div>
      </main>
    );
  }

  const canonical = `${window.location.origin}/blog/${post.slug || post._id}`;
  const ld = {
    "@context": "https://schema.org", "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.content?.slice(0, 160) || "",
    image: post.image ? `${IMAGE_BASE}${post.image}` : undefined,
    author: { "@type": "Person", name: post.author || "360 Drive Academy" },
    datePublished: post.publishedAt || post.createdAt,
    mainEntityOfPage: canonical,
  };
  const mins = readingTime(post.content);

  return (
    <>
      <ReadingProgress />
      <Helmet>
        <title>{post.title} — 360 Drive Academy</title>
        <meta name="description" content={post.excerpt || post.content?.slice(0, 160) || ""} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.content?.slice(0, 160) || ""} />
        {post.image && <meta property="og:image" content={`${IMAGE_BASE}${post.image}`} />}
        <script type="application/ld+json">{JSON.stringify(ld)}</script>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <style>{`
        body { background: #FAFAF8; }

        /* ── Header typography ── */
        .post-eyebrow {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 0.67rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase; color: #dc2626;
        }
        .post-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.85rem, 5vw, 3rem);
          font-weight: 900; line-height: 1.08;
          letter-spacing: -0.02em; color: #111;
        }
        .post-title em { font-style: italic; color: #dc2626; }
        .post-excerpt {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: clamp(0.98rem, 2.4vw, 1.12rem);
          line-height: 1.75; color: #555;
        }

        /* ── Meta strip ── */
        .meta-strip {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: 0.4rem 1.1rem;
          font-size: 0.77rem; color: #777;
          font-family: 'Source Serif 4', Georgia, serif;
        }
        .meta-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: #ccc; display: inline-block; flex-shrink: 0;
        }

        /* ── Hero image ── */
        .hero-image-wrap {
          position: relative; border-radius: 18px; overflow: hidden;
          aspect-ratio: 16 / 9;
          width: 100%;
          background: #e5e5e5;
          box-shadow: 0 20px 60px -8px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04);
        }
        .hero-image-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 9s ease;
        }
        .hero-image-wrap:hover img { transform: scale(1.04); }
        .hero-image-gradient {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 2rem 1.25rem 1rem;
          background: linear-gradient(to top, rgba(0,0,0,0.48) 0%, transparent 100%);
          pointer-events: none;
        }
        .hero-image-label {
          color: rgba(255,255,255,0.72);
          font-size: 0.68rem;
          font-family: 'Source Serif 4', serif;
          letter-spacing: 0.04em;
        }
        @media (max-width: 480px) {
          .hero-image-wrap { border-radius: 12px; }
        }

        /* ── Article body ── */
        .blog-prose { font-family: 'Source Serif 4', Georgia, serif; color: #222; }
        .blog-prose .prose-spacer { height: 0.8rem; }
        .blog-prose .prose-h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.55rem, 3.8vw, 1.95rem); font-weight: 900;
          margin: 2.5rem 0 0.9rem; line-height: 1.14; color: #111;
        }
        .blog-prose .prose-h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.15rem, 2.8vw, 1.45rem); font-weight: 700;
          margin: 2rem 0 0.7rem; color: #111;
          border-left: 3px solid #dc2626; padding-left: 0.75rem;
        }
        .blog-prose .prose-h3 {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 1.08rem; font-weight: 600;
          margin: 1.6rem 0 0.45rem; color: #333; letter-spacing: 0.02em;
        }
        .blog-prose .prose-p {
          font-size: clamp(0.96rem, 2.1vw, 1.06rem);
          line-height: 1.9; margin-bottom: 1.35rem; color: #2a2a2a;
        }
        .blog-prose .prose-strong { font-weight: 700; color: #111; }

        /* ── Tags ── */
        .tag-chip {
          display: inline-flex; align-items: center; gap: 0.28rem;
          background: #FEF2F2; color: #B91C1C;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0.26rem 0.68rem; border-radius: 999px;
          border: 1px solid #FECACA;
          font-family: 'Source Serif 4', Georgia, serif; white-space: nowrap;
        }

        /* ── Share button ── */
        .btn-share {
          display: inline-flex; align-items: center; gap: 0.38rem;
          font-size: 0.76rem; font-weight: 600; color: #555;
          border: 1.5px solid #e2e2e2; border-radius: 999px;
          padding: 0.38rem 0.95rem; background: white; cursor: pointer;
          transition: all 0.2s; font-family: 'Source Serif 4', Georgia, serif;
          white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .btn-share:hover { border-color: #dc2626; color: #dc2626; background: #FEF2F2; }
        .btn-share.copied { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }

        /* ── Section rule ── */
        .section-rule {
          width: 40px; height: 3px;
          background: linear-gradient(90deg, #dc2626, #ef4444);
          border-radius: 4px;
        }

        /* ── CTA card — red & white only ── */
        .cta-card {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 60%, #991b1b 100%);
          border-radius: 1.5rem; padding: clamp(1.6rem, 5vw, 2.5rem);
          color: white; position: relative; overflow: hidden;
          box-shadow: 0 20px 56px -6px rgba(185,28,28,0.45);
        }
        .cta-card::before {
          content: ''; position: absolute; top: -50px; right: -50px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-card::after {
          content: ''; position: absolute; bottom: -40px; left: 60px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-eyebrow {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          margin-bottom: 0.6rem;
        }
        .cta-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.3rem, 3.2vw, 1.65rem);
          font-weight: 900; line-height: 1.2; margin-bottom: 0.7rem;
          color: #fff;
        }
        .cta-body {
          color: rgba(255,255,255,0.72); font-size: 0.86rem; line-height: 1.68;
          font-family: 'Source Serif 4', serif; margin-bottom: 1.6rem; max-width: 25rem;
        }
        .btn-cta-primary {
          background: #fff; color: #dc2626; font-weight: 700; font-size: 0.8rem;
          padding: 0.68rem 1.45rem; border-radius: 999px; border: none; cursor: pointer;
          transition: all 0.22s; font-family: 'Source Serif 4', Georgia, serif;
          letter-spacing: 0.03em;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        }
        .btn-cta-primary:hover {
          background: #fff1f1; transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.18);
        }
        .btn-cta-secondary {
          color: rgba(255,255,255,0.85); font-weight: 600; font-size: 0.8rem;
          background: transparent; border: 1.5px solid rgba(255,255,255,0.4);
          padding: 0.68rem 1.45rem; border-radius: 999px; cursor: pointer;
          transition: all 0.22s; font-family: 'Source Serif 4', Georgia, serif;
        }
        .btn-cta-secondary:hover { border-color: #fff; color: #fff; background: rgba(255,255,255,0.08); }
      `}</style>

      <main className="bg-[#FAFAF8] min-h-screen">

        {/* ── Back nav ── */}
        <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-8 sm:pt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 hover:text-red-600 transition-colors duration-200"
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: "0.7rem", fontWeight: 700,
              color: "#aaa", letterSpacing: "0.14em", textTransform: "uppercase",
            }}
          >
            <FaArrowLeft /> All articles
          </Link>
        </div>

        {/* ── Header ── */}
        <header className="max-w-2xl mx-auto px-5 sm:px-8 pt-6 pb-8">
          <motion.div variants={stagger} initial="initial" animate="animate">

            {/* Eyebrow */}
            <motion.div variants={fadeUp(0)} className="flex items-center gap-2.5 mb-5">
              <span className="post-eyebrow">Article</span>
              <span className="meta-dot" />
              <span className="post-eyebrow" style={{ color: "#bbb", fontWeight: 400 }}>{mins} min read</span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={fadeUp(0.06)} className="post-title mb-5">
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            {post.excerpt && (
              <motion.p variants={fadeUp(0.1)} className="post-excerpt mb-6">
                {post.excerpt}
              </motion.p>
            )}

            {/* Meta + actions */}
            <motion.div
              variants={fadeUp(0.13)}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="meta-strip">
                <span className="flex items-center gap-1.5">
                  <FaUser style={{ fontSize: "0.62rem", color: "#ccc" }} />
                  {post.author || "360 Drive Academy"}
                </span>
                <span className="meta-dot" />
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt style={{ fontSize: "0.62rem", color: "#ccc" }} />
                  {renderDate(post.createdAt)}
                </span>
              </div>
              <div className="flex items-center flex-wrap gap-2">
                {(post.tags || []).map((tag) => (
                  <span key={tag} className="tag-chip">
                    <FaTags style={{ fontSize: "0.56rem" }} /> {tag}
                  </span>
                ))}
                <button onClick={handleCopy} className={`btn-share ${copied ? "copied" : ""}`}>
                  {copied
                    ? <FaCheck style={{ fontSize: "0.58rem" }} />
                    : <FaLink  style={{ fontSize: "0.58rem" }} />}
                  {copied ? "Copied!" : "Share"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </header>

        {/* ── Hero image ── */}
        {post.image && (
          <div className="max-w-2xl mx-auto px-5 sm:px-8 mb-12">
            <motion.div {...fadeUp(0.15)} className="hero-image-wrap">
              <img src={`${IMAGE_BASE}${post.image}`} alt={post.title} loading="eager" />
              <div className="hero-image-gradient">
                <span className="hero-image-label">{post.title}</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Article body ── */}
        <motion.section {...fadeUp(0.2)} className="max-w-2xl mx-auto px-5 sm:px-8 pb-20">
          <article>
            <SimpleRenderer text={post.content} />
          </article>

          {/* Divider */}
          <div className="my-12 flex items-center gap-4">
            <div style={{ flex: 1, height: 1, background: "#ececec" }} />
            <div className="section-rule" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, height: 1, background: "#ececec" }} />
          </div>

          {/* ── CTA card ── */}
          <motion.div {...fadeUp(0.06)} className="cta-card">
            <div style={{ position: "relative", zIndex: 1 }}>
              <p className="cta-eyebrow">Start your journey</p>
              <h3 className="cta-title">Ready for personalised driving lessons?</h3>
              <p className="cta-body">
                Our instructors will help you pass first time with lessons tailored to your pace and needs.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/courses">
                  <button className="btn-cta-primary">Explore Courses</button>
                </Link>
                <Link to="/contact-us">
                  <button className="btn-cta-secondary">Contact Us →</button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.section>

      </main>
    </>
  );
}