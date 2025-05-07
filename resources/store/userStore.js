import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock user data for development
const mockUsers = [
  {
    id: 'user1',
    name: 'Hafiz',
    email: 'hafiz@mhs.uin-antasari.ac.id',
    role: 'student',
    avatar: null,
    faculty: 'Fakultas Tarbiyah dan Keguruan',
    department: 'Pendidikan Agama Islam',
    semester: 6
  },
  {
    id: 'user2',
    name: 'Muhamad Arianoor, S.Tr, Kom.',
    email: 'ariganteng@uin-antasari.ac.id',
    role: 'lecturer',
    avatar: null,
    faculty: 'Fakultas Tarbiyah dan Keguruan',
    department: 'Pendidikan Agama Islam',
    position: 'Dosen Tetap'
  },
  {
    id: 'user3',
    name: 'Handy Hartono Setiawan',
    email: 'handyuin-antasari.ac.id',
    role: 'staff',
    avatar: null,
    department: 'UTIPD',
    position: 'Admin TI'
  }
];

// Form options
export const ageOptions = [
  { value: 'below18', label: 'Di bawah 18 Tahun' },
  { value: '18to28', label: '18 – 28 Tahun' },
  { value: '28to39', label: '28 – 39 Tahun' },
  { value: '40to49', label: '40 - 49 Tahun' },
  { value: '50to59', label: '50 – 59 Tahun' },
  { value: '60to69', label: '60 – 69 Tahun' },
  { value: 'above70', label: 'Diatas 70 Tahun' },
];

export const genderOptions = [
  { value: 'male', label: 'Laki-Laki' },
  { value: 'female', label: 'Perempuan' },
];

export const originOptions = [
  { value: 'fuh', label: 'Fakultas Ushuluddin dan Humaniora' },
  { value: 'fdik', label: 'Fakultas Dakwah dan Ilmu Komunikasi' },
  { value: 'febi', label: 'Fakultas Ekonomi dan Bisnis Islam' },
  { value: 'fs', label: 'Fakultas Syariah' },
  { value: 'ftk', label: 'Fakultas Tarbiyah dan Keguruan' },
  { value: 'pasca', label: 'Pascasarjana' },
  { value: 'rektorat', label: 'Kantor Pusat' },
  { value: 'public', label: 'Masyarakat Umum' },
  { value: 'stakeholder', label: 'Mitra Kerjasama/Stakeholder' },
];

export const typeOptions = [
  { value: 'lecturer', label: 'Dosen' },
  { value: 'staff', label: 'Tenaga Kependidikan' },
  { value: 'student', label: 'Mahasiswa' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'public', label: 'Masyarakat Umum' },
  { value: 'partner', label: 'Mitra Kerjasama' },
];

export const useUserStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // User profile data
      userData: {
        fullName: '',
        age: '',
        gender: '',
        respondentOrigin: '',
        respondentType: '',
      },
      
      // Survey history
      surveyHistory: [],
      
      // Authentication actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = mockUsers.find(u => u.email === email);
          
          if (user && password === 'password') {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ error: 'Email atau password salah', isLoading: false });
            return false;
          }
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Check if user already exists
          const existingUser = mockUsers.find(u => u.email === userData.email);
          
          if (existingUser) {
            set({ error: 'Email sudah terdaftar', isLoading: false });
            return false;
          }
          
          // Create new user
          const newUser = {
            id: `user${mockUsers.length + 1}`,
            ...userData,
            avatar: null,
          };
          
          mockUsers.push(newUser);
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },
      
      logout: () => {
        // Reset user authentication state
        set({ 
          user: null, 
          isAuthenticated: false,
          userData: {
            fullName: '',
            age: '',
            gender: '',
            respondentOrigin: '',
            respondentType: '',
          },
          surveyHistory: []
        });
        
        // Clear ALL localStorage data to ensure complete cleanup
        try {
          // Option 1: Clear everything in localStorage (most secure approach)
          localStorage.clear();
          
          // Option 2: If selective clearing is needed, use this instead:
          // const keys = Object.keys(localStorage);
          // for (const key of keys) {
          //   // Preserve only critical app settings if needed
          //   if (!key.includes('app-theme') && !key.includes('language-preference')) {
          //     localStorage.removeItem(key);
          //   }
          // }
          
          // Clear persisted Zustand stores
          localStorage.removeItem('survey-store');
          localStorage.removeItem('user-store');
          localStorage.removeItem('directory-store');
          
          console.log('All user data cleared successfully');
        } catch (err) {
          console.error('Error clearing user data:', err);
        }
        
        // Force redirect to login page
        window.location.href = '/login';
      },
      
      // Profile management actions
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const currentUser = get().user;
          const updatedUser = { ...currentUser, ...userData };
          
          // Update user in mock data
          const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
          if (userIndex !== -1) {
            mockUsers[userIndex] = updatedUser;
          }
          
          set({ 
            user: updatedUser, 
            isLoading: false,
            userData: { ...get().userData, ...userData },
          });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },
      
      updateAvatar: async (avatarUrl) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const updatedUser = { ...get().user, avatar: avatarUrl };
          
          // Update user in mock data
          const userIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
          if (userIndex !== -1) {
            mockUsers[userIndex] = updatedUser;
          }
          
          set({ user: updatedUser, isLoading: false });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },
      
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user exists
          const user = mockUsers.find(u => u.email === email);
          
          if (!user) {
            set({ error: 'Email tidak terdaftar', isLoading: false });
            return false;
          }
          
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },
      
      // User data management
      updateUserData: (data) => set((state) => ({
        userData: { ...state.userData, ...data },
      })),
      
      setLoggedIn: (status) => set({ isAuthenticated: status }),
      
      addCompletedSurvey: (surveyData) => set((state) => ({
        surveyHistory: [...state.surveyHistory, {
          ...surveyData,
          timestamp: new Date().toISOString(),
        }],
      })),
      
      clearSurveyHistory: () => set({ surveyHistory: [] }),
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        userData: state.userData,
        surveyHistory: state.surveyHistory
      }),
    }
  )
); 