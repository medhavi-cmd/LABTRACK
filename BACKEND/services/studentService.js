import { pool } from "../config/db.js";

export const createStudentProfile = async (data) => {
  const {
    user_id,
    enrollment_no,
    name,
    branch,
    section,
    year,
    semester,
    phone_no,
  } = data;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      INSERT INTO students
      (
        user_id,
        enrollment_no,
        name,
        branch,
        section,
        year,
        semester,
        phone_no
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8
      )
      RETURNING *
      `,
      [
        user_id,
        enrollment_no,
        name,
        branch,
        section,
        year,
        semester,
        phone_no,
      ]
    );

    await client.query(
      `
      UPDATE users
      SET profile_completed = true
      WHERE user_id = $1
      `,
      [user_id]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


export const getStudentProfile =
async(userId)=>{

  const result =
    await pool.query(
      `
      SELECT *
      FROM students
      WHERE user_id=$1
      `,
      [userId]
    );

  return result.rows[0];
};