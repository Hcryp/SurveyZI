import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon,
  delay = 0,
  index,
  isIOS = false, 
  isLowEnd = false
}) => {
  // Determine the appropriate animation settings based on device capabilities
  const animationEnabled = !isLowEnd;
  
  // iOS-specific adjustments for smoother performance
  const easeType = isIOS ? "easeOut" : [0.25, 0.1, 0.25, 1.0];
  const animationDuration = isIOS ? 0.4 : 0.5;
  
  // iOS-specific hover effects
  const hoverAnimation = animationEnabled 
    ? (isIOS 
        ? { scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }
        : { y: -5, transition: { duration: 0.2 } })
    : {};

  return (
    <motion.div
      initial={animationEnabled ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      whileInView={animationEnabled ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: animationDuration, 
        delay: animationEnabled ? delay : 0,
        ease: easeType
      }}
      whileHover={hoverAnimation}
      className={clsx(
        "relative rounded-2xl p-6 sm:p-8 shadow-lg bg-white flex flex-col h-full",
        "border border-gray-100 overflow-hidden",
        "transition-all duration-200",
        isIOS ? "ios-card-transform ios-safe-touch" : ""
      )}
      style={isIOS ? { WebkitTapHighlightColor: 'transparent' } : {}}
    >
      {/* Decorative elements - hidden on low-end devices */}
      {!isLowEnd && (
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary-50 rounded-full opacity-20"></div>
      )}
      
      {/* Card content */}
      <div className="relative z-10">
        <div 
          className={clsx(
            "w-14 h-14 flex items-center justify-center rounded-xl mb-5",
            "bg-primary-100 text-primary-700",
            isIOS ? "ios-no-highlight" : ""
          )}
        >
          <Icon size={28} className={isIOS ? "ios-icon-render" : ""} />
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold font-display mb-3 text-secondary-900">
          {title}
        </h3>
        
        <p className="text-secondary-600 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureCard; 