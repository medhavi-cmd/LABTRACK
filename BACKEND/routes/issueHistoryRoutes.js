import express from "express";

import { requireAuth } from "../middleware/authmiddleware.js";

import { getIssueHistory } from "../controllers/issueHistoryController.js";

const router = express.Router();

router.get("/", requireAuth, getIssueHistory);

export default router;