import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { fetchReviews, createReview, fetchDestinationById } from '../../services/api';
import './Reviews.css';

const Reviews = () => {
  const { destinationId } = useParams();
  const [destination, setDestination] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { accessToken, isAuthenticated, user } = useAuth();
  const [newReview, setNewReview] = useState({
    title: '',
    content: '',
    rating: 0,
    userName: user.name,
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinationById(destinationId)
      .then(setDestination)
      .catch((error) => console.error(error));
    fetchReviews(destinationId)
      .then(setReviews)
      .catch((error) => console.error(error));
  }, [destinationId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: name === 'rating' ? Number(value) : value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewReview({
        ...newReview,
        photo: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!accessToken) {
      alert('You must be logged in to submit a review');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', newReview.title);
    formData.append('content', newReview.content);
    formData.append('rating', Number(newReview.rating));
    formData.append('UserName', newReview.userName)
    if (newReview.photo) {
      formData.append('photo', newReview.photo);
    }

    createReview(destinationId, formData, accessToken)
      .then((review) => {
        setReviews([...reviews, review]);
        setNewReview({ title: '', content: '', rating: 0, photo: null });
        setPhotoPreview(null);
        setIsSubmitting(false);
        setIsPopupOpen(false);
        navigate(`/destinations/${destinationId}/reviews/${review.id}`);
      })
      .catch((error) => {
        console.error(error);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="review-box">
      {destination.photoDataUrl && (
          <div className="review-image-container">
            <img 
              src={destination.photoDataUrl} 
              alt="Review" 
              className="review-photo" 
            />
          </div>
        )}
      <h1 style={{ textAlign: 'center' }}>{destination.name}</h1>
      <p>{destination.content}</p>
      <h2 style={{ textAlign: 'center' }}>Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <div key={review.id}>
            <p className="review-username"><strong>{review.userName}</strong></p>
            <ul>
              <li>
                <Link to={`/destinations/${destinationId}/reviews/${review.id}`}>{review.name}</Link>
              </li>
            </ul>
      </div>
        ))}
      </ul>
  
      {isAuthenticated ? (
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => setIsPopupOpen(true)}>Add a Review</button>
          {isPopupOpen && (
            <div className="popup">
              <div className="popup-content">
                <span className="popup-close" onClick={() => setIsPopupOpen(false)}>
                  &times;
                </span>
                <h3 style={{ textAlign: 'center' }}>Add a Review</h3>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newReview.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Content</label>
                    <textarea
                      name="content"
                      value={newReview.content}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={newReview.rating}
                      onChange={handleInputChange}
                      min="1"
                      max="5"
                      required
                    />
                  </div>
                  <div>
                    <label>Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    {photoPreview && (
                      <div className="photo-preview">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="max-w-full h-auto rounded"
                          style={{ maxHeight: '200px' }}
                        />
                      </div>
                    )}
                  </div>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
      <div className="message">
        <p>You must be logged in to create a review.</p>
        </div>
      )}
      <Link to="../.." style={{ display: 'inline', marginTop: '20px', textAlign: 'left' }}>
        Back
      </Link>
    </div>
  );
}  

export default Reviews;
