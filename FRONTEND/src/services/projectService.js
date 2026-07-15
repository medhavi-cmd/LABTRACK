import axios from "axios";

const API = "http://localhost:5001/api/faculty/projects";

export const getProjects = () => axios.get(API);

export const updateProjectStatus = (id, status) =>
  axios.patch(`${API}/${id}/status`, { status });