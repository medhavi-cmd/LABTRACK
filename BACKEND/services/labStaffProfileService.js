import { pool } from "../config/db.js";

export const fetchLabStaffProfile = async (userId) => {
  const result = await pool.query(
    `
    SELECT
      staff_id,
      user_id,
      name,
      phone_no
    FROM lab_staff
    WHERE user_id = $1
    `,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("Profile not found.");
  }

  return result.rows[0];
};

export const editLabStaffProfile = async (
  userId,
  { name, phone_no }
) => {
  const result = await pool.query(
    `
    UPDATE lab_staff
    SET
      name = $1,
      phone_no = $2
    WHERE user_id = $3
    RETURNING
      staff_id,
      user_id,
      name,
      phone_no
    `,
    [name, phone_no, userId]
  );

  if (result.rows.length === 0) {
    throw new Error("Profile not found.");
  }

  return result.rows[0];
};