import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/faculty/projects`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getProjects = () =>
  axios.get(API, {
    headers: getAuthHeaders(),
  });

export const updateProjectStatus = (id, status, remarks = null) =>
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
