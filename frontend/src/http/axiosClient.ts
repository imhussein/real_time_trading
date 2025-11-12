import axios from "axios";
import { config } from "../config/config";

const axiosClient = axios.create({
  baseURL: config.apiURL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
