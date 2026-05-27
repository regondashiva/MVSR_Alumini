import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
  NewspaperIcon
} from '@heroicons/react/outline';

const FacultyDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pendingAlumni: 12,
    pendingStudents: 8,
    activeJobs: 5,
    upcomingEvents: 2
  });
  const navigate = useNavigate();

  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'faculty') {
      navigate('/dashboard');
      return;
    }
    setUser(parsedUser);

    fetchPendingUsers();
  }, [navigate]);

  const fetchPendingUsers = async () => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/faculty/pending-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setPendingUsers(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching pending users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/v1/faculty/verify-user/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        alert(data.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Error verifying user:', err);
      alert('Verification failed');
    }
  };

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  const pendingAlumniCount = pendingUsers.filter(u => u.role === 'alumni').length;
  const pendingStudentCount = pendingUsers.filter(u => u.role === 'student').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user.firstName} {user.lastName}. Manage {user.department} department connections.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Alumni</dt>
                  <dd className="text-lg font-medium text-gray-900">{pendingAlumniCount}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#verify" className="font-medium text-mvsr-600 hover:text-mvsr-500">Review pending</a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Students</dt>
                  <dd className="text-lg font-medium text-gray-900">{pendingStudentCount}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#verify" className="font-medium text-mvsr-600 hover:text-mvsr-500">Review pending</a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Jobs Posted by You</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activeJobs}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/careers" className="font-medium text-mvsr-600 hover:text-mvsr-500">Manage opportunities</a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Widget */}
        <div className="bg-white shadow rounded-lg" id="verify">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Verifications</h3>
            <p className="mt-1 text-sm text-gray-500">Verify alumni and students from your department.</p>
          </div>
          <ul className="divide-y divide-gray-200 p-4 max-h-96 overflow-y-auto">
            {loadingUsers ? (
              <li className="py-4 text-center text-sm text-gray-500">Loading pending users...</li>
            ) : pendingUsers.length === 0 ? (
              <li className="py-4 text-center text-sm text-gray-500">No pending verifications for your department.</li>
            ) : (
              pendingUsers.map(pendingUser => (
                <li key={pendingUser.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-medium text-sm">
                        {pendingUser.firstName[0]}{pendingUser.lastName[0]}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{pendingUser.firstName} {pendingUser.lastName}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {pendingUser.role} - {pendingUser.rollNumber} {pendingUser.passoutYear ? `(Class of ${pendingUser.passoutYear})` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleVerify(pendingUser.id)}
                      className="text-green-600 hover:text-green-900 px-2 py-1 text-sm font-medium border border-green-600 rounded"
                    >
                      Verify
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => navigate('/news/create')} className="flex items-center justify-center px-4 py-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <NewspaperIcon className="h-5 w-5 mr-2 text-gray-400" />
              Post Department News
            </button>
            <button onClick={() => navigate('/jobs/create')} className="flex items-center justify-center px-4 py-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
              Share Internship/Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
