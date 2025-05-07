  import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import SurveyPage from './pages/SurveyPage.jsx';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import SurveyHistoryPage from './pages/SurveyHistoryPage';
import SurveyDetailPage from './pages/SurveyDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { useUserStore } from './store/userStore';
import EndingPage from './pages/EndingPage';
import PublicFeedbackPage from './pages/PublicFeedbackPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AuthCheck from './components/Auth/AuthCheck';
import { useEffect } from 'react';

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // When route changes, scroll to top with a slight delay to ensure the DOM has updated
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant' // Use 'instant' instead of 'smooth' for immediate feedback
      });
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);
  
  return null;
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUserStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <>
      {/* Add AuthCheck component to verify authentication state on startup */}
      <AuthCheck />
      
      {/* Add scroll restoration */}
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="directory" element={<DirectoryPage />} />
          <Route path="service/:id" element={<ServiceDetailPage />} />
          <Route path="survey/:serviceId" element={
            <ProtectedRoute>
              <SurveyPage />
            </ProtectedRoute>
          } />
          <Route path="login" element={<LoginPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="history" element={
            <ProtectedRoute>
              <SurveyHistoryPage />
            </ProtectedRoute>
          } />
          <Route path="history/:responseId" element={
            <ProtectedRoute>
              <SurveyDetailPage />
            </ProtectedRoute>
          } />
          <Route path="ending/:serviceId" element={<EndingPage />} />
          <Route path="feedback/:serviceId" element={<PublicFeedbackPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
