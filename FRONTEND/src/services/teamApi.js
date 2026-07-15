const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

export const request = async (url, options = {}) => {
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

export const getMyProfile = () => request("/team/my-profile");

export const getStudentByEnrollment = (enrollmentNo) =>
  request(`/team/student/${encodeURIComponent(enrollmentNo)}`);

export const registerTeam = (payload) =>
  request("/team/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getMyTeam = () => request("/team/my-team");

export const getMyTeamStatus = () => request("/team/my-team-status");

export const getFacultyList = () => request("/team/faculty");

