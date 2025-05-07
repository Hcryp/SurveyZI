import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './userStore';

// Mock survey data
const mockSurveys = [
  {
    id: 'survey1',
    title: 'Evaluasi Layanan Akademik UIN Antasari',
    description: 'Survei ini bertujuan untuk mengukur tingkat kepuasan mahasiswa terhadap layanan akademik yang diberikan oleh UIN Antasari.',
    createdBy: 'user3',
    createdAt: '2023-05-15',
    expiresAt: '2023-12-30',
    isActive: true,
    targetRespondents: ['student'],
    questions: [
      {
        id: 'q1',
        type: 'likert',
        text: 'Bagaimana tingkat kepuasan Anda terhadap layanan administrasi akademik?',
        options: [
          { value: 1, label: 'Sangat Tidak Puas' },
          { value: 2, label: 'Tidak Puas' },
          { value: 3, label: 'Netral' },
          { value: 4, label: 'Puas' },
          { value: 5, label: 'Sangat Puas' }
        ],
        required: true
      },
      {
        id: 'q2',
        type: 'likert',
        text: 'Bagaimana tingkat kepuasan Anda terhadap fasilitas perkuliahan?',
        options: [
          { value: 1, label: 'Sangat Tidak Puas' },
          { value: 2, label: 'Tidak Puas' },
          { value: 3, label: 'Netral' },
          { value: 4, label: 'Puas' },
          { value: 5, label: 'Sangat Puas' }
        ],
        required: true
      },
      {
        id: 'q3',
        type: 'text',
        text: 'Apa saran Anda untuk peningkatan layanan akademik?',
        required: false
      }
    ]
  }
];

// Mock service data
const mockServices = [
  {
    id: 'service1',
    name: 'Layanan Akademik Fakultas',
    category: 'Akademik',
    status: 'Aktif',
    description: 'Layanan administrasi akademik di tingkat fakultas',
    faculty: 'Fakultas Tarbiyah dan Keguruan',
    location: 'Gedung Fakultas Lt. 1',
    contactPerson: '0511-3303673',
    operationalHours: 'Senin-Jumat, 08.00-16.00 WITA',
    procedureSteps: [
      'Datang ke loket layanan akademik fakultas',
      'Mengisi formulir sesuai kebutuhan',
      'Mengumpulkan dokumen pendukung',
      'Menunggu proses'
    ],
    requirements: [
      'KTM (Kartu Tanda Mahasiswa)',
      'Transkip Nilai (jika diperlukan)',
      'Dokumen pendukung lainnya'
    ],
    processingTime: '1-3 hari kerja',
    cost: 'Gratis',
    qrCode: 'https://uinantasari.ac.id/survey/service1',
    surveyAvailable: true
  }
];

// Create the survey store
export const useSurveyStore = create(
  persist(
    (set, get) => ({
      // Current service ID being surveyed
      currentServiceId: null,
      
      // Current survey responses
      responses: {},
      
      // Array to store all survey responses
      allResponses: [],
      
      // Survey completion status
      currentSection: 0,
      totalSections: 0,
      isCompleted: false,
      
      // Tracks survey start time
      startTime: null,
      
      // Tracks survey completion time
      completionTime: null,
      
      // From stores/surveyStore.js
      surveys: mockSurveys,
      services: mockServices,
      isLoading: false,
      error: null,
      completedServices: [],
      feedbackSubmitted: [],
      
      // Reset the entire store state
      resetStore: () => {
        // Reset to initial state
        set({
          currentServiceId: null,
          responses: {},
          allResponses: [],
          currentSection: 0,
          totalSections: 0,
          isCompleted: false,
          startTime: null,
          completionTime: null,
          isLoading: false,
          error: null,
          completedServices: [],
          feedbackSubmitted: []
        });
        
        console.log('Survey store has been reset');
      },
      
      // Action to set the current service
      setCurrentService: (serviceId) => set({
        currentServiceId: serviceId,
        responses: {},
        currentSection: 0,
        isCompleted: false,
        startTime: new Date().toISOString(),
        completionTime: null
      }),
      
      // Action to add/update a response
      updateResponse: (questionId, value) => set((state) => ({
        responses: {
          ...state.responses,
          [questionId]: value
        }
      })),
      
      // Action to set section progress
      setProgress: (currentSection, totalSections) => set({
        currentSection,
        totalSections
      }),
      
      // Action to advance to next section
      nextSection: () => set((state) => ({
        currentSection: Math.min(state.currentSection + 1, state.totalSections)
      })),
      
      // Action to go back to previous section
      prevSection: () => set((state) => ({
        currentSection: Math.max(state.currentSection - 1, 0)
      })),
      
      // Action to complete survey
      completeSurvey: (serviceId) => {
        // Mark the current time when survey is completed
        const completionTime = new Date().toISOString();
        
        // Add to list of completed services if serviceId is provided
        if (serviceId) {
          set((state) => ({
            completedServices: [...state.completedServices, serviceId],
            isCompleted: true,
            completionTime
          }));
        } else {
          set({
            isCompleted: true,
            completionTime
          });
        }
        
        // This would be where you'd send the survey data to the backend
        console.log('Survey completed:', get().responses);
      },
      
      // Save a completed survey response
      saveResponse: (responseData) => {
        // Generate a unique response ID
        const responseId = `resp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const responseWithId = {
          ...responseData,
          id: responseId
        };
        
        // Add to the responses array
        set((state) => ({
          allResponses: [...state.allResponses, responseWithId]
        }));
        
        console.log('Response saved:', responseWithId);
        return responseId;
      },
      
      // Mark a service as completed
      markServiceAsCompleted: (serviceId) => {
        if (!serviceId) return;
        
        // Add to list of completed services if not already included
        set((state) => {
          if (state.completedServices.includes(serviceId)) {
            return state; // No change needed
          }
          return {
            completedServices: [...state.completedServices, serviceId]
          };
        });
        
        // Mark overall survey as completed
        set({
          isCompleted: true,
          completionTime: new Date().toISOString()
        });
      },
      
      // Get all responses for a specific service
      getResponsesForService: (serviceId) => {
        if (!serviceId) return [];
        
        // Filter responses by serviceId
        return get().allResponses.filter(response => response.serviceId === serviceId);
      },
      
      // Update feedback for a specific response
      updateFeedback: (serviceId, feedbackData) => {
        // Add to list of feedback submitted
        set((state) => ({
          feedbackSubmitted: [...state.feedbackSubmitted, serviceId]
        }));
        
        // Update the response if it exists
        set((state) => {
          const updatedResponses = state.allResponses.map(response => {
            if (response.serviceId === serviceId) {
              return {
                ...response,
                feedback: feedbackData
              };
            }
            return response;
          });
          
          return {
            allResponses: updatedResponses
          };
        });
        
        console.log('Feedback updated:', feedbackData);
        return true;
      },
      
      // Action to reset survey
      resetSurvey: () => set({
        responses: {},
        currentSection: 0,
        isCompleted: false,
        startTime: new Date().toISOString(),
        completionTime: null
      }),
      
      // Reset all user-specific survey data (called on logout)
      resetUserData: () => set({
        currentServiceId: null,
        responses: {},
        allResponses: [],
        completedServices: [],
        feedbackSubmitted: [],
        currentSection: 0,
        isCompleted: false,
        startTime: null,
        completionTime: null
      }),
      
      // Action to get survey duration in minutes (if completed)
      getSurveyDuration: (state) => {
        if (!state.startTime || !state.completionTime) return null;
        
        const start = new Date(state.startTime);
        const end = new Date(state.completionTime);
        const durationMs = end - start;
        
        return Math.round(durationMs / (1000 * 60)); // Convert to minutes
      },
      
      // Get all available services
      getServices: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Just use the mock data for now
          set({ services: mockServices, isLoading: false });
          return mockServices;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return [];
        }
      },
      
      // Get a single service by ID
      getServiceById: (serviceId) => {
        const service = get().services.find(s => s.id === serviceId);
        return service || null;
      },
      
      // Check if a service has been completed
      isServiceCompleted: (serviceId) => {
        return get().completedServices.includes(serviceId);
      },
      
      // Submit survey feedback
      submitFeedback: async (serviceId, feedback) => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Add to list of feedback submitted
          set((state) => ({
            feedbackSubmitted: [...state.feedbackSubmitted, serviceId],
            isLoading: false
          }));
          
          // This would be where you'd send the feedback data to the backend
          console.log('Feedback submitted:', feedback);
          
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      }
    }),
    {
      name: 'survey-storage', // name for the localStorage key
      partialize: (state) => ({
        responses: state.responses,
        allResponses: state.allResponses,
        completedServices: state.completedServices,
        feedbackSubmitted: state.feedbackSubmitted,
        currentServiceId: state.currentServiceId,
        currentSection: state.currentSection,
        isCompleted: state.isCompleted,
      }),
    }
  )
); 