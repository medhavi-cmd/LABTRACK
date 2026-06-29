import express from "express";

import { requireAuth } from "../middleware/authMiddleware.js";

import {
  createComponentRequest,
} from "../controllers/studentRequestController.js";

const router = express.Router();

router.post(
  "/submit",
  requireAuth,
  createComponentRequest
);

export default router;