import express from "express";
import {
  getNotifications,
  addNotification,
  deleteNotification,
  getProjects,
  updateProjectStatus,
  getComponentRequests,
  updateComponentRequestStatus,
  getEvents,
  addEvent,
  deleteEvent,
  getGalleryItems,
  updateGalleryStatus,
  getStudentProgress,
} from "../controllers/facultyController.js";

const router = express.Router();

router.get("/projects", getProjects);
router.patch("/projects/:id/status", updateProjectStatus);

router.get("/components", getComponentRequests);
router.patch("/components/:id/status", updateComponentRequestStatus);

router.get("/events", getEvents);
router.post("/events", addEvent);
router.delete("/events/:id", deleteEvent);

router.get("/notifications", getNotifications);
router.post("/notifications", addNotification);
router.delete("/notifications/:id", deleteNotification);

router.get("/gallery", getGalleryItems);
router.patch("/gallery/:id/status", updateGalleryStatus);

router.get("/progress", getStudentProgress);

export default router;