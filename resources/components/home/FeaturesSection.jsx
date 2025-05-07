import React from 'react';
import { motion } from 'framer-motion';
import { ChartBar, Users, Star, Clock, ShieldCheck, Award } from 'lucide-react';
import clsx from 'clsx';

const FeatureCard = ({ icon: Icon, title, description, index, isIOS }) => {
  const easeType = isIOS ? "easeOut" : [0.25, 0.1, 0.25, 1.0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: easeType
      }}
      className={clsx(
        "bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col",
        isIOS ? "ios-card-safe-touch" : ""
      )}
    >
      <div className={clsx(
        "bg-primary-50 p-3 rounded-lg mb-4 inline-flex items-center justify-center w-12 h-12",
        isIOS ? "ios-no-highlight" : ""
      )}>
        <Icon className="text-primary-600 w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600 flex-1">{description}</p>
    </motion.div>
  );
};

const FeaturesSection = ({ isIOS }) => {
  const features = [
    {
      icon: ChartBar,
      title: "Analisis Komprehensif",
      description: "Dapatkan wawasan mendalam tentang tingkat kepuasan layanan dengan analisis data yang rinci.",
    },
    {
      icon: Users,
      title: "Ramah Pengguna",
      description: "Antarmuka yang intuitif dan mudah digunakan untuk semua kalangan mahasiswa.",
    },
    {
      icon: Star,
      title: "Penilaian Terukur",
      description: "Sistem penilaian yang terstruktur untuk mengukur kualitas dengan akurat.",
    },
    {
      icon: Clock,
      title: "Respons Cepat",
      description: "Waktu pengisian survei yang singkat dengan pertanyaan yang tepat sasaran.",
    },
    {
      icon: ShieldCheck,
      title: "Keamanan Data",
      description: "Perlindungan data responden dengan standar keamanan sistem terkini.",
    },
    {
      icon: Award,
      title: "Peningkatan Berkelanjutan",
      description: "Mendukung evaluasi dan perbaikan layanan secara berkelanjutan.",
    },
  ];

  return (
    <section className={clsx(
      "py-12 md:py-16 lg:py-20 bg-gray-50",
      isIOS ? "ios-safe-section" : ""
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.5,
            ease: isIOS ? "easeOut" : [0.25, 0.1, 0.25, 1.0]
          }}
        >
          <h2 className="text-3xl font-bold text-secondary-900 mb-4 font-display">
            Keunggulan Platform
          </h2>
          <p className="text-secondary-600 text-lg">
            Fitur-fitur unggulan yang memudahkan proses survei dan analisis kepuasan layanan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
              index={index}
              isIOS={isIOS}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 