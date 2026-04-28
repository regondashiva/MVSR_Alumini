import React, { useState } from 'react';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/outline';

const Academics = () => {
  const [activeTab, setActiveTab] = useState('programs');

  const programs = [
    {
      name: 'Computer Science Engineering (CSE)',
      duration: '4 Years',
      seats: '120',
      accreditation: 'NBA Accredited',
      description: 'Focus on software development, algorithms, data structures, and modern computing technologies.',
      highlights: ['AI & Machine Learning', 'Cloud Computing', 'Cybersecurity', 'Full Stack Development']
    },
    {
      name: 'Electronics & Communication Engineering (ECE)',
      duration: '4 Years',
      seats: '120',
      accreditation: 'NBA Accredited',
      description: 'Study electronic circuits, communication systems, and embedded systems design.',
      highlights: ['VLSI Design', 'Digital Signal Processing', 'Wireless Communication', 'IoT Systems']
    },
    {
      name: 'Electrical & Electronics Engineering (EEE)',
      duration: '4 Years',
      seats: '60',
      accreditation: 'NBA Accredited',
      description: 'Power systems, electrical machines, and renewable energy technologies.',
      highlights: ['Power Systems', 'Renewable Energy', 'Industrial Automation', 'Smart Grid']
    },
    {
      name: 'Information Technology (IT)',
      duration: '4 Years',
      seats: '60',
      accreditation: 'NBA Accredited',
      description: 'Information systems, network security, and enterprise applications.',
      highlights: ['Network Security', 'Database Management', 'Web Technologies', 'DevOps']
    },
    {
      name: 'Mechanical Engineering (MECH)',
      duration: '4 Years',
      seats: '60',
      accreditation: 'NBA Accredited',
      description: 'Mechanical design, thermal engineering, and manufacturing processes.',
      highlights: ['CAD/CAM', 'Thermal Engineering', 'Robotics', 'Automotive Engineering']
    },
    {
      name: 'Civil Engineering (CIVIL)',
      duration: '4 Years',
      seats: '60',
      accreditation: 'NBA Accredited',
      description: 'Structural design, transportation engineering, and construction management.',
      highlights: ['Structural Analysis', 'Transportation Engineering', 'Environmental Engineering', 'Smart Cities']
    }
  ];

  const facilities = [
    {
      name: 'Digital Library',
      icon: BookOpenIcon,
      description: 'Access to thousands of e-books, journals, and research papers 24/7.',
      features: ['E-Books Collection', 'Research Journals', 'Study Materials', 'Question Banks']
    },
    {
      name: 'Virtual Labs',
      icon: AcademicCapIcon,
      description: 'State-of-the-art virtual laboratories for practical learning.',
      features: ['ICT Enabled Labs', 'Remote Access', 'Simulation Tools', 'Practical Training']
    },
    {
      name: 'Smart Classrooms',
      icon: UserGroupIcon,
      description: 'Modern classrooms equipped with digital teaching aids.',
      features: ['Interactive Boards', 'Projectors', 'Audio Systems', 'WiFi Connectivity']
    },
    {
      name: 'Online Learning',
      icon: ClockIcon,
      description: 'Access to online courses and learning materials.',
      features: ['Swayam Platform', 'MOOCs', 'Video Lectures', 'Online Assessments']
    }
  ];

  const achievements = [
    {
      title: 'NBA Accreditation',
      description: 'All programs are NBA accredited ensuring quality education standards.',
      icon: CheckCircleIcon
    },
    {
      title: 'Excellent Placement Record',
      description: 'Consistent 90%+ placement rate with top companies.',
      icon: CheckCircleIcon
    },
    {
      title: 'Research Excellence',
      description: 'Active research programs with funded projects and publications.',
      icon: CheckCircleIcon
    },
    {
      title: 'Industry Collaboration',
      description: 'Strong partnerships with leading industries for internships and training.',
      icon: CheckCircleIcon
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Academics</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Discover our comprehensive academic programs designed to build future-ready engineers
              with strong theoretical foundations and practical skills.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 border-b">
            {['programs', 'facilities', 'achievements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
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
        {activeTab === 'programs' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Engineering Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                  <div className="flex items-center mb-4">
                    <AcademicCapIcon className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                      <span className="text-sm text-green-600 font-medium">{program.accreditation}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{program.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Seats:</span>
                      <span className="font-medium">{program.seats}</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Key Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {program.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Academic Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {facilities.map((facility, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <facility.icon className="h-10 w-10 text-blue-600 mr-4" />
                    <h3 className="text-xl font-semibold text-gray-900">{facility.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{facility.description}</p>
                  <ul className="space-y-2">
                    {facility.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Academic Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start">
                    <achievement.icon className="h-8 w-8 text-green-600 mr-4 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                      <p className="text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join MVSR?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey towards becoming a successful engineer with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Apply Now
            </button>
            <button className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium">
              Download Brochure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academics;
