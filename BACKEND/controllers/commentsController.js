import { getComments, addComment, deleteComment } from "../services/commentsService.js";

const ALLOWED_ENTITY_TYPES = [
  "request",
  "issue",
  "damage",
  "return",
  "inventory",
  "purchase_request",
  "project",
  "team",
  "gallery",
];

const getUserId = (req) =>
  req.user?.user_id ?? req.user?.userId ?? req.user?.id;

export const listComments = async (req, res) => {
  try {
    const { entity_type, entity_id } = req.query;

    if (!entity_type || !ALLOWED_ENTITY_TYPES.includes(entity_type)) {
      return res.status(400).json({ success: false, message: "Invalid entity_type." });
    }
    const entityId = Number(entity_id);
    if (!Number.isInteger(entityId) || entityId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid entity_id." });
    }

    const comments = await getComments({ entityType: entity_type, entityId });
    return res.status(200).json({ success: true, data: comments });
  } catch (err) {
    console.error("listComments error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch comments." });
  }
};

export const createComment = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const { entity_type, entity_id, comment_text } = req.body;

    if (!entity_type || !ALLOWED_ENTITY_TYPES.includes(entity_type)) {
      return res.status(400).json({ success: false, message: "Invalid entity_type." });
    }
    const entityId = Number(entity_id);
    if (!Number.isInteger(entityId) || entityId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid entity_id." });
    }
    if (!comment_text?.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required." });
    }

    const comment = await addComment({
      entityType: entity_type,
      entityId,
      userId,
      commentText: comment_text.trim(),
    });

    return res.status(201).json({ success: true, data: comment });
  } catch (err) {
    console.error("createComment error:", err);
    return res.status(500).json({ success: false, message: "Failed to add comment." });
  }
};

export const removeComment = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const commentId = Number(req.params.id);
    if (!Number.isInteger(commentId) || commentId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid comment ID." });
    }

    const deleted = await deleteComment({ commentId, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Comment not found or not yours." });
    }

    return res.status(200).json({ success: true, message: "Comment deleted." });
  } catch (err) {
    console.error("removeComment error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete comment." });
  }
};
