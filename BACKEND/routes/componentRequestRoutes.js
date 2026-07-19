import express from "express";
import {
  fetchRequests,
  approveRequest,
} from "../controllers/componentRequestController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole("lab_staff"));

router.get("/", fetchRequests);
router.patch("/:id/approve", approveRequest);

export default router;