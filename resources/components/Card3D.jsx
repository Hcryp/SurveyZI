import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * A modernized 3D Interactive Card with smooth gradients and soft shadows
 * Updated for 2025-2026 design trends
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Card content
 * @param {boolean} props.interactive - Enable 3D rotation effect on hover
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.glass - Apply glass morphism effect
 * @param {boolean} props.shadow - Apply shadow effect
 * @param {string} props.variant - Card color variant (default, primary, secondary, accent)
 * @param {string} props.borderColor - Border color class
 */
const Card3D = ({ 
  children, 
  interactive = true, 
  className = '',
  glass = false,
  shadow = true,
  variant = 'default',
  borderColor = 'border-surface-200/50',
  ...rest 
}) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  
  // Theme variants
  const variants = {
    default: {
      bg: glass ? 'bg-white/70' : 'bg-white',
      highlight: 'from-surface-50/20',
      border: borderColor
    },
    primary: {
      bg: glass ? 'bg-primary-50/70' : 'bg-primary-50/90',
      highlight: 'from-primary-100/30 to-transparent',
      border: 'border-primary-200/50'
    },
    secondary: {
      bg: glass ? 'bg-secondary-50/70' : 'bg-secondary-50/90',
      highlight: 'from-secondary-100/30 to-transparent',
      border: 'border-secondary-200/50'
    },
    accent: {
      bg: glass ? 'bg-accent-50/70' : 'bg-accent-50/90',
      highlight: 'from-accent-100/30 to-transparent',
      border: 'border-accent-200/50'
    }
  };
  
  // Handle mouse move for 3D rotation effect
  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Set rotation based on mouse position
    // Limiting rotation to a subtle effect (max 4 degrees)
    const maxRotate = 4;
    const rotateYValue = (mouseX / (rect.width / 2)) * maxRotate;
    const rotateXValue = -(mouseY / (rect.height / 2)) * maxRotate;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };
  
  const handleMouseEnter = () => {
    if (!interactive) return;
    setScale(1.01);
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotateX(0);
    setRotateY(0);
    setScale(1);
    setIsHovered(false);
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`
        rounded-2xl p-6 transition-all duration-300 border ${variants[variant].border}
        ${variants[variant].bg} 
        ${glass ? 'glass-morphism backdrop-blur-md' : ''}
        font-jakarta relative overflow-hidden ${className}
      `}
      style={{
        transformStyle: interactive ? 'preserve-3d' : 'flat',
        perspective: '1200px',
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        boxShadow: shadow 
          ? isHovered
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.05), 0 8px 24px -4px rgba(0, 0, 0, 0.03)'
            : '0 4px 12px -2px rgba(0, 0, 0, 0.03), 0 2px 6px -1px rgba(0, 0, 0, 0.02)'
          : 'none'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {/* Gradient highlight effect */}
      {interactive && (
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${variants[variant].highlight} opacity-0 pointer-events-none`}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Inner content wrapper with shadow and counter-rotation */}
      <div 
        className="relative z-10 w-full h-full"
        style={{ 
          transform: interactive ? `translateZ(10px)` : 'none',
          transformStyle: 'preserve-3d'
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default Card3D; 