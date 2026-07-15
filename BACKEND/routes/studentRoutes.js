import express from "express";

import {
  completeProfile,
  fetchProfile
}
from "../controllers/studentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router =
  express.Router();
  
router.use(requireAuth);
router.use(requireRole("student"));

router.post("/complete-profile", completeProfile);

router.get("/profile/:userId", fetchProfile);

export default router;