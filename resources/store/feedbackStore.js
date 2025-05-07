import { create } from "zustand";
import { persist } from "zustand/middleware";

// Sample data for development
const initialFeedbacks = [
  {
    id: 1,
    serviceId: 1,
    userId: 1,
    rating: 4,
    comment: "Pelayanan cukup baik, tapi bisa lebih cepat",
    createdAt: "2023-04-15T09:23:45.000Z",
  },
  {
    id: 2,
    serviceId: 1,
    userId: 2,
    rating: 5,
    comment: "Sangat puas dengan pelayanan yang diberikan",
    createdAt: "2023-04-16T14:30:22.000Z",
  },
  {
    id: 3,
    serviceId: 2,
    userId: 1,
    rating: 3,
    comment: "Prosedur terlalu berbelit-belit",
    createdAt: "2023-04-18T11:15:08.000Z",
  },
];

// Store definition
const useFeedbackStore = create(
  persist(
    (set, get) => ({
      // State
      feedbacks: initialFeedbacks,
      userFeedbacks: [],
      isLoading: false,
      error: null,
      currentFeedback: null,

      // Get all feedbacks
      fetchFeedbacks: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          set({ feedbacks: initialFeedbacks, isLoading: false });
        } catch (error) {
          set({
            error: "Failed to fetch feedbacks",
            isLoading: false,
          });
        }
      },

      // Get feedbacks for a specific service
      fetchServiceFeedbacks: async (serviceId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          const serviceFeedbacks = initialFeedbacks.filter(
            (feedback) => feedback.serviceId === serviceId
          );
          set({
            feedbacks: serviceFeedbacks,
            isLoading: false,
          });
          return serviceFeedbacks;
        } catch (error) {
          set({
            error: "Failed to fetch service feedbacks",
            isLoading: false,
          });
          return [];
        }
      },

      // Get feedbacks by user ID
      fetchUserFeedbacks: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          const userFeedbacks = initialFeedbacks.filter(
            (feedback) => feedback.userId === userId
          );
          set({ userFeedbacks, isLoading: false });
          return userFeedbacks;
        } catch (error) {
          set({
            error: "Failed to fetch user feedbacks",
            isLoading: false,
          });
          return [];
        }
      },

      // Submit a new feedback
      submitFeedback: async (newFeedback) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Generate new ID (in real app, this would come from the backend)
          const newId = Math.max(...get().feedbacks.map((f) => f.id), 0) + 1;
          
          const feedbackToAdd = {
            id: newId,
            ...newFeedback,
            createdAt: new Date().toISOString(),
          };

          // Update state with new feedback
          set((state) => ({
            feedbacks: [...state.feedbacks, feedbackToAdd],
            isLoading: false,
          }));

          // Update user feedbacks if they match the current user
          if (
            get().userFeedbacks.length > 0 &&
            get().userFeedbacks[0].userId === newFeedback.userId
          ) {
            set((state) => ({
              userFeedbacks: [...state.userFeedbacks, feedbackToAdd],
            }));
          }

          // Update service ratings in the serviceStore if available
          // This would typically be done through an API in a real application
          if (window.updateServiceRating) {
            const serviceId = newFeedback.serviceId;
            const feedbacks = get().feedbacks.filter(
              (f) => f.serviceId === serviceId
            );
            const totalRating = feedbacks.reduce(
              (sum, feedback) => sum + feedback.rating,
              0
            );
            const averageRating = totalRating / feedbacks.length;
            window.updateServiceRating(serviceId, averageRating);
          }

          return feedbackToAdd;
        } catch (error) {
          set({
            error: "Failed to submit feedback",
            isLoading: false,
          });
          return null;
        }
      },

      // Update an existing feedback
      updateFeedback: async (id, updatedData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Find the feedback to update
          const feedbackIndex = get().feedbacks.findIndex((f) => f.id === id);
          if (feedbackIndex === -1) {
            throw new Error("Feedback not found");
          }

          // Get the old feedback data
          const oldFeedback = get().feedbacks[feedbackIndex];
          const oldRating = oldFeedback.rating;

          // Create updated feedback
          const updatedFeedback = {
            ...oldFeedback,
            ...updatedData,
            // Don't update the creation date
          };

          // Update feedbacks array
          const updatedFeedbacks = [...get().feedbacks];
          updatedFeedbacks[feedbackIndex] = updatedFeedback;

          // Update state
          set({
            feedbacks: updatedFeedbacks,
            isLoading: false,
          });

          // Update user feedbacks if they exist
          const userFeedbackIndex = get().userFeedbacks.findIndex(
            (f) => f.id === id
          );
          if (userFeedbackIndex !== -1) {
            const updatedUserFeedbacks = [...get().userFeedbacks];
            updatedUserFeedbacks[userFeedbackIndex] = updatedFeedback;
            set({ userFeedbacks: updatedUserFeedbacks });
          }

          // If rating changed, update service ratings in the serviceStore if available
          if (
            oldRating !== updatedFeedback.rating &&
            window.updateServiceRating
          ) {
            const serviceId = updatedFeedback.serviceId;
            const feedbacks = updatedFeedbacks.filter(
              (f) => f.serviceId === serviceId
            );
            const totalRating = feedbacks.reduce(
              (sum, feedback) => sum + feedback.rating,
              0
            );
            const averageRating = totalRating / feedbacks.length;
            window.updateServiceRating(serviceId, averageRating);
          }

          return updatedFeedback;
        } catch (error) {
          set({
            error: "Failed to update feedback",
            isLoading: false,
          });
          return null;
        }
      },

      // Delete a feedback
      deleteFeedback: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Find the feedback to delete
          const feedbackToDelete = get().feedbacks.find((f) => f.id === id);
          if (!feedbackToDelete) {
            throw new Error("Feedback not found");
          }

          const serviceId = feedbackToDelete.serviceId;

          // Filter out the feedback
          const updatedFeedbacks = get().feedbacks.filter((f) => f.id !== id);
          const updatedUserFeedbacks = get().userFeedbacks.filter(
            (f) => f.id !== id
          );

          // Update state
          set({
            feedbacks: updatedFeedbacks,
            userFeedbacks: updatedUserFeedbacks,
            isLoading: false,
          });

          // Update service ratings in the serviceStore if available
          if (window.updateServiceRating) {
            const serviceFeedbacks = updatedFeedbacks.filter(
              (f) => f.serviceId === serviceId
            );
            const totalRating = serviceFeedbacks.reduce(
              (sum, feedback) => sum + feedback.rating,
              0
            );
            const averageRating =
              serviceFeedbacks.length > 0
                ? totalRating / serviceFeedbacks.length
                : 0;
            window.updateServiceRating(serviceId, averageRating);
          }

          return true;
        } catch (error) {
          set({
            error: "Failed to delete feedback",
            isLoading: false,
          });
          return false;
        }
      },

      // Set current feedback
      setCurrentFeedback: (feedback) => {
        set({ currentFeedback: feedback });
      },

      // Clear errors
      clearErrors: () => {
        set({ error: null });
      },
    }),
    {
      name: "feedback-storage",
    }
  )
);

export default useFeedbackStore; 