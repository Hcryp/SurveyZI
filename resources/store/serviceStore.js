import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock services data
const mockServices = [
  {
    id: 'service1',
    name: 'Layanan Akademik Fakultas',
    category: 'Akademik',
    slug: 'layanan-akademik-fakultas',
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
  },
  {
    id: 'service2',
    name: 'Layanan Perpustakaan',
    category: 'Perpustakaan',
    slug: 'layanan-perpustakaan',
    status: 'Aktif',
    description: 'Layanan peminjaman buku, referensi, dan sumber belajar lainnya',
    faculty: 'UPT Perpustakaan',
    location: 'Gedung Perpustakaan',
    contactPerson: '0511-3304733',
    operationalHours: 'Senin-Jumat, 08.00-15.30 WITA',
    procedureSteps: [
      'Menunjukkan KTM/Kartu Anggota Perpustakaan',
      'Mencari buku pada katalog',
      'Mengambil buku pada rak',
      'Melakukan registrasi peminjaman'
    ],
    requirements: [
      'KTM (Kartu Tanda Mahasiswa)',
      'Kartu Anggota Perpustakaan',
      'Tidak memiliki tanggungan peminjaman/denda'
    ],
    processingTime: 'Langsung',
    cost: 'Gratis',
    qrCode: 'https://uinantasari.ac.id/survey/service2',
    surveyAvailable: true
  }
];

export const useServiceStore = create(
  persist(
    (set, get) => ({
      services: mockServices,
      filteredServices: mockServices,
      selectedService: null,
      isLoading: false,
      error: null,
      
      // Get all services
      getAllServices: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // In a real app, this would be an API call
          set({ services: mockServices, filteredServices: mockServices, isLoading: false });
          return mockServices;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return [];
        }
      },
      
      // Get service by ID
      getServiceById: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // In a real app, this would be an API call
          const service = mockServices.find(s => s.id === id);
          
          if (service) {
            set({ selectedService: service, isLoading: false });
            return service;
          } else {
            set({ error: 'Layanan tidak ditemukan', isLoading: false });
            return null;
          }
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return null;
        }
      },
      
      // Get service by slug
      getServiceBySlug: async (slug) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // In a real app, this would be an API call
          const service = mockServices.find(s => s.slug === slug);
          
          if (service) {
            set({ selectedService: service, isLoading: false });
            return service;
          } else {
            set({ error: 'Layanan tidak ditemukan', isLoading: false });
            return null;
          }
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return null;
        }
      },
      
      // Get services by faculty
      getServicesByFaculty: async (faculty) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 400));
          
          // In a real app, this would be an API call
          const filtered = mockServices.filter(s => s.faculty === faculty);
          
          set({ filteredServices: filtered, isLoading: false });
          return filtered;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return [];
        }
      },
      
      // Get services by category
      getServicesByCategory: async (category) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 400));
          
          // In a real app, this would be an API call
          const filtered = mockServices.filter(s => s.category === category);
          
          set({ filteredServices: filtered, isLoading: false });
          return filtered;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return [];
        }
      },
      
      // Search services by keyword
      searchServices: async (keyword) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // In a real app, this would be an API call
          const lowerKeyword = keyword.toLowerCase();
          const filtered = mockServices.filter(s => 
            s.name.toLowerCase().includes(lowerKeyword) || 
            s.description.toLowerCase().includes(lowerKeyword) ||
            s.faculty.toLowerCase().includes(lowerKeyword) ||
            s.category.toLowerCase().includes(lowerKeyword)
          );
          
          set({ filteredServices: filtered, isLoading: false });
          return filtered;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return [];
        }
      },
      
      // Filter services 
      filterServices: async (filters) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 400));
          
          // In a real app, this would be an API call
          let filtered = [...mockServices];
          
          // Apply category filter
          if (filters.category) {
            filtered = filtered.filter(s => s.category === filters.category);
          }
          
          // Apply faculty filter
          if (filters.faculty) {
            filtered = filtered.filter(s => s.faculty === filters.faculty);
          }
          
          // Apply status filter
          if (filters.status) {
            filtered = filtered.filter(s => s.status === filters.status);
          }
          
          set({ filteredServices: filtered, isLoading: false });
          return filtered;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return [];
        }
      },
      
      // Clear filters
      clearFilters: () => {
        set({ filteredServices: mockServices });
      },
      
      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'service-store', // name for localStorage
      partialize: (state) => ({ selectedService: state.selectedService }),
    }
  )
);
