import axios from "axios";
import { toQueryString } from "../hooks/useListQuery";

const API = `${import.meta.env.VITE_API_URL}/faculty/projects`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

// Search, filter and sort are resolved by the API (projectApprovalService.js).
export const getProjects = (params = {}, signal) =>
  axios.get(`${API}${toQueryString(params)}`, {
    headers: getAuthHeaders(),
    signal,
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
