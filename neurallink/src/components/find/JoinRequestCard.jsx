import React, { useState } from "react";

export default function JoinRequestCard({ request, onApprove, onReject }) {
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
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-3">
              {request.requesterGitHubProfile?.avatar ? (
                <img 
                  src={request.requesterGitHubProfile.avatar} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center font-bold text-black/90">
                  {request.requesterGitHubProfile?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {request.requesterGitHubProfile?.displayName || request.requesterGitHubProfile?.username || request.requester.email}
                </h3>
                <p className="text-sm text-gray-400">
                  @{request.requesterGitHubProfile?.username || 'user'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Score: <span className="text-white font-semibold">{request.finalScore?.toFixed(1) || 0}%</span>
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                request.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {request.status}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-md font-semibold text-white mb-2">Project: {request.project.title}</h4>
            <p className="text-sm text-gray-300">{request.project.description}</p>
          </div>

          {request.message && (
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Message:</h4>
              <p className="text-sm text-gray-400">{request.message}</p>
            </div>
          )}

          {/* Score Breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{request.projectRelevanceScore?.toFixed(1) || 0}%</div>
              <div className="text-xs text-gray-400">Project Match</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{request.adminCompatibilityScore?.toFixed(1) || 0}%</div>
              <div className="text-xs text-gray-400">Team Match</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{request.activityScore?.toFixed(1) || 0}%</div>
              <div className="text-xs text-gray-400">Activity</div>
            </div>
          </div>

          {request.rejectionReason && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
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
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
              >
                Reject
              </button>
            </div>
          )}

          {request.status === 'approved' && (
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
              Approved
            </span>
          )}

          {request.status === 'rejected' && (
            <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
              Rejected
            </span>
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
