import axios from "axios";

//const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = "https://wander-tales-backend.vercel.app/";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'multipart/form-data',  // Ensures that FormData is correctly sent
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
);

export default axiosInstance;