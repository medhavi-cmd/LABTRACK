import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/faculty/components`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getComponentRequests = () =>
  axios.get(API, {
    headers: getAuthHeaders(),
  });
