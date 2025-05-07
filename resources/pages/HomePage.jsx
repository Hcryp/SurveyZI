import React, { useState, useEffect, useRef, lazy, Suspense, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle, BarChart3, Search, Star, Clock, Calendar,
  ArrowUpRight, HelpCircle, FileText, ClipboardEdit, Award,
  TrendingUp, Users, BookOpen, Sparkles, MessageSquare, Crown,
  MapPin, ChevronRight, AlertCircle, GraduationCap, ClipboardList, 
  Stethoscope, Wallet, Library, Laptop, Microscope, Building2, 
  Briefcase, LineChart, BarChart4, Book, Camera, HandshakeIcon, 
  Presentation, Lightbulb, FlaskConical, Globe, Newspaper, Megaphone, 
  BanknoteIcon, CoinsIcon, CircleDollarSign
} from 'lucide-react';
import { useDirectoryStore } from '../store/directoryStore';
import { useUserStore } from '../store/userStore';
import { useSurveyStore } from '../store/surveyStore';
import Button3D from '../components/Button3D';
import clsx from 'clsx';

// Import the TestimonialSection directly instead of lazy loading for now
// We'll fix lazy loading after we get the page working
import TestimonialSection from '../components/home/TestimonialSection';

// Lightweight loading component for suspense fallback
const LoadingFallback = () => (
  <div className="h-20 w-full flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
  </div>
);

// First, enhance the device detection for newer iPhone models with Dynamic Island
const useLowEndDevice = () => {
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOSWithDynamicIsland, setIsIOSWithDynamicIsland] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  
  useEffect(() => {
    // Enhanced heuristic for low-end devices with Android optimization
    const checkDeviceCapabilities = () => {
      // Detect Android specifically
      const isAndroidDevice = /Android/i.test(navigator.userAgent);
      setIsAndroid(isAndroidDevice);
      
      // Detect iOS devices with potential Dynamic Island (iPhone 14 Pro and newer)
      const isIOSDeviceCheck = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsIOSDevice(isIOSDeviceCheck);
      
      if (isIOSDeviceCheck) {
        // Try to detect iPhone 14 Pro, 14 Pro Max, 15 Pro, 15 Pro Max or newer models
        // Note: This is an approximation as UserAgent doesn't directly expose the exact model
        const modernIPhone = /iPhone1[4-9]|iPhone2[0-9]/i.test(navigator.userAgent) || 
                            window.devicePixelRatio >= 3 && window.screen.width >= 390 && /iPhone/i.test(navigator.userAgent);
        setIsIOSWithDynamicIsland(modernIPhone);
      }
      
      // Enhanced Android detection - some Android devices need optimization even if they're not technically "low-end"
      if (isAndroidDevice) {
        // Check for Android version as some older Android versions have rendering issues
        const androidVersionMatch = navigator.userAgent.match(/Android\s([0-9.]+)/);
        const androidVersion = androidVersionMatch ? parseFloat(androidVersionMatch[1]) : 0;
        
        // Android devices with older OS or slower processors should be treated as low-end
        if (androidVersion < 10) {
          setIsLowEnd(true);
          return true;
        }
      }
      
      // Safely check for navigator properties that might not exist in all browsers
      const memoryLimit = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
      
      // More comprehensive connection check
      const connectionType = navigator.connection ? 
        (navigator.connection.effectiveType === 'slow-2g' || 
         navigator.connection.effectiveType === '2g' || 
         navigator.connection.effectiveType === '3g' ||
         navigator.connection.downlink < 1.5) : false;
        
      const screenSize = window.screen.width * window.screen.height;
      const isSmallScreen = screenSize < 1000000; // ~HD resolution threshold
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Detect if device is reporting low battery - some devices throttle performance
      const isBatteryLow = 'getBattery' in navigator ? 
        navigator.getBattery().then(battery => battery.level < 0.15) : false;
      
      // For iOS devices, assume better performance but still considerate
      // If it's iOS but with slow connection, still consider it low-end
      if (isIOSDeviceCheck && connectionType) return true;
      // Most modern iOS devices handle animations well
      if (isIOSDeviceCheck) return false;
      
      // Consider Android devices that have any performance limitations as needing optimization
      const isLowEndDevice = isAndroidDevice ? 
        (memoryLimit || connectionType || isSmallScreen || isBatteryLow) :
        ((memoryLimit || connectionType) && isMobile);
        
      setIsLowEnd(isLowEndDevice);
      return isLowEndDevice;
    };
    
    try {
      checkDeviceCapabilities();
    } catch (error) {
      // If there's any error in detection, default to false
      setIsLowEnd(false);
      setIsAndroid(false);
      setIsIOSWithDynamicIsland(false);
      setIsIOSDevice(false);
      console.error("Error detecting device capabilities:", error);
    }
  }, []);
  
  return { isLowEnd, isAndroid, isIOSWithDynamicIsland, isIOS: isIOSDevice };
};

// Optimized CountUp component with better performance
const CountUp = ({ end, duration = 1550 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTime = useRef(null);
  const endValue = useRef(end);
  const { isLowEnd, isAndroid } = useLowEndDevice();

  useEffect(() => {
    endValue.current = end;
    
    // For low-end devices, just set the final value without animation
    if (isLowEnd || isAndroid) {
      setCount(end);
      return;
    }
    
    startTime.current = Date.now();
    
    // More efficient animation using timestamp-based updates
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * endValue.current);
      
      setCount(currentCount);
      
      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };
    
    countRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [end, duration, isLowEnd, isAndroid]);
  
  return <>{count}</>;
};

// Memoized StarRating component
const StarRating = memo(({ score }) => {
  if (score === "N/A") return null;
  
  const numericScore = parseFloat(score);
  const fullStars = Math.floor(numericScore);
  const hasHalfStar = numericScore - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex justify-center mt-1 mb-1">
      {fullStars > 0 && 
        <>
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className="w-4 h-4 text-amber-500 fill-amber-500" />
          ))}
        </>
      }
      {hasHalfStar && (
        <span className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <Star className="w-4 h-4 text-amber-500 fill-amber-500 absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
        </span>
      )}
      {emptyStars > 0 && 
        <>
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
          ))}
        </>
      }
    </div>
  );
});

// Optimized placeholder with reduced animation for Android
const ImagePlaceholder = () => {
  const { isAndroid } = useLowEndDevice();
  
  return (
    <div className={`bg-gray-100 ${!isAndroid ? 'animate-pulse' : ''} w-full h-full rounded-lg`}></div>
  );
};

const HomePage = () => {
  const { 
    services, 
    favorites, 
    isServiceFavorite, 
    isServiceCompleted,
    getFilteredServices
  } = useDirectoryStore();
  const { isAuthenticated, user } = useUserStore();
  const { completedServices, allResponses } = useSurveyStore();
  
  // States
  const [activeTab, setActiveTab] = useState('favorites');
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSection, setVisibleSection] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const { isLowEnd, isAndroid: detectedAndroid, isIOSWithDynamicIsland } = useLowEndDevice();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [renderedServices, setRenderedServices] = useState([]);
  const [shouldOptimizeScroll, setShouldOptimizeScroll] = useState(false);
  const [iPhoneNotchSize, setIPhoneNotchSize] = useState({ top: 47, left: 0, right: 0 });
  
  // Last scroll position for scroll optimization
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  
  // Refs for scroll tracking - use fewer refs for performance
  const sectionRefs = useRef({
    hero: null,
    stats: null,
    services: null,
    testimonials: null
  });
  
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 500,
        mass: 0.8
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        duration: 0.4
      }
    }
  };
  
  // Get services based on active tab
  const getTabServices = () => {
    if (activeTab === 'favorites') {
      return services.filter(service => isServiceFavorite(service.id)).slice(0, 4);
    } else if (activeTab === 'recent') {
      return services.filter(service => isServiceCompleted(service.id)).slice(0, 4);
    } else {
      return services.slice(0, 4);
    }
  };
  
  const displayServices = getTabServices();
  
  // Calculate average rating from completed surveys
  const calculateAverageRating = () => {
    if (allResponses.length === 0) return "N/A";
    
    // Calculate overall score for each response using similar logic to SurveyDetailPage
    const responseScores = allResponses.map(response => {
      if (!response.answers || response.answers.length === 0) return 0;
      
      // Calculate total score based on answers (assuming 1-6 scale like in SurveyDetailPage)
      let totalScore = 0;
      let maxPossibleScore = 0;
      
      response.answers.forEach(answer => {
        // Only count numeric answers
        const answerValue = parseInt(answer.answer);
        if (!isNaN(answerValue)) {
          totalScore += answerValue;
          // Assuming max score is 6 for each question (from SurveyDetailPage logic)
          maxPossibleScore += 6;
        }
      });
      
      // Convert to percentage (0-100) similar to SurveyDetailPage
      const score = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
      return Math.round(score * 10) / 10; // Round to 1 decimal place
    });
    
    // Filter out any zero scores
    const validScores = responseScores.filter(score => score > 0);
    
    if (validScores.length === 0) return "N/A";
    
    // Calculate the average score
    const averageScore = validScores.reduce((total, score) => total + score, 0) / validScores.length;
    
    // Convert to 5-star scale (since our star rating shows 5 stars)
    // 100% = 5 stars, so divide by 20
    const starRating = (averageScore / 20).toFixed(1);
    
    return starRating;
  };

  // Get color class based on score - similar to SurveyDetailPage
  const getScoreColorClass = (score) => {
    if (score === "N/A") return "text-gray-500";
    
    const numericScore = parseFloat(score);
    if (numericScore >= 4.0) return 'text-green-600';
    if (numericScore >= 3.0) return 'text-blue-600';
    if (numericScore >= 2.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get interpretation text based on score - similar to SurveyDetailPage
  const getScoreInterpretation = (score) => {
    if (score === "N/A") return "Belum ada penilaian";
    
    const numericScore = parseFloat(score);
    if (numericScore >= 4.0) return 'Sangat Baik';
    if (numericScore >= 3.0) return 'Baik';
    if (numericScore >= 2.0) return 'Cukup';
    return 'Perlu Ditingkatkan';
  };

  // Stats data
  const stats = [
    { title: 'Unit Layanan', value: services.length, icon: <BookOpen className="w-6 h-6 text-primary-600" /> },
    { 
      title: 'Survei Selesai', 
      value: completedServices.length, 
      icon: <CheckCircle className="w-6 h-6 text-primary-600" /> 
    },
    { title: 'Layanan Difavoritkan', value: favorites.length, icon: <Star className="w-6 h-6 text-primary-600" /> },
    { 
      title: 'Kepuasan Anda', 
      subtitle: `Berdasarkan ${allResponses.length} Survei Layanan yang Anda isi`,
      value: calculateAverageRating(), 
      starRating: true,
      interpretation: getScoreInterpretation(calculateAverageRating()),
      colorClass: getScoreColorClass(calculateAverageRating()),
      icon: <Award className="w-6 h-6 text-primary-600" /> 
    }
  ];
  
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Ari Ganteng',
      role: 'Mahasiswa Politeknik Negeri Tanah Laut',
      content: 'Aplikasi yang sangat membantu untuk memberikan feedback ke layanan kampus. Tampilannya mudah digunakan dan responsif.',
      rating: 5,
      isFeatured: true,
      timestamp: '3 hari yang lalu',
      profileImage: null,
      gender: 'male'
    },
    {
      id: 2,
      name: 'Anonymous',
      role: 'Anonymous',
      content: 'Kok Ngeleg di HP Aku yah 😑',
      rating: 1,
      isFeatured: false,
      timestamp: 'Baru Saja',
      profileImage: null,
      gender: 'female'
    },
    {
      id: 3,
      name: 'Ahmad Fauzi',
      role: 'Dosen Fakultas Ekonomi',
      content: 'Platform yang sangat bermanfaat untuk mendapatkan masukan dari mahasiswa. Sangat merekomendasikan untuk digunakan di semua layanan kampus.',
      rating: 5,
      isFeatured: false,
      timestamp: '2 minggu yang lalu',
      profileImage: null,
      gender: 'male'
    },
    {
      id: 4,
      name: 'Anonymous',
      role: 'Mahasiswa Politeknik Negeri Tanah Laut',
      content: 'Semangat ketua!',
      rating: 5,
      isFeatured: false,
      timestamp: 'Baru Saja',
      profileImage: null,
      gender: 'male'
    }
  ];
  
  // Detect mobile device and iOS/Android on mount
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Detect iOS
      const iOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsIOS(iOS);
      
      // Detect Android
      const android = /Android/i.test(navigator.userAgent);
      setIsAndroid(android);
      
      // Set scroll optimization for mobile devices
      setShouldOptimizeScroll(mobile || android);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    // Add class to body for platform-specific CSS
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      document.body.classList.add('ios-device');
    }
    
    if (/Android/i.test(navigator.userAgent)) {
      document.body.classList.add('android-device');
      
      // Force hardware acceleration for Android
      document.body.style.transform = 'translateZ(0)';
      document.body.style.backfaceVisibility = 'hidden';
      document.body.style.perspective = '1000px';
    }
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);
  
  // Handle scroll effects with performance optimization
  useEffect(() => {
    // Skip complex scroll handling on low-end devices
    if (isLowEnd) {
      setVisibleSection('all');
      return;
    }
    
    const handleScroll = () => {
      // Use optimized scroll handling for mobile/Android
      if (shouldOptimizeScroll) {
        lastScrollY.current = window.scrollY;
        
        if (!ticking.current) {
          // Use requestAnimationFrame to limit scroll event processing
          requestAnimationFrame(() => {
            // Simple states that don't trigger expensive re-renders
            setIsScrolled(lastScrollY.current > 60);
            ticking.current = false;
          });
          
          ticking.current = true;
        }
        return;
      }
      
      // Regular scroll handling for desktop
      setIsScrolled(window.scrollY > 60);
      
      // Track section visibility
      const viewportHeight = window.innerHeight;
      
      // Use refs object for more efficient access
      const sections = Object.entries(sectionRefs.current).filter(([_, ref]) => ref);
      
      for (const [key, ref] of sections) {
        const rect = ref?.getBoundingClientRect();
        if (rect && rect.top < viewportHeight * 0.7) {
          setVisibleSection(key);
        }
      }
    };
    
    const optimizedScroll = isAndroid || isLowEnd 
      ? throttle(handleScroll, 100) // Use throttle for Android
      : handleScroll;
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    
    // Initial call
    handleScroll();
    
    return () => window.removeEventListener('scroll', optimizedScroll);
  }, [isLowEnd, isAndroid, shouldOptimizeScroll]);
  
  // Preload critical assets with priority
  useEffect(() => {
    // Skip intensive preloads on low-end devices
    if (isLowEnd || isAndroid) {
      setImagesLoaded(true);
      return;
    }
    
    // Load critical assets
    const heroImage = new Image();
    heroImage.fetchPriority = "high";
    heroImage.loading = "eager";
    heroImage.src = '/3D_illustration.png';
    heroImage.onload = () => setImagesLoaded(true);
    heroImage.onerror = () => {
      console.error("Error loading hero image");
      setImagesLoaded(true);
    };

    // Set a timeout to ensure imagesLoaded gets set to true even if loading fails
    const timeout = setTimeout(() => {
      if (!imagesLoaded) {
        setImagesLoaded(true);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isLowEnd, isAndroid]);
  
  // Throttle function for scroll optimization
  function throttle(callback, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        callback.apply(this, args);
      }
    };
  }
  
  // Generate gradient colors for service cards
  const getServiceGradient = (serviceName) => {
    // Simple hash function for string
    const hash = serviceName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Generate distinct hue based on name
    const huePresets = [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345];
    const hue = huePresets[Math.abs(hash) % huePresets.length];
    const hueOffset = ((hash % 10) - 5);
    const finalHue = (hue + hueOffset) % 360;
    
    // Generate brighter, softer pastel gradients for thumbnails
    return {
      from: `hsl(${finalHue}, 85%, 75%)`,
      to: `hsl(${finalHue}, 45%, 55%)`
    };
  };
  
  // Generate service icon
  const getServiceIcon = (serviceName, category) => {
    const name = serviceName.toLowerCase();
    const cat = (category || '').toLowerCase();
    
    // Define color style
    const iconClass = "w-8 h-8 text-white";
    
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
    if (cat.includes('keuangan')) return <BanknoteIcon className={iconClass} />;
    if (cat.includes('humas') || cat.includes('publikasi')) return <Globe className={iconClass} />;
    if (cat.includes('kerjasama')) return <HandshakeIcon className={iconClass} />;
    if (cat.includes('penelitian')) return <FlaskConical className={iconClass} />;
    if (cat.includes('pengembangan') && cat.includes('akademik')) return <Award className={iconClass} />;
    if (cat.includes('perpustakaan') || cat.includes('library')) return <BookOpen className={iconClass} />;
    if (cat.includes('akademik')) return <GraduationCap className={iconClass} />;
    if (cat.includes('administrasi')) return <ClipboardList className={iconClass} />;
    if (cat.includes('kesehatan')) return <Stethoscope className={iconClass} />;
    if (cat.includes('teknologi')) return <Laptop className={iconClass} />;
    if (cat.includes('humas')) return <Users className={iconClass} />;
    
    // Default icon based on first letter
    return <div className="text-white font-display font-bold text-2xl">{serviceName.charAt(0)}</div>;
  };
  
  // Generate category-specific colors for better visual distinction
  const getCategoryColor = (category) => {
    const categoryLower = (category || '').toLowerCase();
    
    if (categoryLower.includes('akademik')) return { bg: 'bg-blue-50', text: 'text-blue-700' };
    if (categoryLower.includes('kesehatan')) return { bg: 'bg-green-50', text: 'text-green-700' };
    if (categoryLower.includes('keuangan')) return { bg: 'bg-amber-50', text: 'text-amber-700' };
    if (categoryLower.includes('perpustakaan')) return { bg: 'bg-purple-50', text: 'text-purple-700' };
    if (categoryLower.includes('kerjasama')) return { bg: 'bg-cyan-50', text: 'text-cyan-700' };
    if (categoryLower.includes('kemahasiswaan')) return { bg: 'bg-pink-50', text: 'text-pink-700' };
    if (categoryLower.includes('penelitian')) return { bg: 'bg-indigo-50', text: 'text-indigo-700' };
    if (categoryLower.includes('teknologi')) return { bg: 'bg-orange-50', text: 'text-orange-700' };
    if (categoryLower.includes('kepegawaian')) return { bg: 'bg-teal-50', text: 'text-teal-700' };
    
    // Default colors if no match
    return { bg: 'bg-gray-50', text: 'text-gray-700' };
  };

  // Generate faculty-specific colors
  const getFacultyColor = (faculty) => {
    const facultyLower = (faculty || '').toLowerCase();
    
    if (facultyLower.includes('tarbiyah')) return { bg: 'bg-rose-50', text: 'text-rose-700' };
    if (facultyLower.includes('syariah')) return { bg: 'bg-emerald-50', text: 'text-emerald-700' };
    if (facultyLower.includes('dakwah')) return { bg: 'bg-violet-50', text: 'text-violet-700' };
    if (facultyLower.includes('ushuluddin')) return { bg: 'bg-yellow-50', text: 'text-yellow-700' };
    if (facultyLower.includes('ekonomi')) return { bg: 'bg-sky-50', text: 'text-sky-700' };
    if (facultyLower.includes('teknologi')) return { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700' };
    if (facultyLower.includes('rektorat')) return { bg: 'bg-red-50', text: 'text-red-700' };
    if (facultyLower.includes('administrasi')) return { bg: 'bg-indigo-50', text: 'text-indigo-700' };
    
    // Default color for other faculties
    return { bg: 'bg-slate-50', text: 'text-slate-700' };
  };
  
  // Handle favorite click
  const handleFavoriteClick = (e, serviceId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle the favorite status in the store
    if (isServiceFavorite(serviceId)) {
      useDirectoryStore.getState().removeFromFavorites(serviceId);
    } else {
      useDirectoryStore.getState().addToFavorites(serviceId);
    }
  };
  
  // Check if service survey is completed
  const isServiceSurveyCompleted = (serviceId) => {
    // Check both as string and as number to handle type mismatches
    const serviceIdNum = parseInt(serviceId, 10);
    const serviceIdStr = serviceId.toString();
    
    return completedServices.some(id => {
      const completedIdNum = parseInt(id, 10);
      const completedIdStr = id.toString();
      
      return (
        completedIdStr === serviceIdStr || 
        (
          !isNaN(serviceIdNum) && 
          !isNaN(completedIdNum) && 
          completedIdNum === serviceIdNum
        )
      );
    });
  };
  
  // Use more efficient rendering for starred cards on Android
  const renderStarRating = (score) => {
    if (isAndroid) {
      // Simplified star rendering for Android
  return (
        <div className="flex justify-center mt-1 mb-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${star <= Math.round(parseFloat(score)) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
              />
            ))}
          </div>
        </div>
      );
    }
    
    // Use the memoized version for normal devices
    return <StarRating score={score} />;
  };
  
  // Optimized stats section for Android
  const renderStatsSection = () => (
    <div 
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
      style={isAndroid ? { 
        willChange: 'transform', 
        transform: 'translateZ(0)',
      } : {}}
    >
      {stats.map((stat) => (
        <div
          key={stat.title} 
          className="rounded-xl md:rounded-2xl bg-white shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.05)] p-4 md:p-6 text-center cursor-pointer"
          style={isAndroid ? { 
            willChange: 'transform',
            transform: 'translateZ(0)',
          } : {}}
        >
          <div 
            className="w-10 h-10 md:w-14 md:h-14 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-3 md:mb-5 shadow-sm"
          >
            {stat.icon}
          </div>
          <h3 className={`text-2xl md:text-4xl font-bold mb-1 font-display tracking-tight ${stat.colorClass || 'text-primary-700'}`}>
            {stat.value}
          </h3>
          {stat.starRating && renderStarRating(stat.value)}
          <p className="text-sm md:text-base text-primary-800 font-medium">{stat.title}</p>
          {stat.subtitle && (
            <p className="text-xs text-secondary-500 mt-1">{stat.subtitle}</p>
          )}
          {stat.interpretation && (
            <p className={`text-xs md:text-sm font-medium mt-1 ${stat.colorClass}`}>{stat.interpretation}</p>
          )}
        </div>
      ))}
    </div>
  );
  
  // Within the HomePage component, add a useEffect for scroll optimization
  useEffect(() => {
    // Apply CSS scroll behavior for smoother scrolling on low-end devices
    if (isLowEnd || isAndroid) {
      // Add CSS for smoother scrolling
      const style = document.createElement('style');
      style.textContent = `
        .smooth-scroll-container {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          scroll-snap-type: y proximity;
        }
        
        .scroll-snap-item {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }
        
        .android-optimized {
          backface-visibility: hidden;
          perspective: 1000;
          transform: translate3d(0,0,0);
          will-change: transform;
        }
        
        @supports (scroll-behavior: smooth) {
          html {
            scroll-behavior: ${isLowEnd ? 'auto' : 'smooth'};
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Limit framerate on very low-end devices
      if (isLowEnd) {
        // Use requestAnimationFrame throttling for ultra-smooth scrolling
        let lastKnownScrollPosition = 0;
        let ticking = false;
        let scrollTimeout;
        
        const handleScroll = () => {
          lastKnownScrollPosition = window.scrollY;
          
          if (!ticking) {
            // Use timeout to ensure we're not overloading the device
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              window.requestAnimationFrame(() => {
                // Do minimal work here - just what's absolutely necessary
                setIsScrolled(lastKnownScrollPosition > 60);
                ticking = false;
              });
            }, 50); // Lower interval for smoother feeling
            
            ticking = true;
          }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
          window.removeEventListener('scroll', handleScroll);
          clearTimeout(scrollTimeout);
          document.head.removeChild(style);
        };
      }
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isLowEnd, isAndroid]);

  // Add virtual list rendering for service lists
  const VirtualizedList = ({ items, renderItem, itemHeight = 100, windowSize = 10 }) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null);
    
    useEffect(() => {
      const handleScroll = () => {
        if (containerRef.current) {
          setScrollTop(containerRef.current.scrollTop);
        }
      };
      
      const current = containerRef.current;
      if (current) {
        current.addEventListener('scroll', handleScroll, { passive: true });
      }
      
      return () => {
        if (current) {
          current.removeEventListener('scroll', handleScroll);
        }
      };
    }, []);
    
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - windowSize);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + (containerRef.current?.clientHeight || 0)) / itemHeight) + windowSize
    );
    
    const visibleItems = items.slice(startIndex, endIndex + 1);
    
    return (
      <div 
        ref={containerRef}
        className="overflow-auto h-[500px] will-change-scroll"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map((item, index) => (
            <div 
              key={startIndex + index}
              style={{
                position: 'absolute',
                top: (startIndex + index) * itemHeight,
                height: itemHeight,
                width: '100%'
              }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Add CSS variables for safe areas
  useEffect(() => {
    const setupDynamicIslandSupport = () => {
      // Set Dynamic Island safe areas
      if (isIOS && isIOSWithDynamicIsland) {
        // Add specific CSS for Dynamic Island
        const style = document.createElement('style');
        style.textContent = `
          :root {
            --dynamic-island-top: env(safe-area-inset-top, 47px);
            --dynamic-island-left: env(safe-area-inset-left, 0px);
            --dynamic-island-right: env(safe-area-inset-right, 0px);
            --notch-width: 126px;
            --dynamic-island-height: 34px;
          }
          
          .dynamic-island-aware {
            padding-top: var(--dynamic-island-top) !important;
          }
          
          .dynamic-island-header {
            padding-top: calc(var(--dynamic-island-top) + 10px);
            height: auto !important;
          }
          
          .header-content-wrapper {
            position: relative;
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .header-avoid-island {
            margin: 0 auto;
            width: calc(100% - var(--notch-width));
            max-width: 100%;
            position: relative;
          }
        `;
        document.head.appendChild(style);
        
        // Try to get actual safe area values if available
        try {
          // Get computed values from CSS env() if available
          const computedStyle = getComputedStyle(document.documentElement);
          const topInset = computedStyle.getPropertyValue('env(safe-area-inset-top)');
          const leftInset = computedStyle.getPropertyValue('env(safe-area-inset-left)');
          const rightInset = computedStyle.getPropertyValue('env(safe-area-inset-right)');
          
          setIPhoneNotchSize({
            top: topInset ? parseInt(topInset, 10) : 47,
            left: leftInset ? parseInt(leftInset, 10) : 0,
            right: rightInset ? parseInt(rightInset, 10) : 0
          });
        } catch (e) {
          console.log('Could not get safe area insets from env()', e);
        }
        
        // Add meta viewport tag with viewport-fit=cover if not present
        const existingViewport = document.querySelector('meta[name="viewport"]');
        if (existingViewport && !existingViewport.content.includes('viewport-fit=cover')) {
          existingViewport.content = `${existingViewport.content}, viewport-fit=cover`;
        }
        
        return () => {
          document.head.removeChild(style);
        };
      }
    };
    
    // Execute the setup
    return setupDynamicIslandSupport();
  }, [isIOS, isIOSWithDynamicIsland]);

  return (
    <div 
      className={`min-h-screen flex flex-col bg-gradient-to-br from-white to-white pb-16 overflow-hidden smooth-scroll-container ${isIOS ? 'ios-safe-area' : ''} ${isAndroid ? 'android-optimized' : ''} ${isIOSWithDynamicIsland ? 'dynamic-island-aware' : ''}`}
      style={isAndroid ? { 
        contain: 'content',
        contentVisibility: 'auto',
        containIntrinsicSize: '0 1000px',
        overscrollBehavior: 'contain'
      } : {}}
    >
      {/* Sticky Header - enhanced for Dynamic Island awareness */}
      <motion.header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled ? 'bg-white/70 backdrop-blur-md shadow-sm' : 'bg-transparent'
        } ${isIOS ? 'pt-safe-top' : ''} ${isIOSWithDynamicIsland ? 'dynamic-island-header' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: isLowEnd || isAndroid ? 0.1 : 0.5 }}
        style={{
          ...isAndroid ? { 
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          } : {},
          // Add padding for devices with Dynamic Island
          ...(isIOSWithDynamicIsland ? {
            paddingTop: `${iPhoneNotchSize.top}px`,
          } : {})
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between h-16 ${isIOSWithDynamicIsland ? 'header-content-wrapper' : ''}`}>
            <div className={`flex items-center ${isIOSWithDynamicIsland ? 'header-avoid-island' : ''}`}>
              <Link to="/" className="text-xl font-display font-bold text-primary-600">
                Survey UIN Antasari
              </Link>
            </div>
            
            <div className="md:hidden">
              <Button3D variant="light" size="sm" className="rounded-full">
                <span className="sr-only">Menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </Button3D>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Hero Section - with Dynamic Island spacing */}
      <section 
        ref={el => sectionRefs.current.hero = el} 
        className={`relative pt-0 pb-12 md:pb-16 overflow-hidden scroll-snap-item ${isIOS ? 'ios-hero-padding' : ''} ${isIOSWithDynamicIsland ? 'pt-4' : ''}`}
        style={{
          ...isAndroid ? { contain: 'paint layout', containIntrinsicSize: '0 600px' } : {},
          ...(isIOSWithDynamicIsland ? { paddingTop: '1rem' } : {})
        }}
      >
        <div className="absolute inset-0"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile-optimized layout with reversed order for small screens */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image area - now first on mobile for better visibility */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: isAndroid ? 0.1 : 0.3, delay: isAndroid ? 0 : 0.1 }}
              className="relative mt-0 order-first md:order-last"
              style={isAndroid ? { willChange: 'transform', transform: 'translateZ(0)' } : {}}
            >
              <div className="relative flex items-center justify-center pt-0 md:pt-20 pb-4 md:pb-10">
                {imagesLoaded ? (
                  <img 
                    src="/3D_illustration.png" 
                    alt="UIN Antasari Survey Platform" 
                    loading={isAndroid ? "eager" : "lazy"}
                    width="550"
                    height="440"
                    className="relative z-30 w-[85%] md:w-[95%] h-auto object-contain mx-auto"
                    style={isAndroid ? { transform: 'translateZ(0)' } : {}}
                  />
                ) : (
                  <div className="relative z-30 w-[85%] md:w-[95%] h-[300px] md:h-[440px] mx-auto bg-gray-50 rounded-xl animate-pulse"></div>
                )}
              </div>
            </motion.div>
            
            {/* Text content area - now second on mobile for better thumb access */}
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: isLowEnd || isAndroid ? 0.1 : 0.5, delay: isAndroid ? 0 : 0.05 }}
              className="flex flex-col items-start pt-0 order-last md:order-first"
              style={isAndroid ? { willChange: 'transform', transform: 'translateZ(0)' } : {}}
            >
              <div className="inline-block bg-primary-100 text-primary-800 font-medium rounded-full px-4 py-1 text-sm mb-6 md:mb-8">
                Platform Survei Layanan Kampus
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-secondary-900 leading-tight">
                Survey Layanan
                <br />
                <span className="text-green-600 whitespace-nowrap">UIN Antasari Banjarmasin</span>
              </h1>
              
              <p className="mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-primary-800 max-w-lg">
              Mari bersama-sama untuk membuat layanan kampus menjadi lebih baik dengan berbagi pendapat kalian secara jujur, karena setiap masukan kalian sangat berarti untuk kami.
              </p>
              
              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 w-full">
                <Link 
                  to="/directory" 
                  className="w-full sm:w-auto"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Button3D 
                    variant="primary" 
                    size="lg" 
                    className={`w-full px-8 py-4 rounded-full shadow-lg hover:shadow-primary-600/30 hover:shadow-xl transition-all duration-300 border-2 border-primary-700/10 ${isIOS ? 'ios-touch-button' : ''}`}
                  >
                    <span className="text-base">Lihat Direktori</span>
                    <ArrowRight className="ml-2 h-5 w-5 animate-pulse-slow" />
                  </Button3D>
                </Link>
                
                <Link 
                  to="/about" 
                  className="w-full sm:w-auto"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Button3D 
                    variant="light" 
                    size="lg" 
                    className={`w-full px-8 py-4 rounded-full border border-gray-200 ${isIOS ? 'ios-touch-button' : ''}`}
                  >
                    <span>Pelajari Lebih Lanjut</span>
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Button3D>
                </Link>
              </div>
              
              <div className="mt-8 md:mt-12 flex items-center">
                <div className="flex -space-x-3">
                  {[
                    { color: '#f87171', initial: '😊' },
                    { color: '#60a5fa', initial: '😉' },
                    { color: '#a78bfa', initial: '🤩' }
                  ].map((avatar, i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm font-medium border-2 border-white shadow-sm overflow-hidden"
                      style={{ 
                        background: `linear-gradient(135deg, ${avatar.color}, ${avatar.color}dd)`,
                      }}
                    >
                      <span className="text-base md:text-lg">{avatar.initial}</span>
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-xs md:text-sm font-medium text-secondary-900">Bergabung dengan 300+ pengguna</p>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="ml-2 text-xs text-secondary-600">dari 250+ ulasan</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-24"></div>
      </section>
      
      {/* Stats Section - with optimized animations */}
      <section 
        ref={el => sectionRefs.current.stats = el} 
        className="py-8 md:py-10 relative will-change-transform scroll-snap-item"
        style={isAndroid ? { 
          contain: 'paint layout', 
          containIntrinsicSize: '0 400px',
          contentVisibility: isLowEnd ? 'auto' : 'visible' 
        } : {}}
      >
        <div className="absolute inset-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-center mb-6 md:mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 sm:text-4xl">
              Platform Survei Layanan UIN Antasari Banjarmasin
            </h2>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-secondary-600 max-w-3xl mx-auto">
              Membantu civitas akademika dan masyarakat umum untuk memberikan pendapat dan evaluasi terhadap seluruh layanan di UIN Antasari Banjarmasin
            </p>
          </motion.div>
          
          {/* Optimized stats rendering */}
          {renderStatsSection()}
          
          <motion.div 
            className="grid md:grid-cols-3 gap-4 md:gap-8 mt-6 md:mt-10"
            style={isAndroid ? { willChange: 'auto', containIntrinsicSize: '0 500px' } : {}}
          >
            <motion.div
              variants={cardVariants}
              whileHover={isLowEnd ? {} : { 
                y: -4,
                boxShadow: "0px 12px 20px -5px rgba(0,0,0,0.1)", 
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } 
              }}
              className="rounded-2xl bg-white shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.05)] p-6 transform focus-within:ring-2 focus-within:ring-primary-400 focus-within:outline-none will-change-transform"
            >
              <motion.div 
                variants={iconVariants}
                className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-5 shadow-sm will-change-transform"
              >
                <ClipboardEdit className="w-6 h-6 text-blue-700" />
              </motion.div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3 font-display">Survei Terstruktur</h3>
              <p className="text-secondary-700">
                Kuesioner dirancang berdasarkan standar pelayanan publik dengan kategori penilaian yang terukur
              </p>
            </motion.div>
            
            <motion.div
              variants={cardVariants}
              whileHover={isLowEnd ? {} : { 
                y: -4,
                boxShadow: "0px 12px 20px -5px rgba(0,0,0,0.1)", 
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } 
              }}
              className="rounded-2xl bg-white shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.05)] p-6 transform focus-within:ring-2 focus-within:ring-primary-400 focus-within:outline-none will-change-transform"
            >
              <motion.div 
                variants={iconVariants}
                className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-sm will-change-transform"
              >
                <BarChart3 className="w-6 h-6 text-green-700" />
              </motion.div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3 font-display">Analisis Real-time</h3>
              <p className="text-secondary-700">
                Dapatkan analisis lengkap hasil survei secara real-time dengan visualisasi data yang mudah dipahami
              </p>
            </motion.div>
            
            <motion.div
              variants={cardVariants}
              whileHover={isLowEnd ? {} : { 
                y: -4,
                boxShadow: "0px 12px 20px -5px rgba(0,0,0,0.1)", 
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } 
              }}
              className="rounded-2xl bg-white shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.05)] p-6 transform focus-within:ring-2 focus-within:ring-primary-400 focus-within:outline-none will-change-transform"
            >
              <motion.div 
                variants={iconVariants}
                className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-5 shadow-sm will-change-transform"
              >
                <TrendingUp className="w-6 h-6 text-amber-700" />
              </motion.div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3 font-display">Peningkatan Berkelanjutan</h3>
              <p className="text-secondary-700">
                Evaluasi berkala untuk memastikan peningkatan kualitas layanan yang berkelanjutan
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Favorite Services Section - optimized rendering */}
      <section 
        ref={el => sectionRefs.current.services = el}
        className="py-10 relative scroll-snap-item"
        style={isAndroid ? { 
          contain: 'paint layout',
          containIntrinsicSize: '0 600px',
          contentVisibility: isLowEnd ? 'auto' : 'visible'
        } : {}}
      >
        <div className="absolute inset-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-secondary-900 sm:text-4xl">
                Layanan Favorit Anda
              </h2>
              <p className="mt-3 text-lg text-secondary-600 max-w-3xl">
                Akses cepat ke layanan yang Anda tandai sebagai favorit
              </p>
            </div>
            
            <Link
              to="/directory"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center mt-4 md:mt-0 group"
              onClick={() => window.scrollTo(0, 0)}
            >
              <span>Lihat Semua Layanan</span>
              <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.length > 0 ? (
              services.filter(service => isServiceFavorite(service.id)).slice(0, 6).map((service, index) => {
                // Create a simple gradient function that doesn't rely on external functions
                const createGradient = (name) => {
                  const str = name || '';
                  const hash = str.split('').reduce((acc, char) => {
                    return char.charCodeAt(0) + ((acc << 5) - acc);
                  }, 0);
                  
                  const hue = Math.abs(hash % 360);
                  return {
                    from: `hsl(${hue}, 85%, 75%)`,
                    to: `hsl(${hue}, 45%, 55%)`
                  };
                };
                
                const gradient = createGradient(service.name);
                
                return (
                  <div 
                    key={service.id}
                    className="bg-white rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1),0_6px_10px_-3px_rgba(0,0,0,0.05)] overflow-hidden group transition-all duration-150 relative cursor-pointer"
                    style={{ 
                      willChange: 'transform', 
                      transform: 'translateZ(0)'
                    }}
                  >
                    <Link 
                      to={`/service/${service.id}`}
                      className="block outline-none focus:outline-none h-full"
                      tabIndex={0}
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <div className="p-5">
                        <div className="flex space-x-4">
                          {/* Service icon */}
                          <div 
                            className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                            }}
                          >
                            <div className="text-white font-display font-bold text-2xl">
                              {service.name ? service.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                          </div>
                          
                          {/* Service info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium text-base text-gray-800">
                                {service.name}
                              </h3>
                              
                              {/* Favorite button */}
                              <div 
                                onClick={(e) => handleFavoriteClick(e, service.id)}
                                className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-400 cursor-pointer"
                              >
                                <Star className="w-3 h-3 fill-amber-400" />
                              </div>
                            </div>
                            
                            {/* Location tag */}
                            <div className="mt-3 mb-3">
                              <div className="inline-flex items-center py-1 px-2.5 rounded-md bg-gray-50 border border-gray-100">
                                <MapPin className="w-3 h-3 text-gray-500 mr-1.5" />
                                <span className="text-xs text-gray-600 font-medium truncate">
                                  {service.location || 'Kampus UIN Antasari'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Description */}
                            <p className="text-sm text-gray-500 mb-3.5 line-clamp-2 leading-relaxed">
                              {service.description || 'Informasi tentang layanan ini belum tersedia.'}
                            </p>
                            
                            {/* Tags section */}
                            <div className="flex flex-wrap gap-1.5">
                              {/* Faculty tag */}
                              <span className="text-xs py-0.5 px-2 rounded-full bg-gray-100 text-gray-600">
                                {service.faculty}
                              </span>
                              
                              {/* Completed survey tag */}
                              {isServiceSurveyCompleted(service.id) && (
                                <span className="flex items-center text-xs text-green-600 bg-green-50 py-0.5 px-2 rounded-full">
                                  <CheckCircle className="w-2.5 h-2.5 mr-1" />
                                  <span>Selesai</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm">
                <div className="h-20 w-20 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Belum ada layanan favorit</h3>
                <p className="text-secondary-600 max-w-md text-center mb-6">
                  Jelajahi direktori layanan dan tandai beberapa sebagai favorit untuk akses cepat
                </p>
                <Link to="/directory">
                  <Button3D 
                    variant="primary" 
                    size="md" 
                    className="px-6 py-2.5 rounded-full focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:outline-none"
                  >
                    <span>Jelajahi Direktori</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button3D>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Testimonials - optimized */}
      <TestimonialSection 
        testimonialsRef={el => sectionRefs.current.testimonials = el}
        testimonials={testimonials}
        isMobile={isMobile}
        isIOS={isIOS}
        isAndroid={isAndroid}
        isLowEnd={isLowEnd}
        optimizedCardVariants={cardVariants}
        optimizedIconVariants={iconVariants}
      />
    </div>
  );
};

export default HomePage; 