import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Filter, Clock, CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { useDirectoryStore } from "../store/directoryStore";
import FeedbackCard from "@/components/Feedback/FeedbackCard";
import FeedbackList from "@/components/Feedback/FeedbackList";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock feedback data for development with enhanced user info to match FeedbackCard component
const mockFeedbacks = [
  {
    id: 1,
    serviceId: 1,
    userId: "user1",
    rating: 4,
    content: "Pelayanan cukup baik, tapi bisa lebih cepat. Petugas ramah dan membantu tetapi prosesnya masih memakan waktu yang cukup lama.",
    createdAt: "2023-04-15T09:23:45.000Z",
    helpfulCount: 2,
    serviceTitle: "Layanan Akademik Fakultas",
    user: {
      name: "Hafiz",
      avatar: null
    }
  },
  {
    id: 2,
    serviceId: 1,
    userId: "user2",
    rating: 5,
    content: "Sangat puas dengan pelayanan yang diberikan. Proses cepat dan petugas sangat profesional. Semua kebutuhan saya terpenuhi dengan baik.",
    createdAt: "2023-04-16T14:30:22.000Z",
    helpfulCount: 5,
    serviceTitle: "Layanan Akademik Fakultas",
    user: {
      name: "Muhamad Arianoor",
      avatar: null
    }
  },
  {
    id: 3,
    serviceId: 2,
    userId: "user1",
    rating: 3,
    content: "Prosedur terlalu berbelit-belit dan memakan waktu lama. Beberapa informasi tidak jelas dan saya harus bertanya berulang kali.",
    createdAt: "2023-04-18T11:15:08.000Z",
    helpfulCount: 1,
    serviceTitle: "Layanan Perpustakaan",
    user: {
      name: "Hafiz",
      avatar: null
    }
  },
  {
    id: 4,
    serviceId: 1,
    userId: "user3",
    rating: 2,
    content: "Kurang puas dengan layanan ini. Informasi yang diberikan sering tidak konsisten dan waktu tunggu sangat lama.",
    createdAt: "2023-05-20T10:45:12.000Z",
    helpfulCount: 3,
    serviceTitle: "Layanan Akademik Fakultas",
    user: {
      name: "Handy Hartono",
      avatar: null
    }
  },
  {
    id: 5,
    serviceId: 1,
    userId: "user_demo",
    rating: 4,
    content: "Layanan sudah baik secara keseluruhan. Sistem antrian tertata rapi dan petugas cukup responsif.",
    createdAt: "2023-06-05T08:30:00.000Z",
    helpfulCount: 0,
    serviceTitle: "Layanan Akademik Fakultas",
    user: {
      name: "Demo User",
      avatar: null
    }
  }
];

const PublicFeedbackPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { getServiceById } = useDirectoryStore();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: []
  });
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Fetch service details
    const fetchServiceDetails = async () => {
      setLoading(true);
      try {
        const serviceData = getServiceById(parseInt(serviceId, 10) || serviceId);
        
        if (!serviceData) {
          setError("Layanan tidak ditemukan");
          setLoading(false);
          return;
        }
        
        setService(serviceData);
        
        // Fetch feedbacks for this service
        await fetchFeedbacks(serviceData.id);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError("Gagal memuat data layanan");
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceDetails();
  }, [serviceId, getServiceById]);
  
  // Fetch feedbacks for a specific service
  const fetchFeedbacks = async (id) => {
    try {
      // In a real app, this would call the API or use a store
      // For now, use our mock data
      const serviceFeedbacks = mockFeedbacks.filter(fb => fb.serviceId.toString() === id.toString());
      
      // Calculate statistics
      calculateStats(serviceFeedbacks);
      
      // Sort feedbacks by newest first (default)
      const sortedFeedbacks = sortFeedbacksByDate(serviceFeedbacks);
      setFeedbacks(sortedFeedbacks);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError("Gagal memuat umpan balik");
    }
  };
  
  // Calculate feedback statistics
  const calculateStats = (feedbackData) => {
    if (!feedbackData || feedbackData.length === 0) {
      setStats({
        average: 0,
        total: 0,
        distribution: [
          { rating: 5, count: 0, percentage: 0 },
          { rating: 4, count: 0, percentage: 0 },
          { rating: 3, count: 0, percentage: 0 },
          { rating: 2, count: 0, percentage: 0 },
          { rating: 1, count: 0, percentage: 0 }
        ]
      });
      return;
    }
    
    const total = feedbackData.length;
    const totalRating = feedbackData.reduce((sum, fb) => sum + fb.rating, 0);
    const average = totalRating / total;
    
    // Calculate distribution
    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const count = feedbackData.filter(fb => Math.round(fb.rating) === rating).length;
      const percentage = (count / total) * 100;
      return { rating, count, percentage };
    });
    
    setStats({ average, total, distribution });
  };
  
  // Sort feedbacks by date (newest first)
  const sortFeedbacksByDate = (feedbackData) => {
    return [...feedbackData].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };
  
  // Handle sorting change
  const handleSortChange = (value) => {
    setSortBy(value);
    
    let sortedFeedbacks = [...feedbacks];
    if (value === "newest") {
      sortedFeedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (value === "oldest") {
      sortedFeedbacks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (value === "highest") {
      sortedFeedbacks.sort((a, b) => b.rating - a.rating);
    } else if (value === "lowest") {
      sortedFeedbacks.sort((a, b) => a.rating - b.rating);
    } else if (value === "helpful") {
      sortedFeedbacks.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }
    
    setFeedbacks(sortedFeedbacks);
  };
  
  // Handle rating filter change
  const handleRatingFilter = (value) => {
    setFilterRating(value);
    setActiveTab(value);
    
    // Re-fetch and filter feedbacks
    const serviceFeedbacks = mockFeedbacks.filter(fb => fb.serviceId.toString() === serviceId.toString());
    
    let filteredFeedbacks = serviceFeedbacks;
    if (value !== "all") {
      const ratingValue = parseInt(value, 10);
      filteredFeedbacks = serviceFeedbacks.filter(fb => Math.round(fb.rating) === ratingValue);
    }
    
    // Apply current sort
    if (sortBy === "newest") {
      filteredFeedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filteredFeedbacks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "highest") {
      filteredFeedbacks.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      filteredFeedbacks.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "helpful") {
      filteredFeedbacks.sort((a, b) => b.helpfulCount - a.helpfulCount);
    }
    
    setFeedbacks(filteredFeedbacks);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return format(parseISO(dateString), "dd MMMM yyyy", { locale: id });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="text-red-500 text-xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>
    );
  }
  
  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="text-gray-500 text-xl mb-4">
          Layanan tidak ditemukan
        </div>
        <Button onClick={() => navigate("/directory")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Direktori
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to={`/service/${serviceId}`}
          className="inline-flex items-center text-secondary-600 hover:text-primary-600"
        >
          <ArrowLeft size={16} className="mr-2" />
          Kembali ke Detail Layanan
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8"
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 text-white">
          <h1 className="text-2xl font-bold mb-2">{service.name}</h1>
          <p className="text-white/80">Umpan Balik Pengguna</p>
        </div>
        
        <div className="p-6">
          {/* Rating summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl font-bold text-secondary-900 mb-1">
                {stats.average.toFixed(1)}
              </div>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`${
                      star <= Math.round(stats.average)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {stats.total} ulasan
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              {stats.distribution.map((item) => (
                <div key={item.rating} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium mr-1">{item.rating}</span>
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right text-sm text-gray-500">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={handleRatingFilter}>
                <TabsList className="grid grid-cols-6 w-full sm:w-auto">
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="5">5</TabsTrigger>
                  <TabsTrigger value="4">4</TabsTrigger>
                  <TabsTrigger value="3">3</TabsTrigger>
                  <TabsTrigger value="2">2</TabsTrigger>
                  <TabsTrigger value="1">1</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="w-full sm:w-auto">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Urutkan berdasarkan" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="oldest">Terlama</SelectItem>
                  <SelectItem value="highest">Rating tertinggi</SelectItem>
                  <SelectItem value="lowest">Rating terendah</SelectItem>
                  <SelectItem value="helpful">Paling membantu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Feedback list */}
          {feedbacks.length === 0 ? (
            <div className="py-10 text-center">
              <div className="mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Belum ada umpan balik</h3>
              <p className="mt-1 text-gray-500">Belum ada umpan balik untuk kategori ini.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PublicFeedbackPage; 