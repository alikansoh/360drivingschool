import Blog from "../Model/Blog.js";

// Helper: parse tags string or array
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => t.trim()).filter(Boolean);
  return String(tags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

// Create blog
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      author,
      tags,
      published,
      metaTitle,
      metaDescription,
      publishedAt,
      slug,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "title_and_content_required" });
    }

    const blog = new Blog({
      title,
      excerpt,
      content,
      author,
      tags: parseTags(tags),
      published: published === "true" || published === true,
      publishedAt: published ? publishedAt || Date.now() : undefined,
      metaTitle,
      metaDescription,
      slug,
    });

    if (req.file) {
      // adjust according to how you store image path (same as Course)
      blog.image = req.file.path || req.file.filename || req.file.location;
    }

    await blog.save();
    return res.status(201).json(blog);
  } catch (err) {
    console.error("createBlog:", err);
    return res.status(500).json({ error: "server_error", details: err.message });
  }
};

// Get list with pagination/search/tag filter
export const getBlogs = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();
    const tag = req.query.tag;
    const publishedOnly = req.query.published === "true";

    const filter = {};
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { excerpt: new RegExp(search, "i") },
        { content: new RegExp(search, "i") },
        { author: new RegExp(search, "i") },
      ];
    }
    if (tag) filter.tags = tag;
    if (publishedOnly) filter.published = true;

    const [total, docs] = await Promise.all([
      Blog.countDocuments(filter),
      Blog.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      blogs: docs,
    });
  } catch (err) {
    console.error("getBlogs:", err);
    return res.status(500).json({ error: "server_error", details: err.message });
  }
};

// Get single blog by id or slug
export const getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    let blog = null;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      blog = await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).lean();
    }
    if (!blog) {
      // try slug
      blog = await Blog.findOneAndUpdate({ slug: id }, { $inc: { views: 1 } }, { new: true }).lean();
    }

    if (!blog) return res.status(404).json({ error: "not_found" });
    return res.json(blog);
  } catch (err) {
    console.error("getBlog:", err);
    return res.status(500).json({ error: "server_error", details: err.message });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      author,
      tags,
      published,
      metaTitle,
      metaDescription,
      publishedAt,
      slug,
    } = req.body;

    const update = {
      ...(title && { title }),
      ...(excerpt && { excerpt }),
      ...(content && { content }),
      ...(author && { author }),
      ...(metaTitle && { metaTitle }),
      ...(metaDescription && { metaDescription }),
      ...(typeof published !== "undefined" && { published: published === "true" || published === true }),
      ...(publishedAt && { publishedAt }),
      ...(slug && { slug }),
    };

    if (typeof tags !== "undefined") update.tags = parseTags(tags);

    if (req.file) {
      update.image = req.file.path || req.file.filename || req.file.location;
    }

    const blog = await Blog.findByIdAndUpdate(id, update, { new: true, runValidators: true });

    if (!blog) return res.status(404).json({ error: "not_found" });
    return res.json(blog);
  } catch (err) {
    console.error("updateBlog:", err);
    return res.status(500).json({ error: "server_error", details: err.message });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ error: "not_found" });
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteBlog:", err);
    return res.status(500).json({ error: "server_error", details: err.message });
  }
};