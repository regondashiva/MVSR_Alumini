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

  const DEFAULT_GALLERY_IMAGE = {
    url: 'https://via.placeholder.com/1200x800?text=No+Image',
    alt: 'Gallery image not available',
    caption: 'No image available',
  };

  const normalizeGalleryItem = (item) => {
    const images = Array.isArray(item.images) && item.images.length ? item.images : [DEFAULT_GALLERY_IMAGE];
    const tags = Array.isArray(item.tags) ? item.tags : [];

    return {
      ...item,
      images,
      tags,
      likes: typeof item.likes === 'number' ? item.likes : 0,
      views: typeof item.views === 'number' ? item.views : 0,
      createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    };
  };

  const normalizeGalleryItems = (items) => items.map(normalizeGalleryItem);

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
          const galleryData = data.data?.gallery ?? data.data ?? data;
          setGalleryItems(normalizeGalleryItems(Array.isArray(galleryData) ? galleryData : []));
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
        title: "MVSR Engineering College - Campus & Infrastructure",
        description: "Explore the beautiful MVSR Engineering College campus with modern infrastructure, lush green environment, and state-of-the-art facilities established in 1981.",
        category: "campus",
        tags: ["campus", "infrastructure", "mvsr", "college"],
        images: [
          {
            url: "https://mvsrec.edu.in/images/home_slider/IMG_20251120_120402893_HDR_AE.jpg",
            caption: "MVSR Engineering College Campus - A symbol of academic excellence since 1981",
            alt: "MVSR College Campus",
            width: 1200,
            height: 800,
            size: 485760,
          },
          {
            url: "https://mvsrec.edu.in/images/home_slider/2024-10-05_Dasara.jpg",
            caption: "Dasara celebrations at MVSR Engineering College campus",
            alt: "MVSR Dasara Celebrations",
            width: 1200,
            height: 800,
            size: 393216,
          },
          {
            url: "https://mvsrec.edu.in/images/home_slider/2025-rangoli-1.jpg",
            caption: "Rangoli competition at MVSR Engineering College",
            alt: "MVSR Rangoli Competition",
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
        title: "Samavarthan 2026 - Annual Day Celebrations",
        description: "Grand annual day celebrations Samavarthan 2026 showcasing the best of MVSR Engineering College with performances, awards, and memorable moments.",
        category: "events",
        tags: ["samavarthan", "annual-day", "celebrations", "2026"],
        images: [
          {
            url: "https://mvsrec.edu.in/images/Events/SAMAVARTHAN2026.jpg",
            caption: "Samavarthan 2026 - Annual Day celebrations at MVSR Engineering College",
            alt: "Samavarthan 2026",
            width: 1200,
            height: 800,
            size: 368640,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/SAM-E8_1.jpg",
            caption: "Cultural performances during Samavarthan celebrations",
            alt: "Samavarthan Cultural Event",
            width: 1200,
            height: 800,
            size: 425984,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/SAM-E1.jpg",
            caption: "Students showcasing their talent at Samavarthan",
            alt: "Samavarthan Student Performance",
            width: 1200,
            height: 800,
            size: 393216,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/SAM-E2.jpg",
            caption: "Award ceremony during Samavarthan 2026",
            alt: "Samavarthan Awards",
            width: 1200,
            height: 800,
            size: 409600,
          }
        ],
        likes: 892,
        views: 4567,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 3,
        title: "ATHLEMA 2025 - Annual Sports Fest",
        description: "The annual sports fest ATHLEMA 2025 brought together students from all departments for exciting competitions in cricket, football, athletics, and more.",
        category: "events",
        tags: ["athlema", "sports-fest", "competition", "sports", "2025"],
        images: [
          {
            url: "https://mvsrec.edu.in/images/Events/ATHLEMA-25-COLLL.jpg",
            caption: "ATHLEMA 2025 - Annual Sports Festival at MVSR Engineering College",
            alt: "ATHLEMA 2025 Sports Fest",
            width: 1200,
            height: 800,
            size: 458752,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/MBA-BOXING.jpg",
            caption: "Boxing competition during ATHLEMA sports fest",
            alt: "Boxing at ATHLEMA",
            width: 1200,
            height: 800,
            size: 393216,
          }
        ],
        likes: 678,
        views: 3456,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 4,
        title: "Technical Workshops & Hackathons",
        description: "Showcasing the technical excellence and innovation spirit of MVSR students through IT HACK, AI100K, MicroHackathon, and other coding events.",
        category: "technical",
        tags: ["hackathon", "workshop", "technical", "innovation", "coding"],
        images: [
          {
            url: "https://mvsrec.edu.in/images/Events/IT-HACK-1.jpg",
            caption: "IT HACK 1.0 - 24-hour hackathon organized by IT Department",
            alt: "IT HACK Hackathon",
            width: 1200,
            height: 800,
            size: 368640,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/AI100K.jpg",
            caption: "AI100K Workshop on Artificial Intelligence and Machine Learning",
            alt: "AI100K Workshop",
            width: 1200,
            height: 800,
            size: 425984,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/MicroHackathon.jpg",
            caption: "Micro Hackathon - Quick problem solving coding challenge",
            alt: "Micro Hackathon",
            width: 1200,
            height: 800,
            size: 409600,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/CSE-HACK2.jpg",
            caption: "CSE Department Hackathon - Students working on innovative solutions",
            alt: "CSE Hackathon",
            width: 1200,
            height: 800,
            size: 393216,
          }
        ],
        likes: 734,
        views: 3890,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: 5,
        title: "Department Technical Fests",
        description: "Annual department-wise technical festivals showcasing innovations from CSE, ECE, EEE, Mechanical, Civil, and IT departments.",
        category: "technical",
        tags: ["tech-fest", "departments", "innovations", "projects"],
        images: [
          {
            url: "https://mvsrec.edu.in/images/Events/FEST-MAIN.jpg",
            caption: "Main Technical Fest - Inter-departmental competitions and exhibitions",
            alt: "Technical Fest Main Event",
            width: 1200,
            height: 800,
            size: 368640,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/fest-cse.jpg",
            caption: "CSE Department Technical Fest - Software and AI projects",
            alt: "CSE Tech Fest",
            width: 1200,
            height: 800,
            size: 409600,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/FEST-ECE.jpg",
            caption: "ECE Department Technical Fest - Electronics and IoT innovations",
            alt: "ECE Tech Fest",
            width: 1200,
            height: 800,
            size: 393216,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/FEST-MECH.jpg",
            caption: "Mechanical Department Fest - Robotics and design challenges",
            alt: "Mech Tech Fest",
            width: 1200,
            height: 800,
            size: 425984,
          }
        ],
        likes: 1123,
        views: 5678,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: 6,
        title: "Cultural Performances & Celebrations",
        description: "Vibrant cultural events at MVSR including Samavarthan performances, Dasara celebrations, rangoli competitions, and more.",
        category: "cultural",
        tags: ["cultural", "performances", "celebrations", "dance", "music"],
        images: [
          {
            url: "https://mvsrec.edu.in/images/Events/SAM-E4.jpg",
            caption: "Cultural performance during Samavarthan celebrations",
            alt: "Cultural Performance",
            width: 1200,
            height: 800,
            size: 425984,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/SAM-E6.jpg",
            caption: "Group dance performance by MVSR students",
            alt: "Group Dance Performance",
            width: 1200,
            height: 800,
            size: 368640,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/SAM-E5.jpg",
            caption: "Musical night during cultural fest",
            alt: "Musical Night",
            width: 1200,
            height: 800,
            size: 393216,
          }
        ],
        likes: 956,
        views: 4890,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: 7,
        title: "Placements & Industry Partnerships",
        description: "MVSR's strong placement record with top companies like Cisco, IBM, SAP, and more recruiting from campus.",
        category: "academic",
        tags: ["placements", "industry", "recruitment", "career"],
        images: [
          {
            url: "https://mvsrec.edu.in/images/Events/PLC-CSE.jpg",
            caption: "CSE Department Placement Drive - Students placed in top IT companies",
            alt: "CSE Placements",
            width: 1200,
            height: 800,
            size: 368640,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/PLC-ECE.jpg",
            caption: "ECE Department Placements - Strong industry connections",
            alt: "ECE Placements",
            width: 1200,
            height: 800,
            size: 425984,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/PLC-ITD-1.jpg",
            caption: "IT Department Placement Activities - Industry readiness",
            alt: "IT Placements",
            width: 1200,
            height: 800,
            size: 393216,
          },
          {
            url: "https://mvsrec.edu.in/images/home_slider/cisco-2025.jpg",
            caption: "Cisco partnership with MVSR for student certifications and training",
            alt: "Cisco Partnership",
            width: 1200,
            height: 800,
            size: 409600,
          }
        ],
        likes: 523,
        views: 2678,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 8,
        title: "NCC & Social Service Activities",
        description: "NCC cadets and NSS volunteers participating in national service, Republic Day celebrations, and community development activities.",
        category: "activities",
        tags: ["ncc", "nss", "social-service", "republic-day", "national-service"],
        images: [
          {
            url: "https://mvsrec.edu.in/images/Events/NCC-YEP.jpg",
            caption: "NCC Youth Exchange Programme - Building leadership and discipline",
            alt: "NCC Youth Programme",
            width: 1200,
            height: 800,
            size: 393216,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/NCC-FLYING_OFFICER.jpg",
            caption: "NCC Flying Officer commissioning ceremony at MVSR",
            alt: "NCC Flying Officer",
            width: 1200,
            height: 800,
            size: 368640,
          },
          {
            url: "https://mvsrec.edu.in/images/2025-01-26-rd.jpg",
            caption: "Republic Day celebrations 2025 - Flag hoisting ceremony",
            alt: "Republic Day 2025",
            width: 1200,
            height: 800,
            size: 425984,
          },
          {
            url: "https://mvsrec.edu.in/images/home_slider/ncc.jpg",
            caption: "NCC cadets during annual camp and training activities",
            alt: "NCC Camp",
            width: 1200,
            height: 800,
            size: 409600,
          }
        ],
        likes: 678,
        views: 3456,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        id: 9,
        title: "Alumni Meet & Networking",
        description: "Alumni gatherings, meets, and networking events bringing together MVSR graduates from across the globe.",
        category: "events",
        tags: ["alumni-meet", "networking", "graduates", "reunion"],
        images: [
          {
            url: "https://mvsrec.edu.in/images/Events/ALUMNI-COLL_1.jpg",
            caption: "Alumni Collective Meet - Reconnecting with MVSR family",
            alt: "Alumni Collective Meet",
            width: 1200,
            height: 800,
            size: 425984,
          },
          {
            url: "https://mvsrec.edu.in/images/Alumni/Nagaraju-alumni.jpg",
            caption: "Distinguished alumni visit and interaction with students",
            alt: "Alumni Visit",
            width: 1200,
            height: 800,
            size: 368640,
          }
        ],
        likes: 845,
        views: 4123,
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        id: 10,
        title: "Science Day & National Events",
        description: "Celebrations of National Science Day, Teachers Day, and other important national events at MVSR Engineering College.",
        category: "academic",
        tags: ["science-day", "teachers-day", "national-events", "celebrations"],
        images: [
          {
            url: "https://mvsrec.edu.in/images/Events/SICENCEDAY.jpg",
            caption: "National Science Day celebrations with experiments and exhibitions",
            alt: "Science Day",
            width: 1200,
            height: 800,
            size: 393216,
          },
          {
            url: "https://mvsrec.edu.in/images/home_slider/2025-02-28_nsd.jpg",
            caption: "National Science Day 2025 - Student innovations on display",
            alt: "National Science Day 2025",
            width: 1200,
            height: 800,
            size: 425984,
          },
          {
            url: "https://mvsrec.edu.in/images/Events/TeachersDay/Civil/2.jpg",
            caption: "Teachers Day celebrations - Honoring our mentors",
            alt: "Teachers Day",
            width: 1200,
            height: 800,
            size: 368640,
          }
        ],
        likes: 567,
        views: 2345,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
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
      
      const liked = likedItems.has(itemId);
      setGalleryItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, likes: typeof item.likes === 'number' ? item.likes + (liked ? -1 : 1) : (liked ? 0 : 1) }
          : item
      ));
      setLikedItems(newLikedItems);
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
    const normalizedItem = normalizeGalleryItem(item);
    setSelectedItem(normalizedItem);
    setCurrentImageIndex(imageIndex >= normalizedItem.images.length ? 0 : imageIndex);
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
    const title = item.title ? String(item.title).toLowerCase() : '';
    const description = item.description ? String(item.description).toLowerCase() : '';
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const matchesSearch = title.includes(searchTerm.toLowerCase()) ||
                         description.includes(searchTerm.toLowerCase()) ||
                         tags.some((tag) => String(tag).toLowerCase().includes(searchTerm.toLowerCase()));
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
                    src={item.images[0]?.url || DEFAULT_GALLERY_IMAGE.url}
                    alt={item.images[0]?.alt || DEFAULT_GALLERY_IMAGE.alt}
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
            {selectedItem.images?.length > 1 && (
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
                src={selectedItem.images[currentImageIndex]?.url || DEFAULT_GALLERY_IMAGE.url}
                alt={selectedItem.images[currentImageIndex]?.alt || DEFAULT_GALLERY_IMAGE.alt}
                className="max-w-full max-h-screen object-contain mx-auto"
              />
              <p className="text-white mt-4 text-lg">
                {selectedItem.images[currentImageIndex]?.caption || DEFAULT_GALLERY_IMAGE.caption}
              </p>
              {selectedItem.images?.length > 1 && (
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
