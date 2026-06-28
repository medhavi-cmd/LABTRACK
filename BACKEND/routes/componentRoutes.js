import express from "express";
import { fetchAllComponents } from "../controllers/componentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", fetchAllComponents);

export default router;