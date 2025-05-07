import { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';

/**
 * AuthCheck component
 * Verifies user authentication state on app startup
 * Ensures no stale user data persists between different users
 */
const AuthCheck = () => {
  const { isAuthenticated, user } = useUserStore();
  
  useEffect(() => {
    // Check for inconsistent auth state on app startup
    const storedUser = localStorage.getItem('user-store');
    
    if (storedUser) {
      try {
        const parsedData = JSON.parse(storedUser);
        
        // If auth states don't match, clear everything
        if (isAuthenticated !== parsedData.state.isAuthenticated || 
            (isAuthenticated && user?.id !== parsedData.state.user?.id)) {
          console.warn('Inconsistent auth state detected, clearing data');
          
          // Clear all user-specific localStorage data
          const keys = Object.keys(localStorage);
          for (const key of keys) {
            if (key.includes('survey_progress_') || 
                key.includes('survey-storage') || 
                key.includes('user-') || 
                key.includes('form-')) {
              localStorage.removeItem(key);
            }
          }
          
          // Reload page to reset app state
          window.location.reload();
        }
      } catch (err) {
        console.error('Error checking auth state:', err);
      }
    }
  }, [isAuthenticated, user]);

  // This is a utility component that doesn't render anything
  return null;
};

export default AuthCheck; 