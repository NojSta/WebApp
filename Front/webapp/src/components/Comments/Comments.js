import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchComments, fetchReviewById, deleteReview } from '../../services/api';
import { createComment, deleteComment } from '../../services/api';
import { useAuth } from '../../services/AuthContext';
import './Comments.css';

const Comments = () => {
  const { destinationId, reviewId } = useParams();
  const [comments, setComments] = useState([]);
  const [review, setReview] = useState({});
  const [newComment, setNewComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const { accessToken, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isAddingComment, setIsAddingComment] = useState(false);

  useEffect(() => {
    fetchComments(destinationId, reviewId)
      .then(setComments)
      .catch((error) => console.error(error));

    fetchReviewById(destinationId, reviewId)
      .then((fetchedReview) => {
        setReview(fetchedReview);
      })
      .catch((error) => console.error(error));
  }, [destinationId, reviewId]);

  const handleAddComment = () => {
    if (newComment.length < 5 || newComment.length > 100) {
      alert("Comment must be between 5 and 100 characters.");
      return;
    }

    const commentData = {
      text: newComment,
      Name: user.name
    };

    createComment(destinationId, reviewId, commentData, accessToken)
      .then((addedComment) => {
        setComments((prevComments) => [...prevComments, addedComment]);
        setNewComment('');
        setIsModalOpen(false);
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  const handleDeleteComment = (commentId) => {
    const comment = comments.find((comment) => comment.id === commentId);
    if (comment && comment.name === user.name) {
      deleteComment(destinationId, reviewId, commentId, accessToken)
        .then(() => {
          setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
          setIsModalOpen(false);
        })
        .catch((error) => console.error('Error deleting comment:', error));
    } else {
      alert("You can only delete your comments");
      setIsModalOpen(false);
    }
  };

  const handleDeleteReview = () => {
    if (review.userName === user.name || user.name === "admin") {
      deleteReview(destinationId, reviewId, accessToken)
        .then(() => {
          console.log('Review deleted successfully');
          navigate(`/destinations/${destinationId}`);
        })
        .catch((error) => console.error('Error deleting review:', error));
    } else {
      alert("You can only delete your reviews");
    }
  };

  const openDeleteCommentModal = (commentId) => {
    setCommentToDelete(commentId);
    setIsModalOpen(true);
  };

  const openAddCommentModal = () => {
    setIsAddingComment(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCommentToDelete(null);
    setIsAddingComment(false);
    setIsDeletingReview(false);
  };

  return (
    <div className="review-box">
      <div className="review-content">
        {review.photoDataUrl && (
          <div className="review-image-container">
            <img 
              src={review.photoDataUrl} 
              alt="Review" 
              className="review-photo" 
            />
          </div>
        )}
        <h1 className="review-name">{review.name}</h1>
        <p className="review-username"><strong>{review.userName}</strong></p>
        <p className="review-text">{review.content}</p>
        <p className="review-time">{new Date(review.createdAt).toLocaleString()}</p>
        
      </div>

      <h1 className="header-centered">Comments</h1>
      <ul>
        {comments.map(comment => (
          <li key={comment.id} className="comment-item">
            <p className="comment-name"><strong>{comment.name}</strong></p>
            <p className="comment-text">{comment.text}</p>
            <p className="comment-time">{new Date(comment.createdAt).toLocaleString()}</p>
            {isAuthenticated && (comment.name === user.name || user.name === "admin" )&&(
              <button className="delete-button" onClick={() => openDeleteCommentModal(comment.id)}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      {isAuthenticated && (
        <div className="centered-button">
          <button onClick={openAddCommentModal}>Add Comment</button>
        </div>
      )}

      <div className="back-link">
        <Link to={`/destinations/${destinationId}`}>Back</Link>
      </div>

      <div className="review-actions">
        {isAuthenticated && (review.userName === user.name || user.name === "admin") && (
          <button className="delete-review-button" onClick={handleDeleteReview}>
            Delete Review
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            {isDeletingReview ? (
              <div>
                <h3>Are you sure you want to delete this review?</h3>
                <button onClick={handleDeleteReview}>Yes, Delete</button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            ) : isAddingComment ? (
              <div>
                <h3>Add a new comment</h3>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Enter your comment"
                />
                <div className="button-container">
                  <button onClick={handleAddComment}>Add Comment</button>
                  <button onClick={closeModal}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h3>Are you sure you want to delete this comment?</h3>
                <button onClick={() => handleDeleteComment(commentToDelete)}>Yes, Delete</button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
