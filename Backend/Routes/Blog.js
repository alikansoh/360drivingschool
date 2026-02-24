import express from "express";
import { upload } from "../multer.js"; // uses your existing multer config
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getBlog,
  updateBlog,
} from "../Controller/BlogController.js";

const router = express.Router();

router.get("/", getBlogs); // list with ?page=&limit=&search=&tag=&published=true
router.get("/:id", getBlog); // get by ObjectId or slug
router.post("/", upload.single("image"), createBlog);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);

export default router;