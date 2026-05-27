import React, { useState, useEffect } from 'react';
import { 
  BellIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  ChevronDownIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import RoleBadge from './RoleBadge';

const ApprovalNotifications = ({ onApprovalUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/pending-approvals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      const pendingUsers = data.data || [];
      
      setNotifications(pendingUsers);
      setUnreadCount(pendingUsers.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleApprove = async (userId) => {
    setProcessingId(userId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/approve-user/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approvalNotes: 'Approved by admin'
        })
      });

      if (!response.ok) throw new Error('Failed to approve user');

      const data = await response.json();
      setNotifications(prev => prev.filter(n => n.id !== userId));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      toast.success(`${data.data?.firstName} ${data.data?.lastName} approved!`);
      onApprovalUpdate?.();
    } catch (error) {
      toast.error('Failed to approve user: ' + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return; // User cancelled

    setProcessingId(userId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/admin/reject-user/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approvalNotes: reason || 'Rejected by admin'
        })
      });

      if (!response.ok) throw new Error('Failed to reject user');

      const data = await response.json();
      setNotifications(prev => prev.filter(n => n.id !== userId));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      toast.success(`${data.data?.firstName} ${data.data?.lastName} rejected!`);
      onApprovalUpdate?.();
    } catch (error) {
      toast.error('Failed to reject user: ' + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition"
        title="Pending Approvals"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Approvals
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {unreadCount} user{unreadCount !== 1 ? 's' : ''} awaiting approval
            </p>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>All caught up! No pending approvals.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {/* User Info */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {notification.firstName} {notification.lastName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {notification.email}
                        </p>
                      </div>
                      <RoleBadge role={notification.role} size="sm" />
                    </div>

                    {/* Additional Info */}
                    <div className="mb-3 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p><span className="font-medium">College:</span> {notification.college}</p>
                      <p><span className="font-medium">Dept:</span> {notification.department}</p>
                      {notification.createdAt && (
                        <p className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {formatDate(notification.createdAt)}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(notification.id)}
                        disabled={processingId === notification.id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(notification.id)}
                        disabled={processingId === notification.id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Could navigate to full approval dashboard here
                }}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
              >
                View All →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ApprovalNotifications;
