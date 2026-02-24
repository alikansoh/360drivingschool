import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.GOOGLE_PLACES_KEY; // server-only
const DEFAULT_NAME = process.env.BUSINESS_NAME || "360 Drive Academy";
const BIAS_LAT = process.env.BIAS_LAT; // optional for better matching
const BIAS_LNG = process.env.BIAS_LNG;
const BIAS_RADIUS = process.env.BIAS_RADIUS || 5000; // meters

let cache = null;
let cacheTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const loadFallbackReviews = () => {
  try {
    const file = readFileSync(join(__dirname, "../data/reviews.json"), "utf-8");
    return JSON.parse(file).reviews;
  } catch {
    return null;
  }
};

const fetchJson = async (url) => {
  const res = await fetch(url);
  const json = await res.json();
  return { status: res.status, json };
};

router.get("/api/reviews", async (req, res) => {
  // Serve cache if fresh
  if (cache && Date.now() - cacheTime < CACHE_TTL_MS) {
    return res.json(cache);
  }

  // If no API key, return fallback immediately
  if (!API_KEY) {
    const fallback = loadFallbackReviews();
    if (!fallback) return res.status(404).json({ error: "no_reviews" });
    cache = { reviews: fallback, source: "static" };
    cacheTime = Date.now();
    return res.json(cache);
  }

  const queryName = (req.query.q || DEFAULT_NAME).trim();

  try {
    // 1) Try Find Place from Text (name -> place_id)
    let placeId = null;

    // Construct the findplacefromtext URL
    // request fields minimal to get place_id only
    let findPlaceUrl =
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
      `?input=${encodeURIComponent(queryName)}` +
      `&inputtype=textquery` +
      `&fields=place_id` +
      `&key=${API_KEY}`;

    // If we have bias coordinates, add locationbias
    if (BIAS_LAT && BIAS_LNG) {
      // usepoint:lat,lng is supported as locationbias for findplacefromtext
      findPlaceUrl += `&locationbias=point:${BIAS_LAT},${BIAS_LNG}`;
    }

    const fp = await fetchJson(findPlaceUrl);
    if (fp.json?.status === "OK" && fp.json.candidates?.length) {
      placeId = fp.json.candidates[0].place_id;
    }

    // 2) Fallback: textsearch for the name (wider)
    if (!placeId) {
      let textSearchUrl =
        `https://maps.googleapis.com/maps/api/place/textsearch/json` +
        `?query=${encodeURIComponent(queryName)}` +
        `&key=${API_KEY}`;

      // add location bias via location & radius to improve results if available
      if (BIAS_LAT && BIAS_LNG) {
        textSearchUrl += `&location=${BIAS_LAT},${BIAS_LNG}&radius=${BIAS_RADIUS}`;
      }

      const ts = await fetchJson(textSearchUrl);
      if (ts.json?.status === "OK" && ts.json.results?.length) {
        placeId = ts.json.results[0].place_id;
      }
    }

    // 3) If still not found, optionally try nearbysearch around bias coords (if provided)
    if (!placeId && BIAS_LAT && BIAS_LNG) {
      const nearbyUrl =
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
        `?location=${BIAS_LAT},${BIAS_LNG}` +
        `&radius=${BIAS_RADIUS}` +
        `&keyword=${encodeURIComponent(queryName)}` +
        `&key=${API_KEY}`;

      const nb = await fetchJson(nearbyUrl);
      if (nb.json?.status === "OK" && nb.json.results?.length) {
        placeId = nb.json.results[0].place_id;
      }
    }

    // If we have a placeId, fetch place details (reviews)
    if (placeId) {
      const detailsUrl =
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?place_id=${encodeURIComponent(placeId)}` +
        `&fields=name,reviews,formatted_address` +
        `&key=${API_KEY}`;

      const dt = await fetchJson(detailsUrl);

      // Google might return various statuses (OK, ZERO_RESULTS, OVER_QUERY_LIMIT, etc.)
      if (dt.json?.status === "OK" && dt.json.result?.reviews?.length) {
        const reviews = dt.json.result.reviews.map((r) => ({
          id: String(r.time || r.author_url || Math.random()),
          author: r.author_name,
          rating: r.rating,
          relativeTime: r.relative_time_description || "",
          text: r.text || "",
          source: "Google",
          url: r.author_url,
          profilePhoto: r.profile_photo_url,
        }));

        cache = { reviews, source: "google" };
        cacheTime = Date.now();
        return res.json(cache);
      }

      // If details returned but no reviews or non-OK, treat as failure to fetch reviews
      console.warn("[reviews] Place details no reviews or status:", dt.json?.status);
    } else {
      console.warn("[reviews] PlaceId not found for:", queryName);
    }

    // If we reach here -> Google failed to provide reviews. Serve fallback if exists
    const fallback = loadFallbackReviews();
    if (!fallback) {
      // Return 429 so frontend will hide the component (quota or no data)
      return res.status(429).json({ error: "no_reviews_from_google" });
    }

    cache = { reviews: fallback, source: "static" };
    cacheTime = Date.now();
    return res.json(cache);
  } catch (err) {
    console.error("[reviews] unexpected error:", err.message);
    const fallback = loadFallbackReviews();
    if (!fallback) return res.status(500).json({ error: "fetch_failed" });
    cache = { reviews: fallback, source: "static" };
    cacheTime = Date.now();
    return res.json(cache);
  }
});

export default router;