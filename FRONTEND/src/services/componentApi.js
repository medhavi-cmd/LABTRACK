const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5050/api";

const getToken = () => localStorage.getItem("token");

const request = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

import { toQueryString } from "../hooks/useListQuery";

// Search, filter and sort are resolved by the API (componentService.js).
export const getAllComponents = (params = {}, signal) =>
  request(`/components${toQueryString(params)}`, { signal });