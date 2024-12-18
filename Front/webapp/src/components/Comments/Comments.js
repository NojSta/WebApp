import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchComments, fetchReviewById } from '../../services/api';
import './Comments.css';

const Comments = () => {
  const { destinationId, reviewId } = useParams();
  const [comments, setComments] = useState([]);
  const [review, setReview] = useState([]);

  useEffect(() => {
    fetchComments(destinationId, reviewId)
      .then(setComments)
      .catch(error => console.error(error));
    fetchReviewById(destinationId, reviewId)
            .then(setReview)
            .catch((error) => console.error(error));
  }, [destinationId, reviewId]);

  return (
    <div className="comments">
      <h1>{review.name}</h1>
      <p>{review.content}</p>
      
      
      <h1>Comments</h1>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
      <Link to={`/destinations/${destinationId}/reviews`}>Back to Reviews</Link>
    </div>
  );
};

export default Comments;
