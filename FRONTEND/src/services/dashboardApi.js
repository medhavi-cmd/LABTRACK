import { authFetch } from "./api";

const API_URL = `${import.meta.env.VITE_API_URL}/lab-staff/dashboard`;

export const getDashboard = async () => {
  const response = await authFetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const result = await response.json();

  return result.data;
};