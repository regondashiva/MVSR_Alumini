import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  XIcon,
  TrendingUpIcon,
  UploadIcon,
  DownloadIcon,
  DatabaseIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAlumni: 0,
    totalHelpDeskRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    mentorshipPrograms: 0,
    recruitmentPostings: 0
  });
  const [helpDeskRequests, setHelpDeskRequests] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importFile, setImportFile] = useState(null);
  const [importType, setImportType] = useState('alumni');
  const [importing, setImporting] = useState(false);
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingBulk, setProcessingBulk] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'alumni', name: 'Alumni', icon: AcademicCapIcon },
    { id: 'approvals', name: 'Approvals', icon: CheckCircleIcon },
    { id: 'data-import', name: 'Data Import', icon: UploadIcon },
    { id: 'helpdesk', name: 'Help Desk', icon: DocumentTextIcon },
    { id: 'mentorship', name: 'Mentorship', icon: UserGroupIcon },
    { id: 'recruitment', name: 'Recruitment', icon: BriefcaseIcon },
    { id: 'analytics', name: 'Analytics', icon: TrendingUpIcon }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        
        if (parsedUser.role !== 'admin') {
          navigate('/dashboard');
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

    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending registrations
      const registrationsResponse = await fetch('/api/admin/pending-registrations');
      const registrationsData = await registrationsResponse.json();
      
      if (registrationsResponse.ok && registrationsData.success) {
        setPendingRegistrations(registrationsData.data);
      }
      
      // Update stats
      const totalPending = registrationsData.data?.length || 0;
      const approvedCount = registrationsData.data?.filter(r => r.isVerified).length || 0;
      
      setStats(prev => ({
        ...prev,
        pendingRequests: totalPending,
        approvedRequests: approvedCount
      }));

      setHelpDeskRequests([
        {
          id: 1,
          service: 'recruit',
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date(),
          status: 'pending'
        },
        {
          id: 2,
          service: 'help',
          name: 'Jane Smith',
          email: 'jane@example.com',
          createdAt: new Date(),
          status: 'resolved'
        }
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      
      if (action === 'approve') {
        const response = await fetch(`/api/admin/approve-registration/${requestId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          toast.success('Registration approved successfully!');
        } else {
          toast.error('Failed to approve registration');
        }
      } else if (action === 'reject') {
        const response = await fetch(`/api/admin/reject-registration/${requestId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          toast.success('Registration rejected successfully!');
        } else {
          toast.error('Failed to reject registration');
        }
      }
      
      fetchAdminData();
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Failed to process request');
    }
  };

  const handleBulkApprove = async (action) => {
    if (selectedRegistrations.length === 0) {
      toast.error('Please select registrations to process');
      return;
    }

    setProcessingBulk(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/bulk-approve-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          registrationIds: selectedRegistrations,
          action: action
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Successfully ${action}d ${result.data.count} registrations`);
        setSelectedRegistrations([]);
        fetchAdminData();
      } else {
        toast.error(result.message || `Failed to ${action} registrations`);
      }
    } catch (error) {
      console.error('Bulk approval error:', error);
      toast.error(`Failed to ${action} registrations`);
    } finally {
      setProcessingBulk(false);
    }
  };

  const handleSelectRegistration = (registrationId) => {
    setSelectedRegistrations(prev => 
      prev.includes(registrationId)
        ? prev.filter(id => id !== registrationId)
        : [...prev, registrationId]
    );
  };

  const handleSelectAll = () => {
    const filtered = getFilteredRegistrations();
    if (selectedRegistrations.length === filtered.length) {
      setSelectedRegistrations([]);
    } else {
      setSelectedRegistrations(filtered.map(reg => reg.id));
    }
  };

  const getFilteredRegistrations = () => {
    let filtered = pendingRegistrations;

    // Apply status filter
    if (approvalFilter !== 'all') {
      filtered = filtered.filter(reg => 
        approvalFilter === 'pending' ? !reg.isVerified : reg.isVerified
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(reg =>
        `${reg.firstName} ${reg.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleRejectRequest = async (requestId, type) => {
    try {
      toast.success('Request rejected successfully!');
      fetchAdminData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return ClockIcon;
      case 'approved':
        return CheckCircleIcon;
      case 'rejected':
        return XIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <UsersIcon className="h-8 w-8 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <AcademicCapIcon className="h-8 w-8 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Alumni</h3>
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.totalAlumni}</div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <DocumentTextIcon className="h-8 w-8 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Help Desk</h3>
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.totalHelpDeskRequests}</div>
        <div className="text-sm text-gray-600">
          <span className="text-yellow-600">{stats.pendingRequests} pending</span>
          <span className="text-green-600 ml-2">{stats.approvedRequests} approved</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-2">
          <UserGroupIcon className="h-8 w-8 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Mentorship</h3>
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.mentorshipPrograms}</div>
      </div>
    </div>
  );

  const renderHelpDesk = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Help Desk Requests</h2>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            {stats.pendingRequests} Pending
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            {stats.approvedRequests} Approved
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {helpDeskRequests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {request.service}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {(() => {
                      const IconComponent = getStatusIcon(request.status);
                      return <IconComponent className="h-4 w-4 mr-1" />;
                    })()}
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                  <button className="text-mvsr-600 hover:text-mvsr-700">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </button>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleApproveRequest(request.id, 'helpdesk')}
                      className="ml-2 px-3 py-1 text-xs font-medium text-green-600 hover:text-green-700"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                  )}
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleRejectRequest(request.id, 'helpdesk')}
                      className="ml-2 px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      <XIcon className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderApprovals = () => {
    const filteredRegistrations = getFilteredRegistrations();
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Registration Approvals</h2>
          <span className="text-sm text-gray-600">
            {filteredRegistrations.length} of {pendingRegistrations.length} registrations
          </span>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
            >
              <option value="all">All Registrations</option>
              <option value="pending">Pending Only</option>
              <option value="approved">Approved Only</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, roll number..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-end">
            <div className="flex space-x-2 w-full">
              <button
                onClick={() => handleBulkApprove('approve')}
                disabled={selectedRegistrations.length === 0 || processingBulk}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRegistrations.length === 0 || processingBulk
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {processingBulk ? (
                  <span className="flex items-center justify-center">
                    <ClockIcon className="h-4 w-4 mr-1 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Approve Selected ({selectedRegistrations.length})
                  </span>
                )}
              </button>
              
              <button
                onClick={() => handleBulkApprove('reject')}
                disabled={selectedRegistrations.length === 0 || processingBulk}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRegistrations.length === 0 || processingBulk
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                <span className="flex items-center justify-center">
                  <XIcon className="h-4 w-4 mr-1" />
                  Reject Selected ({selectedRegistrations.length})
                </span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mvsr-600"></div>
            <span className="ml-3 text-gray-600">Loading registrations...</span>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Registrations Found</h3>
            <p className="text-gray-600">
              {searchQuery || approvalFilter !== 'all' 
                ? 'Try adjusting your filters or search query'
                : 'All registrations have been processed'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Select All Checkbox */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={selectedRegistrations.length === filteredRegistrations.length && filteredRegistrations.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-mvsr-600 focus:ring-mvsr-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Select All ({filteredRegistrations.length} registrations)
              </label>
            </div>
            
            {filteredRegistrations.map((registration) => (
              <div key={registration.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={selectedRegistrations.includes(registration.id)}
                      onChange={() => handleSelectRegistration(registration.id)}
                      className="h-4 w-4 text-mvsr-600 focus:ring-mvsr-500 border-gray-300 rounded mt-1 mr-3"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {registration.firstName} {registration.lastName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        registration.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {registration.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Roll Number: {registration.rollNumber}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Personal Information:</strong>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{registration.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-600">{registration.countryCode} {registration.phoneNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Address:</span>
                      <p className="text-gray-600">{registration.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Academic Information:</strong>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">College:</span>
                      <p className="text-gray-600">{registration.college}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Department:</span>
                      <p className="text-gray-600">{registration.department}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Passout Year:</span>
                      <p className="text-gray-600">{registration.passoutYear}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Role:</span>
                      <p className="text-gray-600">{registration.role}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Professional Information:</strong>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Company:</span>
                      <p className="text-gray-600">{registration.profile.company || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Role:</span>
                      <p className="text-gray-600">{registration.profile.role || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Experience:</span>
                      <p className="text-gray-600">{registration.profile.experienceYears || 0} years</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Industry:</span>
                      <p className="text-gray-600">{registration.profile.industry || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApproveRequest(registration.id, 'approve')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproveRequest(registration.id, 'reject')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
          <div className="text-2xl font-bold text-gray-900">+{stats.totalUsers}</div>
          <div className="text-sm text-gray-600">Total registered users</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Distribution</h3>
          <div className="space-y-2">
            {[
              { skill: 'JavaScript', count: 35 },
              { skill: 'Python', count: 28 },
              { skill: 'React', count: 22 },
              { skill: 'Node.js', count: 18 },
              { skill: 'AWS', count: 15 }
            ].map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                <span className="text-sm text-gray-500">{skill.count} alumni</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
          <div className="space-y-2">
            {[
              { location: 'Bangalore', count: 15 },
              { location: 'Hyderabad', count: 12 },
              { location: 'Seattle', count: 8 },
              { location: 'Palo Alto', count: 6 },
              { location: 'Austin', count: 4 }
            ].map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{location.location}</span>
                <span className="text-sm text-gray-500">{location.count} alumni</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a CSV or Excel file');
        return;
      }
      setImportFile(file);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('type', importType);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/import-data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Successfully imported ${result.data.count} records`);
        setImportFile(null);
        // Reset file input
        document.getElementById('import-file-input').value = '';
        // Refresh data
        fetchAdminData();
      } else {
        toast.error(result.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/export-data?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Data exported successfully');
      } else {
        toast.error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed. Please try again.');
    }
  };

  const renderDataImport = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Import & Export</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Import Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <UploadIcon className="h-5 w-5 mr-2" />
            Import Data
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Type
              </label>
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
              >
                <option value="alumni">Alumni Data</option>
                <option value="users">User Accounts</option>
                <option value="events">Events</option>
                <option value="news">News</option>
                <option value="jobs">Job Postings</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File (CSV/Excel)
              </label>
              <input
                id="import-file-input"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
              />
            </div>
            
            {importFile && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Selected file: <span className="font-medium">{importFile.name}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Size: {(importFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
            
            <button
              onClick={handleImport}
              disabled={!importFile || importing}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                !importFile || importing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-mvsr-600 text-white hover:bg-mvsr-700'
              }`}
            >
              {importing ? (
                <span className="flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 mr-2 animate-spin" />
                  Importing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UploadIcon className="h-5 w-5 mr-2" />
                  Import Data
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Export Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <DownloadIcon className="h-5 w-5 mr-2" />
            Export Data
          </h3>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Download existing data as CSV files for backup or analysis.
            </p>
            
            <div className="space-y-2">
              {[
                { type: 'alumni', label: 'Alumni Data', description: 'All approved alumni records' },
                { type: 'users', label: 'User Accounts', description: 'All registered users' },
                { type: 'events', label: 'Events', description: 'All events and activities' },
                { type: 'news', label: 'News', description: 'All news articles' },
                { type: 'jobs', label: 'Job Postings', description: 'All recruitment postings' }
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleExport(item.type)}
                    className="px-3 py-1 bg-mvsr-600 text-white text-sm rounded-lg hover:bg-mvsr-700 transition-colors flex items-center"
                  >
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Export
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Import Instructions:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use CSV or Excel files with proper headers</li>
          <li>• Alumni data should include: firstName, lastName, email, rollNumber, graduationYear, department</li>
          <li>• Users data should include: firstName, lastName, email, password, role</li>
          <li>• Duplicate records will be automatically skipped</li>
          <li>• Large files may take longer to process</li>
        </ul>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'approvals':
        return renderApprovals();
      case 'helpdesk':
        return renderHelpDesk();
      case 'data-import':
        return renderDataImport();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage the entire platform from here</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                User Dashboard
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

        <div className="bg-white rounded-lg shadow-md p-2 mb-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-mvsr-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
