import React, { useState } from 'react';
import { 
  UserGroupIcon, 
  SparklesIcon,
  StarIcon,
  HeartIcon,
  MusicNoteIcon,
  CameraIcon,
  BookOpenIcon,
  LightBulbIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  CalendarIcon,
  BriefcaseIcon
} from '@heroicons/react/outline';

const StudentLife = () => {
  const [activeTab, setActiveTab] = useState('clubs');

  // Force cache refresh
  const cacheVersion = '1.0.1';

  const clubs = [
    {
      name: 'Technical Clubs',
      icon: LightBulbIcon,
      description: 'Foster innovation and technical excellence through various technical activities.',
      gradient: 'from-blue-500 to-cyan-500',
      clubs: [
        'Coding Club',
        'Robotics Club', 
        'AI/ML Club',
        'IoT Club',
        'Cybersecurity Club',
        'Open Source Club'
      ]
    },
    {
      name: 'Cultural Clubs',
      icon: MusicNoteIcon,
      description: 'Celebrate diversity and cultural heritage through various cultural activities.',
      gradient: 'from-purple-500 to-pink-500',
      clubs: [
        'Music Club',
        'Dance Club',
        'Drama Club',
        'Literary Club',
        'Fine Arts Club',
        'Photography Club'
      ]
    },
    {
      name: 'Sports Clubs',
      icon: StarIcon,
      description: 'Promote physical fitness and sportsmanship through various sports activities.',
      gradient: 'from-green-500 to-emerald-500',
      clubs: [
        'Cricket Club',
        'Football Club',
        'Basketball Club',
        'Volleyball Club',
        'Athletics Club',
        'Kabbadi Club'
      ]
    },
    {
      name: 'Professional Development',
      icon: BriefcaseIcon,
      description: 'Enhance professional skills and career readiness.',
      gradient: 'from-orange-500 to-red-500',
      clubs: [
        'IEEE Student Branch',
        'ACM Chapter',
        'ISTE Chapter',
        'Entrepreneurship Cell',
        'Placement Cell',
        'Alumni Association'
      ]
    }
  ];

  const events = [
    {
      name: 'A T H L E M A - Sports Fest',
      date: 'August 8-9, 2024',
      description: 'Annual sports festival celebrating athletic excellence and team spirit.',
      type: 'Sports',
      participants: '2000+',
      highlights: ['Multiple Sports', 'Inter-College Competition', 'Cultural Events', 'Prize Distribution'],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Independence Day Celebrations',
      date: 'August 15, 2024',
      description: 'Patriotic celebration with flag hoisting and cultural programs.',
      type: 'Cultural',
      participants: '3000+',
      highlights: ['Flag Hoisting', 'March Past', 'Cultural Programs', 'Guest Lectures'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Republic Day Celebrations',
      date: 'January 26, 2025',
      description: 'National celebration showcasing unity and cultural diversity.',
      type: 'Cultural',
      participants: '3000+',
      highlights: ['Parade', 'Cultural Programs', 'Award Ceremony', 'Guest Speakers'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Founder\'s Day',
      date: 'Annual',
      description: 'Commemorating the founder with special programs and awards.',
      type: 'Cultural',
      participants: '2500+',
      highlights: ['Founder Memorial', 'Award Ceremony', 'Alumni Meet', 'Cultural Programs'],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Dasara Celebrations',
      date: 'October',
      description: 'Traditional festival celebration with cultural activities.',
      type: 'Cultural',
      participants: '2000+',
      highlights: ['Cultural Programs', 'Traditional Activities', 'Food Festival', 'Art Exhibition'],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      name: 'Vijay Diwas',
      date: 'December 16, 2019',
      description: 'Victory day celebration honoring national heroes.',
      type: 'Cultural',
      participants: '1500+',
      highlights: ['Patriotic Programs', 'Guest Lectures', 'Cultural Events', 'Competitions'],
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  const achievements = [
    {
      title: 'Women Kabaddi Team',
      achievement: 'Second Place in Rudrasandhaan 2020',
      description: 'Our college women Kabaddi team secured second place in the sports fest organized by AVNIET.',
      icon: StarIcon,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'IIT-H Competition',
      achievement: 'First and Fourth Prizes in ELAN NVISION 2020',
      description: 'G.Prateeka and K.Sruthi Samhitha of BE 3/4 EEE won First Prize and Fourth Prize in the national student competition at IIT-Hyderabad.',
      icon: StarIcon,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Cisco Networking Academy',
      achievement: 'Top Performing Academy in Telangana',
      description: 'Our college has been recognized as one of the top-performing academies in the Cisco Networking Academy program in Telangana.',
      icon: StarIcon,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Faculty Excellence',
      achievement: 'Best Performing Instructor Award',
      description: 'CSE faculty Mr. K Murali Krishna, Assistant Professor has been recognized as one of the Best Performing Instructors.',
      icon: StarIcon,
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const facilities = [
    {
      name: 'Hostels',
      icon: HeartIcon,
      description: 'Comfortable and secure accommodation for students.',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Separate Boys/Girls Hostels', 'WiFi Connectivity', 'Mess Facilities', '24/7 Security']
    },
    {
      name: 'Sports Complex',
      icon: StarIcon,
      description: 'Modern sports facilities for various indoor and outdoor games.',
      gradient: 'from-green-500 to-emerald-500',
      features: ['Cricket Ground', 'Basketball Courts', 'Volleyball Courts', 'Gymnasium']
    },
    {
      name: 'Cafeteria',
      icon: UserGroupIcon,
      description: 'Hygienic and affordable food options for students.',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Multiple Food Counters', 'Vegetarian/Non-Vegetarian', 'Snack Bar', 'Seating Area']
    },
    {
      name: 'Transportation',
      icon: GlobeAltIcon,
      description: 'Safe and reliable transportation facilities.',
      gradient: 'from-orange-500 to-red-500',
      features: ['College Buses', 'Multiple Routes', 'GPS Tracking', 'Experienced Drivers']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Student Life</h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              Experience vibrant campus life with diverse clubs, exciting events, and endless opportunities 
              for personal growth and lifelong friendships.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 border-b">
            {['clubs', 'events', 'achievements', 'facilities'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-mvsr-600 text-mvsr-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'clubs' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Student Clubs & Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {clubs.map((category, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
                  <div className="flex items-center mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${category.gradient} mr-4`}>
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  <div className="space-y-3">
                    {category.clubs.map((club, idx) => (
                      <div key={idx} className="flex items-center text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <SparklesIcon className="h-4 w-4 text-mvsr-600 mr-3" />
                        {club}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Annual Events & Festivals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${event.gradient}`}></div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${event.gradient} mr-3`}>
                        <CalendarIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                        <span className={`text-sm font-medium bg-gradient-to-r ${event.gradient} bg-clip-text text-transparent`}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Date:</span>
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Participants:</span>
                        <span className="font-medium">{event.participants}</span>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Highlights:</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-mvsr-100 text-mvsr-800 text-xs rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Student Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
                  <div className="flex items-start">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${achievement.gradient} mr-4`}>
                      <achievement.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                      <h4 className={`text-lg font-medium mb-3 bg-gradient-to-r ${achievement.gradient} bg-clip-text text-transparent`}>
                        {achievement.achievement}
                      </h4>
                      <p className="text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Campus Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {facilities.map((facility, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
                  <div className="flex items-center mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${facility.gradient} mr-4`}>
                      <facility.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{facility.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{facility.description}</p>
                  <ul className="space-y-3">
                    {facility.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Vibrant Community</h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of an exciting campus life that shapes your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-8 py-4 bg-white text-mvsr-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
              Explore Clubs
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-mvsr-600 transition-all duration-200 font-medium">
              View Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLife;
