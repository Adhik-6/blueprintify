import axios from "axios";

const baseURL = import.meta.env.BACKEND_URL || "http://127.0.0.1:8000/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;
