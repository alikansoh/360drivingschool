/**
 * routes/sitemap.js  (backend — Express / ESM)
 * -----------------------------------------------
 * Serves a live /sitemap.xml by querying MongoDB directly.
 * Blog posts are included automatically the moment published = true.
 *
 * Mount in your main server file:
 *   import sitemapRouter from "./routes/sitemap.js";
 *   app.use("/", sitemapRouter);
 *
 * robots.txt should point to:
 *   Sitemap: https://360driveacademy.co.uk/sitemap.xml
 */

import express from "express";
import Blog from "../Model/Blog.js"; // ← adjust path if needed

const router = express.Router();

const BASE_URL = "https://360driveacademy.co.uk";

const STATIC_ROUTES = [
  { path: "/",                    changefreq: "weekly",  priority: "1.0" },
  { path: "/courses",             changefreq: "weekly",  priority: "0.9" },
  { path: "/about-us",            changefreq: "monthly", priority: "0.8" },
  { path: "/contact-us",          changefreq: "monthly", priority: "0.8" },
  { path: "/faqs",                changefreq: "monthly", priority: "0.7" },
  { path: "/blog",                changefreq: "weekly",  priority: "0.7" },
  { path: "/useful-Links",        changefreq: "monthly", priority: "0.5" },
  { path: "/privacy-and-Policy",  changefreq: "yearly",  priority: "0.3" },
  { path: "/areas/pinner",        changefreq: "monthly", priority: "0.9" },
  { path: "/areas/ealing",        changefreq: "monthly", priority: "0.9" },
  { path: "/areas/greenford",     changefreq: "monthly", priority: "0.9" },
  { path: "/areas/wembley",       changefreq: "monthly", priority: "0.9" },
  { path: "/areas/harrow",        changefreq: "monthly", priority: "0.9" },
  { path: "/areas/ruislip",       changefreq: "monthly", priority: "0.9" },
  { path: "/areas/hendon",        changefreq: "monthly", priority: "0.9" },
  { path: "/areas/mill-hill",     changefreq: "monthly", priority: "0.9" },
  { path: "/areas/southall",      changefreq: "monthly", priority: "0.9" },
  { path: "/areas/borehamwood",   changefreq: "monthly", priority: "0.9" },
  { path: "/areas/alperton",      changefreq: "monthly", priority: "0.9" },
  { path: "/areas/stanmore",      changefreq: "monthly", priority: "0.9" },
];

function esc(str = "") {
  return String(str)
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&apos;");
}

function urlBlock({ loc, lastmod, changefreq, priority, hreflang = false }) {
  const hl = hreflang
    ? `\n    <xhtml:link rel="alternate" hreflang="en-GB" href="${esc(loc)}"/>
    <xhtml:link rel="alternate" hreflang="en"    href="${esc(loc)}"/>`
    : "";
  return `
  <url>
    <loc>${esc(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${hl}
  </url>`;
}

router.get("/sitemap.xml", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // ── Query only published posts, only the fields we need ──
    // Schema fields used:
    //   slug        — the URL segment  (required, unique)
    //   published   — Boolean, default false
    //   publishedAt — Date set when post goes live (may be null)
    //   updatedAt   — auto-managed by { timestamps: true }
    const posts = await Blog
      .find({ published: true })
      .select("slug publishedAt updatedAt")
      .sort({ publishedAt: -1 })   // newest first in sitemap
      .lean();

    // ── Static URL blocks ──
    const staticBlocks = STATIC_ROUTES.map(({ path, changefreq, priority }) =>
      urlBlock({
        loc:       `${BASE_URL}${path}`,
        lastmod:   today,
        changefreq,
        priority,
        hreflang:  path.startsWith("/areas/"),
      })
    );

    // ── Blog URL blocks ──
    // lastmod priority: updatedAt > publishedAt > today
    const blogBlocks = posts.map((post) => {
      const rawDate = post.updatedAt || post.publishedAt || new Date();
      const lastmod = new Date(rawDate).toISOString().split("T")[0];
      return urlBlock({
        loc:        `${BASE_URL}/blog/${esc(post.slug)}`,
        lastmod,
        changefreq: "monthly",
        priority:   "0.6",
      });
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticBlocks.join("")}

  <!-- ═══════════════════════════════════════
       BLOG POSTS  (${blogBlocks.length} published)
  ═══════════════════════════════════════ -->${blogBlocks.join("")}

</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    // Cache 1 hour — Googlebot sees new posts within an hour of publishing
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.status(200).send(xml);

  } catch (err) {
    console.error("Sitemap error:", err);
    res.status(500).send("Could not generate sitemap.");
  }
});

export default router;