import express from "express";
import {
  getMyProfile,
  fetchStudentByEnrollment,
  createTeam,
  getMyTeam,
  checkMyTeamStatus,
  fetchFacultyList,
} from "../controllers/teamController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole("student"));

// Logged-in leader profile
router.get("/my-profile", getMyProfile);

// Fetch member using enrollment number
router.get("/student/:enrollmentNo", fetchStudentByEnrollment);

// Check whether logged-in student already belongs to a team
router.get("/my-team-status", checkMyTeamStatus);

// Fetch complete registered team
router.get("/my-team", getMyTeam);

// fetch all faculty members for dropdown
router.get("/faculty", fetchFacultyList);

// Final submit only happens here
router.post("/register", createTeam);



export default router;