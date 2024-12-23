import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Use environment variable for API base URL
  headers: { 'Content-Type': 'application/json' }
});

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is from the server
    if (error.response) {
      console.error(`Server Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
      toast.error(error.response.data.message || 'An error occurred on the server');
    } else if (error.request) {
      console.error('No response received from server:', error.request);
      toast.error('No response received from the server');
    } else {
      console.error('Error setting up the request:', error.message);
      toast.error(error.message);
    }
    return Promise.reject(error); // Reject the promise to handle it properly in the calling code
  }
);

export default axiosInstance;
