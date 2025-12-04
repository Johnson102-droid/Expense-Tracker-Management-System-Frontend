import axios from 'axios';

// Create an axios instance pointing to your backend URL
const api = axios.create({
  baseURL: 'http://localhost:8081', // Your Backend Port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add the Token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach it
  }
  return config;
});

export default api;