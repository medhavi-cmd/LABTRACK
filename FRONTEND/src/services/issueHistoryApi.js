import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getIssueHistory = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API}/issue-history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};