import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000", // ✅ your backend
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // keep if backend uses cookies
});

// ✅ Attach token
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle errors globally
API.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API ERROR:", error.response || error.message);

    const message =
      error.response?.data?.message ||
      error.response?.data ||
      "Something went wrong!";

    alert(message); // 🔥 simple UI feedback

    return Promise.reject(error);
  }
);

export default API;