import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { useSurveyStore } from '../store/surveyStore';
import { useDirectoryStore } from '../store/directoryStore';
import { Link, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const SurveyHistoryPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserStore();
  const { allResponses, completedServices } = useSurveyStore();
  const { getServiceById } = useDirectoryStore();
  const [surveyHistory, setSurveyHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    // Process actual survey responses and completed services
    const processUserSurveys = () => {
      setIsLoading(true);
      try {
        console.log("Processing surveys with data:", { 
          allResponses, 
          completedServices, 
          userId: user?.id 
        });
        
        // Filter responses for current user if user ID is available
        const userResponses = user?.id 
          ? allResponses.filter(response => response.userId === user.id) 
          : allResponses;
        
        console.log("Filtered user responses:", userResponses);
        
        // Map responses to history format
        const historyItems = userResponses.map((response) => {
          // Try to get service name from directory
          const serviceData = getServiceById(response.serviceId);
          const serviceName = serviceData ? serviceData.name : (response.serviceName || `Survei Layanan ${response.serviceId}`);
          
          return {
            id: response.id,
            serviceId: response.serviceId,
            title: serviceName,
            completedAt: response.completedAt ? parseISO(response.completedAt) : new Date(),
            status: 'completed',
            score: response.scores?.overall || 0
          };
        });
        
        // Also include any completed services that might not have a corresponding response
        completedServices.forEach(serviceId => {
          // Check if this service is already in our history
          const exists = historyItems.some(item => item.serviceId === serviceId);
          
          if (!exists) {
            // Try to get service name from directory
            const serviceData = getServiceById(serviceId);
            const serviceName = serviceData ? serviceData.name : `Survei Layanan ${serviceId}`;
            
            historyItems.push({
              id: `service-${serviceId}`,
              serviceId: serviceId,
              title: serviceName,
              completedAt: new Date(), // We don't know when, so use current date
              status: 'completed',
              score: 0 // No score available
            });
          }
        });
        
        // Sort by completion date, most recent first
        const sortedHistory = historyItems.sort((a, b) => 
          b.completedAt.getTime() - a.completedAt.getTime()
        );
        
        console.log("Final survey history:", sortedHistory);
        setSurveyHistory(sortedHistory);
      } catch (error) {
        console.error("Error processing survey history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    processUserSurveys();
  }, [user, isAuthenticated, allResponses, completedServices, getServiceById]);

  // Format the date in Indonesian locale
  const formatDate = (date) => {
    if (!date) return '-';
    return format(date, 'd MMMM yyyy', { locale: id });
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold text-secondary-900 mb-6">Riwayat Survei</h1>
      
      {surveyHistory.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-secondary-600 mb-4">Anda belum pernah mengisi survei.</p>
          <button 
            onClick={() => navigate('/directory')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Mulai Isi Survei
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-primary-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-secondary-900">Judul Survei</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-secondary-900">Tanggal Pengisian</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-secondary-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-secondary-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {surveyHistory.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-secondary-900">{survey.title}</td>
                  <td className="px-6 py-4 text-sm text-secondary-600">
                    {formatDate(survey.completedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Selesai
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link to={`/history/${survey.serviceId}`} className="text-primary-600 hover:text-primary-900">
                      Lihat Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SurveyHistoryPage; 