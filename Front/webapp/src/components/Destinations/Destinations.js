import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createDestination, deleteDestination, fetchDestinations } from '../../services/api';
import { useAuth } from '../../services/AuthContext';
import './Destinations.css';

const Destinations = () => {
  const { accessToken, isAuthenticated, user } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [newDestination, setNewDestination] = useState({ name: '', content: '', photo: null });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  useEffect(() => {
    fetchDestinations()
      .then(setDestinations)
      .catch((error) => console.error(error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDestination({
      ...newDestination,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDestination({
        ...newDestination,
        photo: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateDestination = (e) => {
    e.preventDefault();
    if (!accessToken) {
      alert('You must be logged in to create a destination');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', newDestination.name);
    formData.append('content', newDestination.content);
    if (newDestination.photo) {
      formData.append('photo', newDestination.photo);
    }

    createDestination(formData, accessToken)
      .then((destination) => {
        setDestinations([...destinations, destination]);
        setNewDestination({ name: '', content: '', photo: null });
        setPhotoPreview(null);
        setIsSubmitting(false);
        setIsPopupOpen(false);
      })
      .catch((error) => {
        console.error(error);
        setIsSubmitting(false);
      });
  };

  const handleDeleteDestination = (destinationId) => {
    if (!accessToken) {
      alert('You must be logged in to delete a destination');
      return;
    }

    if (window.confirm('Are you sure you want to delete this destination?')) {
      deleteDestination(destinationId, accessToken)
        .then(() => {
          setDestinations(destinations.filter((dest) => dest.id !== destinationId));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  return (
    <div className="destinations">
      <h1>Destinations</h1>
      <div className="grid-container">
      {destinations.map((destination) => (
        <div key={destination.id} className="destination-box">
          <Link to={`/destinations/${destination.id}`} className="destination-name">
            {destination.name}
          </Link>
          {destination.photoDataUrl && (
            <div className="destination-image">
              <Link to={`/destinations/${destination.id}`}>
                <img
                  src={destination.photoDataUrl}
                  alt={destination.name || "Destination"}
                  className="photo"
                />
              </Link>
            </div>
          )}
          {isAuthenticated && user.name === "admin" && (
            <button
              className="delete-button"
              onClick={() => handleDeleteDestination(destination.id)}
            >
              Delete
            </button>
          )}
        </div>
      ))}
      </div>
  
      {isAuthenticated && user.name === "admin" && (
        <div>
          <div className="center-button-container">
            <button onClick={() => setIsPopupOpen(true)}>Add New Destination</button>
          </div>
          {isPopupOpen && (
            <div className="popup">
              <div className="popup-content">
                <span className="popup-close" onClick={() => setIsPopupOpen(false)}>
                  &times;
                </span>
                <h3>Add New Destination</h3>
                <form onSubmit={handleCreateDestination}>
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newDestination.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Content</label>
                    <textarea
                      name="content"
                      value={newDestination.content}
                      onChange={handleInputChange}
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
                  <div className="button-container">
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Destination'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}  

export default Destinations;
