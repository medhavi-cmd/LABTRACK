import express from "express";
import {
  fetchRequestFormDetails,
  submitPurchaseRequest,
  fetchMyPurchaseRequests,
} from "../controllers/purchaseRequestController.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole("student"));

router.get("/form-details", fetchRequestFormDetails);

router.post("/", submitPurchaseRequest);

router.get("/my-requests", fetchMyPurchaseRequests);

export default router;