import express from "express";
import {
  getNotifications,
  addNotification,
  deleteNotification,
  getProjects,
  updateProjectStatus,
  getComponentRequests,
  getEvents,
  addEvent,
  deleteEvent,
  getGalleryItems,
  updateGalleryStatus,
  getStudentProgress,
  getFacultyDashboard,
  archiveNotification,
} from "../controllers/facultyController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(requireAuth);
router.use(requireRole("faculty"));
router.get("/dashboard", getFacultyDashboard);

router.get("/projects", getProjects);
router.patch("/projects/:id/status", updateProjectStatus);

router.get("/components", getComponentRequests);

router.get("/events", getEvents);
router.post("/events", addEvent);
router.delete("/events/:id", deleteEvent);

router.get("/notifications", getNotifications);
router.post("/notifications", addNotification);
router.delete("/notifications/:id", deleteNotification);
router.patch(
  "/notifications/:id/archive",
  archiveNotification
);

router.get("/gallery", getGalleryItems);
router.patch("/gallery/:id/status", updateGalleryStatus);

router.get("/progress", getStudentProgress);

export default router;
