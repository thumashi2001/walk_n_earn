import axios from "axios";
import { AUTH_TOKEN_KEY } from "../auth";

const API_URL = "http://localhost:5050/api/admin/health-advice";

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}` },
});

export const fetchAllAdvices = async () => {
  const response = await axios.get(API_URL, getHeaders());
  return response.data.data; // Matches: res.status(200).json({ data: advices })
};

export const deleteAdvice = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
  return response.data;
};