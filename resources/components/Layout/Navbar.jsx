import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { Menu, X, User } from 'lucide-react';

// Add a scroll-to-top handler for all navigation links
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: isIOS() ? 'instant' : 'auto' // Use instant for iOS for better performance
  });
};

// Helper to detect iOS
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const Navbar = () => {
  const { isAuthenticated, user } = useUserStore();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if the current route is active
  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  const navItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Direktori', path: '/directory' },
    { label: 'Ulasan', path: '/testimonials' },
    { label: 'Tentang', path: '/about' },
  ];
  
  const authNavItems = [
    { label: 'Riwayat Survei', path: '/history' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" onClick={scrollToTop} className="flex items-center">
                <img 
                  className="block h-8 w-auto" 
                  src="/logo.png" 
                  alt="UIN Antasari Survey"
                />
                <span className="ml-2 font-bold text-xl font-display text-primary-800">
                  SurveyIN
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={scrollToTop}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActiveRoute(item.path)
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  {authNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={scrollToTop}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActiveRoute(item.path)
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
          
          {/* Desktop profile/login button */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <Link
                to="/profile"
                onClick={scrollToTop}
                className="flex items-center"
              >
                <span className="mr-2 text-sm font-medium text-primary-900">
                  {user?.name || 'User'}
                </span>
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-800">
                    {(user?.name || 'U').charAt(0)}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={scrollToTop}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile profile and hamburger */}
          <div className="flex items-center sm:hidden">
            {/* Mobile profile icon */}
            <Link
              to="/profile"
              onClick={scrollToTop}
              className="p-2 mr-1 rounded-full text-primary-600"
              aria-label={isAuthenticated ? "Profile" : "Login"}
            >
              {isAuthenticated ? (
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-800">
                    {(user?.name || 'U').charAt(0)}
                  </span>
                </div>
              ) : (
                <User className="h-6 w-6" />
              )}
            </Link>
            
            {/* Hamburger menu button */}
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  scrollToTop();
                  setIsMenuOpen(false);
                }}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActiveRoute(item.path)
                    ? 'border-primary-500 text-primary-700 bg-primary-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                {authNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      scrollToTop();
                      setIsMenuOpen(false);
                    }}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActiveRoute(item.path)
                        ? 'border-primary-500 text-primary-700 bg-primary-50'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 