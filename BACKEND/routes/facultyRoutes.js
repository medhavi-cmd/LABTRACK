import express from "express";
import {
  getProjects,
  updateProjectStatus,
} from "../controllers/facultyController.js";

const router = express.Router();

router.get("/projects", getProjects);

router.patch(
  "/projects/:id/status",
  updateProjectStatus
);

export default router;