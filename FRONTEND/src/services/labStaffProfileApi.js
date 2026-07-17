import { authFetch } from "./api";

const BASE_URL = `${import.meta.env.VITE_API_URL}/lab-staff/profile`;

export const getProfile = async () => {
  const response = await authFetch(BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return await response.json();
};

export const updateProfile = async (profileData) => {
  const response = await authFetch(BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update profile");
  }

  return await response.json();
};