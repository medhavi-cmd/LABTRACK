import express from "express";
import { fetchRequests } from "../controllers/componentRequestController.js";

const router = express.Router();

router.get("/", fetchRequests);

export default router;