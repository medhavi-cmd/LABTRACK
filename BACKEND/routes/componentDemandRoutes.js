import express from "express";
import { fetchComponentDemand } from "../controllers/componentDemandController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(requireAuth);
router.use(requireRole("lab_staff"));

router.get("/", fetchComponentDemand);

export default router;
