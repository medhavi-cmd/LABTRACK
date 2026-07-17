import express from "express";
import { fetchIssuedComponents, markAsReturned } from "../controllers/issuedComponentsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(requireAuth);
router.use(requireRole("lab_staff"));

router.get("/", fetchIssuedComponents);
router.patch("/:id/return", markAsReturned);

export default router;