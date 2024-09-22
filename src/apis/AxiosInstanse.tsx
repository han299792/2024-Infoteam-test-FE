import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: "https://api.2024.newbies.gistory.me",
});

export default axiosInstance;
