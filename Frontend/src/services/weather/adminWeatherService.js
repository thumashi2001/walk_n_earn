import API from "../api";

const ENDPOINT = "/admin/health-advice";

export const fetchAllAdvices = async () => {
  const response = await API.get(ENDPOINT);
  return response.data.data;
};

export const deleteAdvice = async (id) => {
  const response = await API.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

export const createHealthAdvice = async (adviceData) => {
  const response = await API.post(ENDPOINT, adviceData);
  return response.data;
};

export const updateHealthAdvice = async (id, adviceData) => {
  const response = await API.put(`${ENDPOINT}/${id}`, adviceData);
  return response.data;
};
