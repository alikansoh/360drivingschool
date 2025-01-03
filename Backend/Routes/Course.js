import express from "express";
import { upload } from "../multer.js";
import {
    createCourse,
    deleteCourse,
    getCourses,
    updateCourse,
} from "../Controller/Course.js";
const router = express.Router();
router.get("/", getCourses);
router.post("/", upload.single("image"), createCourse);
router.put("/:id", upload.single("image"), updateCourse);
router.delete("/:id", deleteCourse);
export default router;