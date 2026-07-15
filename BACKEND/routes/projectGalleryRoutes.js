import express from "express";

import { requireAuth } from "../middleware/authMiddleware.js";
import { galleryUpload } from "../middleware/galleryUploadMiddleware.js";

import {
  createGalleryRequest,
} from "../controllers/projectGalleryController.js";

const router = express.Router();

router.post(
  "/submit",
  requireAuth,
  galleryUpload,
  createGalleryRequest
);

export default router;