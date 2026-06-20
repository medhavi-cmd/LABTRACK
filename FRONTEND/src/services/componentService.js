import axios from "axios";

const API = "http://localhost:5001/api/faculty/components";

export const getComponentRequests = () =>
  axios.get(API);

export const updateComponentStatus = (
  id,
  status
) =>
  axios.patch(
    `${API}/${id}/status`,
    { status }
  );