import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SearchIcon, 
  UserCircleIcon, 
  LocationMarkerIcon, 
  BriefcaseIcon, 
  AcademicCapIcon, 
  UsersIcon, 
  XIcon,
  MailIcon,
  PhoneIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const AlumniDirectoryClean = () => {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    batch: '',
    branch: '',
    company: '',
    city: '',
    state: '',
    country: '',
    industry: ''
  });
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/alumni/approved');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAlumni(data.data.alumni || []);
        setFilteredAlumni(data.data.alumni || []);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
      toast.error('Failed to fetch alumni directory');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      batch: '',
      branch: '',
      company: '',
      city: '',
      state: '',
      country: '',
      industry: ''
    });
    setSearchTerm('');
  };

  const applyFilters = useCallback(() => {
    let filtered = alumni;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(alum => {
        const searchLower = searchTerm.toLowerCase();
        return (
          alum.name.toLowerCase().includes(searchLower) ||
          alum.company?.toLowerCase().includes(searchLower) ||
          alum.branch?.toLowerCase().includes(searchLower) ||
          alum.city?.toLowerCase().includes(searchLower) ||
          alum.state?.toLowerCase().includes(searchLower) ||
          alum.country?.toLowerCase().includes(searchLower) ||
          alum.industry?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply other filters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(alum => {
          const alumValue = alum[key]?.toLowerCase() || '';
          const filterValue = filters[key].toLowerCase();
          return alumValue.includes(filterValue);
        });
      }
    });

    setFilteredAlumni(filtered);
  }, [alumni, searchTerm, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleAlumniClick = (alum) => {
    setSelectedAlumni(alum);
  };

  const closeAlumniModal = () => {
    setSelectedAlumni(null);
  };

  const renderAlumniCard = (alum) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-mvsr-600 to-mvsr-800 rounded-t-lg overflow-hidden">
          <img
            src={alum.profileImage || 'https://via.placeholder.com/150'}
            alt={alum.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {alum.isVerified && (
          <div className="absolute top-2 right-2">
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <UserCircleIcon className="h-3 w-3 mr-1" />
              Verified
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {alum.name}
            </h3>
            <p className="text-sm text-gray-600">
              {alum.currentPosition} at {alum.company}
            </p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <LocationMarkerIcon className="h-4 w-4 mr-1" />
              {alum.city}, {alum.state}
            </div>
          </div>
          
          <div className="text-right">
            <button
              onClick={() => handleAlumniClick(alum)}
              className="text-mvsr-600 hover:text-mvsr-700 font-medium text-sm"
            >
              View Profile
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {alum.skills && alum.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {alum.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-mvsr-100 text-mvsr-800 text-xs rounded-full">
                  {skill}
                </span>
              ))}
              {alum.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                  +{alum.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Alumni</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by name, company, location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
            <select
              value={filters.batch}
              onChange={(e) => handleFilterChange('batch', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
            >
              <option value="">All Batches</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <select
              value={filters.branch}
              onChange={(e) => handleFilterChange('branch', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
            >
              <option value="">All Branches</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
              placeholder="Filter by company..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Filter by city..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
            >
              <option value="">All Industries</option>
              <option value="Information Technology">IT</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>

          <div className="flex space-x-4 mt-4">
            {(searchTerm || Object.values(filters).some(v => v)) && (
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <XIcon className="h-4 w-4 mr-2" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredAlumni.length} of {alumni.length} alumni
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mvsr-600"></div>
        <span className="ml-3 text-gray-600">Loading alumni directory...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar with Filters */}
          <div className="w-80 flex-shrink-0">
            {renderSidebar()}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Alumni Directory</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      const userData = localStorage.getItem('user');
                      if (userData) {
                        const user = JSON.parse(userData);
                        navigate('/alumni-profile/' + user.id);
                      }
                    }}
                    className="px-4 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Alumni Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.map(alum => renderAlumniCard(alum))}
            </div>
          </div>
        </div>
      </div>

      {/* Alumni Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedAlumni.name}
              </h3>
              <button
                onClick={closeAlumniModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MailIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{selectedAlumni.email}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{selectedAlumni.phoneNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <LocationMarkerIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{selectedAlumni.city}, {selectedAlumni.state}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Professional Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{selectedAlumni.currentPosition}</span>
                    </div>
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{selectedAlumni.company}</span>
                    </div>
                    <div className="flex items-center">
                      <UsersIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">{selectedAlumni.branch} • {selectedAlumni.passoutYear}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlumni.skills && selectedAlumni.skills.length > 0 && (
                      selectedAlumni.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-mvsr-100 text-mvsr-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Actions</h4>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate('/alumni-profile/' + selectedAlumni.id)}
                      className="flex-1 px-4 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors"
                    >
                      View Full Profile
                    </button>
                    <button
                      onClick={() => {
                        toast.success('Connection request sent!');
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDirectoryClean;
