import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSurveyStore } from '../store/surveyStore';
import { useUserStore } from '../store/userStore';
import { motion } from 'framer-motion';
import { Clock, Users, CheckCircle, XCircle } from 'lucide-react';

const SurveyListPage = () => {
  const { surveys, fetchSurveys, isLoading, error } = useSurveyStore();
  const { user, isAuthenticated } = useUserStore();
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  useEffect(() => {
    if (surveys.length) {
      let filtered = [...surveys];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(survey => 
          survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          survey.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply active/inactive filter
      if (activeFilter === 'active') {
        filtered = filtered.filter(survey => survey.isActive);
      } else if (activeFilter === 'inactive') {
        filtered = filtered.filter(survey => !survey.isActive);
      }
      
      // If user is authenticated, filter by targetRespondent
      if (isAuthenticated && user) {
        filtered = filtered.filter(survey => 
          survey.targetRespondent.includes(user.role) || survey.targetRespondent.includes('all')
        );
      }
      
      setFilteredSurveys(filtered);
    }
  }, [surveys, searchTerm, activeFilter, isAuthenticated, user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (isLoading && !surveys.length) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daftar Survei</h1>
        <p className="text-gray-600">
          Temukan dan ikuti survei yang tersedia untuk meningkatkan layanan di UIN Antasari.
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Cari survei..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setActiveFilter('all')}
          >
            Semua
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'active' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setActiveFilter('active')}
          >
            Aktif
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${activeFilter === 'inactive' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setActiveFilter('inactive')}
          >
            Tidak Aktif
          </button>
        </div>
      </div>

      {filteredSurveys.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada survei ditemukan</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `Tidak ada survei yang cocok dengan kata kunci "${searchTerm}"`
              : "Tidak ada survei yang tersedia saat ini."}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredSurveys.map((survey) => (
            <motion.div
              key={survey.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{survey.title}</h3>
                  {survey.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="h-3 w-3 mr-1" />
                      Tidak Aktif
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{survey.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Berakhir: {new Date(survey.expiredAt).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Target: {survey.targetRespondent.map(r => 
                    r === 'student' ? 'Mahasiswa' : 
                    r === 'lecturer' ? 'Dosen' : 
                    r === 'staff' ? 'Staff' : r
                  ).join(', ')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {survey.questions.length} pertanyaan
                  </div>
                  
                  <Link 
                    to={`/survey/${survey.id}`}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      survey.isActive 
                        ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (!survey.isActive) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {survey.isActive ? 'Ikuti Survei' : 'Tidak Tersedia'}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SurveyListPage; 