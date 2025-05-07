import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, Heart, MessageSquare, Send, Star } from 'lucide-react';
import { useDirectoryStore } from '../store/directoryStore';
import { useSurveyStore } from '../store/surveyStore';
import confetti from 'canvas-confetti';

const EmojiFeedback = ({ selected, onClick, emoji, label, color }) => {
  const isSelected = selected === emoji;
  
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(emoji)}
      className={`flex flex-col items-center space-y-2 transition-all ${
        isSelected ? 'scale-110' : 'opacity-70'
      }`}
    >
      <div 
        className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full ${
          isSelected ? `bg-${color}-100 shadow-lg shadow-${color}-100/50` : 'bg-gray-100'
        }`}
      >
        <span className="text-3xl md:text-4xl">{emoji}</span>
      </div>
      <span className={`text-sm font-medium ${isSelected ? `text-${color}-500` : 'text-gray-500'}`}>{label}</span>
    </motion.button>
  );
};

const EndingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getServiceById } = useDirectoryStore();
  const { updateFeedback } = useSurveyStore();
  
  // Log what state was passed to help debug
  console.log('EndingPage received state:', location.state);
  console.log('EndingPage serviceId param:', serviceId);
  
  // Get data passed from SurveyPage
  const surveyData = location.state || {};
  const { serviceName: passedServiceName, overallScore, responseId, completedAt } = surveyData;
  
  const [serviceName, setServiceName] = useState(passedServiceName || 'Layanan');
  const [feedbackEmoji, setFeedbackEmoji] = useState(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Emoji options
  const emojiOptions = [
    { emoji: '😞', label: 'Buruk', color: 'red' },
    { emoji: '😐', label: 'Biasa', color: 'yellow' },
    { emoji: '🙂', label: 'Baik', color: 'blue' },
    { emoji: '😃', label: 'Sangat Baik', color: 'green' },
    { emoji: '🤩', label: 'Luar Biasa', color: 'purple' }
  ];
  
  // Launch confetti effect
  useEffect(() => {
    if (showConfetti) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      
      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }
      
      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [showConfetti]);
  
  // Get service info if not passed from previous page
  useEffect(() => {
    if (!serviceId) {
      console.warn('No serviceId provided to EndingPage');
      return;
    }
    
    // Only fetch if we don't have the service name from props
    if (!passedServiceName) {
      try {
        console.log('Fetching service info for ID:', serviceId);
        // Try both string and number ID versions
        const service = getServiceById(serviceId) || 
                       getServiceById(parseInt(serviceId, 10)) || 
                       getServiceById(serviceId.toString());
        
        if (service) {
          console.log('Found service:', service);
          setServiceName(service.name || 'Layanan');
        } else {
          console.warn('Service not found for ID:', serviceId);
        }
      } catch (error) {
        console.error('Error getting service info:', error);
      }
    }
  }, [serviceId, getServiceById, passedServiceName]);
  
  const handleSubmitFeedback = () => {
    if (!feedbackEmoji) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting feedback for serviceId:', serviceId);
      
      // Update feedback in the store with response ID from survey
      updateFeedback(serviceId, {
        emoji: feedbackEmoji,
        comment: comment,
        timestamp: new Date().toISOString(),
        responseId: responseId || `fallback-${Date.now()}`,
        score: overallScore || 0
      });
      
      // Show confetti and set submitted state
      setShowConfetti(true);
      setSubmitted(true);
      
      // Redirect to history page after 3 seconds
      setTimeout(() => {
        console.log('Redirecting to history page');
        navigate('/history');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Terjadi kesalahan saat mengirim feedback. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Define animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // If no survey data was passed, redirect to survey list
  useEffect(() => {
    if (!location.state && serviceId) {
      console.warn('No survey data passed to ending page, will use minimal information');
      // We'll still show the page, but with limited information
    }
  }, [location.state, serviceId]);
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full space-y-8 rounded-3xl shadow-xl overflow-hidden relative bg-white/90 backdrop-blur-sm"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500"></div>
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-blue-100 opacity-20"></div>
        <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-teal-100 opacity-20"></div>
        
        {/* Content */}
        <div className="px-10 pt-14 pb-10 relative z-10">
          {submitted ? (
            <>
              <motion.div
                variants={itemVariants}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center rounded-full text-white mb-8"
              >
                <Check className="w-12 h-12" />
              </motion.div>
              
              <motion.h2 
                variants={itemVariants}
                className="text-center text-3xl font-bold text-gray-800 mb-3"
              >
                Terima Kasih!
              </motion.h2>
              
              <motion.p 
                variants={itemVariants}
                className="text-center text-gray-600 mb-6"
              >
                Feedback Anda berhasil dikirim dan sangat berarti bagi kami untuk meningkatkan layanan.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="text-center"
              >
                <p className="text-sm text-gray-500 mb-4">
                  Anda akan dialihkan ke halaman riwayat survey dalam beberapa saat...
                </p>
                
                <Link
                  to="/history"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Lihat Riwayat
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                variants={itemVariants}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center rounded-full text-white mb-8"
              >
                <Heart className="w-12 h-12" />
              </motion.div>
              
              <motion.h2 
                variants={itemVariants}
                className="text-center text-3xl font-bold text-gray-800 mb-2"
              >
                Terima Kasih!
              </motion.h2>
              
              <motion.p 
                variants={itemVariants}
                className="text-center text-gray-600 mb-2"
              >
                Survei Anda telah berhasil disimpan. Satu langkah lagi!
              </motion.p>
              
              <motion.p 
                variants={itemVariants}
                className="text-center text-gray-500 text-sm mb-6"
              >
                Mohon berikan feedback mengenai pengalaman Anda dengan layanan ini sebelum melanjutkan
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="mb-8"
              >
                <p className="text-center font-medium text-gray-700 mb-5">
                  Bagaimana Pengalaman Anda dengan {serviceName}?
                </p>
                
                <div className="flex justify-between items-center flex-wrap gap-4 px-4 md:px-8">
                  {emojiOptions.map((option) => (
                    <EmojiFeedback
                      key={option.emoji}
                      selected={feedbackEmoji}
                      onClick={setFeedbackEmoji}
                      emoji={option.emoji}
                      label={option.label}
                      color={option.color}
                    />
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="mb-8"
              >
                <div className="flex items-center text-gray-700 font-medium mb-3">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  <span>Tambahkan Komentar (Opsional)</span>
                </div>
                
                <div className="relative">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-xl min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white/80"
                    placeholder="Berikan komentar atau saran Anda..."
                  ></textarea>
                </div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="flex justify-center"
              >
                <motion.button
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackEmoji || isSubmitting}
                  className={`px-8 py-3 rounded-xl flex items-center justify-center font-medium shadow-md transition-all ${
                    feedbackEmoji && !isSubmitting 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={feedbackEmoji && !isSubmitting ? { scale: 1.05 } : {}}
                  whileTap={feedbackEmoji && !isSubmitting ? { scale: 0.95 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Feedback
                    </>
                  )}
                </motion.button>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EndingPage; 