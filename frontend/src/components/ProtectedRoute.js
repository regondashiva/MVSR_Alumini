import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check approval status for non-admin users
  if (user.role !== 'admin' && user.approvalStatus) {
    if (user.approvalStatus === 'pending') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Pending Approval</h2>
            <p className="text-center text-gray-600 mb-6">
              Your registration is pending admin approval. We're reviewing your information and will notify you once you've been approved.
            </p>
            <p className="text-center text-sm text-gray-500 mb-4">
              This typically takes 24-48 hours.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Back to Login
            </button>
          </div>
        </div>
      );
    }
    
    if (user.approvalStatus === 'rejected') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Registration Rejected</h2>
            <p className="text-center text-gray-600 mb-4">
              Your registration has been rejected by the admin.
            </p>
            {user.approvalNotes && (
              <div className="bg-gray-100 rounded p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Reason:</span> {user.approvalNotes}
                </p>
              </div>
            )}
            <p className="text-center text-sm text-gray-500 mb-4">
              Please contact support for more information.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
