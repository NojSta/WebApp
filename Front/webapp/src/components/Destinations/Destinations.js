import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDestinations } from '../../services/api';
import './Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchDestinations()
      .then(setDestinations)
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="destinations">
      <h1>Destinations</h1>
      <ul>
        {destinations.map(destination => (
          <li key={destination.id}>
            <Link to={`/destinations/${destination.id}`}>{destination.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Destinations;
