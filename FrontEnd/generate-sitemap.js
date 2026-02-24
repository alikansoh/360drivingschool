/**
 * generate-sitemap.js  (build-time script — Node / ESM)
 * -------------------------------------------------------
 * Fetches published blog posts from your live API and writes
 * public/sitemap.xml before the frontend build runs.
 *
 * Add to package.json:
 *   "sitemap": "node generate-sitemap.js",
 *   "build":   "npm run sitemap && vite build"
 *
 * Run manually any time:
 *   node generate-sitemap.js
 */

import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ── Config ─────────────────────────────────────────────────── */
const BASE_URL = "https://360driveacademy.co.uk";
const API_BASE = "https://three60drivingschool.onrender.com";
const OUT_FILE = path.join(__dirname, "public", "sitemap.xml");

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

/* ── Helpers ─────────────────────────────────────────────────── */
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

/* ── Fetch published blog posts from your API ────────────────── */
async function fetchPublishedPosts() {
  try {
    // Your API returns posts — adjust endpoint if needed
    const res = await fetch(`${API_BASE}/blogs?published=true`);

    if (!res.ok) {
      console.warn(`⚠️  API responded ${res.status} — skipping blog posts.`);
      return [];
    }

    const data = await res.json();

    // Handle { blogs: [...] }, { posts: [...] }, { data: [...] }, or plain array
    const posts = Array.isArray(data)
      ? data
      : (data.blogs ?? data.posts ?? data.data ?? []);

    // Filter client-side too — only published: true (matches schema default: false)
    const published = posts.filter((p) => p.published === true);

    console.log(`✅  ${published.length} published post(s) fetched.`);
    return published;

  } catch (err) {
    console.warn("⚠️  Could not reach API:", err.message);
    return [];
  }
}

/* ── Main ────────────────────────────────────────────────────── */
async function run() {
  console.log("🗺️  Generating sitemap.xml …");

  const today = new Date().toISOString().split("T")[0];

  const staticBlocks = STATIC_ROUTES.map(({ path, changefreq, priority }) =>
    urlBlock({
      loc:       `${BASE_URL}${path}`,
      lastmod:   today,
      changefreq,
      priority,
      hreflang:  path.startsWith("/areas/"),
    })
  );

  const posts = await fetchPublishedPosts();

  const blogBlocks = posts.map((post) => {
    // Schema: slug (required), publishedAt (Date|null), updatedAt (auto timestamp)
    const rawDate = post.updatedAt || post.publishedAt || today;
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

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, xml, "utf8");

  console.log(`\n✅  Written to: ${OUT_FILE}`);
  console.log(`    Static : ${staticBlocks.length} URLs`);
  console.log(`    Blog   : ${blogBlocks.length} URLs`);
  console.log(`    Total  : ${staticBlocks.length + blogBlocks.length} URLs\n`);
}

run().catch((err) => {
  console.error("❌  Failed:", err);
  process.exit(1);
});