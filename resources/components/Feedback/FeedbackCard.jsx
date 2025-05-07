import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

const FeedbackCard = ({ feedback }) => {
  const { rating, content, createdAt, user, helpfulCount, serviceTitle } = feedback;

  // Format the creation date relative to now (e.g., "2 days ago")
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: id,
  });

  // Get user initials for avatar fallback
  const getUserInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
      {/* Top row with user info and rating */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {getUserInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="ml-3">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
            </p>
          </div>
        </div>
        <div className="flex">
          {/* Rating stars */}
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-5 w-5 ${
                i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 15.28l6.2 3.64-1.64-7.03L20 7.54l-7.19-.61L10 0 7.19 6.93 0 7.54l5.45 4.35-1.64 7.03z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>
      </div>

      {/* Feedback content */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
        {content}
      </p>

      {/* Bottom row with helpful button and service info */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>Membantu ({helpfulCount})</span>
        </Button>

        {serviceTitle && (
          <span className="text-xs text-gray-500 dark:text-gray-400 italic">
            Ulasan untuk: {serviceTitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default FeedbackCard; 