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

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists",
            });
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
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
            [
                role,
                name,
                email,
                role === "student"
                    ? enrollmentNo
                    : null,

                role !== "student"
                    ? employeeId
                    : null,

                hashedPassword,
            ]
        );

        const user = result.rows[0];

        res.status(201).json({
            message: "Account created",
            token: generateToken(
                user.user_id,
                user.role
            ),
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
};

export const login = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const user = result.rows[0];

        const match =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!match) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        res.json({
            token: generateToken(
                user.user_id,
                user.role
            ),
            user,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};