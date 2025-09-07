import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useComplaint } from "../context/ComplaintContext";
import { Link } from "react-router-dom";

const Homepage = () => {
  const { user } = useAuth();
  const { complaints, fetchComplaints, loading, error } = useComplaint();
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [visibleComplaints, setVisibleComplaints] = useState(6);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const categories = [
    "all", "Infrastructure", "Hostel", "Cafeteria", "Transport", 
    "Library", "IT", "Administration", "Faculty", "Academic"
  ];

  const statusOptions = ["all", "Pending", "In Progress", "Resolved", "Rejected"];

  // Filter complaints based on selected filters
  const filteredComplaints = complaints.filter(complaint => {
    const categoryMatch = filterCategory === "all" || complaint.category === filterCategory;
    const statusMatch = filterStatus === "all" || complaint.status === filterStatus;
    
    return categoryMatch && statusMatch;
  });

  // Get limited complaints for display
  const displayedComplaints = filteredComplaints.slice(0, visibleComplaints);

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
      day: 'numeric'
    });
  };

  const loadMoreComplaints = () => {
    setVisibleComplaints(prev => prev + 6);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Banner Component */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl">
            Community Complaint Portal
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl">
            A platform for students and staff to voice concerns and track resolutions
          </p>
          <div className="mt-10 flex justify-center">
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/new-complaint"
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 shadow-sm"
                >
                  File a New Complaint
                </Link>
                <Link
                  to="/dashboard"
                  className="px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 shadow-sm"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 shadow-sm"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 shadow-sm"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Complaints Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Recent Complaints</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Browse through the latest complaints submitted by our community members
            </p>
          </div>

          {/* Filters */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>
                      {option === "all" ? "All Statuses" : option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="mt-12 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
              <p>Error loading complaints: {error}</p>
              <button 
                onClick={fetchComplaints}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Complaints Grid */}
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayedComplaints.map(complaint => (
                  <div key={complaint._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {complaint.category}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        complaint.complaintType === "student" ? "bg-purple-100 text-purple-800" : "bg-indigo-100 text-indigo-800"
                      }`}>
                        {complaint.complaintType === "student" ? "Student" : "Teacher"}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{complaint.problem}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatDate(complaint.createdAt)}</span>
                      {complaint.user && (
                        <span>By: {complaint.user.name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredComplaints.length === 0 && (
                <div className="mt-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No complaints found</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {complaints.length === 0 
                      ? "No complaints have been submitted yet." 
                      : "Try adjusting your filters."}
                  </p>
                </div>
              )}

              {filteredComplaints.length > visibleComplaints && (
                <div className="mt-12 text-center">
                  <button
                    onClick={loadMoreComplaints}
                    className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                  >
                    Load More Complaints
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Simple steps to get your concerns addressed
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Submit Complaint</h3>
              <p className="mt-2 text-gray-600">
                Fill out our simple form to report your issue with relevant details.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Track Progress</h3>
              <p className="mt-2 text-gray-600">
                Monitor the status of your complaint as it moves through the resolution process.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Get Resolved</h3>
              <p className="mt-2 text-gray-600">
                Receive updates and final resolution for your submitted complaints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold">Ready to make a difference?</h2>
          <p className="mt-4 text-lg">
            Join our community and help make our institution better for everyone.
          </p>
          <div className="mt-8">
            {user ? (
              <Link
                to="/new-complaint"
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 shadow-sm"
              >
                Submit Your First Complaint
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 shadow-sm"
              >
                Create Your Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;