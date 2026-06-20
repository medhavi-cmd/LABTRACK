import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import generateToken from "../utils/generateTokens.js";

export const signup = async (req, res) => {
  try {
    const {
      role,
      name,
      email,
      password,
      enrollmentNo,
      employeeId,
    } = req.body;

    const allowedRoles = ["student", "faculty", "lab_staff"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role selected",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (role === "student" && !enrollmentNo) {
      return res.status(400).json({
        message: "Enrollment number is required for students",
      });
    }

    if (role !== "student" && !employeeId) {
      return res.status(400).json({
        message: "Employee ID is required for faculty and lab staff",
      });
    }

    console.log("SIGNUP REQUEST:", req.body);

    let finalEnrollmentNo = null;
    let finalEmployeeId = null;

    if (role === "student") {
      if (!/^\d+$/.test(String(enrollmentNo))) {
        return res.status(400).json({
          message: "Enrollment number is required and must contain numbers only",
        });
      }

      finalEnrollmentNo = Number(enrollmentNo);
    }

    if (role === "faculty" || role === "lab_staff") {
      if (!String(employeeId).trim()) {
        return res.status(400).json({
          message: "Employee ID is required for faculty and lab staff",
        });
      }

      finalEmployeeId = String(employeeId).trim();
    }

    const existingEmail = await pool.query(
      `
      SELECT user_id
      FROM users
      WHERE email = $1
      `,
      [email.trim().toLowerCase()]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    if (finalEnrollmentNo !== null) {
      const existingEnrollment = await pool.query(
        `
        SELECT user_id
        FROM users
        WHERE enrollment_number = $1
        `,
        [finalEnrollmentNo]
      );

      if (existingEnrollment.rows.length > 0) {
        return res.status(400).json({
          message: "This enrollment number is already registered",
        });
      }
    }

    if (finalEmployeeId !== null) {
      const existingEmployee = await pool.query(
        `
        SELECT user_id
        FROM users
        WHERE employee_id = $1
        `,
        [finalEmployeeId]
      );

      if (existingEmployee.rows.length > 0) {
        return res.status(400).json({
          message: "This employee ID is already registered",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (
        role,
        full_name,
        email,
        enrollment_number,
        employee_id,
        password_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        role,
        name.trim(),
        email.trim().toLowerCase(),
        finalEnrollmentNo,
        finalEmployeeId,
        hashedPassword,
      ]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: "Account created successfully",
      token: generateToken(user.user_id, user.role),
      user,
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        message:
          "Email, enrollment number, or employee ID is already registered",
      });
    }

    res.status(500).json({
      message: error.message || "Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      token: generateToken(user.user_id, user.role),
      user: {
        user_id: user.user_id,
        role: user.role,
        full_name: user.full_name,
        email: user.email,
        enrollment_number: user.enrollment_number,
        employee_id: user.employee_id,
        profile_completed: user.profile_completed,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};