// /lib/axiosInstance.ts
import axios from 'axios';

// Create an Axios instance with a base URL.
const authAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_REST_API_URL, // e.g., "https://api.example.com"
});

export default authAxios;
