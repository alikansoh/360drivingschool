import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Admin",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    image: {
      type: String, // URL or filepath as you store for Course.image
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    metaTitle: String,
    metaDescription: String,
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Simple pre-save to ensure slug exists (only if not provided)
blogSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    // basic slugify
    const slug = this.title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    this.slug = slug + (Math.random().toString(36).slice(2, 6)); // avoid duplicates
  }
  next();
});

export default mongoose.model("Blog", blogSchema);