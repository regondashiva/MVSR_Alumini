import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  XIcon,
  TrendingUpIcon,
  HeartIcon,
  ChatIcon,
  ShareIcon,
  OfficeBuildingIcon,
  LocationMarkerIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalConnections: 0,
    mentorshipRequests: 0,
    jobApplications: 0,
    eventsAttended: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        
        if (parsedUser.role !== 'alumni') {
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('No authentication token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Initialize with default values
      const defaultStats = {
        totalConnections: 0,
        mentorshipRequests: 0,
        jobApplications: 0,
        eventsAttended: 0
      };
      
      try {
        // Fetch user's connections
        const connectionsResponse = await fetch('/api/v1/alumni/connections', { headers });
        if (connectionsResponse.ok) {
          const connectionsData = await connectionsResponse.json();
          if (connectionsData.success) {
            defaultStats.totalConnections = connectionsData.data?.length || 0;
          }
        }
      } catch (error) {
        console.warn('Failed to fetch connections:', error);
      }
      
      try {
        // Fetch mentorship requests (if endpoint exists)
        const mentorshipResponse = await fetch('/api/v1/mentorship/requests', { headers });
        if (mentorshipResponse.ok) {
          const mentorshipData = await mentorshipResponse.json();
          if (mentorshipData.success) {
            defaultStats.mentorshipRequests = mentorshipData.data?.length || 0;
          }
        }
      } catch (error) {
        console.warn('Failed to fetch mentorship requests:', error);
      }
      
      try {
        // Fetch job applications
        const applicationsResponse = await fetch('/api/v1/jobs/applications', { headers });
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          if (applicationsData.success) {
            defaultStats.jobApplications = applicationsData.data?.length || 0;
          }
        }
      } catch (error) {
        console.warn('Failed to fetch job applications:', error);
      }
      
      try {
        // Fetch events attended
        const eventsResponse = await fetch('/api/v1/events/my', { headers });
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          if (eventsData.success) {
            defaultStats.eventsAttended = eventsData.data?.length || 0;
          }
        }
      } catch (error) {
        console.warn('Failed to fetch events:', error);
      }

      // Set the final stats
      setStats(defaultStats);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      // Set default values to prevent crashes
      setStats({
        totalConnections: 0,
        mentorshipRequests: 0,
        jobApplications: 0,
        eventsAttended: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{stats.totalConnections}</p>
              <p className="text-blue-100">Connections</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <UserGroupIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-100">
            <TrendingUpIcon className="h-4 w-4 mr-1" />
            <span>+12% this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{stats.mentorshipRequests}</p>
              <p className="text-green-100">Mentorship</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <BriefcaseIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-100">
            <TrendingUpIcon className="h-4 w-4 mr-1" />
            <span>+5% this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{stats.jobApplications}</p>
              <p className="text-purple-100">Applications</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <DocumentTextIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-100">
            <TrendingUpIcon className="h-4 w-4 mr-1" />
            <span>+8% this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{stats.eventsAttended}</p>
              <p className="text-orange-100">Events</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <CalendarIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-100">
            <TrendingUpIcon className="h-4 w-4 mr-1" />
            <span>+3% this month</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="p-2 bg-mvsr-100 rounded-lg mr-3">
          <ChartBarIcon className="h-5 w-5 text-mvsr-600" />
        </div>
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => navigate('/alumni-enhanced')}
          className="flex items-center p-4 bg-gradient-to-r from-mvsr-600 to-mvsr-700 text-white rounded-lg hover:from-mvsr-700 hover:to-mvsr-800 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <div className="p-2 bg-white/20 rounded-lg mr-4">
            <UsersIcon className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Alumni Directory</p>
            <p className="text-sm text-mvsr-100">Browse and connect</p>
          </div>
        </button>
        
        <button
          onClick={() => {
            const userData = localStorage.getItem('user');
            if (userData) {
              const user = JSON.parse(userData);
              navigate('/alumni-profile/' + user.id);
            }
          }}
          className="flex items-center p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <div className="p-2 bg-white/20 rounded-lg mr-4">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold">My Profile</p>
            <p className="text-sm text-blue-100">Update your information</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/events')}
          className="flex items-center p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <div className="p-2 bg-white/20 rounded-lg mr-4">
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Events</p>
            <p className="text-sm text-green-100">Upcoming events</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/careers')}
          className="flex items-center p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <div className="p-2 bg-white/20 rounded-lg mr-4">
            <BriefcaseIcon className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Career Opportunities</p>
            <p className="text-sm text-purple-100">Job openings</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderRecentActivity = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <div className="p-2 bg-mvsr-100 rounded-lg mr-3">
          <ClockIcon className="h-5 w-5 text-mvsr-600" />
        </div>
        Recent Activity
      </h3>
      <div className="space-y-4">
        <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-300">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-semibold text-gray-900">Profile Updated</p>
            <p className="text-xs text-gray-600">Your profile information was successfully updated</p>
            <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:shadow-md transition-all duration-300">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <HeartIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-semibold text-gray-900">New Connection</p>
            <p className="text-xs text-gray-600">You connected with John Doe from Computer Science</p>
            <p className="text-xs text-green-600 mt-1">1 day ago</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 hover:shadow-md transition-all duration-300">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-semibold text-gray-900">Event Registered</p>
            <p className="text-xs text-gray-600">Successfully registered for Alumni Meet 2024</p>
            <p className="text-xs text-purple-600 mt-1">3 days ago</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100 hover:shadow-md transition-all duration-300">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <DocumentTextIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-semibold text-gray-900">Job Application</p>
            <p className="text-xs text-gray-600">Applied for Senior Developer position at Tech Corp</p>
            <p className="text-xs text-orange-600 mt-1">1 week ago</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mvsr-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Alumni Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your alumni overview</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/alumni-discovery')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Alumni Discovery
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Overview Section - Full Width */}
          <div className="col-span-full">
            {renderOverview()}
          </div>

          {/* Bottom Section - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderQuickActions()}
            {renderRecentActivity()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
