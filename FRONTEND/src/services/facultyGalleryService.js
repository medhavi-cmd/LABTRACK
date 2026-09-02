import axios from "axios";
import { toQueryString } from "../hooks/useListQuery";

const API = `${import.meta.env.VITE_API_URL}/faculty/gallery`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

// Search, filter and sort are resolved by the API (facultyGalleryService.js).
export const getGalleryRequests = (params = {}, signal) =>
  axios.get(`${API}${toQueryString(params)}`, {
    headers: getAuthHeaders(),
    signal,
  });

export const updateGalleryStatus = (id, status, remarks = null) =>
  axios.patch(
    `${API}/${id}/status`,
    {
      status,
      remarks,
    },
    {
      headers: getAuthHeaders(),
    }
  );
