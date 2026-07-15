import express from "express";
import { fetchRequests } from "../controllers/componentRequestController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole("lab_staff"));

router.get(
    "/",
    requireAuth,
    requireRole("lab_staff"),
    fetchRequests
);

export default router;