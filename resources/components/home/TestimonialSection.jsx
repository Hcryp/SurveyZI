import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Button3D from '../Button3D';

const TestimonialSection = ({ 
  testimonialsRef, 
  testimonials, 
  isMobile, 
  isIOS,
  isLowEnd,
  optimizedCardVariants,
  optimizedIconVariants
}) => {
  return (
    <section ref={testimonialsRef} className={clsx(
      "py-10 md:py-14 lg:py-20 relative overflow-hidden",
      isIOS ? 'ios-momentum-scroll' : ''
    )}>
      <div className="absolute inset-0"></div>
      <div className="absolute inset-0"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 sm:text-4xl">
            Apa Kata Pengguna
          </h2>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-secondary-600 max-w-3xl mx-auto">
            Pendapat dari pengguna platform survei layanan UIN Antasari
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
          {/* Limit testimonials to 2 on mobile for better performance */}
          {testimonials.slice(0, isMobile ? 2 : testimonials.length).map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
              isLowEnd={isLowEnd}
              isIOS={isIOS}
            />
          ))}
        </div>
        
        {isMobile && testimonials.length > 2 && (
          <div className="mt-4 flex justify-center">
            <Link to="/testimonials">
              <Button3D 
                variant="light" 
                size="sm" 
                className={clsx(
                  "px-4 py-2 rounded-full border border-gray-200",
                  isIOS ? 'ios-touch-button min-h-[44px]' : ''
                )}
                style={isIOS ? { WebkitAppearance: 'none' } : {}}
              >
                <span>Lihat {testimonials.length - 2} Ulasan Lainnya</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button3D>
            </Link>
          </div>
        )}
        
        {!isMobile && (
          <div className="mt-10 text-center">
            <Link to="/testimonials">
              <motion.button 
                whileHover={isLowEnd ? {} : { 
                  y: isIOS ? 0 : -2,
                  scale: isIOS ? 1.05 : 1,
                  color: '#1d4ed8' // Darker blue on hover
                }}
                className={clsx(
                  "inline-flex items-center justify-center text-primary-600 hover:text-primary-700 font-medium gap-1 group",
                  isIOS ? 'min-h-[44px] px-4' : ''
                )}
                style={isIOS ? { WebkitTapHighlightColor: 'transparent' } : {}}
              >
                Lihat Semua Ulasan
                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

// Separate component for individual testimonial cards for better performance
const TestimonialCard = memo(({ testimonial, index, isLowEnd, isIOS }) => {
  // iOS specific animations that are smoother on Safari
  const iosHoverAnimation = isIOS ? {
    scale: 1.02, // Subtle scale instead of Y translation for better iOS performance
    boxShadow: "0px 15px 30px -10px rgba(0,0,0,0.1)",
    transition: { duration: 0.3, ease: "easeOut" }
  } : {};
  
  // Combine platform-specific animations
  const hoverAnimation = isLowEnd ? {} : (
    isIOS ? iosHoverAnimation : { 
      y: -4,
      boxShadow: "0px 15px 30px -10px rgba(0,0,0,0.1)", 
      transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } 
    }
  );
    
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: isIOS ? 0.4 : 0.3, 
        delay: index * (isLowEnd ? 0.05 : 0.1),
        ease: isIOS ? "easeOut" : [0.25, 0.1, 0.25, 1]
      }}
      whileHover={hoverAnimation}
      className={clsx(
        "rounded-xl md:rounded-2xl p-6 md:p-8 relative transition-all duration-150 backdrop-blur-sm border overflow-hidden",
        testimonial.isFeatured 
          ? "bg-gradient-to-br from-primary-50 to-white shadow-xl border-primary-100 ring-1 ring-primary-100 ring-opacity-50" 
          : "bg-white shadow-lg border-gray-100",
        isIOS ? "ios-card-transform" : ""
      )}
      style={isIOS ? { 
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none'
      } : {}}
    >
      {/* Only show decorative elements on higher-end devices */}
      {!isLowEnd && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-5">
            <div className="w-full h-full rounded-full bg-primary-500"></div>
          </div>
          
          {testimonial.isFeatured && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-secondary-300 to-primary-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
              Ulasan Teratas
            </div>
          )}
          
          {testimonial.name === 'Anonymous' && (
            <div className="absolute bottom-6 right-6 text-gray-100 opacity-30">
              <MessageSquare className="w-16 h-16" />
            </div>
          )}
          
          <div className="absolute bottom-4 right-8 text-7xl text-primary-100 opacity-50 font-serif z-0">
            "
          </div>
        </>
      )}
      
      {/* Content area */}
      <div className="flex flex-col h-full z-10 relative">
        <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-5">
          <div className={clsx(
            "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg font-bold shadow-md overflow-hidden border-2",
            testimonial.isFeatured ? "border-primary-200" : "border-white"
          )}>
            {testimonial.profileImage ? (
              <img 
                src={testimonial.profileImage} 
                alt={testimonial.name} 
                className="w-full h-full object-cover" 
                loading="lazy" 
                fetchPriority="low" 
              />
            ) : (
              <div className="w-full h-full">
                <img 
                  src={testimonial.gender === 'female' 
                    ? '/profile_picture_female.png' 
                    : '/profile_picture_male.png'
                  } 
                  alt={testimonial.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  fetchPriority="low"
                  onError={(e) => {
                    // Fallback if image doesn't load
                    e.target.onerror = null;
                    e.target.parentNode.innerHTML = `<div class="${clsx(
                      'w-full h-full flex items-center justify-center',
                      testimonial.isFeatured ? 'bg-primary-100 text-primary-800' : 'bg-purple-100 text-purple-800'
                    )}">${testimonial.name.charAt(0)}</div>`;
                  }}
                  style={isIOS ? { WebkitUserDrag: 'none' } : {}}
                />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-secondary-900 text-base md:text-lg font-display">{testimonial.name}</h3>
            <p className="text-xs md:text-sm text-secondary-600">{testimonial.role}</p>
            <StarRating rating={testimonial.rating} timestamp={testimonial.timestamp} isIOS={isIOS} />
          </div>
        </div>
        
        <div className="mb-0 flex-1 relative">
          <p className="text-sm md:text-base text-secondary-700 line-clamp-3 md:line-clamp-4 relative z-10">
            {testimonial.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

// Optimized star rating component
const StarRating = memo(({ rating, timestamp, isIOS }) => {
  // iOS-specific animation that's smoother
  const starAnimation = isIOS ? {
    opacity: [0, 1],
    scale: [0.8, 1],
    transition: { duration: 0.2 }
  } : {
    opacity: [0, 1],
    scale: [0, 1],
    transition: { duration: 0.2 }
  };

  return (
    <div className="flex items-center mt-1 md:mt-1.5 gap-0.5 md:gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: isIOS ? 0.8 : 0 }}
          animate={starAnimation}
          transition={{ 
            duration: 0.2, 
            delay: 0.1 + (i * 0.05),
            ease: isIOS ? "easeOut" : "spring"
          }}
        >
          <Star 
            className={clsx(
              "w-4 h-4 md:w-5 md:h-5 transition-all duration-300",
              i < rating
                ? 'text-amber-500 fill-amber-500' 
                : 'text-gray-300'
            )}
          />
        </motion.div>
      ))}
      <span className="text-xs text-secondary-500 ml-2">{timestamp}</span>
    </div>
  );
});

export default memo(TestimonialSection); 