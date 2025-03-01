import express from "express";
import {
  createPackage,
  deletePackage,
  getPackages,
  updatePackage,
} from "../Controller/Package.js";
const router = express.Router();
router.get("/", getPackages);
router.post("/", createPackage);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);
export default router;
