import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ThumbsUp, MessageSquare, Search, Filter, Award, Sparkles, Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Button3D from '../components/Button3D';

const TestimonialsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Fetch testimonials on mount
  useEffect(() => {
    // Simulating API call with timeout
    setTimeout(() => {
      // Mock testimonials data
      const mockTestimonials = [
        {
          id: 1,
          name: 'Ari Ganteng',
          role: 'Mahasiswa Politeknik Negeri Tanah Laut',
          content: 'Aplikasi yang sangat membantu untuk memberikan feedback ke layanan kampus. Tampilannya mudah digunakan dan responsif.',
          rating: 5,
          isFeatured: true,
          timestamp: '3 hari yang lalu',
          date: '2023-04-20T10:30:00',
          profileImage: null,
          gender: 'male',
          helpfulCount: 12
        },
        {
          id: 2,
          name: 'Anonymous',
          role: 'Anonymous',
          content: 'Kok Ngeleg di HP Aku yah 😑',
          rating: 1,
          isFeatured: false,
          timestamp: 'Baru Saja',
          date: '2023-04-25T09:15:00',
          profileImage: null,
          gender: 'female',
          helpfulCount: 0
        },
        {
          id: 3,
          name: 'Ahmad Fauzi',
          role: 'Dosen Fakultas Ekonomi',
          content: 'Platform yang sangat bermanfaat untuk mendapatkan masukan dari mahasiswa. Sangat merekomendasikan untuk digunakan di semua layanan kampus.',
          rating: 5,
          isFeatured: false,
          timestamp: '2 minggu yang lalu',
          date: '2023-04-12T13:45:00',
          profileImage: null,
          gender: 'male',
          helpfulCount: 8
        },
        {
          id: 4,
          name: 'Anonymous',
          role: 'Mahasiswa Politeknik Negeri Tanah Laut',
          content: 'Semangat ketua!',
          rating: 5,
          isFeatured: false,
          timestamp: 'Baru Saja',
          date: '2023-04-25T08:20:00',
          profileImage: null,
          gender: 'male',
          helpfulCount: 2
        },
        {
          id: 5,
          name: 'Fadiyah Nur',
          role: 'Mahasiswa Fakultas Ekonomi',
          content: 'Fitur surveinya bagus, tapi kadang masih ada lag di beberapa bagian. Semoga bisa diperbaiki di update selanjutnya.',
          rating: 4,
          isFeatured: false,
          timestamp: '1 minggu yang lalu',
          date: '2023-04-18T11:30:00',
          profileImage: null,
          gender: 'female',
          helpfulCount: 5
        },
        {
          id: 6,
          name: 'Arif Rahman',
          role: 'Mahasiswa Fakultas Teknik',
          content: 'Sangat membantu untuk memberikan feedback ke layanan kampus. Semoga layanan kampus jadi lebih baik dengan adanya survei ini.',
          rating: 5,
          isFeatured: false,
          timestamp: '5 hari yang lalu',
          date: '2023-04-20T14:20:00',
          profileImage: null,
          gender: 'male',
          helpfulCount: 7
        },
        {
          id: 7,
          name: 'Bayu Pratama',
          role: 'Alumni 2022',
          content: 'Kualitas surveinya bagus, tapi perlu ditambahkan fitur untuk melacak perbaikan setelah masukan diberikan.',
          rating: 3,
          isFeatured: false,
          timestamp: '3 minggu yang lalu',
          date: '2023-04-05T16:10:00',
          profileImage: null,
          gender: 'male',
          helpfulCount: 3
        },
        {
          id: 8,
          name: 'Dina Permata',
          role: 'Staff TU Fakultas Ekonomi',
          content: 'Platform yang mudah digunakan untuk mendapatkan feedback dari mahasiswa. Sangat membantu untuk meningkatkan kualitas layanan.',
          rating: 4,
          isFeatured: false,
          timestamp: '2 minggu yang lalu',
          date: '2023-04-12T10:15:00',
          profileImage: null,
          gender: 'female',
          helpfulCount: 6
        }
      ];
      
      setTestimonials(mockTestimonials);
      setFilteredTestimonials(mockTestimonials);
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time
  }, []);
  
  // Get profile image based on gender
  const getProfileImage = (gender) => {
    return gender === 'female' ? '/profile_picture_female.png' : '/profile_picture_male.png';
  };

  // Calculate overall statistics
  const calculateStats = () => {
    if (testimonials.length === 0) return { average: 0, total: 0, distribution: [] };
    
    const total = testimonials.length;
    const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
    const average = totalRating / total;
    
    // Calculate distribution
    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const count = testimonials.filter(t => t.rating === rating).length;
      const percentage = (count / total) * 100;
      return { rating, count, percentage };
    });
    
    return { average, total, distribution };
  };
  
  // Stats data
  const stats = calculateStats();
  
  // Handle search term change
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    applyFilters(term, filterRating, sortBy);
  };
  
  // Handle rating filter change
  const handleRatingFilter = (rating) => {
    setFilterRating(rating);
    
    applyFilters(searchTerm, rating, sortBy);
  };
  
  // Handle sort change
  const handleSortChange = (sort) => {
    setSortBy(sort);
    
    applyFilters(searchTerm, filterRating, sort);
  };
  
  // Apply all filters
  const applyFilters = (term, rating, sort) => {
    // First filter by search term and rating
    let filtered = testimonials.filter(testimonial => {
      const matchesTerm = term === '' || 
        testimonial.content.toLowerCase().includes(term) || 
        testimonial.name.toLowerCase().includes(term) ||
        testimonial.role.toLowerCase().includes(term);
      
      const matchesRating = rating === 'all' || testimonial.rating === parseInt(rating);
      
      return matchesTerm && matchesRating;
    });
    
    // Then sort the filtered results
    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      default:
        break;
    }
    
    setFilteredTestimonials(filtered);
  };
  
  // Mark a testimonial as helpful
  const handleMarkHelpful = (id) => {
    const updatedTestimonials = testimonials.map(testimonial => {
      if (testimonial.id === id) {
        return {
          ...testimonial,
          helpfulCount: testimonial.helpfulCount + 1
        };
      }
      return testimonial;
    });
    
    setTestimonials(updatedTestimonials);
    
    // Re-apply current filters to update the filtered list
    applyFilters(searchTerm, filterRating, sortBy);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Apple-style breadcrumb navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-sm font-medium">
            <Link 
              to="/" 
              className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
              onClick={() => window.scrollTo(0, 0)}
            >
              <Home className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Beranda</span>
            </Link>
            
            <div className="flex items-center mx-2 text-gray-300">
              <ChevronRight className="h-4 w-4" />
            </div>
            
            <span className="text-gray-800 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Ulasan Pengguna
            </span>
          </nav>
        </div>
      </div>

      {/* Page header with statistics */}
      <div className="bg-white shadow-sm mt-1 md:mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">Ulasan Pengguna</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall rating */}
            <div className="bg-white rounded-4xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                <h2 className="text-xl font-bold text-secondary-900 ml-2">
                  Rata-rata Rating
                </h2>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-secondary-900">
                    {stats.average.toFixed(1)}
                  </div>
                  <div className="flex mt-2 justify-center">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-5 w-5 ${
                          rating <= Math.round(stats.average)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-secondary-600 mt-1">
                    dari {stats.total} ulasan
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  {stats.distribution.map((item) => (
                    <div key={item.rating} className="flex items-center">
                      <div className="w-8 text-sm font-medium text-secondary-700">
                        {item.rating} <Star className="h-3 w-3 inline-block text-amber-500 fill-amber-500" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full ml-2">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-8 text-sm text-secondary-600 text-right ml-2">
                        {item.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Filters */}
            <div className="bg-white rounded-4xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-bold text-secondary-900 ml-2">
                  Filter & Pencarian
                </h2>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari ulasan..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-gray-50"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter Rating
                  </label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-gray-50"
                    value={filterRating}
                    onChange={(e) => handleRatingFilter(e.target.value)}
                  >
                    <option value="all">Semua Rating</option>
                    <option value="5">5 Bintang</option>
                    <option value="4">4 Bintang</option>
                    <option value="3">3 Bintang</option>
                    <option value="2">2 Bintang</option>
                    <option value="1">1 Bintang</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urutkan
                  </label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none bg-gray-50"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="highest">Rating Tertinggi</option>
                    <option value="lowest">Rating Terendah</option>
                    <option value="helpful">Paling Membantu</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="relative">
              {/* Special "Ulasan Teratas" badge for featured testimonial */}
              {testimonial.isFeatured && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full blur-sm opacity-50"></div>
                    <div className="relative flex items-center px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-medium rounded-full shadow-md">
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      Ulasan Teratas
                    </div>
                  </div>
                </div>
              )}
              
              {/* Testimonial card */}
              <div className={clsx(
                "bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md",
                testimonial.isFeatured && "border-2 border-amber-300 bg-gradient-to-b from-amber-50/50 to-white"
              )}>
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={clsx(
                        "w-12 h-12 rounded-full overflow-hidden",
                        testimonial.isFeatured ? "ring-4 ring-amber-200" : "ring-2 ring-gray-100"
                      )}>
                        {testimonial.profileImage ? (
                          <img
                            src={testimonial.profileImage}
                            alt={testimonial.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <img
                            src={getProfileImage(testimonial.gender)}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.target.onerror = null;
                              e.target.parentNode.innerHTML = `<div class="w-full h-full rounded-full flex items-center justify-center ${
                                testimonial.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
                              } text-white font-bold text-lg">${testimonial.name.charAt(0)}</div>`;
                            }}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-secondary-900 truncate">
                          {testimonial.name}
                        </h3>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Star
                              key={rating}
                              className={`h-5 w-5 ${
                                rating <= testimonial.rating
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-secondary-600">
                        {testimonial.role} • {testimonial.timestamp}
                      </p>
                      
                      <div className="mt-3 text-secondary-800">
                        {testimonial.content}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <button
                          className="flex items-center text-secondary-600 hover:text-primary-600 transition-colors"
                          onClick={() => handleMarkHelpful(testimonial.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {testimonial.helpfulCount > 0
                              ? `${testimonial.helpfulCount} orang merasa terbantu`
                              : 'Tandai membantu'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTestimonials.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <MessageSquare className="h-12 w-12 text-secondary-300 mx-auto" />
              <h3 className="mt-2 text-xl font-medium text-secondary-900">
                Tidak Ada Ulasan yang Ditemukan
              </h3>
              <p className="mt-1 text-secondary-600">
                Tidak ada ulasan yang cocok dengan filter Anda. Coba ubah filter atau kurangi kata kunci pencarian.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage; 