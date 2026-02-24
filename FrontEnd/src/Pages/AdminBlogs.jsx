import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "https://three60drivingschool.onrender.com/blog";
const IMAGE_BASE = "https://three60drivingschool.onrender.com/";
const PAGE_LIMIT = 9;

const SUGGESTED_TAGS = [
  "Driving Lessons",
  "Learner Driver",
  "Pass Plus",
  "DVSA",
  "Manual",
  "Automatic",
  "Mock Test",
  "Intensive Course",
  "Motorway Lessons",
  "Refresher",
  "Theory Test",
  "Instructor",
];

const slugify = (str = "") =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isValidSlug = (s) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

const blank = {
  title: "",
  content: "",
  author: "",
  tags: [],
  published: true,
  image: null,
  imagePreview: null,
  slug: "",
};

function useDebounced(value, delay = 450) {
  const [state, setState] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setState(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return state;
}

/* ── Modal ── */
function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white w-full max-w-4xl rounded-lg shadow-2xl flex flex-col"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* Sticky header — outside scroll container so it never scrolls away */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-gradient-to-r from-indigo-50 to-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center text-white text-sm font-bold">
              ✍️
            </div>
            <h3 className="text-base font-bold text-gray-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>
        {/* Scrollable body — min-h-0 is critical for flex children to shrink */}
        <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
      </div>
    </div>
  );
}

/* ── Confirm Dialog ── */
function ConfirmDialog({ open, title, message, onCancel, onConfirm, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="text-2xl">🗑️</div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-1">{title}</h4>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Tag Input ── */
function TagInput({ tags, setTags }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const addTag = (t) => {
    const tag = String(t || value).trim();
    if (!tag || tags.includes(tag)) {
      setValue("");
      return;
    }
    setTags([...tags, tag]);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !value && tags.length)
      setTags(tags.slice(0, -1));
  };

  return (
    <div className="space-y-2">
      <div
        className="min-h-[40px] flex items-center flex-wrap gap-1 p-2 border rounded-md cursor-text focus-within:ring-2 focus-within:ring-indigo-300 focus-within:border-indigo-400 transition-all text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium"
          >
            {t}
            <button
              onClick={() => setTags(tags.filter((x) => x !== t))}
              className="text-indigo-400 hover:text-indigo-700 ml-0.5 leading-none"
              aria-label={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (value.trim()) addTag();
          }}
          placeholder={tags.length === 0 ? "Type a tag and press Enter…" : ""}
          className="flex-1 min-w-[80px] py-1 px-1 outline-none text-sm bg-transparent"
        />
      </div>
      <div className="flex flex-wrap gap-1 text-xs">
        {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((t) => (
          <button
            key={t}
            onClick={() => addTag(t)}
            className="px-2 py-0.5 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            + {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Editor ── */
function Editor({ value, onChange }) {
  const [tab, setTab] = useState("write");
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  return (
    <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-300">
      <div className="flex items-center justify-between bg-gray-50 border-b px-2 py-1">
        <div className="flex gap-1">
          {["write", "preview"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2 py-1 rounded-md text-sm font-medium capitalize transition-all ${
                tab === t
                  ? "bg-white shadow text-indigo-600 border"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "write" ? "✏️ Write" : "👁 Preview"}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 px-2">
          {wordCount} words · {value.length} chars
        </span>
      </div>
      {tab === "write" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="w-full p-3 outline-none resize-none font-sans text-sm leading-relaxed min-h-[120px] sm:min-h-[160px]"
          placeholder={
            "Start writing your post…\n\n# Heading 1\n## Heading 2\n\n**Bold text** and regular paragraphs."
          }
        />
      ) : (
        <div className="prose max-w-none p-3 bg-white min-h-[120px] sm:min-h-[160px] overflow-auto text-sm">
          <SimplePreview text={value} />
        </div>
      )}
    </div>
  );
}

function SimplePreview({ text = "" }) {
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((l, i) => {
        const trimmed = l.trim();
        if (!trimmed) return <div key={i} className="my-1" />;
        if (trimmed.startsWith("### "))
          return (
            <h3 key={i} className="text-base font-semibold mt-2">
              {trimmed.slice(4)}
            </h3>
          );
        if (trimmed.startsWith("## "))
          return (
            <h2 key={i} className="text-lg font-bold mt-3">
              {trimmed.slice(3)}
            </h2>
          );
        if (trimmed.startsWith("# "))
          return (
            <h1 key={i} className="text-2xl font-extrabold mt-3">
              {trimmed.slice(2)}
            </h1>
          );
        const parts = trimmed
          .split(/(\*\*[^*]+\*\*)/g)
          .map((seg, idx) =>
            seg.startsWith("**") && seg.endsWith("**") ? (
              <strong key={idx}>{seg.slice(2, -2)}</strong>
            ) : (
              seg
            )
          );
        return (
          <p key={i} className="text-sm text-gray-700 my-1 leading-relaxed">
            {parts}
          </p>
        );
      })}
    </div>
  );
}

/* ── Image Upload Zone ── */
function ImageUploadZone({ preview, onFile, onRemove }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onFile(file);
    else toast.error("Please drop an image file");
  };

  return (
    <div>
      {preview ? (
        <div className="relative rounded-md overflow-hidden border">
          <img
            src={preview}
            alt="Feature"
            className="w-full h-28 sm:h-32 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-2">
            <div className="flex gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="px-2 py-1 rounded-md bg-white/90 text-xs font-medium hover:bg-white transition-colors"
              >
                Replace
              </button>
              <button
                onClick={onRemove}
                className="px-2 py-1 rounded-md bg-red-500/80 text-white text-xs font-medium hover:bg-red-500 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-3 text-center cursor-pointer transition-all ${
            dragging
              ? "border-indigo-400 bg-indigo-50 scale-[1.01]"
              : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="text-2xl mb-1">🖼️</div>
          <p className="text-sm font-medium text-gray-600">
            Click or drag an image here
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Max 5 MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </div>
  );
}

/* ── Small UI helpers ── */
function StepDots({ steps }) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((done, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all ${
            done ? "bg-indigo-500" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {msg}</p>
  );
}

function PublishToggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
        value ? "bg-indigo-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/* ════════════════════════════════════════════
   ADD FORM
   ════════════════════════════════════════════ */
function AddPostForm({ onClose, onCreated }) {
  const [post, setPost] = useState({ ...blank });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [slugSection, setSlugSection] = useState(false);
  const slugManual = useRef(false);

  useEffect(() => {
    if (!slugManual.current)
      setPost((s) => ({ ...s, slug: slugify(s.title) }));
  }, [post.title]);

  const set = (key, val) => setPost((s) => ({ ...s, [key]: val }));
  const clearError = (key) =>
    setErrors((e) => {
      const n = { ...e };
      delete n[key];
      return n;
    });

  const handleImage = (file) => {
    const reader = new FileReader();
    reader.onload = () =>
      setPost((s) => ({ ...s, image: file, imagePreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!post.title.trim()) errs.title = "Title is required";
    else if (post.title.length > 100)
      errs.title = "Title must be under 100 characters";
    if (!post.content.trim()) errs.content = "Content is required";
    else if (post.content.trim().length < 50)
      errs.content = "Content must be at least 50 characters";
    if (post.slug && !isValidSlug(post.slug))
      errs.slug =
        "Invalid slug (lowercase letters, numbers and hyphens only)";
    return errs;
  };

  const handleCreate = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.append("title", post.title.trim());
    fd.append("content", post.content.trim());
    fd.append("author", post.author.trim());
    fd.append("tags", (post.tags || []).join(","));
    fd.append("published", post.published ? "true" : "false");
    fd.append("slug", post.slug || slugify(post.title));
    if (post.image instanceof File) fd.append("image", post.image);

    try {
      await axios.post(API_BASE_URL, fd);
      toast.success(post.published ? "🎉 Post published!" : "📝 Draft saved!");
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create post");
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    post.title.trim().length > 0,
    post.content.trim().length > 0,
    !!post.imagePreview,
    (post.tags || []).length > 0,
  ];
  const completedCount = steps.filter(Boolean).length;
  const titleLen = post.title.length;

  return (
    <div className="flex flex-col">
      {/* ── Scrollable content ── */}
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Post readiness */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-md p-3 border border-indigo-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                  Post readiness
                </span>
                <span className="text-xs font-bold text-indigo-600">
                  {completedCount}/4
                </span>
              </div>
              <div className="w-full bg-indigo-100 rounded-full h-1.5 mb-2">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                />
              </div>
              <div className="space-y-1 text-xs">
                {[
                  ["Title", steps[0]],
                  ["Content", steps[1]],
                  ["Feature image", steps[2]],
                  ["At least one tag", steps[3]],
                ].map(([label, done]) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 ${
                      done ? "text-indigo-700" : "text-gray-400"
                    }`}
                  >
                    <span className="w-3 text-xs">{done ? "✓" : "○"}</span>{" "}
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Image */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Feature Image
              </label>
              <ImageUploadZone
                preview={post.imagePreview}
                onFile={handleImage}
                onRemove={() =>
                  setPost((s) => ({ ...s, image: null, imagePreview: null }))
                }
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Author
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-sm">
                  👤
                </span>
                <input
                  value={post.author}
                  onChange={(e) => set("author", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-300 outline-none"
                  placeholder="Author name (optional)"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                Tags
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    post.tags.length
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-400"
                  }`}
                >
                  {post.tags.length} added
                </span>
              </label>
              <TagInput
                tags={post.tags}
                setTags={(t) => set("tags", t)}
              />
            </div>

            {/* SEO Slug */}
            <div className="border rounded-md overflow-hidden">
              <button
                onClick={() => setSlugSection((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
              >
                <span>🔗 SEO Slug</span>
                <span className="text-gray-400 text-xs">
                  {slugSection ? "▲ hide" : "▼ edit"}
                </span>
              </button>
              {slugSection && (
                <div className="p-3 space-y-2 border-t">
                  <div className="flex gap-2">
                    <input
                      value={post.slug}
                      onChange={(e) => {
                        slugManual.current = true;
                        set("slug", e.target.value);
                        clearError("slug");
                      }}
                      className={`flex-1 p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-300 ${
                        errors.slug ? "border-red-400" : "border-gray-200"
                      }`}
                      placeholder="post-url-slug"
                    />
                    <button
                      onClick={() => {
                        const g = slugify(post.title || "");
                        slugManual.current = true;
                        set("slug", g);
                        clearError("slug");
                        toast.info("Slug regenerated");
                      }}
                      className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-xs font-medium"
                      title="Regenerate from title"
                    >
                      ↻
                    </button>
                  </div>
                  <FieldError msg={errors.slug} />
                  {post.slug && isValidSlug(post.slug) && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-xs text-green-600 truncate font-mono">
                        /blog/{post.slug}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(
                            `${window.location.origin}/blog/${post.slug}`
                          );
                          toast.success("Copied!");
                        }}
                        className="ml-auto text-xs text-indigo-500 hover:text-indigo-700"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Publish toggle */}
            <div className="flex items-center justify-between p-3 rounded-md border bg-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {post.published
                    ? "🟢 Publish immediately"
                    : "🔵 Save as draft"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {post.published
                    ? "Visible to readers right away"
                    : "Not visible until published"}
                </p>
              </div>
              <PublishToggle
                value={post.published}
                onChange={(v) => set("published", v)}
              />
            </div>
          </div>

          {/* Right — title + content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Post Title <span className="text-red-400">*</span>
                </label>
                <span
                  className={`text-xs ${
                    titleLen > 100
                      ? "text-red-500 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {titleLen}/100
                </span>
              </div>
              <input
                value={post.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  clearError("title");
                }}
                className={`w-full px-3 py-2 border rounded-md text-lg font-bold placeholder:font-normal placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-300 ${
                  errors.title ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
                placeholder="Give your post a compelling title…"
                maxLength={120}
              />
              <FieldError msg={errors.title} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">
                Content <span className="text-red-400">*</span>
                <span className="ml-2 text-xs text-gray-400">
                  — basic Markdown supported
                </span>
              </label>
              <Editor
                value={post.content}
                onChange={(val) => {
                  set("content", val);
                  clearError("content");
                }}
              />
              <FieldError msg={errors.content} />
              {post.content.trim().length > 0 &&
                post.content.trim().length < 50 &&
                !errors.content && (
                  <p className="text-xs text-amber-500">
                    ⚡ {50 - post.content.trim().length} more characters to
                    meet the minimum
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky footer ── */}
      <div className="border-t bg-white px-3 sm:px-4 py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <StepDots steps={steps} />
          <span className="text-xs text-gray-400 hidden sm:inline">
            {completedCount === 4
              ? "Ready to publish! 🚀"
              : `${4 - completedCount} step${
                  4 - completedCount > 1 ? "s" : ""
                } remaining`}
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
          <button
            onClick={onClose}
            disabled={saving}
            className="w-full sm:w-auto px-3 py-1.5 rounded-md border text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Discard
          </button>

          {post.published && (
            <button
              onClick={() => {
                set("published", false);
                setTimeout(handleCreate, 0);
              }}
              disabled={saving}
              className="w-full sm:w-auto px-3 py-1.5 rounded-md border text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Save draft
            </button>
          )}

          <button
            onClick={handleCreate}
            disabled={saving}
            className={`w-full sm:w-auto px-4 py-1.5 rounded-md text-white text-sm font-semibold flex items-center gap-2 ${
              saving
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {saving ? (
              <>
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : post.published ? (
              "🚀 Publish Post"
            ) : (
              "💾 Save Draft"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════ */
export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const q = useDebounced(search, 450);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editPost, setEditPost] = useState({ ...blank });
  const [savingEdit, setSavingEdit] = useState(false);
  const editSlugManualRef = useRef(false);

  const fetchList = useCallback(
    async (pg = page, term = q) => {
      setLoading(true);
      try {
        const res = await axios.get(API_BASE_URL, {
          params: { page: pg, limit: PAGE_LIMIT, search: term || undefined },
        });
        setBlogs(res.data.blogs || res.data || []);
        setPages(res.data.pages || 1);
      } catch {
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    },
    [page, q]
  );

  useEffect(() => setPage(1), [q]);
  useEffect(() => {
    fetchList(page, q);
  }, [page, q, fetchList]);

  useEffect(() => {
    if (!editSlugManualRef.current)
      setEditPost((s) => ({ ...s, slug: slugify(s.title) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPost.title]);

  const handleEditImage = (file) => {
    const reader = new FileReader();
    reader.onload = () =>
      setEditPost((s) => ({ ...s, image: file, imagePreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const openEdit = (post) => {
    setSelected(post);
    editSlugManualRef.current = false;
    setEditPost({
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      author: post.author || "",
      tags: post.tags || [],
      published: !!post.published,
      image: null,
      imagePreview: post.image ? `${IMAGE_BASE}${post.image}` : null,
      slug: post.slug || slugify(post.title || ""),
    });
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!selected || !editPost.title.trim() || !editPost.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSavingEdit(true);
    const fd = new FormData();
    fd.append("title", editPost.title);
    fd.append("content", editPost.content);
    fd.append("author", editPost.author);
    fd.append("tags", (editPost.tags || []).join(","));
    fd.append("published", editPost.published ? "true" : "false");
    fd.append("slug", editPost.slug || slugify(editPost.title));
    if (editPost.image instanceof File) fd.append("image", editPost.image);
    try {
      const res = await axios.put(`${API_BASE_URL}/${selected._id}`, fd);
      toast.success("Post updated");
      setBlogs((prev) =>
        prev.map((b) => (b._id === selected._id ? res.data : b))
      );
      setShowEdit(false);
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update");
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = (post) => {
    setSelected(post);
    setConfirmDeleteOpen(true);
  };

  const doDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/${selected._id}`);
      toast.success("Post deleted");
      setConfirmDeleteOpen(false);
      fetchList(page, q);
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
      setSelected(null);
    }
  };

  const togglePublished = async (post) => {
    try {
      const fd = new FormData();
      fd.append("published", post.published ? "false" : "true");
      const res = await axios.put(`${API_BASE_URL}/${post._id}`, fd);
      setBlogs((prev) =>
        prev.map((b) => (b._id === post._id ? res.data : b))
      );
      toast.success(res.data.published ? "Published" : "Unpublished");
    } catch {
      toast.error("Failed to change publish state");
    }
  };

  return (
    <div className="container mx-auto p-3 sm:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800">
            Blog Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit and publish posts with full SEO control.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="relative flex-1 md:flex-none md:w-64">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="w-full pl-9 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 outline-none transition-all text-sm"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔎</span>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md shadow-md font-medium transition-all text-sm"
          >
            <span className="text-lg leading-none">+</span>
            <span className="hidden sm:inline">New Post</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-3 bg-white rounded-md shadow animate-pulse h-56"
            />
          ))}

        {!loading && blogs.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-16 flex flex-col items-center gap-3">
            <span className="text-4xl">📭</span>
            <p className="font-medium">No posts found</p>
          </div>
        )}

        {!loading &&
          blogs.map((b) => (
            <article
              key={b._id}
              className="bg-white rounded-md shadow hover:shadow-lg transition-all flex flex-col overflow-hidden group"
            >
              <div className="h-32 sm:h-36 overflow-hidden bg-gray-100">
                <img
                  src={
                    b.image
                      ? `${IMAGE_BASE}${b.image}`
                      : "https://via.placeholder.com/800x400?text=No+Image"
                  }
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1.5 line-clamp-3 flex-1">
                  {b.excerpt || b.content}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t">
                  <div className="text-xs text-gray-400">
                    <div className="font-medium text-gray-600">
                      {b.author || "Admin"}
                    </div>
                    <div>{new Date(b.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => togglePublished(b)}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                        b.published
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {b.published ? "● Live" : "○ Draft"}
                    </button>
                    <button
                      onClick={() => openEdit(b)}
                      className="px-2 py-1 rounded-md bg-amber-50 text-amber-600 text-xs font-medium hover:bg-amber-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(b)}
                      className="px-2 py-1 rounded-md bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="text-sm text-gray-500">
          Page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{pages}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-md border bg-white text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-3 py-1.5 rounded-md border bg-white text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Create New Post"
      >
        <AddPostForm
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            setPage(1);
            fetchList(1, q);
          }}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
          setSelected(null);
        }}
        title="Edit post"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-3 sm:p-4">
          {/* Left sidebar */}
          <div className="space-y-3">
            <div className="border rounded-md p-2">
              <label className="text-sm font-medium">Feature Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleEditImage(e.target.files?.[0])}
                className="mt-2 text-sm"
              />
              {editPost.imagePreview && (
                <div className="mt-2 relative">
                  <img
                    src={editPost.imagePreview}
                    alt="preview"
                    className="w-full h-28 object-cover rounded-md"
                  />
                  <button
                    onClick={() =>
                      setEditPost((s) => ({
                        ...s,
                        image: null,
                        imagePreview: null,
                      }))
                    }
                    className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Author</label>
              <input
                value={editPost.author}
                onChange={(e) =>
                  setEditPost((s) => ({ ...s, author: e.target.value }))
                }
                className="w-full mt-1 p-2 border rounded-md text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tags</label>
              <TagInput
                tags={editPost.tags}
                setTags={(t) => setEditPost((s) => ({ ...s, tags: t }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Slug</label>
              <div className="flex gap-2 mt-1">
                <input
                  value={editPost.slug}
                  onChange={(e) => {
                    editSlugManualRef.current = true;
                    setEditPost((s) => ({ ...s, slug: e.target.value }));
                  }}
                  className="flex-1 p-2 border rounded-md text-sm"
                />
                <button
                  onClick={() => {
                    const g = slugify(editPost.title);
                    editSlugManualRef.current = true;
                    setEditPost((s) => ({ ...s, slug: g }));
                  }}
                  className="px-2 py-1 rounded-md bg-gray-100 text-sm"
                >
                  ↻
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 mt-2 text-sm">
              <input
                type="checkbox"
                checked={editPost.published}
                onChange={(e) =>
                  setEditPost((s) => ({ ...s, published: e.target.checked }))
                }
              />
              Published
            </label>
          </div>

          {/* Right — title + content */}
          <div className="lg:col-span-2 space-y-3">
            <input
              value={editPost.title}
              onChange={(e) =>
                setEditPost((s) => ({ ...s, title: e.target.value }))
              }
              placeholder="Post title"
              className="w-full p-2 border rounded-md text-lg font-bold outline-none"
            />
            <Editor
              value={editPost.content}
              onChange={(val) =>
                setEditPost((s) => ({ ...s, content: val }))
              }
            />
            <div className="flex justify-end gap-2 mt-2 pt-2 border-t">
              <button
                onClick={() => {
                  setShowEdit(false);
                  setSelected(null);
                }}
                className="px-3 py-1.5 rounded-md border text-sm"
                disabled={savingEdit}
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium disabled:opacity-50"
                disabled={savingEdit}
              >
                {savingEdit ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete post?"
        message="This will permanently delete the post and cannot be undone."
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={doDelete}
        loading={deleting}
      />
    </div>
  );
}