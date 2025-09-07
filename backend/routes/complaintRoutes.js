import express from "express";
import multer from "multer";
import { createComplaint, deleteComplaint, getComplaints, getMyComplaints, updateComplaintStatus } from "../controllers/complaintController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post("/", protect, upload.single("image"), createComplaint); // Student/Teacher submit
router.get("/", protect,  getComplaints); // Admin view all
router.put("/:id", protect, adminOnly, updateComplaintStatus); // Admin update status
router.get("/my", protect, getMyComplaints);
router.delete("/:id", protect, deleteComplaint);

export default router;
