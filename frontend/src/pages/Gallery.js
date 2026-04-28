import React, { useState, useEffect } from 'react';
import { 
  PhotographIcon, 
  HeartIcon, 
  EyeIcon, 
  CalendarIcon,
  TagIcon,
  SearchIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/solid';
import toast from 'react-hot-toast';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedItems, setLikedItems] = useState(new Set());

  const categories = [
    { id: 'all', name: 'All Photos', icon: PhotographIcon },
    { id: 'campus', name: 'Campus', icon: PhotographIcon },
    { id: 'events', name: 'Events', icon: CalendarIcon },
    { id: 'technical', name: 'Technical', icon: TagIcon },
    { id: 'cultural', name: 'Cultural', icon: PhotographIcon },
    { id: 'academic', name: 'Academic', icon: PhotographIcon },
    { id: 'infrastructure', name: 'Infrastructure', icon: PhotographIcon },
    { id: 'activities', name: 'Activities', icon: PhotographIcon },
  ];

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
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
      let response = await fetch('/api/v1/gallery', { headers });
      
      // If that fails, try the legacy endpoint
      if (!response.ok) {
        response = await fetch('/api/gallery', { headers });
      }

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGalleryItems(data.data || []);
        } else {
          setGalleryItems([]);
        }
      } else {
        // Use mock data as fallback
        setGalleryItems(getMockGalleryData());
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      // Use mock data as fallback
      setGalleryItems(getMockGalleryData());
    } finally {
      setLoading(false);
    }
  };

  const getMockGalleryData = () => {
    return [
      {
        id: 1,
        title: "MVSR Engineering College - Campus Overview",
        description: "Beautiful aerial view of the MVSR Engineering College campus showcasing the modern infrastructure and lush green environment.",
        category: "campus",
        tags: ["campus", "infrastructure", "aerial-view", "mvsr"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=800&fit=crop&auto=format",
            caption: "MVSR Engineering College Main Building - A symbol of academic excellence since 1981",
            alt: "MVSR College Main Campus Building",
            width: 1200,
            height: 800,
            size: 485760,
          },
          {
            url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=800&fit=crop&auto=format",
            caption: "Modern Library Building with state-of-the-art facilities and digital resources",
            alt: "MVSR College Library",
            width: 1200,
            height: 800,
            size: 393216,
          },
          {
            url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=800&fit=crop&auto=format",
            caption: "Advanced Computer Science Department Lab equipped with latest technology",
            alt: "Computer Science Department Lab",
            width: 1200,
            height: 800,
            size: 425984,
          }
        ],
        likes: 456,
        views: 2890,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        title: "Independence Day Celebrations 2024",
        description: "Patriotic fervor and enthusiasm marked the Independence Day celebrations at MVSR Engineering College.",
        category: "events",
        tags: ["independence-day", "celebrations", "patriotic", "national-festival", "2024"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1551698638-6933a9f91e31?w=1200&h=800&fit=crop&auto=format",
            caption: "Flag hoisting ceremony by the Principal during Independence Day 2024 celebrations",
            alt: "Flag Hoisting Ceremony",
            width: 1200,
            height: 800,
            size: 368640,
          },
          {
            url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop&auto=format",
            caption: "Students performing cultural activities during Independence Day celebrations",
            alt: "Cultural Performance",
            width: 1200,
            height: 800,
            size: 425984,
          }
        ],
        likes: 678,
        views: 3456,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 3,
        title: "ATHLEMA Sports Fest 2024",
        description: "The annual sports fest ATHLEMA 2024 brought together students from all departments for two days of intense competition.",
        category: "events",
        tags: ["athlema", "sports-fest", "competition", "sports", "2024", "august"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop&auto=format",
            caption: "Inaugural ceremony of ATHLEMA 2024 with Principal and faculty members",
            alt: "ATHLEMA 2024 Inauguration",
            width: 1200,
            height: 800,
            size: 458752,
          },
          {
            url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop&auto=format",
            caption: "Cricket tournament finals between Computer Science and Mechanical Engineering",
            alt: "Cricket Tournament Finals",
            width: 1200,
            height: 800,
            size: 393216,
          }
        ],
        likes: 892,
        views: 4567,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 4,
        title: "Technical Workshops and Hackathons",
        description: "Showcasing the technical excellence and innovation spirit of MVSR students through various workshops and hackathons.",
        category: "technical",
        tags: ["workshop", "hackathon", "technical", "innovation", "coding", "sih2025"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&h=800&fit=crop&auto=format",
            caption: "IT HACK 1.0 - 24-hour hackathon organized by the Computer Science Department",
            alt: "IT HACK Hackathon",
            width: 1200,
            height: 800,
            size: 368640,
          },
          {
            url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop&auto=format",
            caption: "AI100K workshop on Artificial Intelligence and Machine Learning fundamentals",
            alt: "AI100K Workshop",
            width: 1200,
            height: 800,
            size: 425984,
          }
        ],
        likes: 734,
        views: 3890,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: 5,
        title: "Graduation Ceremony 2024",
        description: "The proud moment of graduation ceremony 2024, celebrating the academic achievements of our graduating students.",
        category: "academic",
        tags: ["graduation", "convocation", "ceremony", "achievements", "2024", "success"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop&auto=format",
            caption: "Grand procession of graduating students during the convocation ceremony",
            alt: "Graduation Procession",
            width: 1200,
            height: 800,
            size: 368640,
          },
          {
            url: "https://images.unsplash.com/photo-1537832816519-689ad163238b?w=1200&h=800&fit=crop&auto=format",
            caption: "Award ceremony for outstanding academic performers and gold medalists",
            alt: "Awards Ceremony",
            width: 1200,
            height: 800,
            size: 409600,
          }
        ],
        likes: 1123,
        views: 5678,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: 6,
        title: "Cultural Fest - Techno Cultural Harmony",
        description: "Annual cultural festival showcasing the diverse talents of MVSR students through music, dance, and drama.",
        category: "cultural",
        tags: ["cultural-fest", "music", "dance", "drama", "talent", "creativity"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop&auto=format",
            caption: "Inaugural performance of the cultural fest with traditional dance",
            alt: "Cultural Fest Inauguration",
            width: 1200,
            height: 800,
            size: 425984,
          },
          {
            url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=800&fit=crop&auto=format",
            caption: "Music band performance by students during the cultural night",
            alt: "Music Band Performance",
            width: 1200,
            height: 800,
            size: 368640,
          }
        ],
        likes: 956,
        views: 4890,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: 7,
        title: "Laboratories and Infrastructure",
        description: "State-of-the-art laboratories and infrastructure facilities across all departments providing hands-on learning experience.",
        category: "infrastructure",
        tags: ["laboratories", "infrastructure", "facilities", "equipment", "research"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop&auto=format",
            caption: "Advanced Electronics Laboratory with modern testing equipment",
            alt: "Electronics Laboratory",
            width: 1200,
            height: 800,
            size: 368640,
          },
          {
            url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&h=800&fit=crop&auto=format",
            caption: "Computer Laboratory with high-performance systems and software",
            alt: "Computer Laboratory",
            width: 1200,
            height: 800,
            size: 425984,
          }
        ],
        likes: 523,
        views: 2678,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 8,
        title: "NCC and Social Activities",
        description: "NCC cadets participating in various competitions and social service activities, showcasing discipline and leadership.",
        category: "activities",
        tags: ["ncc", "social-service", "discipline", "leadership", "national-service"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=800&fit=crop&auto=format",
            caption: "NCC cadets during the Republic Day parade celebration",
            alt: "NCC Republic Day Parade",
            width: 1200,
            height: 800,
            size: 393216,
          },
          {
            url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=800&fit=crop&auto=format",
            caption: "Social service activity - Tree plantation drive by NCC cadets",
            alt: "Tree Plantation Drive",
            width: 1200,
            height: 800,
            size: 368640,
          }
        ],
        likes: 678,
        views: 3456,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      }
    ];
  };

  const handleLike = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to like gallery items');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Toggle like state
      const newLikedItems = new Set(likedItems);
      if (likedItems.has(itemId)) {
        newLikedItems.delete(itemId);
        // Unlike API call
        await fetch(`/api/v1/gallery/${itemId}/unlike`, { 
          method: 'POST', 
          headers 
        });
        toast.success('Removed from likes');
      } else {
        newLikedItems.add(itemId);
        // Like API call
        await fetch(`/api/v1/gallery/${itemId}/like`, { 
          method: 'POST', 
          headers 
        });
        toast.success('Added to likes');
      }
      
      setLikedItems(newLikedItems);
      
      // Update the item in the list
      setGalleryItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, likes: likedItems.has(itemId) ? item.likes - 1 : item.likes + 1 }
          : item
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      // Mock success
      const newLikedItems = new Set(likedItems);
      if (likedItems.has(itemId)) {
        newLikedItems.delete(itemId);
        toast.success('Removed from likes');
      } else {
        newLikedItems.add(itemId);
        toast.success('Added to likes');
      }
      setLikedItems(newLikedItems);
    }
  };

  const openLightbox = (item, imageIndex = 0) => {
    setSelectedItem(item);
    setCurrentImageIndex(imageIndex);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction) => {
    if (!selectedItem) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === selectedItem.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedItem.images.length - 1 : prev - 1
      );
    }
  };

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mvsr-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <PhotographIcon className="h-8 w-8 mr-3 text-mvsr-600" />
                Photo Gallery
              </h1>
              <p className="text-gray-600 mt-1">Explore moments from MVSR Engineering College</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-mvsr-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <PhotographIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Main Image */}
                <div className="relative group cursor-pointer" onClick={() => openLightbox(item, 0)}>
                  <img
                    src={item.images[0]?.url}
                    alt={item.images[0]?.alt}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                      <PhotographIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">View {item.images.length} photos</p>
                    </div>
                  </div>
                  {item.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      +{item.images.length - 1} more
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-block bg-mvsr-100 text-mvsr-700 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(item.id);
                        }}
                        className="flex items-center space-x-1 hover:text-mvsr-600 transition-colors"
                      >
                        {likedItems.has(item.id) ? (
                          <HeartSolidIcon className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartIcon className="h-5 w-5" />
                        )}
                        <span>{item.likes}</span>
                      </button>
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-5 w-5" />
                        <span>{item.views}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XIcon className="h-8 w-8" />
            </button>

            {/* Navigation */}
            {selectedItem.images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="text-center">
              <img
                src={selectedItem.images[currentImageIndex]?.url}
                alt={selectedItem.images[currentImageIndex]?.alt}
                className="max-w-full max-h-screen object-contain mx-auto"
              />
              <p className="text-white mt-4 text-lg">
                {selectedItem.images[currentImageIndex]?.caption}
              </p>
              {selectedItem.images.length > 1 && (
                <p className="text-gray-400 mt-2">
                  {currentImageIndex + 1} / {selectedItem.images.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
