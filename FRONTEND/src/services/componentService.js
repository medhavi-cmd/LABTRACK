import axios from "axios";
import { toQueryString } from "../hooks/useListQuery";

const API = `${import.meta.env.VITE_API_URL}/faculty/components`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Search, filter and sort are resolved by the API (facultyComponentService.js).
export const getComponentRequests = (params = {}, signal) =>
  axios.get(`${API}${toQueryString(params)}`, {
    headers: getAuthHeaders(),
    signal,
  });
