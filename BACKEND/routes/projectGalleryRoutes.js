import express from "express";

import { requireAuth } from "../middleware/authMiddleware.js";
import { galleryUpload } from "../middleware/galleryUploadMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

import {
  createGalleryRequest,
} from "../controllers/projectGalleryController.js";

const router = express.Router();

router.post(
    "/submit",
    requireAuth,
    requireRole("student"),
    galleryUpload,
    createGalleryRequest
);

export default router;