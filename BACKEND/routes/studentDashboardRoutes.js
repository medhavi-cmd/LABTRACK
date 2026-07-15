import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { fetchDashboardData } from "../controllers/studentDashboardController.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
    "/",
    requireAuth,
    requireRole("student"),
    fetchDashboardData
);

export default router;