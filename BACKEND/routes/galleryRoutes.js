import express from "express";

import {
  fetchGalleryProjects,
  fetchGalleryStatistics,
  fetchProjectDetails,
} from "../controllers/galleryController.js";

const router = express.Router();

router.get("/", fetchGalleryProjects);

router.get("/statistics", fetchGalleryStatistics);

router.get("/:projectId", fetchProjectDetails);

export default router;