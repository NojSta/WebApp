import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { fetchReviews, createReview, fetchDestinationById } from '../../services/api';
import './Reviews.css';

const Reviews = () => {
  const { destinationId } = useParams();
  const [destination, setDestination] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    title: '',
    content: '',
    rating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken, isAuthenticated } = useAuth();
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
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!accessToken) {
      alert('You must be logged in to submit a review');
      setIsSubmitting(false);
      return;
    }

    createReview(destinationId, newReview, accessToken)
      .then((review) => {
        setReviews([...reviews, review]);
        setNewReview({ title: '', content: '', rating: 0 });
        setIsSubmitting(false);
        navigate(`/destinations/${destinationId}/reviews/${review.id}`);
      })
      .catch((error) => {
        console.error(error);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="reviews">
      <h1>{destination.name}</h1>
      <p>{destination.content}</p>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <Link to={`/destinations/${destinationId}/reviews/${review.id}`}>{review.name}</Link>
          </li>
        ))}
      </ul>

      {isAuthenticated ? (
        <div>
          <h3>Add a Review</h3>
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
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      ) : (
        <p>You must be logged in to create a review.</p>
      )}

      <Link to="../..">Back to Destinations</Link>
    </div>
  );
};

export default Reviews;
