import express from "express";
import { fetchDamageComponents, resolveDamageComponent, createDamageReport } from "../controllers/damageComponentsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(requireAuth);
router.use(requireRole("lab_staff"));

router.get("/", fetchDamageComponents);
router.patch("/:id/resolve", resolveDamageComponent);
router.post("/", createDamageReport);

export default router;
