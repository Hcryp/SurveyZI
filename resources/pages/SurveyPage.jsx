import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, ArrowLeft, CheckCircle2, Info, X, ClipboardCheck, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useUserStore } from '../store/userStore';
import { useDirectoryStore } from '../store/directoryStore';
import { useSurveyStore } from '../store/surveyStore';
import { SurveyQuestionList, surveyQuestions } from '../components/SurveyQuestion';

const SurveyPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  
  // States
  const [currentServiceData, setCurrentServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [previousResponse, setPreviousResponse] = useState(null);
  
  // Progress tracking
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  
  // For question navigation popup
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const questionNavRef = useRef(null);
  
  // Get data from stores
  const { isAuthenticated, user } = useUserStore();
  const { getServiceById } = useDirectoryStore();
  const { saveResponse, markServiceAsCompleted, isServiceCompleted, getResponsesForService } = useSurveyStore();
  
  // Get form values to track changes
  const formValues = watch();
  
  // Group questions by category for section navigation 
  const corruptionQuestions = surveyQuestions.filter(q => q.category === 'corruption_perception');
  const serviceQualityQuestions = surveyQuestions.filter(q => q.category === 'service_quality');
  const integrityQuestions = surveyQuestions.filter(q => q.category === 'survey_integrity');
  
  // Load saved answers on initial load
  useEffect(() => {
    const loadSavedAnswers = () => {
      try {
        // Load from localStorage using serviceId as part of the key
        const savedProgress = localStorage.getItem(`survey_progress_${serviceId}`);
        
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress);
          
          // Set each value in the form
          Object.entries(parsedProgress).forEach(([questionId, value]) => {
            setValue(questionId, value);
          });
          
          console.log('Loaded saved progress from localStorage');
        }
      } catch (err) {
        console.error('Error loading saved progress:', err);
      }
    };
    
    // Only try to load saved answers after the component has fully initialized
    if (!loading && isAuthenticated) {
      loadSavedAnswers();
    }
  }, [loading, isAuthenticated, serviceId, setValue]);
  
  // Save answers to localStorage whenever formValues change
  useEffect(() => {
    if (formValues && Object.keys(formValues).length > 0 && isAuthenticated) {
      try {
        localStorage.setItem(`survey_progress_${serviceId}`, JSON.stringify(formValues));
      } catch (err) {
        console.error('Error saving progress to localStorage:', err);
      }
    }
  }, [formValues, serviceId, isAuthenticated]);
  
  // Calculate progress based on answered questions
  useEffect(() => {
    const totalQuestions = surveyQuestions.length;
    let answered = 0;
    
    surveyQuestions.forEach(question => {
      if (formValues && formValues[question.id]) {
        answered++;
      }
    });
    
    setAnsweredCount(answered);
    setProgressPercentage((answered / totalQuestions) * 100);
  }, [formValues]);
  
  // Handle selecting an option
  const handleSelectOption = (questionId, optionValue) => {
    setValue(questionId, optionValue);
  };
  
  // Handle click outside to close question navigator
  useEffect(() => {
    function handleClickOutside(event) {
      if (questionNavRef.current && !questionNavRef.current.contains(event.target)) {
        setShowQuestionNav(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [questionNavRef]);
  
  // Handle navigation to a specific question
  const scrollToQuestion = (questionId) => {
    const questionElement = document.getElementById(`question-${questionId}`);
    if (questionElement) {
      // Scroll to the question with a small offset from the top
      window.scrollTo({
        top: questionElement.offsetTop - 120,
        behavior: 'smooth'
      });
      
      // Add a temporary highlight
      questionElement.classList.add('highlight-question');
      setTimeout(() => {
        questionElement.classList.remove('highlight-question');
      }, 1500);
      
      // Close the question navigator
      setShowQuestionNav(false);
    }
  };
  
  // Check if user is logged in and already completed this survey
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: `/survey/${serviceId}` } });
      return;
    }
    
    // Check if the user has already completed this survey
    const hasCompleted = isServiceCompleted(serviceId);
    
    if (hasCompleted) {
      // Get previous responses for this service
      const previousResponses = getResponsesForService(serviceId);
      const latestResponse = previousResponses.length > 0 ? 
        previousResponses[previousResponses.length - 1] : null;
      
      setIsDuplicate(true);
      setPreviousResponse(latestResponse);
    }
  }, [isAuthenticated, navigate, serviceId, isServiceCompleted, getResponsesForService]);
  
  // Get service data
  useEffect(() => {
    setLoading(true);
    try {
      // Parse serviceId as a number if possible
      const parsedServiceId = parseInt(serviceId, 10);
      const service = getServiceById(isNaN(parsedServiceId) ? serviceId : parsedServiceId);
      
      if (service) {
        setCurrentServiceData(service);
        setLoading(false);
      } else {
        // If service not found, use a fallback service
        console.warn(`Service with ID ${serviceId} not found, using fallback`);
        setCurrentServiceData({
          id: serviceId,
          name: 'Layanan Kampus',
          description: 'Deskripsi layanan kampus',
        });
        setLoading(false);
      }
    } catch (e) {
      console.error('Error loading service:', e);
      setError('Gagal memuat data layanan');
      setLoading(false);
    }
  }, [serviceId, getServiceById]);
  
  // Handle form submission
  const onSubmit = async (data) => {
    setSubmitting(true);
    
    try {
      // Calculate scores for different categories
      let corruptionScore = 0;
      let serviceQualityScore = 0;
      let surveyIntegrityScore = 0;
      
      // Track if all answers have max score in each category
      let allCorruptionMax = corruptionQuestions.length > 0;
      let allServiceQualityMax = serviceQualityQuestions.length > 0;
      let allSurveyIntegrityMax = true;
      
      // Process corruption perception questions
      corruptionQuestions.forEach(question => {
        const answer = data[question.id];
        const option = question.options.find(opt => opt.value === answer || opt.label === answer);
        if (option) {
          corruptionScore += option.score;
          // Check if this is less than max score (6)
          if (option.score < 6) {
            allCorruptionMax = false;
          }
        }
      });
      
      // Process service quality questions
      serviceQualityQuestions.forEach(question => {
        const answer = data[question.id];
        const option = question.options.find(opt => opt.value === answer || opt.label === answer);
        if (option) {
          serviceQualityScore += option.score;
          // Check if this is less than max score (6)
          if (option.score < 6) {
            allServiceQualityMax = false;
          }
        }
      });
      
      // Process survey integrity questions if they exist
      const surveyIntegrityQuestions = surveyQuestions.filter(q => q.category === 'survey_integrity');
      surveyIntegrityQuestions.forEach(question => {
        const answer = data[question.id];
        const option = question.options.find(opt => opt.value === answer || opt.label === answer);
        if (option) {
          surveyIntegrityScore += option.score;
          // Check if this is less than max score (6)
          if (option.score < 6) {
            allSurveyIntegrityMax = false;
          }
        }
      });
      
      // Calculate average scores (normalize to 0-100 scale)
      // If all answers have max score, set to exactly 100%
      const avgCorruptionScore = allCorruptionMax ? 100 : 
        (corruptionScore / (corruptionQuestions.length * 6)) * 100;
      
      const avgServiceQualityScore = allServiceQualityMax ? 100 :
        (serviceQualityScore / (serviceQualityQuestions.length * 6)) * 100;
      
      const avgSurveyIntegrityScore = surveyIntegrityQuestions.length === 0 ? 0 :
        (allSurveyIntegrityMax ? 100 : 
          (surveyIntegrityScore / (surveyIntegrityQuestions.length * 6)) * 100);
      
      // Special case: if all category scores are 100%, overall should be 100%
      let overallScore = 0;
      
      if (allCorruptionMax && allServiceQualityMax && 
          (surveyIntegrityQuestions.length === 0 || allSurveyIntegrityMax)) {
        overallScore = 100;
      } else {
        // Calculate answered questions count for each category
        const answeredCorruptionCount = corruptionQuestions.filter(q => data[q.id]).length;
        const answeredServiceQualityCount = serviceQualityQuestions.filter(q => data[q.id]).length;
        const answeredSurveyIntegrityCount = surveyIntegrityQuestions.filter(q => data[q.id]).length;
        
        // Calculate total answered questions
        const totalAnswered = answeredCorruptionCount + answeredServiceQualityCount + answeredSurveyIntegrityCount;
        
        // Calculate weights based on answered questions
        const cpWeight = answeredCorruptionCount / totalAnswered;
        const sqWeight = answeredServiceQualityCount / totalAnswered;
        const siWeight = answeredSurveyIntegrityCount / totalAnswered;
        
        // Calculate weighted overall score
        if (answeredCorruptionCount > 0) {
          overallScore += avgCorruptionScore * cpWeight;
        }
        if (answeredServiceQualityCount > 0) {
          overallScore += avgServiceQualityScore * sqWeight;
        }
        if (answeredSurveyIntegrityCount > 0) {
          overallScore += avgSurveyIntegrityScore * siWeight;
        }
        
        // Check for high scores that might need rounding up
        const allScoresVeryHigh = 
          (answeredCorruptionCount === 0 || avgCorruptionScore >= 99) &&
          (answeredServiceQualityCount === 0 || avgServiceQualityScore >= 99) &&
          (answeredSurveyIntegrityCount === 0 || avgSurveyIntegrityScore >= 99);
        
        // If all individual scores are very high and overall is close to 100, round up
        if (allScoresVeryHigh && overallScore > 99) {
          overallScore = 100;
        }
        
        // Handle floating-point errors by rounding to 2 decimal places
        overallScore = Math.round(overallScore * 100) / 100;
        
        // Final validation: ensure that if all category scores are excellent, overall is 100%
        if (
          (answeredCorruptionCount === 0 || avgCorruptionScore > 99.5) &&
          (answeredServiceQualityCount === 0 || avgServiceQualityScore > 99.5) &&
          (answeredSurveyIntegrityCount === 0 || avgSurveyIntegrityScore > 99.5) &&
          overallScore > 99.5
        ) {
          overallScore = 100;
        }
      }
      
      // Ensure we have valid service data even if currentServiceData is somehow missing
      const serviceName = currentServiceData?.name || `Layanan ${serviceId}`;
      const serviceDescription = currentServiceData?.description || 'Layanan UIN Antasari';
      
      // Create a response object
      const response = {
        serviceId,
        userId: user.id,
        serviceName: serviceName,
        serviceDescription: serviceDescription,
        completedAt: new Date().toISOString(),
        answers: Object.entries(data).map(([questionId, answer]) => {
          const question = surveyQuestions.find(q => q.id === questionId);
          return {
            questionId,
            questionText: question ? question.text : '',
            answer,
            category: question ? question.category : ''
          };
        }),
        scores: {
          corruption: avgCorruptionScore,
          serviceQuality: avgServiceQualityScore,
          surveyIntegrity: avgSurveyIntegrityScore,
          overall: overallScore
        }
      };
      
      // Save the response
      const responseId = saveResponse(response);
      console.log('Survey response saved with ID:', responseId);
      
      // Mark the service as completed
      markServiceAsCompleted(serviceId);
      console.log('Service marked as completed:', serviceId);
      
      // Clear saved progress
      localStorage.removeItem(`survey_progress_${serviceId}`);
      
      // Show brief success message
      setSuccess(true);
      
      // Redirect to ending page with feedback form after a short delay
      setTimeout(() => {
        try {
          console.log('Navigating to ending page with data:', {
            serviceName: serviceName,
            overallScore: Math.round(overallScore),
            responseId: responseId || 'temp-' + Date.now()
          });
          
          // Navigate to the ending page and pass necessary data
          navigate(`/ending/${serviceId}`, {
            state: {
              serviceName: serviceName,
              overallScore: Math.round(overallScore),
              responseId: responseId || 'temp-' + Date.now(), // Fallback ID if needed
              completedAt: new Date().toISOString()
            }
          });
        } catch (navigationError) {
          console.error('Error navigating to ending page:', navigationError);
          // As a fallback, try a direct window location change
          window.location.href = `/ending/${serviceId}`;
        }
      }, 1500); // Shorter delay since we're going to another form
    } catch (error) {
      console.error('Error submitting survey:', error);
      setError('Terjadi kesalahan saat mengirim survei. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle going back
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle clearing saved progress
  const handleResetProgress = () => {
    if (window.confirm('Anda yakin ingin menghapus semua jawaban?')) {
      // Clear form values
      surveyQuestions.forEach(question => {
        setValue(question.id, undefined);
      });
      
      // Remove from localStorage
      localStorage.removeItem(`survey_progress_${serviceId}`);
      
      // Show feedback
      alert('Progres telah direset');
    }
  };
  
  // Show duplicate survey warning
  if (isDuplicate && previousResponse) {
    const completedDate = previousResponse.completedAt ? 
      new Date(previousResponse.completedAt).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'sebelumnya';
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="relative overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-teal-400/20 to-emerald-400/20"></div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-teal-200 rounded-full opacity-10"></div>
            <div className="absolute -top-8 -left-8 w-48 h-48 bg-blue-200 rounded-full opacity-10"></div>
            
            <div className="relative p-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ClipboardCheck className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Survei Sudah Terisi
              </h2>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100 mb-6">
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2">
                      Anda sudah mengisi survei untuk layanan ini pada:
                    </p>
                    <p className="font-medium text-blue-600">
                      {completedDate}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    Untuk menjaga keakuratan data dan menghindari duplikasi, setiap pengguna hanya dapat mengisi survei sekali untuk setiap layanan.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to={`/history/${serviceId}`}
                  className="relative py-3.5 px-8 rounded-full text-white font-medium 
                  flex items-center justify-center
                  bg-gradient-to-r from-blue-400 to-teal-400
                  shadow-lg shadow-blue-400/20
                  overflow-hidden transition-all duration-200
                  hover:shadow-xl hover:shadow-blue-400/30 hover:translate-y-[-2px]"
                  style={{
                    boxShadow: '0 10px 20px -10px rgba(79, 209, 197, 0.5), 0 4px 6px -2px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {/* Inner reflection effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></span>
                  {/* Bottom shadow */}
                  <span className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-500/20 to-transparent"></span>
                  
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="relative z-10">Lihat Detail Survei</span>
                </Link>
                
                <Link
                  to="/directory"
                  className="relative py-3.5 px-8 rounded-full flex items-center justify-center
                  bg-gradient-to-r from-gray-50 to-gray-100
                  text-gray-700 font-medium
                  border border-gray-200
                  shadow-md shadow-gray-200/50 
                  overflow-hidden transition-all duration-200
                  hover:shadow-lg hover:shadow-gray-200/70 hover:translate-y-[-2px]"
                >
                  {/* Inner reflection effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/80 to-white/40"></span>
                  {/* Bottom shadow */}
                  <span className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-200/30 to-transparent"></span>
                  
                  <ArrowLeft className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10">Kembali ke Direktori Layanan</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-700">Memuat...</h2>
          <p className="text-gray-500 mt-2">Sedang menyiapkan survey</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">Terjadi Kesalahan</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }
  
  // Show success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 rounded-lg max-w-md">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-semibold text-green-700 mb-2">Terima Kasih!</h2>
          <p className="text-gray-600 mb-6">Survei Anda telah berhasil disimpan. Anda akan dialihkan ke halaman riwayat survei.</p>
          <div className="w-full max-w-xs mx-auto">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header with back button and reset progress button */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            onClick={handleBack}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </motion.button>
          
          {answeredCount > 0 && (
            <motion.button
              onClick={handleResetProgress}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-500 hover:text-red-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
              Reset Progres
            </motion.button>
          )}
        </div>
        
        {/* Survey header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
            SURVEI PERSEPSI KORUPSI
          </h1>
          
          {currentServiceData && (
            <p className="text-gray-600 text-lg">
              {currentServiceData.name}
            </p>
          )}
          
          <div className="flex items-center justify-center mt-4 text-gray-500 text-sm">
            <Info className="w-4 h-4 mr-2" />
            <p>Jawab semua pertanyaan untuk menyelesaikan survei</p>
          </div>
          
          {/* Show auto-save indicator if we have any progress */}
          {answeredCount > 0 && (
            <div className="mt-2 flex items-center justify-center text-xs text-green-600">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Progres tersimpan otomatis
            </div>
          )}
        </motion.div>
        
        {/* Survey form */}
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-10"
        >
          {/* Use the SurveyQuestionList component */}
          <SurveyQuestionList 
            watchedValues={(id) => formValues && formValues[id]}
            onSelectOption={handleSelectOption}
            errors={errors}
            register={register}
          />
          
          {/* Submit button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <motion.button
              type="submit"
              disabled={submitting || progressPercentage < 100}
              className={`py-4 px-10 rounded-xl text-white font-semibold shadow-lg flex items-center justify-center transition-all ${
                progressPercentage === 100 
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
                  : 'bg-gray-400'
              }`}
              whileHover={progressPercentage === 100 ? { scale: 1.03, y: -2 } : {}}
              whileTap={progressPercentage === 100 ? { scale: 0.98 } : {}}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Mengirim Respon...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-3" />
                  Kirim Survei
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
        
        {/* Enhanced Progress pill with fixed position at bottom-right */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="relative">
            {/* The main progress pill that is always visible */}
            <motion.div 
              className="bg-white/80 backdrop-blur-md shadow-lg rounded-full 
                py-2 px-3.5
                flex flex-row items-center gap-2
                border border-gray-100 cursor-pointer"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => setShowQuestionNav(!showQuestionNav)}
            >
              {/* Compact layout for all screen sizes */}
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-xs font-medium text-white shadow-sm">
                  {answeredCount}
                </div>
                <span className="text-gray-600 text-xs font-medium">/ {surveyQuestions.length}</span>
              </div>
              
              {/* Progress percentage */}
              <span className="text-teal-500 font-semibold text-xs">
                {Math.round(progressPercentage)}%
              </span>
              
              {/* Progress bar */}
              <div className="w-12 h-2 bg-gray-100/70 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                />
              </div>
            </motion.div>
            
            {/* Question Navigation Popup - Position above the pill when at bottom */}
            <AnimatePresence>
              {showQuestionNav && (
                <motion.div 
                  ref={questionNavRef}
                  className="absolute bottom-full mb-2 right-0
                    bg-white rounded-xl shadow-xl border border-gray-200 p-4 
                    w-[280px] sm:w-[340px]"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800">Navigasi Pertanyaan</h3>
                    <button 
                      onClick={() => setShowQuestionNav(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
                    {/* Corruption Perception Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Persepsi Korupsi</h4>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {corruptionQuestions.map((question, index) => {
                          const isAnswered = formValues && formValues[question.id];
                          return (
                            <motion.button
                              key={question.id}
                              onClick={() => scrollToQuestion(question.id)}
                              className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium
                                ${isAnswered 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : 'bg-red-50 text-red-800 border border-red-100'
                                }`}
                              whileHover={{ y: -2, scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {index + 1}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Service Quality Section */}
                    {serviceQualityQuestions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Kualitas Pelayanan</h4>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                          {serviceQualityQuestions.map((question, index) => {
                            const isAnswered = formValues && formValues[question.id];
                            const displayIndex = corruptionQuestions.length + index + 1;
                            return (
                              <motion.button
                                key={question.id}
                                onClick={() => scrollToQuestion(question.id)}
                                className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium
                                  ${isAnswered 
                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                    : 'bg-red-50 text-red-800 border border-red-100'
                                  }`}
                                whileHover={{ y: -2, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {displayIndex}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Integrity Questions Section */}
                    {integrityQuestions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Integritas Layanan</h4>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                          {integrityQuestions.map((question, index) => {
                            const isAnswered = formValues && formValues[question.id];
                            const displayIndex = corruptionQuestions.length + serviceQualityQuestions.length + index + 1;
                            return (
                              <motion.button
                                key={question.id}
                                onClick={() => scrollToQuestion(question.id)}
                                className={`h-10 rounded-lg flex items-center justify-center text-sm font-medium
                                  ${isAnswered 
                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                    : 'bg-red-50 text-red-800 border border-red-100'
                                  }`}
                                whileHover={{ y: -2, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {displayIndex}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-sm bg-green-100 border border-green-200 mr-1"></div>
                      <span className="text-xs text-gray-600">Dijawab</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-sm bg-red-50 border border-red-100 mr-1"></div>
                      <span className="text-xs text-gray-600">Belum Dijawab</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* CSS for question highlighting */}
        <style jsx="true">{`
          .highlight-question {
            animation: pulse-border 0.8s ease-in-out;
          }
          
          @keyframes pulse-border {
            0%, 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.2); }
            50% { box-shadow: 0 0 0 4px rgba(56, 189, 248, 0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SurveyPage; 