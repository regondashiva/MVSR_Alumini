import React, { useState, useEffect } from 'react';
import { SearchIcon, BriefcaseIcon, LocationMarkerIcon, CurrencyDollarIcon, ClockIcon, FilterIcon } from '@heroicons/react/outline';

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/jobs');
      const json = await res.json();
      if (json.success && json.data && json.data.jobs) {
        setJobs(json.data.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const jobTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Remote', label: 'Remote' }
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Remote', label: 'Remote' }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || job.job_type === selectedType;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  const featuredJobs = filteredJobs.slice(0, 0); // Remove featured for now
  const regularJobs = filteredJobs;

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to apply for jobs.');
      return;
    }
    
    try {
      const res = await fetch(`/api/v1/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Successfully applied to the job!');
      } else {
        alert(data.message || 'Failed to apply.');
      }
    } catch (err) {
      console.error(err);
      alert('Error applying to job.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Career Opportunities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore job opportunities posted by MVSR alumni and partner companies
          </p>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-mvsr-600 mb-2">150+</div>
            <div className="text-gray-600">Active Jobs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-mvsr-600 mb-2">50+</div>
            <div className="text-gray-600">Companies</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-mvsr-600 mb-2">200+</div>
            <div className="text-gray-600">Alumni Employers</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-mvsr-600 mb-2">89%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
              >
                {jobTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location.value} value={location.value}>{location.label}</option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
              >
                <FilterIcon className="h-5 w-5 mr-2" />
                More Filters
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredJobs.length}</span> jobs
            </p>
            <button className="text-mvsr-600 hover:text-mvsr-700 font-medium">
              Post a Job
            </button>
          </div>
        </div>

        {/* Featured Jobs */}
        {featuredJobs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <img 
                        src={job.logo} 
                        alt={job.company}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                    </div>
                    {job.alumniPosted && (
                      <span className="px-2 py-1 bg-mvsr-100 text-mvsr-800 rounded-full text-xs font-medium">
                        Alumni Posted
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <LocationMarkerIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {job.type}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {job.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {job.experience}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Posted {job.posted} • Apply by {new Date(job.deadline).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleApply(job.id)}
                      className="px-4 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors duration-200"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Jobs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Opportunities</h2>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading jobs...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <div className="space-y-4">
              {regularJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-4 text-gray-600 font-bold text-xl">
                        {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">{job.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-2">{job.company}</p>
                        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <LocationMarkerIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {job.location || 'Not specified'}
                          </div>
                          <div className="flex items-center">
                            <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {job.job_type || 'Full-time'}
                          </div>
                          <div className="flex items-center">
                            <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {job.salary_range || 'Not specified'}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {job.experience_required || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 text-right flex flex-col justify-between items-end h-full min-h-[100px]">
                      <p className="text-sm text-gray-500 mb-3">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => handleApply(job.id)}
                        className="px-4 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors duration-200 mt-auto"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <BriefcaseIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find more opportunities
            </p>
          </div>
        )}

        {/* Post Job CTA */}
        <div className="mt-16 bg-mvsr-600 rounded-lg p-8 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Hiring? Post Your Job Here
            </h2>
            <p className="mb-6">
              Connect with talented MVSR alumni and students. Post your job openings and find the right candidates.
            </p>
            <button className="px-6 py-3 bg-white text-mvsr-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Post a Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
