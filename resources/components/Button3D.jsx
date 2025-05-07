import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modern 3D Button component with smooth gradient and Apple-inspired styling
 * Updated for 2025-2026 design trends with support for fully rounded buttons
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button style variant (primary, accent, light)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.fullWidth - Whether button takes full width
 * @param {ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 */
const Button3D = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  children, 
  onClick, 
  disabled = false,
  className = '',
  ...rest 
}) => {
  // Size classes - adjusted for better Apple-like proportions
  const sizeClasses = {
    sm: 'py-2 px-4 text-xs',
    md: 'py-2.5 px-5 text-sm',
    lg: 'py-3.5 px-7 text-base'
  };
  
  // Gradient backgrounds - enhanced for more Apple-like aesthetics
  const gradients = {
    primary: {
      bg: 'bg-gradient-3d-green',
      shadow: 'rgba(5, 150, 105, 0.2)',
      text: 'text-white',
      ring: 'focus:ring-primary-500/30'
    },
    secondary: {
      bg: 'bg-gradient-3d-blue',
      shadow: 'rgba(37, 99, 235, 0.2)',
      text: 'text-white',
      ring: 'focus:ring-secondary-500/30'
    },
    accent: {
      bg: 'bg-gradient-3d-yellow',
      shadow: 'rgba(202, 138, 4, 0.2)',
      text: 'text-white',
      ring: 'focus:ring-accent-500/30'
    },
    light: {
      bg: 'bg-white',
      shadow: 'rgba(0, 0, 0, 0.07)',
      text: 'text-gray-800',
      ring: 'focus:ring-gray-200/50',
      border: 'border border-gray-100'
    },
    ghost: {
      bg: 'bg-transparent',
      shadow: 'transparent',
      text: 'text-gray-800',
      ring: 'focus:ring-gray-200/50',
      border: 'border border-gray-200'
    }
  };
  
  // Calculate if we need a border
  const borderClass = gradients[variant].border || '';
  
  // Determine if we should use Apple-style elevated button (more subtly 3D)
  const isAppleStyleElevated = className.includes('rounded-full');
  
  // Adjust shadow style based on whether it's Apple style or regular 3D
  const getShadowStyle = (isHover = false, isActive = false) => {
    if (disabled) return 'none';
    
    if (isAppleStyleElevated) {
      // Apple-style subtle shadows
      return isActive
        ? `0 1px 1px ${gradients[variant].shadow}`
        : isHover
          ? `0 10px 20px -5px ${gradients[variant].shadow}, 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
          : `0 6px 16px -6px ${gradients[variant].shadow}, 0 2px 5px -2px rgba(0, 0, 0, 0.05)`;
    } else {
      // Regular 3D button style with inset shadow
      return isActive
        ? `0 2px 4px -1px ${gradients[variant].shadow}, 0 1px 2px -1px rgba(0, 0, 0, 0.01), inset 0 -1px 0 0 rgba(0, 0, 0, 0.05)`
        : isHover
          ? `0 12px 20px -3px ${gradients[variant].shadow}, 0 8px 14px -2px rgba(0, 0, 0, 0.01), inset 0 -4px 0 -1px rgba(0, 0, 0, 0.05)`
          : `0 8px 15px -3px ${gradients[variant].shadow}, 0 4px 6px -2px rgba(0, 0, 0, 0.01), inset 0 -4px 0 -1px rgba(0, 0, 0, 0.05)`;
    }
  };
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-medium flex items-center justify-center transition-all duration-300
        focus:outline-none focus:ring-4 ${gradients[variant].ring} font-jakarta tracking-tight
        ${gradients[variant].text} relative overflow-hidden ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}
        ${gradients[variant].bg} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${borderClass} ${className}
      `}
      style={{
        boxShadow: getShadowStyle(),
        transform: 'translateY(0)'
      }}
      whileHover={disabled ? {} : { 
        scale: isAppleStyleElevated ? 1.03 : 1.01,
        y: -1,
        boxShadow: getShadowStyle(true, false)
      }}
      whileTap={disabled ? {} : { 
        scale: 0.98,
        y: isAppleStyleElevated ? 1 : 2,
        boxShadow: getShadowStyle(false, true)
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
      {...rest}
    >
      <span className="relative z-10 flex items-center justify-center">{children}</span>
      {!disabled && variant !== 'ghost' && (
        <>
          <span className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="absolute inset-0 opacity-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent hover:opacity-100 transition-opacity duration-300"></span>
          {isAppleStyleElevated && (
            <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-100 pointer-events-none"></span>
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button3D; 