import { pool } from "../config/db.js";

/* ─────────────────────────────────────────
   GET COMMENTS FOR AN ENTITY
   entity_type: 'request' | 'issue' | 'damage' | 'return' | 'inventory' | 'purchase_request' | 'project' | 'team'
───────────────────────────────────────── */
export const getComments = async ({ entityType, entityId }) => {
  const result = await pool.query(`
    SELECT
      c.comment_id,
      c.entity_type,
      c.entity_id,
      c.user_id,
      c.comment_text,
      c.created_at,
      u.full_name AS author_name,
      u.role AS author_role
    FROM comments c
    JOIN users u ON u.user_id = c.user_id
    WHERE c.entity_type = $1 AND c.entity_id = $2
    ORDER BY c.created_at ASC
  `, [entityType, entityId]);
  return result.rows;
};

/* ─────────────────────────────────────────
   ADD COMMENT
───────────────────────────────────────── */
export const addComment = async ({ entityType, entityId, userId, commentText }) => {
  // Returns the same shape as getComments so the client can append the new
  // comment directly without a refetch (otherwise author_name is missing).
  const result = await pool.query(`
    WITH inserted AS (
      INSERT INTO comments (entity_type, entity_id, user_id, comment_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    )
    SELECT
      i.comment_id,
      i.entity_type,
      i.entity_id,
      i.user_id,
      i.comment_text,
      i.created_at,
      u.full_name AS author_name,
      u.role AS author_role
    FROM inserted i
    JOIN users u ON u.user_id = i.user_id
  `, [entityType, entityId, userId, commentText]);
  return result.rows[0];
};

/* ─────────────────────────────────────────
   DELETE COMMENT (own comment only)
───────────────────────────────────────── */
export const deleteComment = async ({ commentId, userId }) => {
  const result = await pool.query(`
    DELETE FROM comments
    WHERE comment_id = $1 AND user_id = $2
    RETURNING *
  `, [commentId, userId]);
  return result.rows[0];
};
