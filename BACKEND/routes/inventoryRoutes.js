import express from "express";

import {
  fetchComponents,
  fetchComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.get("/", fetchComponents);
router.get("/:id", fetchComponentById);
router.post("/", createComponent);
router.put("/:id", updateComponent);
router.delete("/:id", deleteComponent);

export default router;