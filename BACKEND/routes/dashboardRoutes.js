import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Dashboard routes working" });
});

router.get(
  "/dashboard",
  requireAuth,
  requireRole("lab_staff"),
  getDashboard
);

export default router;