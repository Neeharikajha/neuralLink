import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJoinRequests();
  }, []);

  const fetchJoinRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/join-requests`);
      setJoinRequests(response.data.joinRequests);
    } catch (err) {
      console.error("Failed to fetch join requests:", err);
      setError("Failed to load join requests");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (requestId, action, rejectionReason = "") => {
    try {
      await axios.put(`${API_BASE_URL}/api/join-requests/${requestId}`, {
        action,
        rejectionReason
      });
      
      // Refresh the list
      await fetchJoinRequests();
      alert(`Join request ${action}d successfully!`);
    } catch (error) {
      console.error(`Failed to ${action} join request:`, error);
      alert(`Failed to ${action} join request`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading join requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-gray-200">
      <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-100">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-gray-400 mt-1">
            Manage join requests for your projects.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {joinRequests.length === 0 ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
              <p className="text-gray-400">No join requests found.</p>
            </div>
          ) : (
            joinRequests.map((request) => (
              <JoinRequestCard
                key={request._id}
                request={request}
                onApprove={(id) => handleJoinRequest(id, 'approve')}
                onReject={(id, reason) => handleJoinRequest(id, 'reject', reason)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function JoinRequestCard({ request, onApprove, onReject }) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(request._id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason("");
    } else {
      alert("Please provide a reason for rejection");
    }
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">
            {request.project.title}
          </h3>
          <p className="text-gray-300 mb-3">{request.project.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
            <span>Requester: {request.requester.email}</span>
            <span>Status: <span className={`px-2 py-1 rounded text-xs ${
              request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
              request.status === 'approved' ? 'bg-green-500/20 text-green-300' :
              'bg-red-500/20 text-red-300'
            }`}>{request.status}</span></span>
            <span>Score: {request.finalScore ? `${request.finalScore.toFixed(1)}%` : 'N/A'}</span>
          </div>

          {request.message && (
            <div className="mb-3 p-3 bg-gray-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Message:</h4>
              <p className="text-sm text-gray-400">{request.message}</p>
            </div>
          )}

          {request.rejectionReason && (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="text-sm font-medium text-red-300 mb-1">Rejection Reason:</h4>
              <p className="text-sm text-red-400">{request.rejectionReason}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-sm text-gray-400">
            {new Date(request.createdAt).toLocaleDateString()}
          </span>
          
          {request.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => onApprove(request._id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Approve
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1020] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Reject Join Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason for rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                placeholder="Please provide a reason for rejection"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
