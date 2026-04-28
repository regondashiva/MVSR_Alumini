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

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    const mockEvents = [
      {
        id: 1,
        title: 'Alumni Meet 2024',
        description: 'Annual alumni reunion bringing together graduates from all batches',
        date: '2024-03-15',
        time: '10:00 AM',
        location: 'MVSR Engineering College, Hyderabad',
        category: 'alumni',
        maxAttendees: 500,
        currentAttendees: 245,
        organizer: 'Alumni Association',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NzY4YSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXZlbnQgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==',
        tags: ['reunion', 'networking', 'alumni'],
        isPast: false
      },
      {
        id: 2,
        title: 'Technical Workshop on AI/ML',
        description: 'Hands-on workshop covering latest trends in artificial intelligence and machine learning',
        date: '2024-03-20',
        time: '2:00 PM',
        location: 'Computer Science Department',
        category: 'academic',
        maxAttendees: 100,
        currentAttendees: 67,
        organizer: 'CS Department',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NzY4YSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXZlbnQgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==',
        tags: ['workshop', 'AI', 'ML', 'technology'],
        isPast: false
      },
      {
        id: 3,
        title: 'Cultural Festival',
        description: 'Annual cultural festival with music, dance, drama and various competitions',
        date: '2024-02-10',
        time: '5:00 PM',
        location: 'College Campus',
        category: 'cultural',
        maxAttendees: 1000,
        currentAttendees: 890,
        organizer: 'Student Council',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NzY4YSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXZlbnQgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==',
        tags: ['festival', 'music', 'dance', 'cultural'],
        isPast: true
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setTotalPages(Math.ceil(mockEvents.length / 6));
      setLoading(false);
    }, 1000);
  }, [searchTerm, filterType, selectedCategory]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'upcoming' && !event.isPast) ||
                         (filterType === 'past' && event.isPast);
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

  const handleRegisterEvent = (eventId) => {
    // Handle event registration
    console.log('Register for event:', eventId);
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
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEvents.map((event) => (
              <div key={event.id} className="bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="relative h-48">
                  <img
                    src={event.image}
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
                      event.isPast ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'
                    }`}>
                      {event.isPast ? 'Past Event' : 'Upcoming'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {event.date} at {event.time}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {event.maxAttendees} max
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        {event.currentAttendees} registered
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      {event.organizer}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRegisterEvent(event.id)}
                      className="flex-1 px-3 py-2 bg-mvsr-600 text-white rounded-md hover:bg-mvsr700 transition-colors duration-200"
                    >
                      {event.isPast ? 'View Details' : 'Register'}
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
