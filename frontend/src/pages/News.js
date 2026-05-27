import React, { useState, useEffect } from 'react';
import { SearchIcon, CalendarIcon, UserIcon, ArrowRightIcon, DocumentTextIcon } from '@heroicons/react/outline';

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/news');
      const json = await res.json();
      if (json.success && json.data && json.data.news) {
        setContent(json.data.news);
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
    { value: 'events', label: 'Events' },
    { value: 'learning', label: 'Learning' }
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
                      {article.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <UserIcon className="h-4 w-4 mr-2" />
                        {article.author || 'Admin'}
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
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Loading news...</div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-500">{error}</div>
          ) : filteredContent.filter(item => item.title?.toLowerCase().includes(searchTerm.toLowerCase())).map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <img 
                src={article.image || 'https://via.placeholder.com/800x400'} 
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium capitalize`}>
                      {article.category || 'General'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(article.createdAt || article.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.content}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {article.author || 'Admin'}
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
