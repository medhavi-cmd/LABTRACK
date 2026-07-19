import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";
import generateToken from "../utils/generateTokens.js";
import generateResetToken from "../utils/generateResetToken.js";
import { sendPasswordResetOtp } from "../services/mailService.js";
import { verifyPasswordResetOTP, resetPassword } from "../services/passwordResetService.js";
import { isBMUEmail } from "../utils/emailValidator.js";


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

    if (!isBMUEmail(email)) {
      return res.status(400).json({
        message:
          "Only BMU email addresses (@bmu.edu.in or @bml.edu.in) are allowed.",
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
      if (!/^\d{6}$/.test(String(enrollmentNo))) {
  return res.status(400).json({
    message: "Enrollment number must be exactly 6 digits.",
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

    if (!isBMUEmail(email)) {
      return res.status(400).json({
        message:
          "Only BMU email addresses (@bmu.edu.in or @bml.edu.in) are allowed.",
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


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!isBMUEmail(email)) {
      return res.status(400).json({
        message:
          "Only BMU email addresses (@bmu.edu.in or @bml.edu.in) are allowed.",
      });
    }

    const result = await pool.query(
      `
      SELECT user_id, full_name, email
      FROM users
      WHERE email = $1
      `,
      [email.trim().toLowerCase()]
    );

    // Always return same response
    if (result.rows.length === 0) {
      return res.json({
        message:
          "If an account with this email exists, an OTP has been sent.",
      });
    }

    const user = result.rows[0];

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Delete previous OTPs
    await pool.query(
      `
      DELETE FROM password_reset_otps
      WHERE user_id = $1
      `,
      [user.user_id]
    );

    // Save OTP
    await pool.query(
      `
      INSERT INTO password_reset_otps
      (
        user_id,
        otp_code,
        expires_at
      )
      VALUES
      (
        $1,
        $2,
        NOW() + INTERVAL '5 minutes'
      )
      `,
      [user.user_id, otp]
    );

    // Send Email
    await sendPasswordResetOtp(
      user.email,
      user.full_name,
      otp
    );

    return res.json({
      message:
        "If an account with this email exists, an OTP has been sent.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const userId = await verifyPasswordResetOTP(
      email.trim().toLowerCase(),
      otp.trim()
    );

    const resetToken = generateResetToken(userId);

    res.json({
      message: "OTP verified successfully.",
      resetToken,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


export const resetUserPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required.",
      });
    }

    await resetPassword(
      req.resetUserId,
      email.trim().toLowerCase(),
      newPassword
    );

    res.json({
      message: "Password reset successfully.",
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const email = req.googleUser.email;

    if (!isBMUEmail(email)) {
      return res.status(403).json({
        message:
          "Only BMU email addresses (@bmu.edu.in or @bml.edu.in) are allowed.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        user_id,
        role,
        full_name,
        email,
        enrollment_number,
        employee_id,
        profile_completed
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "No LabTrack account exists with this Google email. Please sign up first.",
      });
    }

    const user = result.rows[0];

    res.json({
      token: generateToken(user.user_id, user.role),
      user,
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};