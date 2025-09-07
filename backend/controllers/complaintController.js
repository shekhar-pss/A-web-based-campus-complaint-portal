import Complaint from "../models/Complaint.js";

// Create Complaint
export const createComplaint = async (req, res) => {
  try {
    const { complaintType, studentId, title, category, problem } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validation: if complaint is by student, studentId is required
    if (complaintType === "student" && !studentId) {
      return res.status(400).json({ message: "Student ID is required for student complaints" });
    }

    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required" });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      complaintType,
      studentId: complaintType === "student" ? studentId : null,
      title,
      category,
      problem,
      image
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Complaints (Admin only)
export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email role");
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Complaint Status (Admin only)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status;
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get complaints of logged-in user
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .populate("user", "name email role");
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete complaint
export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    // Find complaint by id
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Only the user who created complaint can delete it
    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this complaint" });
    }

    await complaint.deleteOne();

    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
