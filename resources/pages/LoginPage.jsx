import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Calendar, Bookmark, Users, AlertCircle, ArrowRight, Shield, Info } from 'lucide-react';
import { useUserStore } from '../store/userStore';

// Sample options for form selections
const genderOptions = [
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
];

const originOptions = [
  { value: 'fuh', label: 'Fakultas Ushuluddin dan Humaniora' },
  { value: 'ftk', label: 'Fakultas Tarbiyah dan Keguruan' },
  { value: 'fsh', label: 'Fakultas Syariah' },
  { value: 'febi', label: 'Fakultas Ekonomi dan Bisnis Islam' },
  { value: 'fdik', label: 'Fakultas Dakwah dan Ilmu Komunikasi' },
  { value: 'pasca', label: 'Pascasarjana' },
  { value: 'rektorat', label: 'Kantor Pusat' },
  { value: 'public', label: 'Masyarakat Umum' },
  { value: 'stakeholder', label: 'Mitra Kerjasama/Stakeholder' },
];

const typeOptions = [
  { value: 'student', label: 'Mahasiswa' },
  { value: 'lecturer', label: 'Dosen' },
  { value: 'staff', label: 'Staff / Karyawan' },
  { value: 'public', label: 'Masyarakat Umum' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'stakeholder', label: 'Mitra Kerjasama' },
];

// Form validation schema
const schema = z.object({
  fullName: z.string().min(3, 'Nama harus diisi minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  whatsapp: z.string().min(10, 'Nomor WhatsApp harus diisi minimal 10 digit'),
  gender: z.string().min(1, 'Jenis kelamin harus dipilih'),
  respondentOrigin: z.string().min(1, 'Asal responden harus dipilih'),
  respondentType: z.string().min(1, 'Jenis responden harus dipilih'),
  serviceDate: z.string().min(1, 'Tanggal layanan harus diisi'),
});

// Function to detect if device is low-end or mobile 
const useDeviceDetect = () => {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [hasDynamicIsland, setHasDynamicIsland] = useState(false);
  const [safeAreaInsets, setSafeAreaInsets] = useState({ top: 0, bottom: 0 });
  
  useEffect(() => {
    const checkDevice = () => {
      // Check if mobile
      const isMobile = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
      
      // Check if iOS
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsIOSDevice(isIOS);
      
      // Try to detect iPhone with Dynamic Island or notch
      if (isIOS) {
        const hasModernNotch = window.screen.height >= 812;
        const hasNewerDynamicIsland = /iPhone1[4-9]|iPhone2[0-9]/i.test(navigator.userAgent) || 
          (window.devicePixelRatio >= 3 && window.screen.width >= 390);
        setHasDynamicIsland(hasNewerDynamicIsland || hasModernNotch);
        
        // Set safe area insets
        try {
          const computedStyle = getComputedStyle(document.documentElement);
          const safeTop = parseInt(computedStyle.getPropertyValue('--sat') || '0', 10) || 
            (hasNewerDynamicIsland ? 47 : hasModernNotch ? 44 : 20);
          const safeBottom = parseInt(computedStyle.getPropertyValue('--sab') || '0', 10) || 
            (hasModernNotch ? 34 : 0);
          
          setSafeAreaInsets({
            top: safeTop,
            bottom: safeBottom
          });
          
          // Set CSS variables for safe area
          document.documentElement.style.setProperty('--safe-area-top', `${safeTop}px`);
          document.documentElement.style.setProperty('--safe-area-bottom', `${safeBottom}px`);
        } catch (e) {
          console.error('Error getting safe area insets', e);
        }
      }
      
      // Check if low-end device
      const memoryLimit = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
      const connectionType = navigator.connection ? 
        (navigator.connection.effectiveType === 'slow-2g' || 
         navigator.connection.effectiveType === '2g' || 
         navigator.connection.effectiveType === '3g' ||
         navigator.connection.downlink < 1.5) : false;
      
      const isLowEnd = memoryLimit || connectionType || 
        (/Android/i.test(navigator.userAgent) && window.innerWidth < 400);
      
      setIsLowEndDevice(isLowEnd);
      
      // Add meta viewport for iOS safe areas if needed
      if (isIOS && hasModernNotch) {
        const existingViewport = document.querySelector('meta[name="viewport"]');
        if (existingViewport && !existingViewport.content.includes('viewport-fit=cover')) {
          existingViewport.content = `${existingViewport.content}, viewport-fit=cover`;
        } else if (!existingViewport) {
          const metaTag = document.createElement('meta');
          metaTag.name = 'viewport';
          metaTag.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
          document.head.appendChild(metaTag);
        }
      }
    };
    
    checkDevice();
    
    // Add CSS for safe areas
    if (isIOSDevice) {
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --sat: env(safe-area-inset-top);
          --sab: env(safe-area-inset-bottom);
          --sal: env(safe-area-inset-left);
          --sar: env(safe-area-inset-right);
        }
        
        .has-safe-area-top {
          padding-top: var(--safe-area-top) !important;
        }
        
        .has-safe-area-bottom {
          padding-bottom: var(--safe-area-bottom) !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);
  
  return { isLowEndDevice, isMobileDevice, isIOSDevice, hasDynamicIsland, safeAreaInsets };
};

// Updated input component with improved layout and mobile optimization
const FloatingLabelInput = ({ id, label, icon, error, isLowEnd, ...rest }) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!rest.value);

  useEffect(() => {
    setHasValue(!!rest.value);
  }, [rest.value]);

  // Optimize animations for low-end devices
  const animationDuration = isLowEnd ? 0.1 : 0.3;
  const animationConfig = isLowEnd ? { duration: animationDuration } : { 
    type: "spring", 
    stiffness: 500, 
    damping: 30,
    duration: animationDuration
  };

  return (
    <motion.div 
      className="relative mb-4 sm:mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animationDuration }}
    >
      <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
        <motion.div
          animate={isFocused ? { color: "#0891b2" } : { color: "#94a3b8" }}
          transition={{ duration: animationDuration }}
        >
          {icon}
        </motion.div>
      </div>
      
      <div className="relative">
        {hasValue && !isFocused && (
          <div className="absolute left-10 sm:left-12 top-0 transform translate-y-1.5 sm:translate-y-2 text-xs text-cyan-600 font-medium z-20">
            {label}
          </div>
        )}
        
        <input
          ref={inputRef}
          id={id}
          aria-label={label}
          className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 ${hasValue ? 'pt-4 pb-2 sm:pt-5 sm:pb-2' : ''} bg-white rounded-lg sm:rounded-xl border ${
            error ? 'border-red-300' : isFocused ? 'border-cyan-500' : 'border-gray-200'
          } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all shadow-sm placeholder:text-gray-400 text-sm sm:text-base`}
          placeholder={hasValue ? '' : label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setHasValue(!!inputRef.current?.value);
          }}
          {...rest}
        />
      </div>
      
      {error && (
        <motion.div 
          className="absolute -bottom-4 left-0 right-0 text-xs text-red-500 flex items-center px-1 sm:px-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animationDuration }}
        >
          <AlertCircle size={12} className="mr-1 flex-shrink-0" /> 
          <span className="line-clamp-1">{error}</span>
        </motion.div>
      )}
      
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
        initial={{ width: hasValue ? '100%' : '0%' }}
        animate={{ width: isFocused || hasValue ? '100%' : '0%' }}
        transition={{ duration: isLowEnd ? 0.2 : 0.3 }}
      />
    </motion.div>
  );
};

// Updated select component with improved layout
const FloatingLabelSelect = ({ id, label, icon, options, error, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!rest.value);
  const selectRef = useRef(null);

  useEffect(() => {
    setHasValue(!!rest.value);
  }, [rest.value]);

  return (
    <motion.div 
      className="relative mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
        <motion.div
          animate={isFocused ? { color: "#0891b2" } : { color: "#94a3b8" }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </div>
      
      <div className="relative">
        {hasValue && !isFocused && (
          <div className="absolute left-12 top-0 transform translate-y-2 text-xs text-cyan-600 font-medium z-20">
            {label}
          </div>
        )}
        
        <select
          ref={selectRef}
          id={id}
          aria-label={label}
          className={`w-full appearance-none pl-12 pr-10 py-3.5 ${hasValue ? 'pt-5 pb-2' : ''} bg-white rounded-xl border ${
            !rest.value && !isFocused ? 'text-gray-500' : 'text-gray-700'
          } ${
            error ? 'border-red-300' : isFocused ? 'border-cyan-500' : 'border-gray-200'
          } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all shadow-sm`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setHasValue(!!rest.value);
          }}
          {...rest}
        >
          <option value="" disabled>
            {label}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-gray-700">
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <motion.svg 
          className="w-4 h-4 text-gray-500"
          animate={isFocused ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </div>
      
      {error && (
        <motion.div 
          className="absolute -bottom-5 left-0 right-0 text-xs text-red-500 flex items-center px-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AlertCircle size={12} className="mr-1 flex-shrink-0" /> 
          <span className="line-clamp-1">{error}</span>
        </motion.div>
      )}
      
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
        initial={{ width: hasValue ? '100%' : '0%' }}
        animate={{ width: isFocused || hasValue ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

// Updated date input component with improved layout
const FloatingLabelDateInput = ({ id, label, icon, error, ...rest }) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!rest.value);

  useEffect(() => {
    setHasValue(!!rest.value);
  }, [rest.value]);

  return (
    <motion.div 
      className="relative mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
        <motion.div
          animate={isFocused ? { color: "#0891b2" } : { color: "#94a3b8" }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </div>
      
      <div className="relative flex items-center">
        {hasValue && !isFocused && (
          <div className="absolute left-12 top-0 transform translate-y-2 text-xs text-cyan-600 font-medium z-20">
            {label}
          </div>
        )}
        
        <input
          ref={inputRef}
          id={id}
          type="date"
          aria-label={label}
          className={`w-full pl-12 pr-4 py-3.5 ${hasValue ? 'pt-5 pb-2' : ''} bg-white rounded-xl border ${
            error ? 'border-red-300' : isFocused ? 'border-cyan-500' : 'border-gray-200'
          } focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all shadow-sm`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setHasValue(!!inputRef.current?.value);
          }}
          {...rest}
        />
        
        {/* Show label as placeholder when no date is selected */}
        {!hasValue && !isFocused && (
          <div className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {label}
          </div>
        )}
      </div>
      
      {error && (
        <motion.div 
          className="absolute -bottom-5 left-0 right-0 text-xs text-red-500 flex items-center px-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AlertCircle size={12} className="mr-1 flex-shrink-0" /> 
          <span className="line-clamp-1">{error}</span>
        </motion.div>
      )}
      
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
        initial={{ width: hasValue ? '100%' : '0%' }}
        animate={{ width: isFocused || hasValue ? '100%' : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

// 3D floating object animation
const FloatingObject = ({ className, duration, delay = 0 }) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{ 
        y: [0, -15, 0],
        rotate: [0, 5, 0, -5, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity, 
        delay: delay,
        ease: "easeInOut" 
      }}
    />
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, updateProfile, register } = useUserStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  
  // Get device information
  const { isLowEndDevice, isMobileDevice, isIOSDevice, hasDynamicIsland, safeAreaInsets } = useDeviceDetect();
  
  // Animation references - optimized for performance
  const formContainerRef = useRef(null);
  const isFormInView = useInView(formContainerRef, { once: true, amount: 0.1 });
  
  const {
    register: formRegister,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      whatsapp: '',
      gender: '',
      respondentOrigin: '',
      respondentType: '',
      serviceDate: today,
    },
  });
  
  useEffect(() => {
    if (isAuthenticated && !formSubmitted) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, formSubmitted]);
  
  const onSubmit = async (data) => {
    try {
      // Clear any existing survey data from previous users
      localStorage.removeItem('survey-storage');
      // Clear any form data and progress
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.includes('survey_progress_')) {
          localStorage.removeItem(key);
        }
      }
      
      // Since we're using mock data, we need to use a default password
      const loginSuccess = await login(data.email, 'password');
      
      if (loginSuccess) {
        // Then update the profile with the rest of the data
        await updateProfile({
          name: data.fullName,
          email: data.email,
          whatsapp: data.whatsapp,
          gender: data.gender,
          respondentOrigin: data.respondentOrigin,
          role: data.respondentType,
          serviceDate: data.serviceDate,
        });
        
        setFormSubmitted(true);
        
        // Show success animation before navigating
        await new Promise(resolve => setTimeout(resolve, 800));
        navigate('/');
      } else {
        // Create a new user
        const registerSuccess = await register({
          name: data.fullName,
          email: data.email,
          whatsapp: data.whatsapp,
          gender: data.gender,
          respondentOrigin: data.respondentOrigin,
          role: data.respondentType,
        });
        
        if (registerSuccess) {
          setFormSubmitted(true);
          
          // Show success animation before navigating
          await new Promise(resolve => setTimeout(resolve, 800));
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  
  // Form section variants for staggered animation - optimized for mobile/low-end
  const formSectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: isLowEndDevice ? 0.05 * i : 0.1 * i,
        duration: isLowEndDevice ? 0.2 : 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className={`min-h-screen font-jakarta relative overflow-hidden ${
      isIOSDevice ? 'has-safe-area-top has-safe-area-bottom' : ''
    }`} style={{ 
      paddingTop: hasDynamicIsland ? `${safeAreaInsets.top}px` : '0'
    }}>
      {/* Background elements - simplified for mobile/low-end */}
      <div className={`absolute inset-0 -z-10 overflow-hidden ${
        isLowEndDevice ? 'opacity-30' : ''
      }`}>
        {!isLowEndDevice && (
          <>
            <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-teal-100/30 to-blue-100/30 blur-3xl"></div>
            <div className="absolute top-1/4 right-0 w-[30rem] h-[30rem] rounded-full bg-gradient-to-bl from-blue-100/20 to-purple-100/20 blur-3xl"></div>
          </>
        )}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-teal-50/50 to-transparent"></div>
      </div>

      {/* Main content - with fixed header spacing */}
      <div className="container mx-auto px-3 sm:px-4 min-h-screen flex items-center justify-center" style={{
        paddingTop: 'calc(70px + env(safe-area-inset-top, 0px))', // Account for fixed header + safe area
        paddingBottom: '1rem'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isLowEndDevice ? 0.3 : 0.6 }}
          className="w-full max-w-6xl mx-auto"
        >
          <div className=" backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-white/80 grid md:grid-cols-5"
            style={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05), 0 20px 25px -5px rgba(0,0,0,0.02), 0 2px 4px -2px rgba(0,0,0,0.05), 0 -2px 10px rgba(255,255,255,0.7)' }}>
            
            {/* Left side with gradient and content - conditionally shown on mobile */}
            <div className={`relative p-6 sm:p-8 md:p-10 md:col-span-2 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 flex flex-col justify-between text-white overflow-hidden ${
              isMobileDevice ? 'max-h-48' : ''
            }`}>
              {/* Background decorative elements - simplified for mobile */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 -right-10 w-40 h-40 rounded-full bg-white/10 mix-blend-overlay"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-white/10 mix-blend-overlay opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Logo and content - simplified for mobile */}
              <div className="relative z-10 flex items-center md:block">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: isLowEndDevice ? 0.3 : 0.5 }}
                  className={`bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-2xl w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center ${
                    isMobileDevice ? 'mr-4' : 'mb-8'
                  } border border-white/30`}
                  style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' }}
                >
                  <img src="/logo_uin.png" alt="UIN Antasari Logo" className="w-full h-full object-contain" />
                </motion.div>
                
                <div>
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: isLowEndDevice ? 0.3 : 0.5 }}
                    className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1 md:mb-4"
                  >
                    Kuisioner UIN Antasari
                  </motion.h1>
                  
                  {!isMobileDevice && (
                    <motion.p 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: isLowEndDevice ? 0.3 : 0.5 }}
                      className="text-white/90 text-sm md:text-base leading-relaxed"
                    >
                      Bantu kami meningkatkan kualitas layanan kampus dengan mengisi formulir ini.
                    </motion.p>
                  )}
                </div>
              </div>
              
              {/* Mobile-optimized info - show only when needed */}
              {isMobileDevice ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="relative z-10 mt-2 flex items-center justify-between"
                >
                  <div className="flex items-center text-xs text-white/90">
                    <Shield className="h-3 w-3 mr-1 opacity-80" />
                    <span>Data Anda Dilindungi</span>
                  </div>
                  
                  <div className="flex space-x-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 w-8 rounded-full bg-white/${40 - (i*10)}`}></div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Decorative elements - only for desktop */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="relative z-10 grid grid-cols-3 gap-2 mt-6 hidden md:grid"
                  >
                    {[30, 20, 10].map((opacity, i) => (
                      <motion.div 
                        key={i}
                        className={`h-1.5 rounded-full bg-white/${opacity}`}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.6 + (i * 0.2), duration: 0.8 }}
                      ></motion.div>
                    ))}
                  </motion.div>
                  
                  {/* Privacy info - only for desktop */}
                  <div className="relative z-10 mt-auto pt-8 hidden md:block">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="text-sm text-white/80"
                    >
                      <div className="flex items-center mb-1">
                        <Shield className="h-4 w-4 mr-2 opacity-80" />
                        <span className="font-medium">Data Anda Dilindungi</span>
                      </div>
                      <p className="text-xs text-white/70">
                        Data yang Anda masukkan disimpan secara anonim dan hanya untuk keperluan survei
                      </p>
                    </motion.div>
                  </div>
                </>
              )}
            </div>
            
            {/* Right side with form - optimized for mobile */}
            <div className="md:col-span-3 p-5 sm:p-8 md:p-12 relative">
              <motion.div
                ref={formContainerRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: isLowEndDevice ? 0.3 : 0.5 }}
                className="max-w-md mx-auto w-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: isLowEndDevice ? 0.3 : 0.5 }}
                  className="mb-4 sm:mb-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Selamat Datang</h2>
                  <p className="text-sm sm:text-base text-gray-600">Isi informasi Anda untuk melakukan pengisian kuisioner</p>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
                  {/* Form fields optimized for better visibility */}
                  <motion.div 
                    custom={0}
                    initial="hidden"
                    animate={isFormInView ? "visible" : "hidden"}
                    variants={formSectionVariants}
                  >
                    <FloatingLabelInput
                      id="fullName"
                      label="Nama Lengkap"
                      icon={<User size={isMobileDevice ? 16 : 18} />}
                      error={errors.fullName?.message}
                      isLowEnd={isLowEndDevice}
                      {...formRegister('fullName')}
                    />
                  </motion.div>
                  
                  <motion.div 
                    custom={1}
                    initial="hidden"
                    animate={isFormInView ? "visible" : "hidden"}
                    variants={formSectionVariants}
                  >
                    <FloatingLabelInput
                      id="email"
                      type="email"
                      label="Alamat Email"
                      icon={<Mail size={isMobileDevice ? 16 : 18} />}
                      error={errors.email?.message}
                      isLowEnd={isLowEndDevice}
                      {...formRegister('email')}
                    />
                  </motion.div>
                  
                  <motion.div 
                    custom={2}
                    initial="hidden"
                    animate={isFormInView ? "visible" : "hidden"}
                    variants={formSectionVariants}
                  >
                    <FloatingLabelInput
                      id="whatsapp"
                      type="tel"
                      label="Nomor WhatsApp"
                      icon={<Phone size={isMobileDevice ? 16 : 18} />}
                      error={errors.whatsapp?.message}
                      isLowEnd={isLowEndDevice}
                      {...formRegister('whatsapp')}
                    />
                  </motion.div>
                  
                  <motion.div 
                    custom={3}
                    initial="hidden"
                    animate={isFormInView ? "visible" : "hidden"}
                    variants={formSectionVariants}
                  >
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <FloatingLabelSelect
                          id="gender"
                          label="Jenis Kelamin"
                          icon={<Users size={isMobileDevice ? 16 : 18} />}
                          options={genderOptions}
                          error={errors.gender?.message}
                          isLowEnd={isLowEndDevice}
                          {...field}
                        />
                      )}
                    />
                  </motion.div>
                  
                  <motion.div 
                    custom={4}
                    initial="hidden"
                    animate={isFormInView ? "visible" : "hidden"}
                    variants={formSectionVariants}
                  >
                    <Controller
                      name="respondentOrigin"
                      control={control}
                      render={({ field }) => (
                        <FloatingLabelSelect
                          id="respondentOrigin"
                          label="Asal Responden"
                          icon={<Bookmark size={isMobileDevice ? 16 : 18} />}
                          options={originOptions}
                          error={errors.respondentOrigin?.message}
                          isLowEnd={isLowEndDevice}
                          {...field}
                        />
                      )}
                    />
                  </motion.div>
                  
                  <motion.div 
                    custom={5}
                    initial="hidden"
                    animate={isFormInView ? "visible" : "hidden"}
                    variants={formSectionVariants}
                  >
                    <Controller
                      name="respondentType"
                      control={control}
                      render={({ field }) => (
                        <FloatingLabelSelect
                          id="respondentType"
                          label="Jenis Responden"
                          icon={<Users size={isMobileDevice ? 16 : 18} />}
                          options={typeOptions}
                          error={errors.respondentType?.message}
                          isLowEnd={isLowEndDevice}
                          {...field}
                        />
                      )}
                    />
                  </motion.div>
                  
                  <motion.div 
                    custom={6}
                    initial="hidden"
                    animate={isFormInView ? "visible" : "hidden"}
                    variants={formSectionVariants}
                  >
                    <FloatingLabelDateInput
                      id="serviceDate"
                      icon={<Calendar size={isMobileDevice ? 16 : 18} />}
                      max={today}
                      error={errors.serviceDate?.message}
                      isLowEnd={isLowEndDevice}
                      {...formRegister('serviceDate')}
                    />
                  </motion.div>
                  
                  {/* Submit button - optimized for mobile */}
                  <motion.div
                    custom={7}
                    initial="hidden"
                    animate={isFormInView ? "visible" : "hidden"}
                    variants={formSectionVariants}
                    className="mt-6 sm:mt-8"
                  >
                    <motion.button
                      type="submit"
                      className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium flex items-center justify-center group focus:outline-none relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #5DEBD7, #7AA2E3, #133E87)',
                        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2), 0 4px 6px -4px rgba(14, 165, 233, 0.2), inset 0 -2px 0 rgba(0,0,0,0.1)'
                      }}
                      disabled={isSubmitting}
                      whileHover={!isLowEndDevice ? { 
                        boxShadow: '0 15px 20px -3px rgba(16, 185, 129, 0.3), 0 8px 8px -4px rgba(14, 165, 233, 0.2), inset 0 -2px 0 rgba(0,0,0,0.1)',
                        y: -2
                      } : {}}
                      whileTap={!isLowEndDevice ? { 
                        y: 0,
                        boxShadow: '0 5px 10px -3px rgba(16, 185, 129, 0.2), 0 2px 4px -2px rgba(14, 165, 233, 0.2), inset 0 -1px 0 rgba(0,0,0,0.1)'
                      } : {}}
                      transition={{ duration: isLowEndDevice ? 0.1 : 0.2 }}
                    >
                      {!isLowEndDevice && (
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200/30 via-teal-200/30 to-cyan-200/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                      )}
                      <div className="relative z-10 flex items-center justify-center text-white">
                        {isSubmitting ? (
                          <motion.svg 
                            className="animate-spin h-5 w-5 mr-2" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </motion.svg>
                        ) : null}
                        <span className="mr-2 text-sm sm:text-base">Lanjutkan ke Kuisioner</span>
                        <motion.div
                          animate={!isLowEndDevice ? { x: [0, 5, 0] } : {}}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            ease: "easeInOut",
                            repeatDelay: 1
                          }}
                        >
                          <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                        </motion.div>
                      </div>
                    </motion.button>
                  </motion.div>
                </form>

                {/* Already logged in message */}
                <AnimatePresence>
                  {isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 sm:mt-8"
                    >
                      <div className="py-3 sm:py-3.5 px-3 sm:px-4 bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-xl">
                        <p className="text-xs sm:text-sm text-blue-800">
                          Anda sudah masuk.{' '}
                          <button
                            onClick={() => navigate('/')}
                            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            Kembali ke Beranda
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: isLowEndDevice ? 0.5 : 1, duration: isLowEndDevice ? 0.4 : 0.8 }}
            className="text-xs text-gray-500 text-center mt-4 sm:mt-6"
          >
            © {new Date().getFullYear()} UIN Antasari Banjarmasin - Sistem Survei dan Direktori Layanan
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;