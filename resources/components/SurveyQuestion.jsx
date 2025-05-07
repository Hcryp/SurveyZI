import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export const surveyQuestions = [
  {
    id: 'q1',
    text: 'Petugas di unit layanan ini memberikan pelayanan secara khusus (diskriminatif)?',
    options: [
      { value: '1', label: 'Selalu Ada', score: 1 },
      { value: '2', label: 'Sering Ada', score: 2 },
      { value: '3', label: 'Kadang-Kadang Ada', score: 3 },
      { value: '4', label: 'Jarang Ada', score: 4 },
      { value: '5', label: 'Hampir Tidak Pernah Ada', score: 5 },
      { value: '6', label: 'Tidak Ada Sama Sekali', score: 6 }
    ],
    category: 'corruption_perception'
  },
  {
    id: 'q2',
    text: 'Petugas di unit layanan ini membeda-bedakan pelayanan karena faktor suku, agama, kekerabatan almamater dan sejenisnya?',
    options: [
      { value: '1', label: 'Selalu Ada', score: 1 },
      { value: '2', label: 'Sering Ada', score: 2 },
      { value: '3', label: 'Kadang-Kadang Ada', score: 3 },
      { value: '4', label: 'Jarang Ada', score: 4 },
      { value: '5', label: 'Hampir Tidak Pernah Ada', score: 5 },
      { value: '6', label: 'Tidak Ada Sama Sekali', score: 6 }
    ],
    category: 'corruption_perception'
  }
];

const QuestionBadge = ({ number }) => (
  <motion.div 
    className="relative flex-shrink-0"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-30 blur-md transform scale-110"></div>
    <div className="absolute inset-0 rounded-full bg-teal-600/30 transform translate-y-1 blur-sm"></div>
    <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full text-white font-bold shadow-lg">
      <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-white/30 rounded-full transform -translate-y-1/4"></div>
      <div className="absolute bottom-1 left-1/4 w-1/2 h-1/6 bg-black/10 rounded-full"></div>
      <span className="text-xl transform -translate-y-px">{number}</span>
    </div>
  </motion.div>
);

const ScoreBadge = ({ score, isSelected }) => (
  <motion.div 
    className={`px-3 py-1.5 rounded-full flex items-center justify-center ${
      isSelected 
        ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white font-medium shadow-md' 
        : 'bg-gray-100 text-gray-700'
    }`}
    whileHover={{ y: -3, scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <span className="text-xs font-medium">Skor {score}</span>
  </motion.div>
);

const SurveyQuestion = ({
  questionNumber,
  questionText,
  options,
  selectedOption,
  onSelectOption,
  isRequired = true,
  error = false,
  theme = 'teal',
}) => {
  const isBlueTheme = theme === 'blue';
  const isPurpleTheme = theme === 'purple';
  
  const headerGradient = isPurpleTheme
    ? "bg-gradient-to-r from-purple-50 to-pink-50"
    : isBlueTheme 
      ? "bg-gradient-to-r from-blue-50 to-indigo-50" 
      : "bg-gradient-to-r from-blue-50 to-green-50";
    
  const badgeGradient = isPurpleTheme
    ? "from-purple-400 to-pink-500"
    : isBlueTheme
      ? "from-blue-400 to-indigo-500"
      : "from-green-400 to-teal-500";
    
  const selectedBg = isPurpleTheme
    ? "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
    : isBlueTheme
      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
      : "bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200";
    
  const selectedBorder = isPurpleTheme
    ? "border-purple-500"
    : isBlueTheme 
      ? "border-blue-500" 
      : "border-teal-500";
  
  const selectedDot = isPurpleTheme
    ? "bg-purple-500"
    : isBlueTheme 
      ? "bg-blue-500" 
      : "bg-teal-500";
      
  const checkColor = isPurpleTheme
    ? "text-purple-500"
    : isBlueTheme
      ? "text-indigo-500"
      : "text-teal-500";
      
  const badgeShadow = isPurpleTheme
    ? "bg-purple-600/30"
    : isBlueTheme
      ? "bg-indigo-600/30"
      : "bg-teal-600/30";
  
  const boxShadowHover = isPurpleTheme
    ? "0 4px 20px rgba(168, 85, 247, 0.15)"
    : isBlueTheme 
      ? "0 4px 20px rgba(79, 70, 229, 0.15)" 
      : "0 4px 20px rgba(20, 184, 166, 0.15)";
      
  const borderHover = isPurpleTheme
    ? "border-2 border-purple-400/50 shadow-xl shadow-purple-100"
    : isBlueTheme 
      ? "border-2 border-indigo-400/50 shadow-xl shadow-indigo-100" 
      : "border-2 border-teal-400/50 shadow-xl shadow-teal-100";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: selectedOption 
          ? "0 2px 8px rgba(0, 0, 0, 0.08)"
          : "0 1px 3px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl overflow-hidden bg-white ${
        selectedOption 
          ? "border border-gray-200 shadow-md"
          : "border border-gray-100 shadow-sm"
      }`}
    >
      <div className={`${headerGradient} p-6 relative overflow-hidden`}>
        <div className={`absolute -top-10 -right-10 w-32 h-32 ${
          isPurpleTheme ? "bg-purple-100" : isBlueTheme ? "bg-indigo-100" : "bg-teal-100"
        } rounded-full opacity-40`}></div>
        <div className={`absolute -bottom-8 -left-8 w-24 h-24 ${
          isPurpleTheme ? "bg-pink-100" : isBlueTheme ? "bg-blue-100" : "bg-blue-100"
        } rounded-full opacity-30`}></div>
        
        <div className="flex items-start gap-5 relative z-10">
          <motion.div 
            className="relative flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${
              isPurpleTheme ? "from-purple-400 to-pink-500" : 
              isBlueTheme ? "from-blue-400 to-indigo-500" : 
              "from-teal-400 to-blue-500"
            } opacity-30 blur-md transform scale-110`}></div>
            
            <div className={`absolute inset-0 rounded-full ${badgeShadow} transform translate-y-1 blur-sm`}></div>
            
            <div className={`relative flex items-center justify-center w-12 h-12 bg-gradient-to-br ${badgeGradient} rounded-full text-white font-bold shadow-lg`}>
              <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-white/30 rounded-full transform -translate-y-1/4"></div>
              <div className="absolute bottom-1 left-1/4 w-1/2 h-1/6 bg-black/10 rounded-full"></div>
              <span className="text-xl transform -translate-y-px">{questionNumber}</span>
            </div>
          </motion.div>
          
          <h2 className="text-lg md:text-xl font-medium text-gray-800 pt-2.5">
            {questionText}
          </h2>
        </div>
        
        {selectedOption && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-4 right-4 ${checkColor}`}
          >
            <CheckCircle className="w-6 h-6" />
          </motion.div>
        )}
      </div>
      
      <div className="space-y-3 p-4 bg-white">
        {options.map((option) => {
          const isSelected = selectedOption === option.value || selectedOption === option.label;
          
          return (
            <motion.label 
              key={option.value || option.label}
              className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                isSelected 
                  ? selectedBg
                  : "bg-gray-50 border border-gray-100 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                  isSelected 
                    ? `border-2 ${selectedBorder} bg-white`
                    : "border border-gray-300 bg-white"
                }`}>
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`h-2.5 w-2.5 ${selectedDot} rounded-full`}
                    />
                  )}
                </div>
                <span className={`ml-3 ${isSelected ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                  {option.label}
                </span>
              </div>
              
              {option.score !== 0 && (
                <motion.div 
                  className={`px-3 py-1.5 rounded-full flex items-center justify-center ${
                    isSelected 
                      ? isPurpleTheme
                        ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium shadow-md"
                        : isBlueTheme
                          ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-medium shadow-md"
                          : "bg-gradient-to-r from-teal-400 to-blue-500 text-white font-medium shadow-md"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-xs font-medium">Skor {option.score}</span>
                </motion.div>
              )}
              
              <input 
                type="radio"
                value={option.value || option.label}
                checked={isSelected}
                onChange={() => onSelectOption(option.value || option.label)}
                className="sr-only"
              />
            </motion.label>
          );
        })}
        
        {isRequired && error && (
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-red-600 px-3 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            Pertanyaan ini wajib diisi
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export const SurveyQuestionList = ({ 
  watchedValues, 
  onSelectOption, 
  errors,
  register
}) => {
  const questionRefs = useRef({});
  const [lastAnsweredQuestion, setLastAnsweredQuestion] = useState(null);
  const [highlightedQuestion, setHighlightedQuestion] = useState(null);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const corruptionQuestions = surveyQuestions.filter(q => q.category === 'corruption_perception');
  const serviceQualityQuestions = surveyQuestions.filter(q => q.category === 'service_quality');
  const integrityQuestions = surveyQuestions.filter(q => q.category === 'survey_integrity');
  
  const allQuestions = [
    ...corruptionQuestions,
    ...serviceQualityQuestions,
    ...integrityQuestions
  ];
  
  const findNextQuestion = (currentQuestionId) => {
    const currentIndex = allQuestions.findIndex(q => q.id === currentQuestionId);
    
    if (currentIndex !== -1 && currentIndex < allQuestions.length - 1) {
      return allQuestions[currentIndex + 1].id;
    }
    
    return null;
  };
  
  const scrollToNextQuestion = (currentQuestionId) => {
    const nextQuestionId = findNextQuestion(currentQuestionId);
    
    if (nextQuestionId && questionRefs.current[nextQuestionId]) {
      const currentElement = questionRefs.current[currentQuestionId];
      const nextElement = questionRefs.current[nextQuestionId];
      
      const windowHeight = window.innerHeight;
      const nextRect = nextElement.getBoundingClientRect();
      const nextElementHeight = nextRect.height;
      
      const scrollMargin = 80;
      
      const targetScrollPosition = window.pageYOffset + nextRect.top - scrollMargin;
      
      const isElementTooLarge = nextElementHeight > (windowHeight - scrollMargin * 1.5);
      
      const isFullyVisible = (
        nextRect.top >= scrollMargin &&
        nextRect.bottom <= windowHeight - 20
      );
      
      if (!isFullyVisible) {
        window.scrollTo({
          top: targetScrollPosition,
          behavior: 'smooth'
        });
        
        setHighlightedQuestion(nextQuestionId);
        
        setTimeout(() => {
          setHighlightedQuestion(null);
        }, 800);
      }
    }
  };
  
  const handleSelectOption = (questionId, value) => {
    onSelectOption(questionId, value);
    setLastAnsweredQuestion(questionId);
    
    setTimeout(() => {
      scrollToNextQuestion(questionId);
    }, 0);
  };
  
  const pulseClass = "border-2 border-gray-200 shadow-md";

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-5xl mx-auto"
    >
      <style>
        {`
          @keyframes pulse-highlight {
            0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2); }
            50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0); }
          }
          .animate-pulse-highlight {
            animation: pulse-highlight 0.8s ease-in-out;
          }
        `}
      </style>

      <div className="space-y-10">
        <div className="space-y-8">
          {corruptionQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              variants={itemVariants}
              className={`relative ${highlightedQuestion === question.id ? pulseClass : ''}`}
              ref={el => questionRefs.current[question.id] = el}
              id={`question-${question.id}`}
            >
              {index < corruptionQuestions.length - 1 && (
                <div className="absolute left-6 top-full w-0.5 h-8 bg-gradient-to-b from-teal-300 to-transparent z-0"></div>
              )}
              
              <SurveyQuestion
                questionNumber={index + 1}
                questionText={question.text}
                options={question.options}
                selectedOption={watchedValues ? watchedValues(question.id) : null}
                onSelectOption={(value) => handleSelectOption(question.id, value)}
                isRequired={true}
                error={errors && errors[question.id]}
              />
              {register && (
                <input 
                  type="hidden" 
                  {...register(question.id, { required: true })}
                />
              )}
            </motion.div>
          ))}
        </div>
        
        {serviceQualityQuestions.length > 0 && (
          <div className="space-y-8">
            <motion.div 
              variants={itemVariants}
              className="py-4 mb-4"
              id="service-quality-section"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                Kualitas Pelayanan
              </h2>
              <p className="text-gray-600 text-center">
                Pertanyaan berikut terkait dengan kualitas pelayanan yang Anda terima
              </p>
            </motion.div>
            
            {serviceQualityQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                variants={itemVariants}
                className={`relative ${highlightedQuestion === question.id ? pulseClass : ''}`}
                ref={el => questionRefs.current[question.id] = el}
                id={`question-${question.id}`}
              >
                {index < serviceQualityQuestions.length - 1 && (
                  <div className="absolute left-6 top-full w-0.5 h-8 bg-gradient-to-b from-blue-300 to-transparent z-0"></div>
                )}
                
                <SurveyQuestion
                  questionNumber={corruptionQuestions.length + index + 1}
                  questionText={question.text}
                  options={question.options}
                  selectedOption={watchedValues ? watchedValues(question.id) : null}
                  onSelectOption={(value) => handleSelectOption(question.id, value)}
                  isRequired={true}
                  error={errors && errors[question.id]}
                  theme="blue"
                />
                {register && (
                  <input 
                    type="hidden" 
                    {...register(question.id, { required: true })}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
        
        {integrityQuestions.length > 0 && (
          <div className="space-y-8">
            <motion.div 
              variants={itemVariants}
              className="py-4 mb-4"
              id="integrity-section"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                Integritas Layanan
              </h2>
              <p className="text-gray-600 text-center">
                Kami memerlukan pendapat Anda mengenai integritas layanan
              </p>
            </motion.div>
            
            {integrityQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                variants={itemVariants}
                className={`relative ${highlightedQuestion === question.id ? pulseClass : ''}`}
                ref={el => questionRefs.current[question.id] = el}
                id={`question-${question.id}`}
              >
                <SurveyQuestion
                  questionNumber={corruptionQuestions.length + serviceQualityQuestions.length + index + 1}
                  questionText={question.text}
                  options={question.options}
                  selectedOption={watchedValues ? watchedValues(question.id) : null}
                  onSelectOption={(value) => handleSelectOption(question.id, value)}
                  isRequired={true}
                  error={errors && errors[question.id]}
                  theme="purple"
                />
                {register && (
                  <input 
                    type="hidden" 
                    {...register(question.id, { required: true })}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SurveyQuestion;