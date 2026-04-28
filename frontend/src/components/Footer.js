import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GlobeAltIcon, 
  MailIcon, 
  PhoneIcon,
  AcademicCapIcon
} from '@heroicons/react/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Alumni Directory', href: '/alumni' },
    { name: 'Events', href: '/events' },
    { name: 'News & Updates', href: '/news' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Careers', href: '/careers' },
  ];

  const resources = [
    { name: 'Academics', href: '/academics' },
    { name: 'Student Life', href: '/student-life' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'FAQ', href: '/faq' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: GlobeAltIcon },
    { name: 'Twitter', href: '#', icon: GlobeAltIcon },
    { name: 'Instagram', href: '#', icon: GlobeAltIcon },
    { name: 'LinkedIn', href: '#', icon: GlobeAltIcon },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* College Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-mvsr-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold">MVSR Alumni</span>
            </div>
            <p className="text-gray-300 mb-4">
              Connecting MVSR Engineering College alumni worldwide. Building lasting relationships and fostering professional growth.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-mvsr-400 transition-colors duration-200"
                  aria-label={social.name}
                >
                  {React.createElement(social.icon, { className: "h-6 w-6" })}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-mvsr-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link
                    to={resource.href}
                    className="text-gray-300 hover:text-mvsr-400 transition-colors duration-200"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <GlobeAltIcon className="h-5 w-5 text-mvsr-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    MVSR Engineering College
                    <br />
                    Nadergul, Hyderabad
                    <br />
                    Telangana, India - 501510
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-mvsr-400 mr-3 flex-shrink-0" />
                <p className="text-gray-300">+91 40 2706 1234</p>
              </div>
              <div className="flex items-center">
                <MailIcon className="h-5 w-5 text-mvsr-400 mr-3 flex-shrink-0" />
                <p className="text-gray-300">alumni@mvsrec.edu.in</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
              <p className="text-gray-300">
                Subscribe to our newsletter for the latest updates and events.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors duration-200 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © {currentYear} MVSR Engineering College Alumni Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
