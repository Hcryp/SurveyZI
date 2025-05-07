import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useUserStore();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };
  
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.3,
        when: "afterChildren",
      }
    }
  };
  
  const linkClassName = (isActive) => `
    relative px-3 py-2 text-sm font-medium transition-colors duration-300
    ${isActive 
      ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary-500 after:rounded-full'
      : 'text-secondary-700 hover:text-primary-600'
    }
  `;
  
  const isActive = (path) => location.pathname === path;
  
  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Direktori Layanan', path: '/direktori' },
    { name: 'Tentang', path: '/tentang' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2 bg-white/90 backdrop-blur-md shadow-sm' : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-9 w-9 relative">
            <motion.img 
              src="/logo_uin.png" 
              alt="UIN Antasari Logo" 
              className="h-full w-full object-contain"
              initial={{ rotate: -5 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
            />
            <motion.div 
              className="absolute inset-0 bg-primary-500/10 rounded-full -z-10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="font-jakarta font-bold text-lg tracking-tight bg-gradient-to-r from-primary-800 to-primary-700 bg-clip-text text-transparent">
              Survey UIN Antasari
            </h1>
            <p className="text-[10px] text-secondary-500 -mt-1 font-jakarta">
              Sistem Survei dan Direktori Layanan
            </p>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <motion.ul 
            className="flex space-x-1" 
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link) => (
              <motion.li key={link.path} variants={itemVariants}>
                <Link 
                  to={link.path} 
                  className={linkClassName(isActive(link.path))}
                >
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </nav>
        
        {/* Auth Button */}
        <div className="hidden md:block">
          {isAuthenticated ? (
            <div className="flex items-center">
              <motion.div 
                className="relative"
                initial={false}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button 
                  className="flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-xl text-white bg-gradient-3d-blue shadow-button-3d hover:shadow-button-3d-hover active:shadow-button-3d-active active:translate-y-1 transition-all duration-200 transform font-jakarta"
                  onClick={logout}
                >
                  <User size={16} />
                  <span>Keluar</span>
                </button>
              </motion.div>
            </div>
          ) : (
            <motion.div 
              initial={false}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-xl text-white bg-gradient-3d-blue shadow-button-3d hover:shadow-button-3d-hover active:shadow-button-3d-active active:translate-y-1 transition-all duration-200 transform font-jakarta"
              >
                <User size={16} />
                <span>Masuk</span>
              </Link>
            </motion.div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <motion.button
            className="p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-secondary-100 text-secondary-700 hover:text-primary-500 focus:outline-none transition-colors shadow-sm"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden px-4 py-3 mt-1 bg-white/95 backdrop-blur-md shadow-lg border-t border-secondary-100 overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.ul className="space-y-1" variants={navVariants}>
              {navLinks.map((link) => (
                <motion.li key={link.path} variants={itemVariants}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg font-medium ${
                      isActive(link.path)
                        ? 'bg-primary-50/70 text-primary-600'
                        : 'text-secondary-700 hover:bg-secondary-50'
                    } transition-colors font-jakarta`}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
              
              {/* Mobile Auth Button */}
              <motion.div className="pt-2 pb-1" variants={itemVariants}>
                {isAuthenticated ? (
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium rounded-xl text-white bg-gradient-3d-blue shadow-button-3d hover:shadow-button-3d-hover active:shadow-button-3d-active active:translate-y-1 transition-all duration-200 transform font-jakarta"
                  >
                    <User size={16} />
                    <span>Keluar</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium rounded-xl text-white bg-gradient-3d-blue shadow-button-3d hover:shadow-button-3d-hover active:shadow-button-3d-active active:translate-y-1 transition-all duration-200 transform font-jakarta"
                  >
                    <User size={16} />
                    <span>Masuk</span>
                  </Link>
                )}
              </motion.div>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar; 