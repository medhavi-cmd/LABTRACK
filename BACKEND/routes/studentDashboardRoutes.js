import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { fetchDashboardData } from "../controllers/studentDashboardController.js";

const router = express.Router();

router.get("/", requireAuth, fetchDashboardData);

export default router;