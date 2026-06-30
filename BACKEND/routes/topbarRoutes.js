import express from "express";

import { requireAuth } from "../middleware/authMiddleware.js";
import { fetchTopbarData } from "../controllers/topbarController.js";

const router = express.Router();

router.get("/", requireAuth, fetchTopbarData);

export default router;