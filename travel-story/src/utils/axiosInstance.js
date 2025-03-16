import axios from "axios";

//const BASE_URL = import.meta.env.VITE_BASE_URL;
 const BASE_URL = "https://wander-tales-backend.vercel.app/";
// const BASE_URL = "http://localhost:8000";
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'multipart/form-data',  // Ensures that FormData is correctly sent
    },
});

// Function to check token expiration
const isTokenExpired = () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    return tokenExpiry && Date.now() > parseInt(tokenExpiry, 10);
};

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Check if token is expired
        if (isTokenExpired()) {
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiry");
            window.location.href = "/auth/login"; // Redirect user to login page
            return Promise.reject(new Error("Session expired. Please log in again."));
        }

        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;