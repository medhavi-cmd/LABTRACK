import axios from "axios";
import { toQueryString } from "../hooks/useListQuery";

const API = import.meta.env.VITE_API_URL;

// Search and filter are resolved by the API (issueHistoryController.js).
export const getIssueHistory = async (params = {}, signal) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API}/issue-history${toQueryString(params)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    }
  );

  return response.data;
};
