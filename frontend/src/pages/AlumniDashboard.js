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
  LocationMarkerIcon,
  StarIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import RoleBadge from '../components/RoleBadge';

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalConnections: 0,
    mentorshipRequests: 0,
    jobApplications: 0,
    eventsAttended: 0
  });
  const [tickets, setTickets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        
        if (parsedUser.role !== 'alumni' && parsedUser.role !== 'faculty' && parsedUser.role !== 'student') {
          navigate('/login');
          return;
        }
        setUser(parsedUser);
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

      // Initialize with database-driven stats
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
        // Fetch mentorship requests
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
        // Fetch helpdesk tickets
        const ticketsResponse = await fetch('/api/v1/helpdesk/my-tickets', { headers });
        if (ticketsResponse.ok) {
          const ticketsData = await ticketsResponse.json();
          if (ticketsData.success) {
            const ticketList = ticketsData.data || [];
            setTickets(ticketList);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch helpdesk tickets:', error);
      }
      
      try {
        // Fetch job applications
        const applicationsResponse = await fetch('/api/v1/jobs/applications', { headers });
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          if (applicationsData.success) {
            const appList = applicationsData.data || [];
            setApplications(appList);
            defaultStats.jobApplications = appList.length;
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
            const eventList = eventsData.data?.events || [];
            setMyEvents(eventList);
            defaultStats.eventsAttended = eventList.length;
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

  const getRoleBadge = (role) => {
    return <RoleBadge role={role} size="sm" />;
  };

  const getThemeColors = (role) => {
    switch (role) {
      case 'faculty':
        return {
          primary: 'from-purple-600 to-indigo-700',
          hover: 'hover:from-purple-700 hover:to-indigo-800',
          text: 'text-purple-600',
          bg: 'bg-purple-100',
          lightBg: 'bg-purple-50',
          border: 'border-purple-200'
        };
      case 'student':
        return {
          primary: 'from-blue-600 to-indigo-700',
          hover: 'hover:from-blue-700 hover:to-indigo-800',
          text: 'text-blue-600',
          bg: 'bg-blue-100',
          lightBg: 'bg-blue-50',
          border: 'border-blue-200'
        };
      default:
        return {
          primary: 'from-mvsr-600 to-mvsr-700',
          hover: 'hover:from-mvsr-700 hover:to-mvsr-800',
          text: 'text-mvsr-600',
          bg: 'bg-mvsr-100',
          lightBg: 'bg-mvsr-50',
          border: 'border-mvsr-200'
        };
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

  const renderQuickActions = () => {
    const theme = getThemeColors(user?.role);
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className={`p-2 ${theme.bg} rounded-lg mr-3`}>
            <ChartBarIcon className={`h-5 w-5 ${theme.text}`} />
          </div>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate('/alumni-enhanced')}
            className={`flex items-center p-4 bg-gradient-to-r ${theme.primary} text-white rounded-lg ${theme.hover} transition-all duration-300 transform hover:scale-105 shadow-md`}
          >
            <div className="p-2 bg-white/20 rounded-lg mr-4">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Alumni Directory</p>
              <p className="text-sm opacity-90">Browse and connect</p>
            </div>
          </button>
          
          <button
            onClick={() => {
              if (user) {
                navigate('/alumni-profile/' + user.id);
              }
            }}
            className={`flex items-center p-4 bg-gradient-to-r ${theme.primary} text-white rounded-lg ${theme.hover} transition-all duration-300 transform hover:scale-105 shadow-md`}
          >
            <div className="p-2 bg-white/20 rounded-lg mr-4">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold">My Profile</p>
              <p className="text-sm opacity-90">Update your information</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/events')}
            className={`flex items-center p-4 bg-gradient-to-r ${theme.primary} text-white rounded-lg ${theme.hover} transition-all duration-300 transform hover:scale-105 shadow-md`}
          >
            <div className="p-2 bg-white/20 rounded-lg mr-4">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Events</p>
              <p className="text-sm opacity-90">Upcoming events</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/careers')}
            className={`flex items-center p-4 bg-gradient-to-r ${theme.primary} text-white rounded-lg ${theme.hover} transition-all duration-300 transform hover:scale-105 shadow-md`}
          >
            <div className="p-2 bg-white/20 rounded-lg mr-4">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Career Opportunities</p>
              <p className="text-sm opacity-90">Job openings</p>
            </div>
          </button>
        </div>
      </div>
    );
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 0) return 'just now';
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval === 1 ? '1 year ago' : `${interval} years ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? '1 month ago' : `${interval} months ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? '1 day ago' : `${interval} days ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    
    return seconds < 5 ? 'just now' : `${seconds} seconds ago`;
  };

  const getActivities = () => {
    const list = [];

    // 1. Profile Updated
    if (user) {
      list.push({
        id: 'profile-update',
        title: 'Profile Updated',
        description: 'Your profile information was successfully updated',
        time: user.updatedAt ? new Date(user.updatedAt) : new Date(Date.now() - 3600000 * 2), // 2 hours ago baseline
        type: 'profile',
        color: 'blue'
      });
    }

    // 2. Helpdesk tickets (includes campus visits)
    tickets.forEach(ticket => {
      let desc = `Submitted request for ${ticket.service}`;
      if (ticket.service === 'campus-visit') {
        let visitDate = '';
        try {
          const details = typeof ticket.details === 'string' ? JSON.parse(ticket.details) : ticket.details;
          if (details && details.visitDate) {
            visitDate = ` on ${new Date(details.visitDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}`;
          }
        } catch (e) {}
        desc = `Your request for a campus visit${visitDate} is ${ticket.status}`;
      } else if (ticket.service === 'mentor') {
        desc = `You volunteered to be a mentor (Status: ${ticket.status})`;
      } else if (ticket.service === 'transcript') {
        desc = `Requested official academic transcripts (Status: ${ticket.status})`;
      } else if (ticket.message) {
        desc = ticket.message;
      }

      list.push({
        id: `ticket-${ticket.id}`,
        title: ticket.service === 'campus-visit' ? 'Campus Visit Requested' : `Helpdesk Request`,
        description: desc,
        time: new Date(ticket.createdAt),
        type: 'helpdesk',
        color: ticket.status === 'resolved' ? 'green' : 'orange'
      });
    });

    // 3. Job Applications
    applications.forEach(app => {
      list.push({
        id: `app-${app.id}`,
        title: 'Job Application Submitted',
        description: `Applied for ${app.job?.title || 'Job'} position at ${app.job?.company || 'Company'}`,
        time: new Date(app.application_date),
        type: 'job',
        color: 'purple'
      });
    });

    // 4. Event Registrations
    myEvents.forEach(event => {
      list.push({
        id: `event-${event.id}`,
        title: 'Event Registered',
        description: `Successfully registered for "${event.title}"`,
        time: new Date(event.created_at || Date.now() - 3600000 * 24 * 3), // Fallback to 3 days ago
        type: 'event',
        color: 'orange'
      });
    });

    // Sort by time descending
    return list.sort((a, b) => b.time - a.time);
  };

  const renderRecentActivity = () => {
    const activities = getActivities();
    
    const getActivityIcon = (type) => {
      switch (type) {
        case 'profile':
          return <CheckCircleIcon className="h-6 w-6 text-white" />;
        case 'helpdesk':
          return <LocationMarkerIcon className="h-6 w-6 text-white" />;
        case 'job':
          return <DocumentTextIcon className="h-6 w-6 text-white" />;
        case 'event':
          return <CalendarIcon className="h-6 w-6 text-white" />;
        default:
          return <ClockIcon className="h-6 w-6 text-white" />;
      }
    };

    const getColorClasses = (color) => {
      switch (color) {
        case 'blue':
          return {
            card: 'from-blue-50 to-indigo-50 border-blue-100',
            badge: 'from-blue-500 to-blue-600',
            text: 'text-blue-600'
          };
        case 'green':
          return {
            card: 'from-green-50 to-emerald-50 border-green-100',
            badge: 'from-green-500 to-green-600',
            text: 'text-green-600'
          };
        case 'orange':
          return {
            card: 'from-orange-50 to-yellow-50 border-orange-100',
            badge: 'from-orange-500 to-orange-600',
            text: 'text-orange-600'
          };
        case 'purple':
          return {
            card: 'from-purple-50 to-pink-50 border-purple-100',
            badge: 'from-purple-500 to-purple-600',
            text: 'text-purple-600'
          };
        default:
          return {
            card: 'from-gray-50 to-slate-50 border-gray-100',
            badge: 'from-gray-500 to-gray-600',
            text: 'text-gray-600'
          };
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <div className="p-2 bg-mvsr-100 rounded-lg mr-3">
            <ClockIcon className="h-5 w-5 text-mvsr-600" />
          </div>
          Recent Activity
        </h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-6 text-sm">No recent activities found.</p>
          ) : (
            activities.map((act) => {
              const cls = getColorClasses(act.color);
              return (
                <div key={act.id} className={`flex items-center p-4 bg-gradient-to-r ${cls.card} rounded-lg border hover:shadow-md transition-all duration-300`}>
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 bg-gradient-to-br ${cls.badge} rounded-full flex items-center justify-center shadow-lg`}>
                      {getActivityIcon(act.type)}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{act.title}</p>
                    <p className="text-xs text-gray-600">{act.description}</p>
                    <p className={`text-xs font-medium ${cls.text} mt-1`}>{formatTimeAgo(act.time)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderHelpdeskSection = () => {
    const getServiceBadgeColor = (service) => {
      switch (service) {
        case 'campus-visit': return 'bg-green-100 text-green-800 border-green-200';
        case 'mentor': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        case 'volunteer': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'transcript': return 'bg-red-100 text-red-800 border-red-200';
        case 'recruit': return 'bg-purple-100 text-purple-800 border-purple-200';
        default: return 'bg-blue-100 text-blue-800 border-blue-200';
      }
    };

    const getServiceIcon = (service) => {
      switch (service) {
        case 'campus-visit': return <LocationMarkerIcon className="h-5 w-5 mr-1" />;
        case 'mentor': return <AcademicCapIcon className="h-5 w-5 mr-1" />;
        case 'volunteer': return <UserGroupIcon className="h-5 w-5 mr-1" />;
        case 'transcript': return <DocumentTextIcon className="h-5 w-5 mr-1" />;
        case 'recruit': return <BriefcaseIcon className="h-5 w-5 mr-1" />;
        default: return <ChatIcon className="h-5 w-5 mr-1" />;
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <LocationMarkerIcon className="h-5 w-5 text-green-600" />
            </div>
            My Campus Visits & Help Desk Requests
          </h3>
          <button
            onClick={() => navigate('/help-desk')}
            className="px-4 py-2 bg-gradient-to-r from-mvsr-600 to-mvsr-700 text-white rounded-lg hover:from-mvsr-700 hover:to-mvsr-800 transition-all duration-300 font-semibold shadow-md transform hover:scale-105"
          >
            New Request / Schedule Visit
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
            <LocationMarkerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No Active Visits or Requests</h4>
            <p className="text-gray-600 max-w-md mx-auto mb-6 text-sm">
              Planning to visit the MVSR campus? Or need academic documents like transcripts? Submit a ticket and track its progress right here.
            </p>
            <button
              onClick={() => navigate('/help-desk')}
              className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              Schedule Campus Visit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => {
              let parsedDetails = {};
              try {
                parsedDetails = typeof ticket.details === 'string' ? JSON.parse(ticket.details) : ticket.details;
              } catch (e) {
                parsedDetails = {};
              }

              const serviceLabel = ticket.service.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

              return (
                <div 
                  key={ticket.id} 
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Service Badge & Status */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getServiceBadgeColor(ticket.service)}`}>
                        {getServiceIcon(ticket.service)}
                        {serviceLabel}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        ticket.status === 'resolved' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200 animate-pulse'
                      }`}>
                        {ticket.status === 'resolved' ? 'Approved / Resolved' : 'Pending Review'}
                      </span>
                    </div>

                    {/* Details section depending on service */}
                    <div className="space-y-2 mb-4">
                      {ticket.service === 'campus-visit' && parsedDetails && (
                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-gray-100 space-y-1">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-800">Visit Date:</span>{' '}
                            {parsedDetails.visitDate ? new Date(parsedDetails.visitDate).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Not Specified'}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-800">Purpose:</span> {parsedDetails.visitPurpose || 'Not Specified'}
                          </p>
                        </div>
                      )}

                      {ticket.service === 'transcript' && parsedDetails && (
                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-gray-100 space-y-1">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-800">Graduation Year:</span> {parsedDetails.graduationYear || 'Not Specified'}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-800">Degree & Branch:</span>{' '}
                            {parsedDetails.degree ? `${parsedDetails.degree} (${parsedDetails.branch || ''})` : 'Not Specified'}
                          </p>
                        </div>
                      )}

                      {ticket.service === 'mentor' && parsedDetails && parsedDetails.mentorshipAreas && parsedDetails.mentorshipAreas.length > 0 && (
                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-gray-100">
                          <p className="text-sm text-gray-700 font-semibold text-gray-800 mb-1">Mentoring Areas:</p>
                          <div className="flex flex-wrap gap-1">
                            {parsedDetails.mentorshipAreas.map(area => (
                              <span key={area} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {ticket.service === 'volunteer' && parsedDetails && parsedDetails.volunteerAreas && parsedDetails.volunteerAreas.length > 0 && (
                        <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-gray-100">
                          <p className="text-sm text-gray-700 font-semibold text-gray-800 mb-1">Volunteer Interests:</p>
                          <div className="flex flex-wrap gap-1">
                            {parsedDetails.volunteerAreas.map(area => (
                              <span key={area} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {ticket.message && (
                        <div className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3 py-1">
                          "{ticket.message}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Remarks Section */}
                  {ticket.adminRemarks && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                      <div className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-blue-900 block mb-0.5">Admin Response:</span>
                          {ticket.adminRemarks}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Indicator for Campus Visit */}
                  {ticket.service === 'campus-visit' && ticket.status === 'resolved' && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-800 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-emerald-950 block">Visit Confirmed!</span>
                        We look forward to hosting you on campus. Please carry your alumni card.
                      </div>
                    </div>
                  )}

                  <div className="mt-4 text-right text-xs text-gray-500">
                    Submitted on {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-l-mvsr-600">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-1 flex-wrap gap-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Alumni Dashboard</h1>
                {user && getRoleBadge(user.role)}
              </div>
              <p className="text-gray-600">
                Welcome back, <span className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</span>! Here's your alumni overview
              </p>
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

          {/* Help Desk & Campus Visits Section - Full Width */}
          <div className="col-span-full">
            {renderHelpdeskSection()}
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
