import express from "express";

import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { getIssueHistory } from "../controllers/issueHistoryController.js";

const router = express.Router();

router.get(
    "/",
    requireAuth,
    requireRole("student"),
    getIssueHistory
);

export default router;