import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/faculty/events`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getEvents = () =>
  axios.get(API, {
    headers: getAuthHeaders(),
  });

export const addEvent = (event) =>
  axios.post(API, event, {
    headers: getAuthHeaders(),
  });

export const deleteEvent = (id) =>
  axios.delete(`${API}/${id}`, {
    headers: getAuthHeaders(),
  });
