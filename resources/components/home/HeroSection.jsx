import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button3D from '../Button3D';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const HeroSection = ({ isLowEnd, isIOS, heroRef, isMobile }) => {
  return (
    <section 
      ref={heroRef} 
      className={clsx(
        'relative overflow-hidden',
        isIOS ? 'ios-hero-padding pt-safe-top' : 'pt-20 sm:pt-24 md:pt-32'
      )}
      style={{
        minHeight: 'calc(100vh - 78px)'
      }}
    >
      {/* Background decorations - reduced for low-end devices */}
      {!isLowEnd && (
        <>
          <div 
            className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 to-transparent h-full w-full opacity-70"
            aria-hidden="true"
          ></div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
            className="absolute top-48 -left-24 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20"
            aria-hidden="true"
          ></motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-48 left-48 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"
            aria-hidden="true"
          ></motion.div>
        </>
      )}
      
      <div className={clsx(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col",
        isIOS ? 'ios-safe-area' : ''
      )}>
        <div className="pt-6 sm:pt-8 md:pt-10 lg:pt-16 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: isIOS ? "easeOut" : [0.25, 0.1, 0.25, 1.0] 
            }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900 leading-tight">
              Survei Layanan <span className="text-primary-600">UIN Antasari</span> 
            </h1>
            
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
              Platform Survei Kepuasan Layanan Mahasiswa Terintegrasi UIN Antasari Banjarmasin
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.1, 
              ease: isIOS ? "easeOut" : [0.25, 0.1, 0.25, 1.0] 
            }}
            className="mt-6 sm:mt-8 md:mt-10"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/layanan">
                <Button3D 
                  size={isMobile ? 'md' : 'lg'} 
                  className={clsx(
                    "w-full sm:w-auto",
                    isIOS ? 'ios-touch-button min-h-[50px]' : ''
                  )}
                  style={isIOS ? { WebkitAppearance: 'none' } : {}}
                >
                  <span>Mulai Survei</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button3D>
              </Link>
              
              <Link to="/tentang">
                <Button3D 
                  variant="light" 
                  size={isMobile ? 'md' : 'lg'} 
                  className={clsx(
                    "w-full sm:w-auto",
                    isIOS ? 'ios-touch-button min-h-[50px]' : ''
                  )}
                  style={isIOS ? { WebkitAppearance: 'none' } : {}}
                >
                  Pelajari Selengkapnya
                </Button3D>
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="flex-1 flex items-center justify-center mt-8 md:mt-10 lg:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            ease: isIOS ? "easeOut" : [0.25, 0.1, 0.25, 1.0]
          }}
        >
          <img 
            src="/hero_illustration.svg" 
            alt="UIN Antasari Survey Platform" 
            className="max-w-full h-auto max-h-[30vh] sm:max-h-[40vh] md:max-h-[45vh] lg:max-h-[50vh]"
            style={isIOS ? { 
              WebkitUserDrag: 'none',
              WebkitTouchCallout: 'none'
            } : {}}
            loading="eager"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 