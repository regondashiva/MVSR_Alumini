import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon,
  UserGroupIcon,
  SearchIcon,
  ChevronDownIcon,
  ClockIcon,
  CheckCircleIcon,
  CameraIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/outline';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { id: 'all', name: 'All Events', icon: CalendarIcon },
    { id: 'academic', name: 'Academic', icon: StarIcon },
    { id: 'cultural', name: 'Cultural', icon: CameraIcon },
    { id: 'sports', name: 'Sports', icon: UserGroupIcon },
    { id: 'workshop', name: 'Workshop', icon: StarIcon },
    { id: 'networking', name: 'Networking', icon: UserGroupIcon },
    { id: 'alumni', name: 'Alumni', icon: CheckCircleIcon }
  ];

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/events');
      const json = await res.json();
      if (json.success && json.data && json.data.events) {
        setEvents(json.data.events);
        setTotalPages(Math.ceil(json.data.events.length / 6));
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const isPast = new Date(event.event_date || event.date) < new Date();
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'upcoming' && !isPast) ||
                         (filterType === 'past' && isPast);
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const currentEvents = filteredEvents.slice((currentPage - 1) * 6, currentPage * 6);

  const handleDeleteEvent = (eventId) => {
    // Handle event deletion
    console.log('Delete event:', eventId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getOrganizerName = (organizer) => {
    if (!organizer) return 'Unknown Organizer';
    if (typeof organizer === 'string') return organizer;
    if (typeof organizer === 'object') return organizer.name || organizer.Name || 'Unknown Organizer';
    return String(organizer);
  };

  const handleRegisterEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to register for events.');
      return;
    }
    
    try {
      const res = await fetch(`/api/v1/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Successfully registered for the event!');
      } else {
        alert(data.message || 'Failed to register.');
      }
    } catch (err) {
      console.error(err);
      alert('Error registering for event.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="mt-2 text-gray-600">
            Manage and organize alumni events, workshops, and activities
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-gray-900 py-2 pl-3 pr-8 pr-10 rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past Events</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-gray-900 py-2 pl-3 pr-8 pr-10 rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mvsr-600"></div>
            <span className="ml-3 text-gray-600">Loading events...</span>
          </div>
        )}

        {/* Events Grid */}
        {!loading && error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEvents.map((event) => {
              const isPast = new Date(event.event_date || event.date) < new Date();
              return (
              <div key={event.id} className="bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="relative h-48">
                  <img
                    src={event.image_url || event.image || 'https://mvsrec.edu.in/images/Events/FEST-MAIN.jpg'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      event.category === 'academic' ? 'bg-blue-100 text-blue-800' :
                      event.category === 'cultural' ? 'bg-purple-100 text-purple-800' :
                      event.category === 'sports' ? 'bg-green-100 text-green-800' :
                      event.category === 'workshop' ? 'bg-yellow-100 text-yellow-800' :
                      event.category === 'networking' ? 'bg-indigo-100 text-indigo-800' :
                      event.category === 'alumni' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {categories.find(c => c.id === event.category)?.name || event.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isPast ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'
                    }`}>
                      {isPast ? 'Past Event' : 'Upcoming'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {new Date(event.event_date || event.date).toLocaleDateString()} {event.time || ''}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {event.max_attendees || event.maxAttendees || 'Unlimited'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        {event.current_attendees || event.currentAttendees || 0} registered
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      {getOrganizerName(event.organizer)}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRegisterEvent(event.id)}
                      className="flex-1 px-3 py-2 bg-mvsr-600 text-white rounded-md hover:bg-mvsr-700 transition-colors duration-200"
                    >
                      {isPast ? 'View Details' : 'Register'}
                    </button>
                    {/* Add conditional for delete based on permissions if needed */}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && currentEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find more events
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages).keys()].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 ${
                  currentPage === index + 1 ? 'bg-mvsr-600 text-white' : ''
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManagement;
