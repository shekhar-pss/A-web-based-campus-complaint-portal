import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  complaintType: { 
    type: String, 
    enum: ["student", "teacher"], 
    required: true 
  },
  studentId: { type: String }, // only if student

  title: { 
    type: String, 
    required: true, 
    trim: true 
  }, // short heading for the complaint

  category: { 
    type: String, 
    enum: ["Infrastructure", "Hostel", "Cafeteria", "Transport", "Library", "IT", "Administration", "Faculty", "Academic"], 
    required: true 
  }, // type of complaint

  problem: { type: String, required: true }, // detailed description
  image: { type: String }, // store image filename

  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Resolved", "Rejected"], 
    default: "Pending" 
  }
}, { timestamps: true });

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
