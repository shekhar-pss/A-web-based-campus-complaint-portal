import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  // Set up default headers
  const setAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  // Get all complaints (Admin only)
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      setAuthHeader();
      
      const { data } = await axios.get(`${API_URL}/complaints`);
      setComplaints(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch complaints";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Get logged-in user's complaints
  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      setAuthHeader();
      
      const { data } = await axios.get(`${API_URL}/complaints/my`);
      setMyComplaints(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch your complaints";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new complaint
  const createComplaint = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setAuthHeader();
      
      // Create FormData object for file upload
      const submitData = new FormData();
      submitData.append("complaintType", formData.complaintType);
      submitData.append("title", formData.title);
      submitData.append("category", formData.category);
      submitData.append("problem", formData.problem);
      
      if (formData.complaintType === "student" && formData.studentId) {
        submitData.append("studentId", formData.studentId);
      }
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }
      
      const { data } = await axios.post(`${API_URL}/complaints`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Update local state
      setMyComplaints(prev => [data, ...prev]);
      
      // If user is admin, update all complaints too
      if (user?.role === "admin") {
        setComplaints(prev => [data, ...prev]);
      }
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create complaint";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update complaint status (Admin only)
  const updateComplaintStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      setAuthHeader();
      
      const { data } = await axios.put(`${API_URL}/complaints/${id}`, { status });
      
      // Update local state
      setComplaints(prev => 
        prev.map(complaint => 
          complaint._id === id ? data : complaint
        )
      );
      
      // Also update in myComplaints if it exists there
      setMyComplaints(prev => 
        prev.map(complaint => 
          complaint._id === id ? data : complaint
        )
      );
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update complaint status";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a complaint
  const deleteComplaint = async (id) => {
    try {
      setLoading(true);
      setError(null);
      setAuthHeader();
      
      await axios.delete(`${API_URL}/complaints/${id}`);
      
      // Update local state
      setComplaints(prev => prev.filter(complaint => complaint._id !== id));
      setMyComplaints(prev => prev.filter(complaint => complaint._id !== id));
      
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete complaint";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  const value = {
    complaints,
    myComplaints,
    loading,
    error,
    fetchComplaints,
    fetchMyComplaints,
    createComplaint,
    updateComplaintStatus,
    deleteComplaint,
    clearError,
  };

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  );
};

// Custom hook
export const useComplaint = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error("useComplaint must be used within a ComplaintProvider");
  }
  return context;
};