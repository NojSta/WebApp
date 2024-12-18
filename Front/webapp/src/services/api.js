import axios from 'axios';
import { useAuth } from './AuthContext';
const API_BASE_URL = 'http://localhost:5092/api';

// Fetch all destinations
export const fetchDestinations = () => {
    return axios.get(`${API_BASE_URL}/destinations`).then(response => response.data);
  };
  
  // Fetch a single destination by ID
  export const fetchDestinationById = (destinationId) => {
    return axios.get(`${API_BASE_URL}/destinations/${destinationId}`).then(response => response.data);
  };
  
  // Create a new destination
  export const createDestination = (destinationData) => {
    return axios.post(`${API_BASE_URL}/destinations`, destinationData).then(response => response.data);
  };
  
  // Update a destination
  export const updateDestination = (destinationId, updatedData) => {
    return axios.put(`${API_BASE_URL}/destinations/${destinationId}`, updatedData).then(response => response.data);
  };
  
  // Delete a destination
  export const deleteDestination = (destinationId) => {
    return axios.delete(`${API_BASE_URL}/destinations/${destinationId}`).then(response => response.data);
  };
  
  // Fetch reviews for a destination
export const fetchReviews = (destinationId) => {
    return axios.get(`${API_BASE_URL}/destinations/${destinationId}/reviews`).then(response => response.data);
  };
  
  // Fetch a single review for a destination
  export const fetchReviewById = (destinationId, reviewId) => {
    return axios.get(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}`).then(response => response.data);
  };
  
  // Create a new review for a destination
  export const createReview = (destinationId, reviewData, accessToken) => {
    console.log('Access Token in createReview:', accessToken); // Log the access token
  
    if (!accessToken) {
      throw new Error("User is not authenticated");
    }
  
    return axios
      .post(
        `${API_BASE_URL}/destinations/${destinationId}/reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => response.data)
      .catch(error => {
        console.error("Error creating review:", error);
        throw error;
      });
  };
  
  // Update a review for a destination
  export const updateReview = (destinationId, reviewId, updatedData) => {
    return axios.put(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}`, updatedData).then(response => response.data);
  };
  
  // Delete a review for a destination
  export const deleteReview = (destinationId, reviewId) => {
    return axios.delete(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}`).then(response => response.data);
  };
  
  // Fetch comments for a review
export const fetchComments = (destinationId, reviewId) => {
    return axios.get(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}/comments`).then(response => response.data);
  };
  
  // Fetch a single comment for a review
  export const fetchCommentById = (destinationId, reviewId, commentId) => {
    return axios.get(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}/comments/${commentId}`).then(response => response.data);
  };
  
  // Create a new comment for a review
  export const createComment = (destinationId, reviewId, commentData) => {
    return axios.post(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}/comments`, commentData).then(response => response.data);
  };
  
  // Update a comment for a review
  export const updateComment = (destinationId, reviewId, commentId, updatedData) => {
    return axios.put(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}/comments/${commentId}`, updatedData).then(response => response.data);
  };
  
  // Delete a comment for a review
  export const deleteComment = (destinationId, reviewId, commentId) => {
    return axios.delete(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}/comments/${commentId}`).then(response => response.data);
  };
  