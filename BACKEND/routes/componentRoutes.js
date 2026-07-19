import express from "express";
import { fetchAllComponents } from "../controllers/componentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole("student"));

router.get("/", fetchAllComponents);

export default router;