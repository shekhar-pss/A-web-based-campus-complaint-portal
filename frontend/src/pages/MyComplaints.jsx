import { useState, useEffect } from "react";
import { useComplaint } from "../context/ComplaintContext";
import { useAuth } from "../context/AuthContext";

const UserComplaints = () => {
  const { myComplaints, fetchMyComplaints, loading, error } = useComplaint();
  const { user } = useAuth();
  
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  // Filter complaints based on selected filters
  const filteredComplaints = myComplaints.filter(complaint => {
    const statusMatch = filterStatus === "all" || complaint.status === filterStatus;
    const categoryMatch = filterCategory === "all" || complaint.category === filterCategory;
    const searchMatch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       complaint.problem.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && categoryMatch && searchMatch;
  });

  // Sort complaints based on selected option
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const statusOptions = ["all", "Pending", "In Progress", "Resolved", "Rejected"];
  const categoryOptions = [
    "all", "Infrastructure", "Hostel", "Cafeteria", "Transport", 
    "Library", "IT", "Administration", "Faculty", "Academic"
  ];

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading complaints: {error}</p>
          <button 
            onClick={fetchMyComplaints}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Complaints</h1>
        <p className="text-gray-600">
          View and manage all your submitted complaints
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
              {categoryOptions.map(option => (
                <option key={option} value={option}>
                  {option === "all" ? "All Categories" : option}
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
          Showing {sortedComplaints.length} of {myComplaints.length} complaints
        </div>
      </div>

      {/* Complaints List */}
      {sortedComplaints.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No complaints found</h3>
          <p className="mt-2 text-sm text-gray-600">
            {myComplaints.length === 0 
              ? "You haven't submitted any complaints yet." 
              : "Try adjusting your filters or search term."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedComplaints.map(complaint => (
            <div key={complaint._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{complaint.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {complaint.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {complaint.complaintType}
                    </span>
                    {complaint.studentId && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ID: {complaint.studentId}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{complaint.problem}</p>
                  
                  {complaint.image && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Attached Image:</p>
                      <img 
                        src={`${import.meta.env.VITE_API_URL}/uploads/${complaint.image}`} 
                        alt="Complaint evidence" 
                        className="h-32 object-cover rounded-md border border-gray-200"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
                  <p className="text-sm text-gray-500">
                    Submitted on {formatDate(complaint.createdAt)}
                  </p>
                  {complaint.updatedAt !== complaint.createdAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      Last updated on {formatDate(complaint.updatedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserComplaints;