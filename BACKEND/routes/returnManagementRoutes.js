import express from "express";
import { fetchReturnHistory } from "../controllers/returnManagementController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole("lab_staff"));

// GET /api/returns
router.get("/", fetchReturnHistory);

export default router;