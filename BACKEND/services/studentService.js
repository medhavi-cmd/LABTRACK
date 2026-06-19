import { pool } from "../config/db.js";

export const createStudentProfile =
async(data)=>{

  const {
    user_id,
    enrollment_no,
    name,
    branch,
    section,
    year,
    semester,
    phone_no
  } = data;

  const result = await pool.query(
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
      phone_no
    ]
  );

  return result.rows[0];
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