import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/faculty/dashboard`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getFacultyDashboard = () =>
  axios.get(API, {
    headers: getAuthHeaders(),
  });
