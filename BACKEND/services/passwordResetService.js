import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

export const resetPassword = async (
userId,
email,
newPassword
) => {
// Verify that the reset token user matches the email
const result = await pool.query(
`     SELECT user_id
    FROM users
    WHERE user_id = $1
      AND email = $2
    `,
[userId, email]
);

if (result.rows.length === 0) {
throw new Error("Invalid reset request.");
}

const hashedPassword = await bcrypt.hash(
newPassword,
10
);

await pool.query(
`     UPDATE users
    SET password_hash = $1
    WHERE user_id = $2
    `,
[hashedPassword, userId]
);

return true;
};

export const verifyPasswordResetOTP = async (
email,
otp
) => {
// Find user
const userResult = await pool.query(
`     SELECT user_id
    FROM users
    WHERE email = $1
    `,
[email]
);

if (userResult.rows.length === 0) {
throw new Error("User not found.");
}

const userId = userResult.rows[0].user_id;

// Latest OTP
const otpResult = await pool.query(
`     SELECT *
    FROM password_reset_otps
    WHERE user_id = $1
      AND is_used = false
    ORDER BY created_at DESC
    LIMIT 1
    `,
[userId]
);

if (otpResult.rows.length === 0) {
throw new Error("No OTP found.");
}

const otpRow = otpResult.rows[0];

if (new Date() > otpRow.expires_at) {
throw new Error("OTP has expired.");
}

if (otpRow.otp_code !== otp) {
throw new Error("Invalid OTP.");
}

// Mark OTP used
await pool.query(
`     UPDATE password_reset_otps
    SET is_used = true
    WHERE otp_id = $1
    `,
[otpRow.otp_id]
);

return userId;
};
