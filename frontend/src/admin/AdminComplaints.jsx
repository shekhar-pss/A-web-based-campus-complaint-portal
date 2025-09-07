import { useState, useEffect } from "react";
import { useComplaint } from "../context/ComplaintContext";
import { useAuth } from "../context/AuthContext";

const AdminComplaintManagement = () => {
  const { complaints, fetchComplaints, updateComplaintStatus, loading, error } = useComplaint();
  const { user } = useAuth();
  
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterComplaintType, setFilterComplaintType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user?.role === "admin") {
      fetchComplaints();
    }
  }, [user]);

  const categories = [
    "all", "Infrastructure", "Hostel", "Cafeteria", "Transport", 
    "Library", "IT", "Administration", "Faculty", "Academic"
  ];

  const statusOptions = ["all", "Pending", "In Progress", "Resolved", "Rejected"];
  const complaintTypeOptions = ["all", "student", "teacher"];

  // Filter complaints based on selected filters
  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = filterStatus === "all" || complaint.status === filterStatus;
    const categoryMatch = filterCategory === "all" || complaint.category === filterCategory;
    const typeMatch = filterComplaintType === "all" || complaint.complaintType === filterComplaintType;
    const searchMatch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       complaint.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (complaint.studentId && complaint.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                       (complaint.user?.name && complaint.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                       (complaint.user?.email && complaint.user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return statusMatch && categoryMatch && typeMatch && searchMatch;
  });

  // Sort complaints based on selected option
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await updateComplaintStatus(complaintId, newStatus);
      setSelectedComplaint(null);
      setStatusUpdate("");
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusCount = (status) => {
    return complaints.filter(complaint => complaint.status === status).length;
  };

  if (user?.role !== "admin") {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Access denied. Admin privileges required to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading complaints: {error}</p>
          <button 
            onClick={fetchComplaints}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Complaint Management</h1>
        <p className="text-gray-600">
          Admin dashboard to manage all complaints submitted by users
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-gray-800">{complaints.length}</div>
          <div className="text-sm text-gray-600">Total Complaints</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-yellow-700">{getStatusCount("Pending")}</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-700">{getStatusCount("In Progress")}</div>
          <div className="text-sm text-blue-600">In Progress</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-700">{getStatusCount("Resolved")}</div>
          <div className="text-sm text-green-600">Resolved</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>
                  {option === "all" ? "All Statuses" : option}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(option => (
                <option key={option} value={option}>
                  {option === "all" ? "All Categories" : option}
                </option>
              ))}
            </select>
          </div>

          {/* Complaint Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterComplaintType}
              onChange={(e) => setFilterComplaintType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {complaintTypeOptions.map(option => (
                <option key={option} value={option}>
                  {option === "all" ? "All Types" : option === "student" ? "Student" : "Teacher"}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {sortedComplaints.length} of {complaints.length} complaints
        </div>
      </div>

      {/* Complaints Table */}
      {sortedComplaints.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No complaints found</h3>
          <p className="mt-2 text-sm text-gray-600">
            {complaints.length === 0 
              ? "No complaints have been submitted yet." 
              : "Try adjusting your filters or search term."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedComplaints.map(complaint => (
                  <tr key={complaint._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{complaint.problem}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{complaint.user?.name || "Unknown"}</div>
                      <div className="text-sm text-gray-500">{complaint.user?.email || "No email"}</div>
                      {complaint.studentId && (
                        <div className="text-sm text-gray-500">ID: {complaint.studentId}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        complaint.complaintType === "student" ? "bg-purple-100 text-purple-800" : "bg-indigo-100 text-indigo-800"
                      }`}>
                        {complaint.complaintType === "student" ? "Student" : "Teacher"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(complaint.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {selectedComplaint === complaint._id ? (
                        <div className="flex flex-col space-y-2">
                          <select
                            value={statusUpdate}
                            onChange={(e) => setStatusUpdate(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="">Select status</option>
                            {statusOptions.filter(opt => opt !== "all").map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(complaint._id, statusUpdate)}
                              disabled={!statusUpdate}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => {
                                setSelectedComplaint(null);
                                setStatusUpdate("");
                              }}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedComplaint(complaint._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Change Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintManagement;