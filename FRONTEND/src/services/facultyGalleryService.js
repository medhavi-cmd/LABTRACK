import axios from "axios";

const API = "http://localhost:5001/api/faculty/gallery";

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
