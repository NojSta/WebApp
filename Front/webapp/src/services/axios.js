// src/services/axios.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5092', // Set the base URL here
  headers: {
    'Content-Type': 'application/json', // Optional: specify content type
  },
});

export default instance;
