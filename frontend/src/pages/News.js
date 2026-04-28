import React, { useState } from 'react';
import { SearchIcon, CalendarIcon, UserIcon, ArrowRightIcon, DocumentTextIcon } from '@heroicons/react/outline';

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('news');

  const contentCategories = [
    { id: 'all', name: 'All Content', icon: DocumentTextIcon },
    { id: 'news', name: 'News', icon: CalendarIcon },
    { id: 'learning', name: 'Learning Resources', icon: UserIcon },
    { id: 'achievements', name: 'Achievements', icon: SearchIcon }
  ];

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'achievements', label: 'Achievements' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'placements', label: 'Placements' },
    { value: 'alumni', label: 'Alumni' },
    { value: 'events', label: 'Events' }
  ];

  const content = [
    // News Content
    {
      id: 1,
      title: 'MVSR Ranks Among Top Engineering Colleges in India',
      excerpt: 'MVSR Engineering College has been ranked among the top 50 engineering colleges in India according to the latest NIRF rankings.',
      content: 'MVSR Engineering College has achieved a significant milestone by being ranked among the top 50 engineering colleges in India. This recognition reflects our commitment to academic excellence, research, and overall development of students.',
      author: 'Admin',
      date: '2024-02-15',
      category: 'news',
      image: '/api/placeholder/800/400',
      featured: true
    },
    {
      id: 2,
      title: 'New Research Center for AI and Machine Learning Inaugurated',
      excerpt: 'A state-of-the-art research center for artificial intelligence and machine learning has been inaugurated at MVSR campus.',
      content: 'The new research center will focus on cutting-edge research in AI and ML, providing students and faculty with world-class facilities to work on innovative projects.',
      author: 'Dr. Ramesh Kumar',
      date: '2024-02-10',
      category: 'news',
      image: '/api/placeholder/800/400',
      featured: true
    },
    {
      id: 3,
      title: 'Placement Drive 2024: Record Breaking Results',
      excerpt: 'This year\'s placement drive has seen record-breaking numbers with 95% of students getting placed in top companies.',
      content: 'The placement season 2024 has been exceptional for MVSR students with top companies like Microsoft, Google, Amazon, and others recruiting our students with attractive packages.',
      author: 'Placement Cell',
      date: '2024-02-05',
      category: 'news',
      image: '/api/placeholder/800/400',
      featured: false
    },
    
    // Learning Resources
    {
      id: 4,
      title: 'Introduction to React Development',
      excerpt: 'Comprehensive guide to getting started with React.js for modern web development.',
      content: 'Learn the fundamentals of React.js including components, state management, hooks, and best practices. This resource includes practical examples and hands-on exercises to help you master React development.',
      author: 'Computer Science Department',
      date: '2024-02-01',
      category: 'learning',
      image: '/api/placeholder/800/400',
      featured: true
    },
    {
      id: 5,
      title: 'Machine Learning Basics Course',
      excerpt: 'Free online course covering ML fundamentals and practical applications.',
      content: 'Introduction to machine learning concepts including supervised learning, unsupervised learning, neural networks, and deep learning. Includes hands-on projects and real-world case studies.',
      author: 'AI Research Center',
      date: '2024-01-28',
      category: 'learning',
      image: '/api/placeholder/800/400',
      featured: false
    },
    {
      id: 6,
      title: 'MVSR Students Win National Hackathon',
      excerpt: 'Our students have won the national hackathon competition, showcasing their innovative solutions to real-world problems.',
      content: 'The team of computer science students developed an innovative solution for smart city management that impressed the judges.',
      author: 'Student Affairs',
      date: '2024-01-15',
      category: 'achievements',
      image: '/api/placeholder/800/400',
      featured: false
    }
  ];

  const filteredContent = content.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const featuredNews = content.filter(item => item.featured);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Latest News & Updates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest happenings, achievements, and announcements from MVSR Engineering College
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured News</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.map((article) => (
                <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-mvsr-100 text-mvsr-800 rounded-full text-xs font-medium">
                        Featured
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(article.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <UserIcon className="h-4 w-4 mr-2" />
                        {article.author}
                      </div>
                      <button className="text-mvsr-600 hover:text-mvsr-700 font-medium flex items-center">
                        Read More
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search news, resources, and achievements..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase())).map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium`}>
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(article.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {article.author}
                  </div>
                  <button className="text-mvsr-600 hover:text-mvsr-700 font-medium flex items-center">
                    Read More
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredContent.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No content found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter to find more articles
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
