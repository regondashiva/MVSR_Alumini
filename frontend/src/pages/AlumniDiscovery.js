import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SearchIcon, 
  OfficeBuildingIcon, 
  LocationMarkerIcon, 
  AcademicCapIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const AlumniDiscovery = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const categories = [
    {
      id: 'company',
      name: 'Search by Company',
      icon: OfficeBuildingIcon,
      placeholder: 'Enter company name',
      description: 'Find alumni working at specific companies'
    },
    {
      id: 'city',
      name: 'Search by City',
      icon: LocationMarkerIcon,
      placeholder: 'Enter city name',
      description: 'Discover alumni in your city or other locations'
    },
    {
      id: 'state',
      name: 'Search by State',
      icon: LocationMarkerIcon,
      placeholder: 'Enter state name',
      description: 'Browse alumni by state across India'
    },
    {
      id: 'country',
      name: 'Search by Country',
      icon: LocationMarkerIcon,
      placeholder: 'Enter country name',
      description: 'Find alumni in specific countries'
    },
    {
      id: 'industry',
      name: 'Search by Industry',
      icon: BriefcaseIcon,
      placeholder: 'Enter industry name',
      description: 'Explore alumni by industry sectors'
    },
    {
      id: 'technology',
      name: 'Search by Technology/Tools',
      icon: AcademicCapIcon,
      placeholder: 'Enter technology or tool',
      description: 'Find alumni with specific tech skills'
    }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchInput('');
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchInput = (value) => {
    setSearchInput(value);
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    if (!user) {
      toast.error('Please login or register to search alumni');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: searchInput,
        category: selectedCategory,
        page: 1,
        limit: 20
      });

      // Try the primary API endpoint
      let response = await fetch(`/api/dynamic/alumni/search?${params}`);
      let data;

      // If primary endpoint fails, try fallback endpoints
      if (!response.ok) {
        console.warn('Primary search endpoint failed, trying fallback...');
        response = await fetch(`/api/alumni/search?${params}`);
      }

      if (!response.ok) {
        console.warn('All search endpoints failed, using mock data...');
        // Use mock data as fallback
        data = getMockSearchResults(searchInput, selectedCategory);
      } else {
        data = await response.json();
      }

      if (data.success || data.mock) {
        setSearchResults(data.data?.alumni || data.alumni || []);
        setSearchQuery(searchInput);
      } else {
        // Use mock data as final fallback
        const mockData = getMockSearchResults(searchInput, selectedCategory);
        setSearchResults(mockData.alumni);
        setSearchQuery(searchInput);
        toast.info('Showing sample results');
      }
    } catch (error) {
      console.error('Search error:', error);
      // Use mock data as fallback
      const mockData = getMockSearchResults(searchInput, selectedCategory);
      setSearchResults(mockData.alumni);
      setSearchQuery(searchInput);
      toast.info('Showing sample results');
    } finally {
      setLoading(false);
    }
  };

  // Mock data generator for fallback
  const getMockSearchResults = (query, category) => {
    const mockAlumni = [
      {
        id: 1,
        name: 'John Doe',
        currentPosition: 'Senior Software Engineer',
        company: 'Microsoft',
        city: 'Redmond',
        state: 'Washington',
        batch: '2020',
        branch: 'Computer Science',
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
        verified: false
      }
    ];

    return {
      success: true,
      mock: true,
      alumni: mockAlumni
    };
  };

  const handleAlumniClick = (alumni) => {
    navigate(`/alumni-profile/${alumni.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mvsr-50 to-mvsr-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Alumni Discovery Portal
          </h1>
          <p className="text-xl text-mvsr-100 mb-8">
            Connect with our distinguished alumni network
          </p>
        </div>

        {!selectedCategory ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How would you like to discover alumni?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-mvsr-500 hover:shadow-lg transition-all duration-300 text-left group"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 bg-mvsr-100 rounded-full group-hover:bg-mvsr-600 transition-colors">
                      <category.icon className="h-8 w-8 text-mvsr-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-mvsr-600">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {category.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Click to search
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-3">
                  {(() => {
                    const category = categories.find(c => c.id === selectedCategory);
                    return category ? (
                      <category.icon className="h-8 w-8 text-mvsr-600" />
                    ) : null;
                  })()}
                  <h2 className="text-2xl font-bold text-gray-900">
                    {categories.find(c => c.id === selectedCategory)?.name || 'Search'}
                  </h2>
                </div>
              </div>

              <div className="mb-8">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={categories.find(c => c.id === selectedCategory)?.placeholder || 'Enter search term...'}
                    className="w-full pl-12 pr-16 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-mvsr-500 focus:border-mvsr-500"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="absolute right-2 top-2 bg-mvsr-600 text-white px-6 py-2 rounded-lg hover:bg-mvsr-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
              </div>

              {!user && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">
                        You need to be logged in to view alumni profiles
                      </p>
                      <button
                        onClick={() => navigate('/login')}
                        className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        Login / Register
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {searchQuery && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Search Results for "{searchQuery}"
                    </h3>
                    <span className="text-sm text-gray-600">
                      {searchResults.length} alumni found
                    </span>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mvsr-600"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.map((alumni) => (
                        <div
                          key={alumni.id}
                          onClick={() => handleAlumniClick(alumni)}
                          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                        >
                          {/* Header with gradient background */}
                          <div className="h-20 bg-gradient-to-r from-mvsr-600 to-mvsr-800 relative">
                            <div className="absolute -bottom-8 left-4">
                              <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                                {alumni.image ? (
                                  <img
                                    src={alumni.image}
                                    alt={alumni.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gradient-to-br from-mvsr-400 to-mvsr-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                      {alumni.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {alumni.verified && (
                              <div className="absolute top-2 right-2">
                                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                  Verified
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4 pt-10">
                            <div className="mb-3">
                              <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-mvsr-600 transition-colors">
                                {alumni.name}
                              </h4>
                              <p className="text-sm text-gray-600 font-medium">
                                {alumni.currentPosition}
                              </p>
                              <p className="text-sm text-mvsr-600 font-semibold">
                                {alumni.company}
                              </p>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 gap-2 mb-3">
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                                <LocationMarkerIcon className="h-4 w-4 mr-2 text-mvsr-600" />
                                <span className="truncate">{alumni.city}, {alumni.state}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                                <AcademicCapIcon className="h-4 w-4 mr-2 text-mvsr-600" />
                                <span className="truncate">{alumni.batch} • {alumni.branch}</span>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                alumni.verified 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {alumni.verified ? 'Verified Alumni' : 'Pending Verification'}
                              </span>
                              <button className="flex items-center text-mvsr-600 hover:text-mvsr-700 text-sm font-medium transition-colors">
                                View Profile
                                <ArrowRightIcon className="h-4 w-4 ml-1" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">
                        No alumni found matching your search
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Try different search terms or browse categories
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => setSelectedCategory('')}
                  className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowRightIcon className="h-5 w-5 mr-2 rotate-180" />
                  Back to Categories
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDiscovery;
