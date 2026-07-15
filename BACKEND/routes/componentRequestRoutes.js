import express from "express";
import {
    fetchRequests,
    approveRequest
} from "../controllers/componentRequestController.js";

const router = express.Router();

router.get("/", fetchRequests);

router.patch("/:id/approve", approveRequest);

export default router;