import express from "express";
import {
  fetchRequestFormDetails,
  submitPurchaseRequest,
  fetchMyPurchaseRequests,
  fetchAllPurchaseRequests,
  updatePurchaseRequestStatus
} from "../controllers/purchaseRequestController.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

// Student routes
router.get("/form-details", requireRole("student"), fetchRequestFormDetails);
router.post("/", requireRole("student"), submitPurchaseRequest);
router.get("/my-requests", requireRole("student"), fetchMyPurchaseRequests);

// Lab Staff routes
router.get("/all", requireRole("lab_staff"), fetchAllPurchaseRequests);
router.patch("/:id/status", requireRole("lab_staff"), updatePurchaseRequestStatus);

export default router;