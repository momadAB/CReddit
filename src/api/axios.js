import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api-creddit.eapi.joincoded.com",
  timeout: 10000,
});

export default axiosInstance;
