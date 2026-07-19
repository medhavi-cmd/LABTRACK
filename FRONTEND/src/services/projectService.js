import axios from "axios";

const API = "http://localhost:5001/api/faculty/projects";

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
