import React, { useState, useEffect, useCallback } from 'react';
import { 
  UsersIcon, 
  TrendingUpIcon, 
  BellIcon, 
  SearchIcon,
  HeartIcon,
  ChatIcon,
  ShareIcon,
  OfficeBuildingIcon,
  LocationMarkerIcon,
  AcademicCapIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const DynamicDashboard = () => {
  const [stats, setStats] = useState(null);
  const [feed, setFeed] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    company: '',
    location: '',
    branch: '',
    industry: ''
  });

  // Fetch real-time stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dynamic/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch statistics');
    }
  };

  // Fetch activity feed
  const fetchFeed = async () => {
    try {
      const response = await fetch('/api/dynamic/feed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setFeed(data.data.feed);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
      toast.error('Failed to fetch activity feed');
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/dynamic/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch trending data
  const fetchTrending = async (type = 'companies') => {
    try {
      const response = await fetch(`/api/dynamic/trending?type=${type}`);
      const data = await response.json();
      if (data.success) {
        setTrending(data.data.trending);
      }
    } catch (error) {
      console.error('Error fetching trending:', error);
      toast.error('Failed to fetch trending data');
    }
  };

  // Dynamic search
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const params = new URLSearchParams({
        query,
        ...filters,
        page: 1,
        limit: 10
      });
      
      const response = await fetch(`/api/dynamic/alumni/search?${params}`);
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data.alumni);
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Search failed');
    }
  }, [filters]);

  // Handle interactions
  const handleInteraction = async (type, targetId, action) => {
    try {
      const response = await fetch('/api/dynamic/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ type, targetId, action })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success(`${action} recorded!`);
        
        // Update local state for immediate feedback
        if (type === 'feed') {
          setFeed(prev => prev.map(item => 
            item.id === targetId 
              ? { ...item, likes: action === 'like' ? item.likes + 1 : item.likes }
              : item
          ));
        }
      }
    } catch (error) {
      console.error('Error recording interaction:', error);
      toast.error('Failed to record interaction');
    }
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    try {
      await fetch(`/api/dynamic/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchFeed(),
        fetchNotifications(),
        fetchTrending()
      ]);
      setLoading(false);
    };

    initializeData();

    // Set up real-time updates (poll every 30 seconds)
    const interval = setInterval(() => {
      fetchStats();
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, handleSearch]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dynamic Alumni Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Real-time insights and interactions
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mvsr-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <UsersIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.overview.totalUsers}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <AcademicCapIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.overview.totalAlumni}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <BellIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Help Desk Requests</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.overview.totalHelpDeskRequests}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <TrendingUpIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Events</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.overview.totalEvents}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {['overview', 'feed', 'search', 'trending', 'notifications'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-mvsr-600 text-mvsr-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {tab === 'notifications' && unreadCount > 0 && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Registrations</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Today:</span>
                            <span className="font-medium">{stats.registrations.today}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">This Week:</span>
                            <span className="font-medium">{stats.registrations.thisWeek}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">This Month:</span>
                            <span className="font-medium">{stats.registrations.thisMonth}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Recent Alumni</h4>
                        <div className="space-y-2">
                          {stats.recentActivity.newAlumni.slice(0, 5).map(alum => (
                            <div key={alum.id} className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{alum.name}</p>
                                <p className="text-xs text-gray-600">{alum.company} • {alum.batch}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Upcoming Events</h4>
                        <div className="space-y-2">
                          {stats.recentActivity.upcomingEvents.map(event => (
                            <div key={event.id} className="border-l-4 border-mvsr-600 pl-4">
                              <p className="text-sm font-medium">{event.title}</p>
                              <p className="text-xs text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Feed Tab */}
                {activeTab === 'feed' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Feed</h3>
                    {feed.map(item => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <p className="font-medium">{item.user.name}</p>
                              <span className="text-xs text-gray-500">{item.user.batch}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{item.content}</p>
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleInteraction('feed', item.id, 'like')}
                                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                              >
                                <HeartIcon className="h-4 w-4" />
                                <span className="text-sm">{item.likes}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                                <ChatIcon className="h-4 w-4" />
                                <span className="text-sm">{item.comments}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
                                <ShareIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search Tab */}
                {activeTab === 'search' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dynamic Search</h3>
                    
                    {/* Search Input */}
                    <div className="mb-6">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search alumni by name, company, location..."
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                        />
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <input
                        type="text"
                        placeholder="Company"
                        value={filters.company}
                        onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={filters.location}
                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                      />
                      <input
                        type="text"
                        placeholder="Branch"
                        value={filters.branch}
                        onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                      />
                      <input
                        type="text"
                        placeholder="Industry"
                        value={filters.industry}
                        onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                      />
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Search Results</h4>
                        {searchResults.map(alum => (
                          <div key={alum.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                              <div className="flex-1">
                                <p className="font-medium">{alum.name}</p>
                                <p className="text-sm text-gray-600">{alum.currentPosition}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <OfficeBuildingIcon className="h-3 w-3 mr-1" />
                                    {alum.company}
                                  </span>
                                  <span className="flex items-center">
                                    <LocationMarkerIcon className="h-3 w-3 mr-1" />
                                    {alum.city}, {alum.state}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Trending Tab */}
                {activeTab === 'trending' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Trending</h3>
                      <div className="flex space-x-2">
                        {['companies', 'industries', 'locations'].map(type => (
                          <button
                            key={type}
                            onClick={() => fetchTrending(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              type === 'companies'
                                ? 'bg-mvsr-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {trending.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
                          <div>
                            <p className="font-medium">{item.name || `${item.city}, ${item.state}`}</p>
                            <p className="text-sm text-gray-600">{item.count} alumni</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-mvsr-600">#{index + 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                          {unreadCount} unread
                        </span>
                      )}
                    </h3>
                    
                    {notifications.length > 0 ? (
                      <div className="space-y-3">
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`bg-white border rounded-lg p-4 cursor-pointer transition-colors ${
                              !notification.read ? 'border-mvsr-200 bg-mvsr-50' : 'border-gray-200'
                            }`}
                            onClick={() => !notification.read && markNotificationRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                !notification.read ? 'bg-mvsr-600' : 'bg-gray-300'
                              }`}></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-medium">{notification.title}</p>
                                  <span className="text-xs text-gray-500">
                                    {new Date(notification.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{notification.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No notifications</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicDashboard;
