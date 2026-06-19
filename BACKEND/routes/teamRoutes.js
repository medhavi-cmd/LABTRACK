import express from "express";
import {
    fetchStudentByEnrollment,
    createTeam
} from "../controllers/teamController.js";

const router = express.Router();

// Route to fetch a student's profile details using their enrollment number
router.get("/student/:enrollmentNo", fetchStudentByEnrollment);

// Route to handle full team registration (creates team, project, and maps members)
router.post("/register", createTeam);

export default router;