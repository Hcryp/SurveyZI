import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  ChevronRight,
  Share2,
  MessageSquare,
  FileEdit,
  Check,
  Home,
  Shield,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  GraduationCap, 
  ClipboardList, 
  Stethoscope, 
  Wallet, 
  Library, 
  Laptop, 
  Users, 
  Microscope,
  Building2,
  TrendingUp,
  BookOpen,
  Book,
  Camera, 
  FileText, 
  HandshakeIcon, 
  Presentation, 
  Award, 
  Lightbulb, 
  FlaskConical,
  Globe,
  Newspaper,
  Megaphone,
  BanknoteIcon,
  CoinsIcon,
  CircleDollarSign,
  ArrowDown,
  XCircle
} from 'lucide-react';
import { useDirectoryStore } from '../store/directoryStore';
import { useUserStore } from '../store/userStore';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getServiceById, isServiceFavorite, toggleFavorite, isServiceCompleted } = useDirectoryStore();
  const { isAuthenticated } = useUserStore();
  const [service, setService] = useState(null);
  const [qrHovered, setQrHovered] = useState(false);
  
  // Refs
  const pageRef = useRef(null);
  const qrWrapperRef = useRef(null);
  const headerRef = useRef(null);
  
  // Service data fetching
  useEffect(() => {
    const serviceData = getServiceById(id);
    
    if (serviceData) {
      document.title = `${serviceData.name} | UIN Antasari`;
      setService(serviceData);
    } else {
      navigate('/not-found');
    }
    
    return () => {
      document.title = 'UIN Antasari';
    };
  }, [id, getServiceById, navigate]);
  
  // Share function
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${service.name} | UIN Antasari`,
        text: `Informasi tentang layanan ${service.name} di UIN Antasari`,
        url: window.location.href
      }).catch(err => {
        console.error('Sharing failed:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link telah disalin ke clipboard');
    }
  };

  if (!service) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white/80 backdrop-blur-sm z-50">
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-8 border-gray-100 opacity-25"></div>
          <motion.div 
            className="w-24 h-24 rounded-full border-t-8 border-l-8 border-r-8 border-transparent border-t-primary-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-500 text-4xl font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            UIN
          </motion.div>
        </div>
      </div>
    );
  }

  // Update the getServiceGradient function to match DirectoryPage.jsx
  // IMPORTANT: Keep core gradient logic in sync with DirectoryPage.jsx
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
    
    // Return the same core gradients as DirectoryPage plus additional properties needed for detail page
    return {
      // Core gradient colors - MUST MATCH DirectoryPage.jsx
      from: `hsl(${finalHue}, 65%, 55%)`,  // Darker for better text contrast
      to: `hsl(${finalHue}, 75%, 45%)`,    // Even darker for gradient depth
      
      // Additional properties needed for ServiceDetailPage
      dark: `hsl(${finalHue}, 70%, 35%)`,  // Darker version for text and accents
      light: `hsl(${finalHue}, 50%, 94%)`, // Very soft light version
      muted: `hsl(${finalHue}, 30%, 96%)`, // Original muted color
      accent: `hsl(${finalHue}, 65%, 65%)` // Softer accent
    };
  };
  
  // Update the getServiceIcon function to use BanknoteIcon for Layanan Keuangan
  const getServiceIcon = (service, gradient) => {
    const category = service.category.toLowerCase();
    const name = service.name.toLowerCase();
    
    // Define color style using the gradient from getServiceGradient
    const iconClass = `w-10 h-10 text-white`;
    
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
    
    // Default icon based on first letter
    return <span className="text-white text-3xl font-bold">{service.name.charAt(0)}</span>;
  };

  const gradient = getServiceGradient(service.name);

  return (
    <motion.div 
      ref={pageRef}
      className="min-h-screen bg-gray-50 pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sticky Header with Progress Bar */}
      <div ref={headerRef} className="sticky top-0 z-40 w-full">
        <div className="bg-white/80 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link to="/" className="mr-2 text-gray-500 hover:text-gray-700">
                <Home size={18} />
              </Link>
              <ChevronRight size={14} className="mx-1 text-gray-400" />
              <Link to="/directory" className="mr-2 text-gray-500 hover:text-gray-700">
                Direktori
        </Link>
              <ChevronRight size={14} className="mx-1 text-gray-400" />
              <p className="font-medium text-gray-800 truncate max-w-[200px]">{service.name}</p>
              
              <div className="ml-auto flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-white shadow-sm border border-gray-100"
                  onClick={() => toggleFavorite(service.id)}
                  aria-label={isServiceFavorite(service.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star
                    size={18}
                    className={`transition-colors duration-300 ${
                      isServiceFavorite(service.id)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-400'
                    }`}
                  />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-white shadow-sm border border-gray-100"
                  onClick={handleShare}
                >
                  <Share2 size={18} className="text-gray-500" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Service Completed Notice */}
        {isServiceCompleted(service.id) && (
        <motion.div
            className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4 bg-blue-100 rounded-full p-2">
                  <Check size={18} className="text-blue-600" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-blue-800">Anda telah mengisi survei untuk layanan ini</h3>
                  <p className="text-sm text-blue-700 mt-0.5">Lihat hasil dan analisis penilaian Anda</p>
                </div>
                <Link
                  to={`/history/${service.id}`}
                  className="flex-shrink-0 ml-2 text-blue-700 font-medium hover:text-blue-800 flex items-center text-sm"
                >
                  Lihat hasil
                  <ChevronRight size={16} className="ml-0.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Service Info */}
          <div className="w-full md:w-2/3">
            {/* Service Header */}
            <div className="flex items-start mb-6">
              <div className="mr-5 flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="relative"
                >
                  <div 
                    className="absolute inset-0 rounded-full opacity-30"
                    style={{
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                      transform: 'rotate(3deg) scale(1.05)',
                      filter: 'blur(8px)'
                    }}
                  ></div>
                  <div 
                    className="h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center shadow-md relative"
                    style={{
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                    }}
                  >
                    {/* Service icon with gradient coloring */}
                    <div className="relative z-10">
                      {getServiceIcon(service, gradient)}
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex-grow"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                  {service.name}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex text-xs font-medium py-1 px-2.5 rounded-full bg-primary-100 text-primary-800">
                    {service.faculty}
                  </span>
                  <span className="inline-flex text-xs font-medium py-1 px-2.5 rounded-full bg-primary-100 text-primary-800">
                    {service.category}
                  </span>
                  <span className={`inline-flex items-center text-xs font-medium py-1 px-2.5 rounded-full 
                    ${service.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                      ${service.status === 'Aktif' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                    {service.status}
                  </span>
                </div>
              </motion.div>
            </div>
            
            {/* Service Description Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white shadow-md rounded-xl border border-gray-100 p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center mr-2"
                  style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                >
                  <Sparkles size={16} className="text-white" />
                </div>
                <span>Tentang Layanan</span>
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
            
            {/* Information cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Location Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-3">
                  <div 
                    className="h-9 w-9 rounded-full flex items-center justify-center mr-3" 
                    style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                  >
                    <MapPin size={18} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Lokasi</h3>
                </div>
                <p className="text-gray-700 text-sm">{service.location}</p>
              </motion.div>
              
              {/* Hours Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-3">
                  <div 
                    className="h-9 w-9 rounded-full flex items-center justify-center mr-3"
                    style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                  >
                    <Clock size={18} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Jam Operasional</h3>
                </div>
                <p className="text-gray-700 text-sm">{service.operationalHours}</p>
              </motion.div>
              
              {/* Contact Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center mb-3">
                  <div 
                    className="h-9 w-9 rounded-full flex items-center justify-center mr-3"
                    style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                  >
                    <Phone size={18} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Kontak</h3>
              </div>
                <p className="text-gray-700 text-sm">{service.contactPerson}</p>
              </motion.div>
            </div>
            
            {/* Feedback Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-100 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center mr-3"
                    style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                  >
                    <MessageSquare size={20} className="text-white" />
                  </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Umpan Balik Pengguna</h3>
                    <p className="text-gray-500 text-sm">Komentar dan penilaian dari pengguna lain</p>
                  </div>
                </div>
                
                <Link
                  to={`/feedback/${service.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                >
                  Lihat semua
                  <ArrowUpRight size={14} className="ml-1" />
                </Link>
              </div>
              
              {/* Sample Feedback Preview Card */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="flex items-center mb-1">
                      <p className="text-sm font-medium text-gray-900 mr-2">Pengguna</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Pelayanan sangat baik dan cepat. Staff sangat membantu dalam proses administrasi.</p>
                  </div>
                </div>
              </div>
            </motion.div>
                </div>
                
          {/* Right Column - QR Code Survey */}
          <div className="w-full md:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-28"
            >
              {/* Survey QR Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 opacity-50" />
                  <div className="relative">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <div 
                        className="h-8 w-8 rounded-full flex items-center justify-center mr-2"
                        style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                      >
                        <FileEdit size={16} className="text-white" />
                      </div>
                      <span>Survei Layanan</span>
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Bagikan pengalaman Anda untuk meningkatkan kualitas layanan
                    </p>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col items-center">
                  <motion.div 
                    ref={qrWrapperRef}
                    className="relative mb-6"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)", 
                      y: -3
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {/* Improved QR code styling */}
                    <div 
                      className="border-[8px] border-white rounded-2xl bg-white shadow-md p-3"
                      style={{ boxShadow: `0 10px 25px -5px ${hexToRgba(gradient.from, 0.15)}` }}
                    >
                      <div className="relative">
                        {/* Subtle gradient background for QR code */}
                        <div 
                          className="absolute inset-0 rounded-lg opacity-5"
                          style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                        ></div>
                        
                        <QRCodeSVG 
                          value={service.qrCode}
                          size={180}
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                          level="H"
                          includeMargin={false}
                        />
                        
                        {/* Improved QR code watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                          <span className="text-2xl font-bold">UIN</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="text-center mb-6 w-full">
                    <p className="text-sm text-gray-500 mb-2">atau gunakan link:</p>
                    <a 
                      href={service.qrCode} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center transition-colors duration-300"
                    >
                      {formatUrl(service.qrCode)}
                      <ExternalLink size={14} className="ml-1.5 flex-shrink-0" />
                    </a>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="space-y-3 w-full">
                    {/* "Isi Survei" button for non-completed services */}
                    {!isServiceCompleted(service.id) && (
                      <Link
                        to={isAuthenticated ? `/survey/${service.id}` : '/login'}
                        className="w-full block"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white font-medium
                            transition-all duration-300 relative overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                            boxShadow: `0 8px 25px -5px ${hexToRgba(gradient.from, 0.4)}`
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent"></div>
                          <FileEdit size={18} className="mr-2" />
                          <span>{isAuthenticated ? 'Isi Survei' : 'Login untuk Mengisi'}</span>
                        </motion.div>
                      </Link>
                    )}
                    
                    {/* Share button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShare}
                      className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium
                        transition-all duration-300 bg-white border border-gray-200 hover:border-gray-300"
                    >
                      <Share2 size={18} className="mr-2 text-gray-600" />
                      <span>Bagikan</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Mobile Survey Button */}
      {!isServiceCompleted(service.id) && (
        <div className="fixed bottom-5 inset-x-5 z-30 md:hidden">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => document.getElementById('mobile-survey-sheet').classList.remove('translate-y-full')}
            className="w-full flex items-center justify-center py-3.5 rounded-xl text-white font-medium
              transition-all duration-300 relative overflow-hidden shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
              boxShadow: `0 10px 30px -5px ${hexToRgba(gradient.from, 0.5)}`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent"></div>
            <FileEdit size={18} className="mr-2" />
            <span className="text-base">{isAuthenticated ? 'Isi Survei' : 'Login untuk Mengisi'}</span>
          </motion.button>
        </div>
      )}
      
      {/* Mobile Survey Bottom Sheet */}
      <div 
        id="mobile-survey-sheet" 
        className="md:hidden fixed inset-0 z-50 transform translate-y-full transition-transform duration-500 ease-in-out"
      >
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => document.getElementById('mobile-survey-sheet').classList.add('translate-y-full')}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          
          <div className="px-4 sm:px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileEdit size={18} className="text-primary-600 mr-2" />
              Isi Survei Layanan
            </h2>
            
            <div className="flex justify-center mb-6">
              <motion.div 
                className="border-[6px] border-white rounded-xl bg-white p-2 shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
            <QRCodeSVG 
              value={service.qrCode}
                  size={160}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="H"
              includeMargin={false}
            />
              </motion.div>
          </div>
          
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">atau gunakan link:</p>
            <a 
              href={service.qrCode} 
              target="_blank" 
              rel="noreferrer" 
                className="text-sm text-primary-600 font-medium inline-flex items-center"
              >
                {formatUrl(service.qrCode)}
                <ExternalLink size={14} className="ml-1.5" />
              </a>
            </div>
          
            {/* Buttons */}
            <div className="space-y-3">
              {!isServiceCompleted(service.id) && (
            <Link
              to={isAuthenticated ? `/survey/${service.id}` : '/login'}
                  className="block w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-center shadow-md"
            >
                  {isAuthenticated ? 'Isi Survei' : 'Login untuk Mengisi'}
            </Link>
              )}
              
              <button
                onClick={() => {
                  handleShare();
                  document.getElementById('mobile-survey-sheet').classList.add('translate-y-full');
                }}
                className="block w-full py-3.5 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl text-center"
              >
                Bagikan Layanan
              </button>
              
              <button
                onClick={() => document.getElementById('mobile-survey-sheet').classList.add('translate-y-full')}
                className="block w-full py-3 text-gray-500 font-medium text-center"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper functions
const formatUrl = (url) => {
  try {
    if (!url) return '';
    return url.replace(/^https?:\/\/(www\.)?/, '').slice(0, 30) + (url.length > 30 ? '...' : '');
  } catch (e) {
    return url;
  }
};

const adjustHslDarker = (hslColor) => {
  // Parse HSL color string
  const match = hslColor.match(/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/);
  if (!match) return hslColor;
  
  const h = parseInt(match[1], 10);
  const s = parseFloat(match[2]);
  const l = Math.max(parseFloat(match[3]) - 10, 10); // Make 10% darker but not less than 10%
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

const hexToRgba = (hslColor, alpha) => {
  // Simple conversion for shadow purposes
  return `rgba(0, 0, 0, ${alpha})`;
};

export default ServiceDetailPage; 