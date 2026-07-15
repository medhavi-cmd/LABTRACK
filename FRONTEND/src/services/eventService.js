import axios from "axios";

const API = "http://localhost:5001/api/faculty/events";

export const getEvents = () =>
  axios.get(API);

export const addEvent = (event) =>
  axios.post(API, event);

export const deleteEvent = (id) =>
  axios.delete(`${API}/${id}`);