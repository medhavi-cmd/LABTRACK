import axios from "axios";

const API = "http://localhost:5001/api/faculty/dashboard";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getFacultyDashboard = () =>
  axios.get(API, {
    headers: getAuthHeaders(),
  });
