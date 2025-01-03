import mongoose from 'mongoose';
import Course from "../Model/Course.js";

export const createCourse = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const courseData = req.body;

        if (req.file) {
            courseData.image = req.file.path; 
        }

        // Optional validation of required fields
        if (!courseData.name || !courseData.description) {
            return res.status(400).json({ error: "Title and Description are required." });
        }

        const course = new Course(courseData);
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: error.message });
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: error.message });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid course ID" });
        }

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const courseData = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid course ID" });
        }

        if (req.file) {
            courseData.image = req.file.path;
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, courseData, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid course ID" });
        }

        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: error.message });
    }
};
