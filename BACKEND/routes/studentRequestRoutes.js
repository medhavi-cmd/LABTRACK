import express from "express";

import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

import {
  createComponentRequest,
} from "../controllers/studentRequestController.js";

const router = express.Router();



router.post(
  "/submit",
  requireAuth,
  requireRole("student"),
  createComponentRequest
);

export default router;