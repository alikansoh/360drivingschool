import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ── Author ────────────────────────────────────────────────
    author: {
      type: String,
      required: true,
      trim: true,
    },
    authorPhotoUrl: {
      type: String,
      default: null,
    },
    authorGoogleUrl: {
      type: String,
      default: null,
    },

    // ── Review content ────────────────────────────────────────
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Timestamps from Google ────────────────────────────────
    relativeTime: {
      type: String,
      default: null,
    },
    googleTime: {
      type: Number,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },

    // ── Source & attribution ──────────────────────────────────
    source: {
      type: String,
      enum: ["Google", "Trustpilot", "Facebook", "Manual"],
      default: "Google",
    },
    language: {
      type: String,
      default: "en",
    },

    // ── Visibility control ────────────────────────────────────
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ────────────────────────────────────────────────────
reviewSchema.index({ rating: -1 });
reviewSchema.index({ publishedAt: -1 });
reviewSchema.index({ isVisible: 1, rating: -1 });

export default mongoose.model("Review", reviewSchema);


// ─────────────────────────────────────────────────────────────
// Separate lightweight schema — ONE document, tracks cache state
// ─────────────────────────────────────────────────────────────
const reviewCacheSchema = new mongoose.Schema({
  cachedUntil: {
    type: Date,
    required: true, // next scheduled refresh time
  },
  lastFetchedAt: {
    type: Date,
    required: true, // when the last successful fetch ran
  },
});

export const ReviewCache = mongoose.model("ReviewCache", reviewCacheSchema);