import React, { useState, useEffect } from 'react';
import { SearchIcon, FilterIcon, UserCircleIcon, LocationMarkerIcon, BriefcaseIcon, AcademicCapIcon, GlobeAltIcon, HomeIcon, OfficeBuildingIcon, UsersIcon, XIcon, ChevronDownIcon } from '@heroicons/react/outline';

const AlumniDirectoryEnhanced = () => {
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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [activeBrowseTab, setActiveBrowseTab] = useState('all');
  const [browseData, setBrowseData] = useState({});
  const [selectedBrowseItem, setSelectedBrowseItem] = useState(null);
  const [showBrowseDropdown, setShowBrowseDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApprovedAlumni = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Try the new API endpoint first
        let response = await fetch('/api/v1/alumni/directory', { headers });
        
        // If that fails, try the legacy endpoint
        if (!response.ok) {
          response = await fetch('/api/alumni/approved', { headers });
        }

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAlumni(data.data || []);
          } else {
            setAlumni([]);
          }
        } else {
          // Use mock data as fallback
          setAlumni(getMockAlumni());
        }
      } catch (error) {
        console.error('Error fetching alumni:', error);
        // Use mock data as fallback
        setAlumni(getMockAlumni());
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedAlumni();
  }, []);

  // Mock alumni data as fallback
  const getMockAlumni = () => {
    return [
      {
        id: 1,
        name: 'John Doe',
        currentPosition: 'Senior Software Engineer',
        company: 'Microsoft',
        city: 'Redmond',
        state: 'Washington',
        batch: '2020',
        branch: 'Computer Science',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        verified: true
      },
      {
        id: 2,
        name: 'Jane Smith',
        currentPosition: 'Product Manager',
        company: 'Google',
        city: 'Mountain View',
        state: 'California',
        batch: '2019',
        branch: 'Information Technology',
        skills: ['Product Management', 'UX Design', 'Data Analysis', 'Agile'],
        verified: true
      },
      {
        id: 3,
        name: 'Mike Johnson',
        currentPosition: 'Data Scientist',
        company: 'Amazon',
        city: 'Seattle',
        state: 'Washington',
        batch: '2021',
        branch: 'Computer Science',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
        verified: false
      },
      {
        id: 4,
        name: 'Sarah Williams',
        currentPosition: 'UX Designer',
        company: 'Apple',
        city: 'Cupertino',
        state: 'California',
        batch: '2020',
        branch: 'Computer Science',
        skills: ['UX Design', 'UI Design', 'Figma', 'Sketch'],
        verified: true
      },
      {
        id: 5,
        name: 'David Brown',
        currentPosition: 'DevOps Engineer',
        company: 'Netflix',
        city: 'Los Gatos',
        state: 'California',
        batch: '2018',
        branch: 'Information Technology',
        skills: ['DevOps', 'Kubernetes', 'Docker', 'AWS'],
        verified: true
      },
      {
        id: 6,
        name: 'Emily Davis',
        currentPosition: 'Frontend Developer',
        company: 'Meta',
        city: 'Menlo Park',
        state: 'California',
        batch: '2021',
        branch: 'Computer Science',
        skills: ['JavaScript', 'React', 'Vue.js', 'CSS'],
        verified: false
      }
    ];
  };

  useEffect(() => {
    let filtered = alumni.filter(alumni => {
      const matchesSearch = 
        alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.country?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = 
        (!filters.batch || alumni.batch === filters.batch) &&
        (!filters.branch || alumni.branch === filters.branch) &&
        (!filters.company || alumni.company?.toLowerCase() === filters.company.toLowerCase()) &&
        (!filters.city || alumni.city?.toLowerCase() === filters.city.toLowerCase()) &&
        (!filters.state || alumni.state?.toLowerCase() === filters.state.toLowerCase()) &&
        (!filters.country || alumni.country?.toLowerCase() === filters.country.toLowerCase()) &&
        (!filters.industry || alumni.industry?.toLowerCase() === filters.industry.toLowerCase());
      
      return matchesSearch && matchesFilters;
    });

    setFilteredAlumni(filtered);
  }, [alumni, searchTerm, filters]);

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
    setSelectedBrowseItem(null);
    setActiveBrowseTab('all');
  };

  const getUniqueValues = (field) => {
    return [...new Set(alumni.map(alum => alum[field]).filter(Boolean))];
  };

  const handleAlumniClick = (alum) => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      alert('Please login to view alumni profiles.');
      return;
    }
    
    const currentUser = JSON.parse(userData);
    
    // Check if user is verified
    if (!currentUser.isVerified) {
      alert('Please verify your identity to view detailed alumni information.');
      return;
    }
    
    setSelectedAlumni(alum);
  };

  const handleBrowseTabClick = (tab) => {
    setActiveBrowseTab(tab);
    setSelectedBrowseItem(null);
    setShowBrowseDropdown(true);
  };

  const handleBrowseItemClick = (item) => {
    setSelectedBrowseItem(item);
    setShowBrowseDropdown(false);
  };

  const getBrowseTabIcon = (tab) => {
    switch(tab) {
      case 'company': return OfficeBuildingIcon;
      case 'state': return LocationMarkerIcon;
      case 'country': return GlobeAltIcon;
      case 'city': return LocationMarkerIcon;
      case 'name': return UsersIcon;
      default: return FilterIcon;
    }
  };

  const getBrowseTabLabel = (tab) => {
    switch(tab) {
      case 'company': return 'Company';
      case 'state': return 'State';
      case 'country': return 'Country';
      case 'city': return 'City';
      case 'name': return 'Name';
      default: return 'All';
    }
  };

  const getBrowseTabCount = (tab) => {
    if (tab === 'all') return alumni.length;
    return browseData[tab]?.length || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Alumni Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with our distinguished alumni network. Browse by company, location, or name.
          </p>
          {(() => {
            const userData = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            
            if (!userData || !token) {
              return true; // Show login message
            }
            
            if (userData) {
              const currentUser = JSON.parse(userData);
              return !currentUser.isVerified; // Show verification message
            }
            return false;
          })() && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                <strong>Note:</strong> {(() => {
                  const userData = localStorage.getItem('user');
                  const token = localStorage.getItem('token');
                  
                  if (!userData || !token) {
                    return 'Please login to view detailed alumni information.';
                  }
                  
                  const currentUser = JSON.parse(userData);
                  return 'Please verify your identity to access detailed alumni information.';
                })()}
              </p>
            </div>
          )}
        </div>

        {/* Browse Navigation Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
              {/* All Tab */}
              <button
                onClick={() => {
                  setActiveBrowseTab('all');
                  setSelectedBrowseItem(null);
                  setShowBrowseDropdown(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeBrowseTab === 'all'
                    ? 'bg-mvsr-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Alumni
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white bg-opacity-20">
                  {getBrowseTabCount('all')}
                </span>
              </button>

              {/* Browse Tabs */}
              {['company', 'state', 'country', 'city', 'name'].map(tab => {
                const Icon = getBrowseTabIcon(tab);
                return (
                  <div key={tab} className="relative">
                    <button
                      onClick={() => handleBrowseTabClick(tab)}
                      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeBrowseTab === tab
                          ? 'bg-mvsr-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {getBrowseTabLabel(tab)}
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white bg-opacity-20">
                        {getBrowseTabCount(tab)}
                      </span>
                      <ChevronDownIcon className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Clear Selection */}
            {(selectedBrowseItem || activeBrowseTab !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <XIcon className="h-4 w-4 mr-2 inline" />
                Clear Selection
              </button>
            )}
          </div>

          {/* Browse Dropdown */}
          {showBrowseDropdown && activeBrowseTab !== 'all' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Browse by {getBrowseTabLabel(activeBrowseTab)}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {browseData[activeBrowseTab]?.map(item => (
                  <button
                    key={item}
                    onClick={() => handleBrowseItemClick(item)}
                    className={`px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                      selectedBrowseItem === item
                        ? 'bg-mvsr-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {item}
                    <span className="ml-2 text-xs opacity-75">
                      ({alumni.filter(alum => alum[activeBrowseTab] === item).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Browse Item */}
          {selectedBrowseItem && (
            <div className="mt-4 p-4 bg-mvsr-50 border border-mvsr-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-mvsr-900">
                    {getBrowseTabLabel(activeBrowseTab)}: {selectedBrowseItem}
                  </h3>
                  <p className="text-sm text-mvsr-700">
                    {filteredAlumni.length} alumni found
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBrowseItem(null)}
                  className="text-mvsr-600 hover:text-mvsr-800"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, position, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <FilterIcon className="h-5 w-5 mr-2" />
              Advanced Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                <select
                  value={filters.batch}
                  onChange={(e) => handleFilterChange('batch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                >
                  <option value="">All Batches</option>
                  {getUniqueValues('batch').map(batch => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                <select
                  value={filters.branch}
                  onChange={(e) => handleFilterChange('branch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                >
                  <option value="">All Branches</option>
                  {getUniqueValues('branch').map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={filters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                >
                  <option value="">All Industries</option>
                  {getUniqueValues('industry').map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {selectedBrowseItem ? `${selectedBrowseItem} Alumni` : 'All Alumni'}
            </h2>
            <p className="text-gray-600">
              {filteredAlumni.length} {filteredAlumni.length === 1 ? 'alumni' : 'alumni'} found
            </p>
          </div>
          {filteredAlumni.length > 0 && (
            <div className="text-sm text-gray-500">
              Showing {filteredAlumni.length} of {alumni.length} alumni
            </div>
          )}
        </div>

        {/* Alumni Grid */}
        {filteredAlumni.length === 0 ? (
          <div className="text-center py-12">
            <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map(alum => (
              <div
                key={alum.id}
                onClick={() => handleAlumniClick(alum)}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                {/* Header with gradient background */}
                <div className="h-24 bg-gradient-to-r from-mvsr-600 to-mvsr-800 relative">
                  <div className="absolute -bottom-10 left-6">
                    <img
                      src={alum.image || '/api/placeholder/80/80'}
                      alt={alum.name}
                      className="h-20 w-20 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                  {alum.verified && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <UserCircleIcon className="h-3 w-3 mr-1" />
                        Verified
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 pt-12">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-mvsr-600 transition-colors">
                      {alum.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {alum.currentPosition}
                    </p>
                    <p className="text-sm text-mvsr-600 font-semibold">
                      {alum.company}
                    </p>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                      <LocationMarkerIcon className="h-4 w-4 mr-2 text-mvsr-600" />
                      <span className="truncate">{alum.city}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                      <AcademicCapIcon className="h-4 w-4 mr-2 text-mvsr-600" />
                      <span className="truncate">{alum.batch}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  {(() => {
                    try {
                      if (alum.skills && Array.isArray(alum.skills) && alum.skills.length > 0) {
                        return (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {alum.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-mvsr-100 text-mvsr-800 text-xs rounded-full">
                                  {skill}
                                </span>
                              ))}
                              {alum.skills.length > 3 && (
                                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                                  +{alum.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    } catch (error) {
                      console.warn('Error rendering skills for alumni:', alum.id, error);
                      return null;
                    }
                  })()}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      alum.verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {alum.verified ? 'Verified Alumni' : 'Pending Verification'}
                    </span>
                    <span className="text-sm text-mvsr-600 font-medium group-hover:text-mvsr-700 transition-colors">
                      View Profile →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alumni Detail Modal */}
        {selectedAlumni && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <img
                      src={selectedAlumni.image}
                      alt={selectedAlumni.name}
                      className="h-20 w-20 rounded-full mr-4"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedAlumni.name}</h2>
                      <p className="text-gray-600">{selectedAlumni.currentPosition}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAlumni(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <OfficeBuildingIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedAlumni.company}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedAlumni.industry}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <LocationMarkerIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedAlumni.city}, {selectedAlumni.state}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedAlumni.country}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Background</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedAlumni.batch} Batch
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedAlumni.branch}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserCircleIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedAlumni.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <OfficeBuildingIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={selectedAlumni.linkedin} target="_blank" rel="noopener noreferrer" className="text-mvsr-600 hover:text-mvsr-700">
                          LinkedIn Profile
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectoryEnhanced;
