import express from "express";

import { requireAuth } from "../middleware/authMiddleware.js";
import { fetchNextEvent } from "../controllers/eventController.js";

const router = express.Router();

router.get("/next", requireAuth, fetchNextEvent);

export default router;