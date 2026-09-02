import { authFetch } from "./api";

const BASE = `${import.meta.env.VITE_API_URL}/comments`;

export const fetchComments = async ({ entityType, entityId }) => {
  const res = await authFetch(`${BASE}?entity_type=${entityType}&entity_id=${entityId}`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to load comments.");
  return data.data; // array of comments
};

export const postComment = async ({ entityType, entityId, commentText }) => {
  const res = await authFetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      entity_type: entityType,
      entity_id: entityId,
      comment_text: commentText,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to add comment.");
  return data.data;
};

export const removeComment = async (commentId) => {
  const res = await authFetch(`${BASE}/${commentId}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete comment.");
  return data;
};
