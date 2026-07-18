import express from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/labStaffProfileController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole("lab_staff"));

router.get("/", getProfile);
router.put("/", updateProfile);

export default router;