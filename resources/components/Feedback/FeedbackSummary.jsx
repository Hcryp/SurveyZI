import React from "react";
import { Progress } from "@/components/ui/progress";
import { StarIcon } from "lucide-react";

const FeedbackSummary = ({ feedbacks = [] }) => {
  // Skip rendering if no feedbacks
  if (!feedbacks || feedbacks.length === 0) {
    return null;
  }

  // Calculate average rating
  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
  const averageRating = feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(1) : 0;

  // Calculate rating distribution (5 to 1 stars)
  const distribution = [5, 4, 3, 2, 1].map(rating => {
    const count = feedbacks.filter(feedback => Math.round(feedback.rating) === rating).length;
    const percentage = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Ringkasan Umpan Balik</h3>
      
      <div className="flex items-start justify-between mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-gray-100">{averageRating}</div>
          <div className="flex items-center justify-center mb-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon 
                key={i}
                size={16}
                className={i < Math.round(averageRating) 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-gray-300 dark:text-gray-600"}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {feedbacks.length} {feedbacks.length === 1 ? 'ulasan' : 'ulasan'}
          </div>
        </div>
        
        <div className="flex-1 ml-6">
          {distribution.map((item) => (
            <div key={item.rating} className="flex items-center mb-2 gap-2">
              <div className="flex items-center w-12">
                <span className="text-sm text-gray-700 dark:text-gray-300 mr-1">{item.rating}</span>
                <StarIcon size={12} className="fill-yellow-400 text-yellow-400" />
              </div>
              <Progress value={item.percentage} className="h-2 flex-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                {item.percentage.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center border-t border-gray-100 dark:border-gray-700 pt-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Terima kasih atas umpan balik Anda! Ini membantu kami meningkatkan layanan.
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary; 