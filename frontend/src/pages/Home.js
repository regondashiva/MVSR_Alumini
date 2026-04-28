import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  BriefcaseIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckIcon
} from '@heroicons/react/outline';

const Home = () => {
  const [stats, setStats] = useState({
    alumni: 15000,
    students: 5000,
    faculty: 500,
    placements: 95
  });

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: 'Rahul Kumar',
      batch: '2015',
      position: 'Senior Software Engineer',
      company: 'Microsoft',
      image: '/api/placeholder/100/100',
      message: 'MVSR provided me with the foundation I needed to succeed in my career. The alumni network has been invaluable for professional growth.'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      batch: '2018',
      position: 'Product Manager',
      company: 'Google',
      image: '/api/placeholder/100/100',
      message: 'The quality of education and the supportive environment at MVSR helped me achieve my dreams. Proud to be an MVSRian!'
    },
    {
      id: 3,
      name: 'Amit Reddy',
      batch: '2012',
      position: 'CTO',
      company: 'TechStart',
      image: '/api/placeholder/100/100',
      message: 'The alumni network keeps us connected and helps us give back to the college. It\'s amazing to see how far we\'ve all come.'
    }
  ]);

  const [features, setFeatures] = useState([
    {
      icon: UserGroupIcon,
      title: 'Alumni Directory',
      description: 'Connect with thousands of MVSR graduates worldwide. Find mentors, collaborators, and friends from your batch.',
      link: '/alumni'
    },
    {
      icon: CalendarIcon,
      title: 'Events & Reunions',
      description: 'Stay updated on alumni events, reunions, and networking opportunities. Never miss a chance to reconnect.',
      link: '/events'
    },
    {
      icon: BriefcaseIcon,
      title: 'Career Opportunities',
      description: 'Explore job openings, internships, and career guidance from fellow alumni and industry partners.',
      link: '/careers'
    },
    {
      icon: StarIcon,
      title: 'Success Stories',
      description: 'Get inspired by the achievements and success stories of our distinguished alumni across various fields.',
      link: '/success-stories'
    },
    {
      icon: PlayIcon,
      title: 'Resource Library',
      description: 'Access study materials, research papers, and professional development resources.'
    }
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to MVSR Alumni Network
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
              Connect, Collaborate, and Grow with Your MVSR Family Worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-mvsr-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center"
              >
                Join Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/alumni"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-mvsr-600 transition-colors duration-200"
              >
                Explore Alumni
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-mvsr-600 mb-2">
                {stats.alumni.toLocaleString()}+
              </div>
              <div className="text-gray-600">Alumni</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-mvsr-600 mb-2">
                {stats.students.toLocaleString()}+
              </div>
              <div className="text-gray-600">Current Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-mvsr-600 mb-2">
                {stats.faculty}+
              </div>
              <div className="text-gray-600">Faculty Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-mvsr-600 mb-2">
                {stats.placements}%
              </div>
              <div className="text-gray-600">Placement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Connected with Your MVSR Family
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering You to Connect, Share, and Succeed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-mvsr-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <feature.icon className="h-8 w-8 text-mvsr-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {feature.description}
                </p>
                <div className="text-center">
                  <Link
                    to={feature.link}
                    className="inline-flex items-center text-mvsr-600 font-semibold hover:text-mvsr-700"
                  >
                    Learn More
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Alumni Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our successful graduates around the world
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.position} at {testimonial.company}</p>
                    <p className="text-xs text-mvsr-600">Batch of {testimonial.batch}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "{testimonial.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Our Alumni Network?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Become part of our growing community and connect with thousands of MVSR graduates worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-mvsr-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center"
            >
              Join Now
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/alumni"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-mvsr-600 transition-colors duration-200"
            >
              Explore Alumni
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
