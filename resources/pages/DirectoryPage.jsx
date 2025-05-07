import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Star, ChevronDown, Clock, MapPin, Sliders, AlertCircle, GraduationCap, ClipboardList, Stethoscope, Wallet, Library, Laptop, Users, Microscope, Building2, Briefcase, TrendingUp, LineChart, BarChart4, BookOpen, Book, Camera, FileText, HandshakeIcon, Presentation, Award, Lightbulb, FlaskConical, Globe, Newspaper, Megaphone, BanknoteIcon, CoinsIcon, CircleDollarSign, RotateCcw } from 'lucide-react';
import { useDirectoryStore } from '../store/directoryStore';

const DirectoryPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    facultyFilter,
    setFacultyFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    sortOrder,
    setSorting,
    getFilteredServices,
    getFaculties,
    getCategories,
    isServiceFavorite,
    toggleFavorite,
    isServiceCompleted,
  } = useDirectoryStore();

  // Local state for filters UI
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  // Update local state when store changes
  useEffect(() => {
    setFilteredServices(getFilteredServices());
    setFaculties(getFaculties());
    setCategories(getCategories());
  }, [searchQuery, facultyFilter, categoryFilter, sortBy, sortOrder, getFilteredServices, getFaculties, getCategories]);

  // Toggle filters panel on mobile
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFacultyFilter('all');
    setCategoryFilter('all');
    setSorting('name', 'asc');
    
    // Focus search input after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Change sort order
  const handleSortChange = (e) => {
    const value = e.target.value;
    
    switch (value) {
      case 'name-asc':
        setSorting('name', 'asc');
        break;
      case 'name-desc':
        setSorting('name', 'desc');
        break;
      case 'faculty-asc':
        setSorting('faculty', 'asc');
        break;
      case 'category-asc':
        setSorting('category', 'asc');
        break;
      default:
        setSorting('name', 'asc');
    }
  };
  
  // Improve the getServiceGradient function to create more distinct colors
  // IMPORTANT: Core hue selection logic stays in sync with ServiceDetailPage.jsx
  // but using brighter pastel colors for the thumbnails
  const getServiceGradient = (serviceName) => {
    // Simple hash function for string
    const hash = serviceName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Generate distinct hue based on name
    // Use a preset list of well-spaced hues and select based on name hash
    const huePresets = [
      15,    // Orange-red
      45,    // Yellow-orange
      75,    // Yellow-green
      105,   // Green
      135,   // Teal
      165,   // Cyan
      195,   // Light blue
      225,   // Blue
      255,   // Purple-blue
      285,   // Purple
      315,   // Pink
      345    // Red-pink
    ];
    
    // Select hue from presets based on hash
    const hue = huePresets[Math.abs(hash) % huePresets.length];
    
    // Add a small random offset to create more variation
    const hueOffset = ((hash % 10) - 5);
    const finalHue = (hue + hueOffset) % 360;
    
    // Generate brighter, softer pastel gradients for thumbnails
    return {
      from: `hsl(${finalHue}, 85%, 75%)`,  // Brighter, softer pastel start color
      to: `hsl(${finalHue}, 45%, 55%)`,    // Slightly deeper end color for dimension
    };
  };

  // Generate icon based on service category or name
  const getServiceIcon = (service) => {
    const category = service.category.toLowerCase();
    const name = service.name.toLowerCase();
    
    // Define color style
    const iconClass = `text-white w-10 h-10`;
    
    // Check for specific service names first
    if (name.includes('keuangan')) return <BanknoteIcon className={iconClass} />;
    if (name.includes('kehumasan')) return <Globe className={iconClass} />;
    if (name.includes('kerjasama')) return <HandshakeIcon className={iconClass} />;
    if (name.includes('lp2m')) return <FlaskConical className={iconClass} />;
    if (name.includes('lpm')) return <Award className={iconClass} />;
    if (name.includes('perpustakaan') || name.includes('library')) return <BookOpen className={iconClass} />;
    if (name.includes('umum')) return <Building2 className={iconClass} />;
    if (name.includes('mahad') || name.includes('al jamiah')) return <Building2 className={iconClass} />;
    if (name.includes('upkk')) return <TrendingUp className={iconClass} />;
    
    // Then check categories
    if (category.includes('keuangan')) return <BanknoteIcon className={iconClass} />;
    if (category.includes('humas') || category.includes('publikasi')) return <Globe className={iconClass} />;
    if (category.includes('kerjasama')) return <HandshakeIcon className={iconClass} />;
    if (category.includes('penelitian')) return <FlaskConical className={iconClass} />;
    if (category.includes('pengembangan') && category.includes('akademik')) return <Award className={iconClass} />;
    if (category.includes('perpustakaan') || category.includes('library')) return <BookOpen className={iconClass} />;
    if (category.includes('akademik')) return <GraduationCap className={iconClass} />;
    if (category.includes('administrasi')) return <ClipboardList className={iconClass} />;
    if (category.includes('kesehatan')) return <Stethoscope className={iconClass} />;
    if (category.includes('teknologi')) return <Laptop className={iconClass} />;
    if (category.includes('humas')) return <Users className={iconClass} />;
    
    // Default icon based on first letter with improved styling
    return (
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 bg-white/20 rounded-full"></div>
        <span className="text-white text-3xl font-bold relative z-10">
          {service.name.charAt(0)}
        </span>
      </div>
    );
  };

  return (
    <div className="pt-32 pb-8 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 max-w-4xl"
      >
        <h1 className="text-4xl font-display font-bold text-secondary-900 sm:text-5xl tracking-tight">
          Unit Layanan UIN Antasari Banjarmasin
        </h1>
        <p className="mt-3 text-xl text-secondary-600 max-w-3xl">
          Silakan memilih layanan yang ingin Anda akses
        </p>
      </motion.div>

      {/* Search and filter bar */}
      <div className="mb-10 max-w-6xl">
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div 
            className={`relative flex-grow transition-all duration-300`}
            animate={{ 
              scale: isSearchFocused ? 1.005 : 1,
              y: isSearchFocused ? -1 : 0
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Search 
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300
                ${isSearchFocused ? 'text-primary-600 scale-110' : 'text-secondary-400'}`}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari layanan kampus..."
              className={`py-3.5 px-12 w-full rounded-full border-2 text-lg
                ${isSearchFocused 
                  ? 'border-primary-400 shadow-lg shadow-primary-300/20 outline-none ring-2 ring-primary-300/30' 
                  : 'border-secondary-200 shadow-md hover:border-primary-300/70 hover:shadow-lg'
                }
                bg-white/90 backdrop-blur-md transition-all duration-300`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-secondary-500 hover:text-secondary-700 
                  bg-secondary-100 hover:bg-secondary-200 rounded-full flex items-center justify-center 
                  transition-all hover:shadow-sm"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </motion.button>
            )}
          </motion.div>
          
          <motion.button
            className="btn-filters bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl 
              py-3.5 px-5 shadow-sm flex items-center lg:w-48 justify-center gap-2 transition-all duration-300 lg:hidden
              hover:shadow-md hover:from-primary-100 hover:to-primary-200 active:shadow-inner"
            onClick={toggleFilters}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div
              animate={{ 
                rotate: isFiltersOpen ? 180 : 0,
                scale: isFiltersOpen ? 1.1 : 1
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sliders size={18} className="mr-2 text-primary-600" />
            </motion.div>
            <span className="font-medium text-primary-700">Filter & Urutkan</span>
            <motion.div
              animate={{ 
                rotate: isFiltersOpen ? 180 : 0,
                y: isFiltersOpen ? 2 : 0
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChevronDown size={16} className="ml-1 text-primary-600" />
            </motion.div>
          </motion.button>
          
          <div className="hidden lg:flex items-center gap-3">
            <motion.div 
              className="relative group" 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <select
                className="appearance-none pl-4 pr-10 py-3.5 rounded-full border-2 border-secondary-200 
                  bg-white/90 backdrop-blur-sm shadow-md text-secondary-800 
                  focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-300/30
                  cursor-pointer hover:border-primary-300/70 group-hover:shadow-lg
                  transition-all duration-300"
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                aria-label="Filter by faculty"
              >
                {faculties.map((faculty) => (
                  <option key={faculty.value} value={faculty.value}>
                    {faculty.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full 
                bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-all duration-300">
                <ChevronDown
                  size={14}
                  className="text-primary-600 group-hover:text-primary-700"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="relative group" 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <select
                className="appearance-none pl-4 pr-10 py-3.5 rounded-full border-2 border-secondary-200 
                  bg-white/90 backdrop-blur-sm shadow-md text-secondary-800 
                  focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-300/30
                  cursor-pointer hover:border-primary-300/70 group-hover:shadow-lg
                  transition-all duration-300"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full 
                bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-all duration-300">
                <ChevronDown
                  size={14}
                  className="text-primary-600 group-hover:text-primary-700"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="relative group" 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <select
                className="appearance-none pl-4 pr-10 py-3.5 rounded-full border-2 border-secondary-200 
                  bg-white/90 backdrop-blur-sm shadow-md text-secondary-800 
                  focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-300/30
                  cursor-pointer hover:border-primary-300/70 group-hover:shadow-lg
                  transition-all duration-300"
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
                aria-label="Sort by"
              >
                <option value="name-asc">Nama (A-Z)</option>
                <option value="name-desc">Nama (Z-A)</option>
                <option value="faculty-asc">Fakultas</option>
                <option value="category-asc">Kategori</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full 
                bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-all duration-300">
                <ChevronDown
                  size={14}
                  className="text-primary-600 group-hover:text-primary-700"
                />
              </div>
            </motion.div>
            
            {(searchQuery || facultyFilter !== 'all' || categoryFilter !== 'all' || sortBy !== 'name' || sortOrder !== 'asc') && (
              <motion.button
                className="py-1 px-5 flex items-center text-red-600 hover:text-red-700 rounded-full 
                  bg-red-50 hover:bg-red-100 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-red-200"
                onClick={clearFilters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <RotateCcw size={15} className="mr-1.5 animate-pulse-slow" />
                <span className="font-medium">Reset Filter</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Mobile filters panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            className="mb-8 lg:hidden space-y-5 bg-white p-6 rounded-2xl 
              shadow-xl border-2 border-primary-100 relative overflow-hidden z-10"
          >
            {/* Decorative gradients */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary-50/50 blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary-50/50 blur-xl"></div>
            
            <motion.div 
              className="flex justify-between items-center mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-secondary-800">Filter & Urutkan</h3>
              <button 
                className="text-secondary-500 hover:text-secondary-700 p-1 rounded-full hover:bg-secondary-100"
                onClick={toggleFilters}
              >
                <X size={20} />
              </button>
            </motion.div>
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="text-sm font-semibold text-secondary-700 block flex items-center">
                <Building className="w-4 h-4 mr-2 text-primary-500" />
                Fakultas
              </label>
              <div className="relative group">
                <select
                  className="w-full appearance-none pl-5 pr-12 py-3.5 rounded-xl 
                    border-2 border-secondary-200 bg-white 
                    focus:outline-none focus:ring-2 focus:border-primary-300 focus:ring-primary-300/30
                    group-hover:border-primary-200 transition-all duration-300 font-medium"
                  value={facultyFilter}
                  onChange={(e) => setFacultyFilter(e.target.value)}
                >
                  {faculties.map((faculty) => (
                    <option key={faculty.value} value={faculty.value}>
                      {faculty.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full 
                  bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-all duration-300">
                  <ChevronDown
                    size={16}
                    className="text-primary-600 group-hover:text-primary-700 transform transition-transform duration-300 
                     group-hover:translate-y-0.5"
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-sm font-semibold text-secondary-700 block flex items-center">
                <Sliders className="w-4 h-4 mr-2 text-primary-500" />
                Kategori
              </label>
              <div className="relative group">
                <select
                  className="w-full appearance-none pl-5 pr-12 py-3.5 rounded-xl 
                    border-2 border-secondary-200 bg-white 
                    focus:outline-none focus:ring-2 focus:border-primary-300 focus:ring-primary-300/30
                    group-hover:border-primary-200 transition-all duration-300 font-medium"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full 
                  bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-all duration-300">
                  <ChevronDown
                    size={16}
                    className="text-primary-600 group-hover:text-primary-700 transform transition-transform duration-300 
                     group-hover:translate-y-0.5"
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="text-sm font-semibold text-secondary-700 block flex items-center">
                <ArrowDown className="w-4 h-4 mr-2 text-primary-500" />
                Urutan
              </label>
              <div className="relative group">
                <select
                  className="w-full appearance-none pl-5 pr-12 py-3.5 rounded-xl 
                    border-2 border-secondary-200 bg-white 
                    focus:outline-none focus:ring-2 focus:border-primary-300 focus:ring-primary-300/30
                    group-hover:border-primary-200 transition-all duration-300 font-medium"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={handleSortChange}
                >
                  <option value="name-asc">Nama (A-Z)</option>
                  <option value="name-desc">Nama (Z-A)</option>
                  <option value="faculty-asc">Fakultas</option>
                  <option value="category-asc">Kategori</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full 
                  bg-primary-100 group-hover:bg-primary-200 flex items-center justify-center transition-all duration-300">
                  <ChevronDown
                    size={16}
                    className="text-primary-600 group-hover:text-primary-700 transform transition-transform duration-300 
                     group-hover:translate-y-0.5"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Add Reset button in mobile view */}
            {(searchQuery || facultyFilter !== 'all' || categoryFilter !== 'all' || sortBy !== 'name' || sortOrder !== 'asc') && (
              <motion.button
                className="w-full mt-4 py-3.5 px-5 flex items-center justify-center text-red-600 hover:text-red-700 rounded-xl
                  bg-red-50 hover:bg-red-100 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-red-200"
                onClick={() => {
                  clearFilters();
                  toggleFilters();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <RotateCcw size={16} className="mr-2 animate-pulse-slow" />
                <span className="font-medium">Reset Semua Filter</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Results count */}
      <motion.div 
        className="mb-6 text-secondary-600 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="py-1 px-3 bg-secondary-100 rounded-full text-secondary-700 font-medium text-sm">
          {filteredServices.length} layanan ditemukan
        </div>
      </motion.div>
      
      {/* Service cards - consistent grid layout for improved readability */}
      {filteredServices.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredServices.map((service, index) => {
            const gradient = getServiceGradient(service.name);
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4,
                  delay: Math.min(index * 0.05, 0.3)
                }}
                whileHover={{ 
                  y: -4,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                  transition: { duration: 0.2 }
                }}
                className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl border border-secondary-100 transition-all duration-300"
              >
                <Link to={`/service/${service.id}`} className="flex flex-col h-full">
                  {/* Color Banner with Service Icon */}
                  <div 
                    className="h-40 flex relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                    }}
                  >
                    {/* Background effects */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 bg-white"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-20 bg-white"></div>
                    
                    {/* Service icon with 3D effect */}
                    <div className="m-auto relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                      {getServiceIcon(service)}
                    </div>
                    
                    {/* Favorite button */}
                    <button
                      className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm
                        hover:shadow-md transition-all duration-300"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(service.id);
                      }}
                      aria-label={isServiceFavorite(service.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Star
                        size={18}
                        className={`${
                          isServiceFavorite(service.id)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-secondary-300 hover:text-secondary-400'
                        } transition-colors duration-300`}
                      />
                    </button>
                    
                    {/* Completion badge */}
                    {isServiceCompleted(service.id) && (
                      <div className="absolute left-4 top-4 z-10 py-1 px-2.5 rounded-full
                        bg-green-500/80 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        <span>Sudah Disurvei</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-medium text-secondary-900 
                      group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 mb-2">
                      {service.name}
                    </h3>
                    
                    <p className="text-sm text-secondary-600 line-clamp-3 mb-4 flex-grow">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-start">
                        <MapPin size={16} className="mt-0.5 mr-2.5 flex-shrink-0 text-primary-500" />
                        <span className="text-sm text-secondary-700 line-clamp-1">
                          {service.location}
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock size={16} className="mt-0.5 mr-2.5 flex-shrink-0 text-primary-500" />
                        <span className="text-sm text-secondary-700 line-clamp-1">
                          {service.operationalHours}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-secondary-100">
                      <span className="text-xs bg-secondary-100 text-secondary-800 py-1 px-2 rounded-full">
                        {service.faculty}
                      </span>
                      <span className="text-xs bg-primary-100 text-primary-800 py-1 px-2 rounded-full">
                        {service.category}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div 
          className="py-16 flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-secondary-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center max-w-md">
            <AlertCircle size={52} className="mx-auto mb-4 text-secondary-300" strokeWidth={1.5} />
            <h3 className="text-xl font-medium text-secondary-900 mb-2">
              Tidak ada layanan yang ditemukan
            </h3>
            <p className="text-secondary-600 mb-6">
              Coba ubah kata kunci pencarian atau filter Anda untuk menemukan layanan yang sesuai.
            </p>
            <motion.button
              className="mx-auto py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl
                shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center"
              onClick={clearFilters}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <X size={16} className="mr-2" />
              Reset Filter
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DirectoryPage; 