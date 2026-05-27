import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MenuIcon, 
  XIcon, 
  UserCircleIcon,
  AcademicCapIcon,
  PhotographIcon,
  CalendarIcon,
  HeartIcon,
  PhoneIcon,
  ChevronDownIcon,
  SupportIcon,
  ChartBarIcon
} from '@heroicons/react/outline';
import RoleBadge from './RoleBadge';
import ApprovalNotifications from './ApprovalNotifications';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [academicsDropdown, setAcademicsDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const navigation = [
    { name: 'Home', href: '/', icon: AcademicCapIcon },
    { name: 'Alumni+', href: '/alumni', icon: UserCircleIcon },
    { name: 'Events', href: '/events', icon: CalendarIcon },
    { name: 'Gallery', href: '/gallery', icon: PhotographIcon },
    { name: 'Academics', href: '/academics', icon: AcademicCapIcon },
    { name: 'Student Life', href: '/student-life', icon: HeartIcon },
    { name: 'Help Desk', href: '/help-desk-enhanced', icon: SupportIcon },
    { name: 'Contact', href: '/contact', icon: PhoneIcon },
    ...(user?.role === 'admin' ? [{ name: 'User Statistics', href: '/user-statistics', icon: ChartBarIcon }] : [])
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-mvsr-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                MVSR Alumni
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.name === 'Academics' ? (
                  <>
                    <button
                      onClick={() => setAcademicsDropdown(!academicsDropdown)}
                      className={`px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${
                        isActive(item.href)
                          ? 'text-mvsr-600 bg-mvsr-50'
                          : 'text-gray-700 hover:text-mvsr-600 hover:bg-mvsr-50'
                      }`}
                    >
                      {item.name}
                      <ChevronDownIcon className="h-3 w-3 ml-1" />
                    </button>
                    {academicsDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <Link
                          to="/academics"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-mvsr-600"
                          onClick={() => setAcademicsDropdown(false)}
                        >
                          Academics
                        </Link>
                        <Link
                          to="/news"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-mvsr-600"
                          onClick={() => setAcademicsDropdown(false)}
                        >
                          News
                        </Link>
                        <Link
                          to="/careers"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-mvsr-600"
                          onClick={() => setAcademicsDropdown(false)}
                        >
                          Careers
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-mvsr-600 bg-mvsr-50'
                        : 'text-gray-700 hover:text-mvsr-600 hover:bg-mvsr-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Admin Notifications */}
                {user.role === 'admin' && (
                  <ApprovalNotifications onApprovalUpdate={() => {}} />
                )}
                
                {/* User Info with Role Badge */}
                <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.firstName}
                    </p>
                  </div>
                  <RoleBadge role={user.role} size="sm" />
                </div>
                
                <Link
                  to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                  className="text-gray-700 hover:text-mvsr-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-mvsr-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-mvsr-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-mvsr-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-mvsr-600 hover:text-mvsr-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-mvsr-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-mvsr-700 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-mvsr-600 hover:bg-mvsr-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mvsr-500"
            >
              {isOpen ? (
                <XIcon className="block h-6 w-6" />
              ) : (
                <MenuIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.name === 'Academics' ? (
                  <>
                    <div
                      className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-mvsr-600 bg-mvsr-50'
                          : 'text-gray-700 hover:text-mvsr-600 hover:bg-mvsr-50'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </div>
                    <div className="pl-8 space-y-1">
                      <Link
                        to="/academics"
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-mvsr-600 hover:bg-mvsr-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Academics
                      </Link>
                      <Link
                        to="/news"
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-mvsr-600 hover:bg-mvsr-50"
                        onClick={() => setIsOpen(false)}
                      >
                        News
                      </Link>
                      <Link
                        to="/careers"
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-mvsr-600 hover:bg-mvsr-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Careers
                      </Link>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-mvsr-600 bg-mvsr-50'
                        : 'text-gray-700 hover:text-mvsr-600 hover:bg-mvsr-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              {user ? (
                <>
                  <Link
                    to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-mvsr-600 hover:bg-mvsr-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-mvsr-600 hover:bg-mvsr-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-mvsr-600 hover:bg-mvsr-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-mvsr-600 hover:bg-mvsr-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-mvsr-600 hover:bg-mvsr-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
