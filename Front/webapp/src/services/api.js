import axios from 'axios';
const API_BASE_URL = 'http://localhost:5092/api';

// Fetch all destinations
export const fetchDestinations = () => {
    return axios.get(`${API_BASE_URL}/destinations`).then(response => response.data);
  };
  
  // Fetch a single destination by ID
  export const fetchDestinationById = (destinationId) => {
    return axios.get(`${API_BASE_URL}/destinations/${destinationId}`).then(response => response.data);
  };
  
  // Create a destination
  export const createDestination = (destinationData, accessToken) => {
    if (!accessToken) {
      throw new Error("User is not authenticated");
    }
  
    return axios
      .post(`${API_BASE_URL}/destinations`, destinationData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
      })
      .then(response => response.data)
      .catch(error => {
        console.error("Error creating destination:", error);
        throw error;
      });
  };
  
  

// Update a destination
export const updateDestination = (destinationId, updatedData, accessToken) => {
  if (!accessToken) {
    throw new Error("User is not authenticated");
  }

  return axios
    .put(`${API_BASE_URL}/destinations/${destinationId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data)
    .catch(error => {
      console.error("Error updating destination:", error);
      throw error;
    });
};

// Delete a destination
export const deleteDestination = (destinationId, accessToken) => {
  if (!accessToken) {
    throw new Error("User is not authenticated");
  }

  return axios
    .delete(`${API_BASE_URL}/destinations/${destinationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data)
    .catch(error => {
      console.error("Error deleting destination:", error);
      throw error;
    });
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
  export const createReview = (destinationId, formData, accessToken) => {
    console.log('Access Token in createReview:', accessToken);
  
    if (!accessToken) {
      throw new Error("User is not authenticated");
    }
    return axios
      .post(
        `${API_BASE_URL}/destinations/${destinationId}/reviews`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => response.data)
      .catch(error => {
        console.error("Error creating review:", error);
        throw error;
      });
  };
  
  // Update a review
export const updateReview = (destinationId, reviewId, updatedData, accessToken) => {
  if (!accessToken) {
    throw new Error("User is not authenticated");
  }

  return axios
    .put(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data)
    .catch(error => {
      console.error("Error updating review:", error);
      throw error;
    });
};

// Delete a review for a destination
export const deleteReview = (destinationId, reviewId, accessToken) => {
  if (!accessToken) {
    throw new Error("User is not authenticated");
  }

  return axios
    .delete(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data)
    .catch(error => {
      console.error("Error deleting review:", error);
      throw error;
    });
};

  
  // Fetch comments for a review
export const fetchComments = (destinationId, reviewId) => {
    return axios.get(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}/comments`).then(response => response.data);
  };
  
  // Fetch a single comment for a review
  export const fetchCommentById = (destinationId, reviewId, commentId) => {
    return axios.get(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}/comments/${commentId}`).then(response => response.data);
  };
  
  // Create a comment for a review
export const createComment = (destinationId, reviewId, commentData, accessToken) => {
  if (!accessToken) {
    throw new Error("User is not authenticated");
  }

  return axios
    .post(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}/comments`, commentData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data)
    .catch(error => {
      console.error("Error creating comment:", error);
      throw error;
    });
};

// Update a comment for a review
export const updateComment = (destinationId, reviewId, commentId, updatedData, accessToken) => {
  if (!accessToken) {
    throw new Error("User is not authenticated");
  }

  return axios
    .put(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}/comments/${commentId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data)
    .catch(error => {
      console.error("Error updating comment:", error);
      throw error;
    });
};

// Delete a comment for a review
export const deleteComment = (destinationId, reviewId, commentId, accessToken) => {
  if (!accessToken) {
    throw new Error("User is not authenticated");
  }

  return axios
    .delete(`${API_BASE_URL}/destinations/${destinationId}/reviews/${reviewId}/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.data)
    .catch(error => {
      console.error("Error deleting comment:", error);
      throw error;
    });
};

  