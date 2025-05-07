import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Building, UserCheck, Calendar, BarChart, Clock, CheckCircle, ChevronRight, FileText, LogOut, AlertTriangle, Phone, Activity, PlusCircle, Folder, ClipboardCheck, Star, Award } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useSurveyStore } from '../store/surveyStore';
import { useDirectoryStore } from '../store/directoryStore';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

// Get default avatar based on gender - keep in sync with Header.jsx
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

// Component for stats card with consistent styling
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white rounded-2xl shadow-md p-7 flex items-center" style={{ background: `linear-gradient(to right, ${color}08, white 15%)` }}>
    <div className="mr-5 flex-shrink-0">
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
        <Icon className="h-5 w-5" style={{ color: color }} />
      </div>
    </div>
    <div className="flex flex-col justify-center">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">{title}</p>
      <h3 className="text-lg font-semibold text-gray-800 mt-1.5">{value}</h3>
    </div>
  </div>
);

// Component for info card with consistent styling
const InfoCard = ({ icon: Icon, title, value, color, subvalue }) => (
  <div className="bg-white rounded-2xl shadow-md p-7" style={{ background: `linear-gradient(to right, ${color}08, white 15%)` }}>
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
        <Icon className="h-5 w-5" style={{ color: color }} />
      </div>
    </div>
    <p className="text-base text-gray-800 mt-1">
      {value}
    </p>
    {subvalue && (
      <p className="text-sm text-gray-500 mt-1">
        {subvalue}
      </p>
    )}
  </div>
);

// Component for rounded action button
const RoundedActionButton = ({ icon: Icon, title, description, color, onClick }) => (
  <button 
    className="w-full flex items-center py-5 px-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50" 
    style={{ boxShadow: `0 0 0 1px ${color}30, 0 2px 4px 0 rgba(0,0,0,0.1)` }}
    onClick={onClick}
  >
    <div 
      className="mr-4 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
      style={{ backgroundColor: color, boxShadow: `0 0 0 4px ${color}20` }}
    >
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div className="text-left flex flex-col justify-center">
      <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
    <ChevronRight className="ml-auto h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
  </button>
);

// Mini activity chart component
const ActivityChart = () => (
  <div className="flex items-end h-12 space-x-1">
    <div className="w-4 bg-blue-200 rounded-t-md h-3"></div>
    <div className="w-4 bg-blue-300 rounded-t-md h-5"></div>
    <div className="w-4 bg-blue-400 rounded-t-md h-8"></div>
    <div className="w-4 bg-blue-500 rounded-t-md h-6"></div>
    <div className="w-4 bg-blue-600 rounded-t-md h-10"></div>
    <div className="w-4 bg-blue-400 rounded-t-md h-7"></div>
    <div className="w-4 bg-blue-300 rounded-t-md h-4"></div>
  </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUserStore();
  const { allResponses, completedServices } = useSurveyStore();
  const { getServiceById } = useDirectoryStore();
  const [isLoading, setIsLoading] = useState(true);
  const [recentSurveys, setRecentSurveys] = useState([]);
  const defaultAvatar = getDefaultAvatar(user);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  console.log("ProfilePage rendered", { isAuthenticated, user });

  // Fetch user data and survey history
  useEffect(() => {
    console.log("ProfilePage useEffect", { isAuthenticated, user });
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      navigate('/login');
      return;
    }
    
    // Simulate loading and fetch recent surveys
    const timer = setTimeout(() => {
      console.log("Loading complete");
      fetchRecentSurveys();
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, user, allResponses, completedServices]);
  
  // Fetch recent surveys from the store
  const fetchRecentSurveys = () => {
    console.log("Fetching recent surveys with data:", { 
      allResponses, 
      completedServices, 
      userId: user?.id 
    });
    
    try {
      // Filter responses for current user if user ID is available
      const userResponses = user?.id 
        ? allResponses.filter(response => response.userId === user.id) 
        : allResponses;
      
      console.log("Filtered user responses:", userResponses);
      
      // Map responses to history format
      const historyItems = userResponses.map((response) => {
        // Try to get service name from directory
        const serviceData = getServiceById(response.serviceId);
        const serviceName = serviceData ? serviceData.name : (response.serviceName || `Survei Layanan ${response.serviceId}`);
        
        return {
          id: response.id,
          serviceId: response.serviceId,
          title: serviceName,
          completedDate: response.completedAt ? response.completedAt : new Date().toISOString(),
          status: 'completed'
        };
      });
      
      // Also include any completed services that might not have a corresponding response
      completedServices.forEach(serviceId => {
        // Check if this service is already in our history
        const exists = historyItems.some(item => item.serviceId === serviceId);
        
        if (!exists) {
          // Try to get service name from directory
          const serviceData = getServiceById(serviceId);
          const serviceName = serviceData ? serviceData.name : `Survei Layanan ${serviceId}`;
          
          historyItems.push({
            id: `service-${serviceId}`,
            serviceId: serviceId,
            title: serviceName,
            completedDate: new Date().toISOString(),
            status: 'completed'
          });
        }
      });
      
      // Sort by completion date, most recent first
      const sortedHistory = historyItems.sort((a, b) => 
        new Date(b.completedDate) - new Date(a.completedDate)
      );
      
      // Take only the 3 most recent surveys
      const recentSurveysData = sortedHistory.slice(0, 3);
      console.log("Final recent surveys:", recentSurveysData);
      
      setRecentSurveys(recentSurveysData);
    } catch (error) {
      console.error("Error fetching recent surveys:", error);
      setRecentSurveys([]);
    }
  };
  
  // Format date to a more readable format
  const formatDate = (dateString) => {
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: id });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Tanggal tidak valid";
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Map respondent types to more readable versions
  const respondentTypeMap = {
    'student': 'Mahasiswa',
    'lecturer': 'Dosen',
    'staff': 'Tenaga Kependidikan',
    'alumni': 'Alumni',
    'public': 'Masyarakat Umum',
    'stakeholder': 'Mitra Kerjasama'
  };
  
  // Maps respondent origins to readable versions
  const respondentOriginMap = {
    'fuh': 'Fakultas Ushuluddin dan Humaniora',
    'ftk': 'Fakultas Tarbiyah dan Keguruan',
    'fsh': 'Fakultas Syariah',
    'febi': 'Fakultas Ekonomi dan Bisnis Islam',
    'fdik': 'Fakultas Dakwah dan Ilmu Komunikasi',
    'pasca':'Pascasarjana',
    'rektorat':'Kantor Pusat',
    'public':'Masyarakat Umum',
    'stakeholder':'Mitra Kerjasama/Stakeholder',
  };
  
  // Handle logout
  const handleLogout = () => {
    console.log("Logging out");
    logout();
    navigate('/login');
  };

  // Navigate to survey details
  const handleSurveyClick = (surveyId) => {
    // In a real app, this would navigate to the survey details
    console.log(`Navigating to survey details for ${surveyId}`);
    navigate(`/history/${surveyId}`);
  };

  // Navigate to complete survey history
  const viewFullHistory = () => {
    navigate('/history');
  };

  // Fallback content if no user data
  if (!user && isAuthenticated) {
    console.log("No user data but authenticated");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Data Profil Tidak Tersedia</h2>
          <p className="text-gray-600 mb-6">Terjadi kesalahan saat memuat data profil Anda.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    console.log("Showing loading state");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Memuat profil Anda...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header section */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 tracking-wide">Profil Pengguna</h1>
            <p className="text-lg font-normal text-gray-500 mt-2">
              
            </p>
          </motion.div>
          
          {/* Main Content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Profile + Stats (now full width) */}
            <div className="col-span-12 space-y-6">
              {/* Profile Card */}
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-3xl shadow-md overflow-hidden"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-7 relative">
                  {/* Logout button positioned top-right */}
                  <div className="absolute top-5 right-6 hidden md:block">
                    <button 
                      onClick={() => setShowLogoutConfirm(true)}
                      className="flex items-center justify-center px-3 py-1.5 border border-red-200 rounded-full text-red-500 bg-white hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} className="mr-1.5" />
                      <span className="text-sm font-medium">Keluar</span>
                    </button>
                  </div>
                  
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-white ring-4 ring-blue-100 overflow-hidden">
                      {user?.profileImage ? (
                        <img 
                          src={user.profileImage} 
                          alt={user?.name || "User Profile"} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <img 
                          src={defaultAvatar} 
                          alt={user?.name || "User Profile"} 
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {user?.name || 'Nama Pengguna'}
                    </h2>
                    
                    <div className="inline-flex items-center px-3 py-1 mt-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium self-center md:self-start">
                      {respondentTypeMap[user?.role] || 'Jenis Responden'}
                    </div>
                    
                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-7 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="text-base">{user?.email || 'email@example.com'}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-7 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-green-500" />
                        </div>
                        <span className="text-base">{user?.whatsapp || user?.phone || '+628123456789'}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-7 flex items-center justify-center">
                          <Building className="w-4 h-4 text-teal-500" />
                        </div>
                        <span className="text-base truncate max-w-xs">
                          {respondentOriginMap[user?.respondentOrigin] || user?.faculty || 'Asal Responden'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Recent Surveys */}
              <motion.div variants={itemVariants}>
                <div className="bg-white rounded-2xl shadow-md p-7" style={{ background: `linear-gradient(to right, #3b82f608, white 15%)` }}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-gray-800 tracking-wide">Survei yang Telah Diisi</h3>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  
                  {/* Recent Surveys List */}
                  <div className="space-y-3">
                    {recentSurveys.length > 0 ? (
                      recentSurveys.map((survey) => (
                        <div 
                          key={survey.id}
                          onClick={() => handleSurveyClick(survey.serviceId)}
                          className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-800">{survey.title}</h4>
                              <p className="text-sm text-gray-500">
                                Diisi pada {formatDate(survey.completedDate)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                              <CheckCircle size={12} />
                              <span>Selesai</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                            <ClipboardCheck className="h-8 w-8 text-blue-300" />
                          </div>
                        </div>
                        <p className="text-gray-500 font-medium">Anda belum pernah mengisi survei.</p>
                        <button 
                          onClick={() => navigate('/directory')}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium inline-flex items-center"
                        >
                          <PlusCircle size={16} className="mr-2" />
                          Mulai Isi Survei
                        </button>
                      </div>
                    )}
                    
                    {recentSurveys.length > 0 && (
                      <div className="pt-4 mt-2 border-t border-gray-100">
                        <button 
                          onClick={viewFullHistory}
                          className="flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                        >
                          <span>Lihat Riwayat Lengkap</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Mobile Logout Button (only visible on small screens) */}
            <div className="col-span-12 lg:hidden mt-6">
              <motion.div variants={itemVariants}>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full py-3 px-4 flex items-center justify-center bg-white border border-red-200 text-red-500 font-medium rounded-2xl hover:bg-red-50 transition-colors"
                >
                  <span className="w-5 h-5 flex items-center justify-center mr-2">
                    <LogOut size={16} />
                  </span>
                  <span>Keluar dari Akun</span>
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3 tracking-wide">Konfirmasi Keluar</h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin keluar dari akun?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Ya, Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
  
export default ProfilePage;
  