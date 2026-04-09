import api from "./axiosConfig";

// ── Users ────────────────────────────────────────────────
export const fetchAllUsers    = ()         => api.get("/users");

// ── Public ──────────────────────────────────────────────
export const fetchTop10       = ()         => api.get("/leaderboard/top");
export const fetchUserRank    = (userId)   => api.get(`/leaderboard/rank/${userId}`);

// ── Admin CRUD ───────────────────────────────────────────
export const fetchAllRecords  = ()         => api.get("/leaderboard");
export const createRecord     = (body)     => api.post("/leaderboard", body);
export const updateRecord     = (id, body) => api.put(`/leaderboard/${id}`, body);
export const deleteRecord     = (id)       => api.delete(`/leaderboard/${id}`);
export const notifyTop5       = ()         => api.post("/leaderboard/notify-top5");
