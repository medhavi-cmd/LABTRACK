import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/faculty/gallery`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getGalleryRequests = () =>
  axios.get(API, {
    headers: getAuthHeaders(),
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
