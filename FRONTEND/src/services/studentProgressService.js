import { authFetch } from "./api";
import { toQueryString } from "../hooks/useListQuery";

const BASE = `${import.meta.env.VITE_API_URL}/faculty/progress`;

// Search, filter and sort are resolved by the API (studentProgressService.js).
export const fetchAllTeamProgress = async (params = {}, signal) => {
  const res = await authFetch(`${BASE}${toQueryString(params)}`, { signal });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch progress.");
  return data.data; // { teams, stats }
};

export const fetchTeamDetail = async (teamId) => {
  const res = await authFetch(`${BASE}/${teamId}`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch team detail.");
  return data.data;
};
