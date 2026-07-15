import express from "express";

import {
  fetchComponents,
  fetchComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
} from "../controllers/inventoryController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole("lab_staff"));

router.get("/", fetchComponents);
router.get("/:id", fetchComponentById);
router.post("/", createComponent);
router.put("/:id", updateComponent);
router.delete("/:id", deleteComponent);

export default router;