import axios from "axios";

const API = "http://localhost:5001/api/faculty/notifications";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getNotifications = () =>
  axios.get(API, {
    headers: getAuthHeaders(),
  });

export const createNotification = ({
  title,
  message,
  sourceType,
  sourceId = null,
}) =>
  axios.post(
    API,
    {
      title,
      message,
      sourceType,
      sourceId,
    },
    {
      headers: getAuthHeaders(),
    }
  );

export const archiveNotification = (id) =>
  axios.patch(
    `${API}/${id}/archive`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

export const deleteNotification = (id) =>
  axios.delete(`${API}/${id}`, {
    headers: getAuthHeaders(),
  });
