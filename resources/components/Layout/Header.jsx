import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ChevronDown, Settings, History } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

// Get default avatar based on gender
const getDefaultAvatar = (user) => {
  // Check for gender in user object - could be stored in different ways
  const gender = user?.gender?.toLowerCase() || 
                user?.sex?.toLowerCase() || 
                '';
  
  // Return appropriate image based on gender
  if (gender === 'female' || gender === 'f') {
    return '/profile_picture_female.png';
  } else {
    // Default to male avatar if gender is male or unspecified
    return '/profile_picture_male.png';
  }
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useUserStore();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Get default avatar for current user
  const defaultAvatar = getDefaultAvatar(user);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if the current route matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/45 backdrop-blur-lg shadow-sm py-2 border-b border-white/20' 
          : 'bg-white/45 backdrop-blur-md py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and site name */}
          <Link to="/" className="flex items-center group">
            <div className="relative overflow-hidden rounded-lg p-0.5 transition-all duration-300 group-hover:scale-105">
              <img
                className="h-12 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105"
                src="/logo_uin.png"
                alt="UIN Antasari Logo"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-primary-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-display font-semibold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-primary-700 group-hover:to-primary-500">
                Survey UIN Antasari
              </h1>
              <p className="text-xs text-secondary-500">
                Sistem Survei dan Direktori Layanan
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-2">
            <NavLink to="/" isActive={isActive('/')}>
              Beranda
            </NavLink>
            <NavLink to="/directory" isActive={isActive('/directory')}>
              Direktori Layanan
            </NavLink>
            <NavLink to="/about" isActive={isActive('/about')}>
              Tentang
            </NavLink>
            
            {isAuthenticated ? (
              <div className="relative ml-2">
                <button 
                  className={`flex items-center text-secondary-800 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 
                    ${isProfileOpen 
                      ? 'bg-primary-100/70 backdrop-blur-sm shadow-sm' 
                      : 'hover:bg-white/30 hover:backdrop-blur-sm hover:shadow-sm'
                    }`}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onBlur={() => setTimeout(() => setIsProfileOpen(false), 100)}
                >
                  <Avatar className="w-8 h-8 mr-2 ring-2 ring-white/70 ring-offset-1 transition-all hover:ring-primary-100 hover:scale-105">
                    <AvatarImage 
                      src={user?.profileImage || defaultAvatar} 
                      alt={user?.name || "User profile"} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary-600 to-primary-800 text-white font-medium text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate max-w-[80px]">
                    {user?.name ? user.name.split(' ')[0] : 'User'}
                  </span>
                  <ChevronDown size={16} className={`ml-1 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      className="absolute right-0 w-72 mt-2 origin-top-right bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden z-20"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 border-b border-gray-100/80 bg-gray-50/50">
                        <div className="flex items-center gap-1">
                          <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-white/80 ring-offset-1">
                            <AvatarImage 
                              src={user?.profileImage || defaultAvatar} 
                              alt={user?.name || "User profile"} 
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-primary-600 to-primary-800 text-white font-medium">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="font-medium text-secondary-900 truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-secondary-500 break-words word-break">{user?.email || user?.role || 'user'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1 backdrop-blur-md">
                        <ProfileMenuItem to="/profile" icon={<User size={16} />}>
                          Profil Saya
                        </ProfileMenuItem>
                        <ProfileMenuItem to="/history" icon={<History size={16} />}>
                          Riwayat Survei
                        </ProfileMenuItem>
                        <button
                          onClick={logout}
                          className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 hover:backdrop-blur-sm transition-all duration-300"
                        >
                          <LogOut size={16} className="mr-2" /> Keluar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-3 text-white bg-gradient-to-r from-primary-600/90 to-primary-800/90 hover:from-primary-700 hover:to-primary-900 backdrop-blur-sm px-5 py-2 text-sm font-medium rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Masuk
              </Link>
            )}
          </nav>

          {/* Mobile header controls */}
          <div className="flex items-center md:hidden">
            {/* Mobile profile icon */}
            {isAuthenticated ? (
              <Link to="/profile" className="mr-2">
                <Avatar className="w-8 h-8 ring-2 ring-white/70 ring-offset-1 transition-all hover:ring-primary-100">
                  <AvatarImage 
                    src={user?.profileImage || defaultAvatar} 
                    alt={user?.name || "User profile"} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary-600 to-primary-800 text-white font-medium text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="mr-2 w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
              >
                <User size={18} />
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-secondary-700 hover:bg-white/30 hover:backdrop-blur-sm hover:shadow-sm focus:outline-none transition-all duration-300"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/80 backdrop-blur-md border-t border-white/20 mt-2"
          >
            <div className="space-y-1 px-4 py-3">
              <MobileNavLink to="/" isActive={isActive('/')} onClick={closeMenu}>
                Beranda
              </MobileNavLink>
              <MobileNavLink to="/directory" isActive={isActive('/directory')} onClick={closeMenu}>
                Direktori Layanan
              </MobileNavLink>
              <MobileNavLink to="/about" isActive={isActive('/about')} onClick={closeMenu}>
                Tentang
              </MobileNavLink>
              
              {isAuthenticated && (
                <MobileNavLink to="/history" isActive={isActive('/history')} onClick={closeMenu}>
                  Riwayat Survei
                </MobileNavLink>
              )}
              
              {/* Logout button for authenticated users */}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex w-full items-center px-4 py-3 mt-2 text-sm text-red-600 hover:bg-red-50/80 rounded-lg"
                >
                  <LogOut size={16} className="mr-2" /> Keluar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Desktop navigation link
const NavLink = ({ to, isActive, children }) => {
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
        isActive 
          ? 'text-primary-800 bg-white/30 backdrop-blur-sm shadow-sm' 
          : 'text-secondary-800 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-sm'
      }`}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Bottom indicator line */}
      {isActive && (
        <span className="absolute left-3 right-3 bottom-1 h-0.5 bg-gradient-to-r from-primary-500/80 to-primary-700/80 rounded-full"></span>
      )}
    </Link>
  );
};

// Mobile navigation link
const MobileNavLink = ({ to, isActive, onClick, children }) => {
  return (
    <Link
      to={to}
      className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
        isActive 
          ? 'text-primary-800 bg-white/30 backdrop-blur-sm' 
          : 'text-secondary-800 hover:bg-white/20 hover:backdrop-blur-sm'
      }`}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Bottom indicator line */}
      {isActive && (
        <span className="absolute left-4 right-4 bottom-1.5 h-0.5 bg-gradient-to-r from-primary-500/80 to-primary-700/80 rounded-full"></span>
      )}
    </Link>
  );
};

// Profile menu item component
const ProfileMenuItem = ({ to, icon, children }) => {
  return (
    <Link to={to} className="flex items-center px-4 py-3 text-sm text-secondary-800 hover:bg-white/50 hover:backdrop-blur-sm transition-all duration-300">
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  );
};

export default Header; 