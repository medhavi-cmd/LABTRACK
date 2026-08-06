import axios from "axios";

const API = "http://localhost:5000/api/faculty/components";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getComponentRequests = () =>
  axios.get(API, {
    headers: getAuthHeaders(),
  });
