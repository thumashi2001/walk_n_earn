import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

function redirectToLogin() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  const path = window.location.pathname || "";
  if (!path.endsWith("/login")) {
    window.location.assign("/login");
  }
}

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const msg = err.response?.data?.message;
    const noToken =
      status === 400 &&
      typeof msg === "string" &&
      msg.toLowerCase().includes("no token");

    if (status === 401 || noToken) {
      redirectToLogin();
    }

    return Promise.reject(err);
  }
);

export default API;