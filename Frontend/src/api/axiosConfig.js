import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Points to your Spring Boot Server
  headers: {
    'Content-Type': 'application/json', 
  },
});

export default api;