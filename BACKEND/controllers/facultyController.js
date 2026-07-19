import {
  getAllProjects,
  updateProjectApprovalStatus,
} from "../services/projectApprovalService.js";
import {
  getFacultyComponentRequests,
} from "../services/facultyComponentService.js";
import {
  getFacultyDashboardData,
} from "../services/facultyDashboardService.js";
import {
  getFacultyEvents,
  createFacultyEvent,
  removeFacultyEvent,
} from "../services/facultyEventService.js";
import {
  getFacultyGalleryRequests,
  getFacultyIdByUserId,
  updateFacultyGalleryRequestStatus,
} from "../services/facultyGalleryService.js";
import {
  getFacultyNotifications,
  getFacultyNotificationStats,
  createFacultyNotification,
  archiveFacultyNotification,
  deleteFacultyNotification,
} from "../services/facultyNotificationService.js";
/* =========================================================
   FACULTY DASHBOARD — CONNECTED TO POSTGRES/SUPABASE
========================================================= */

export const getFacultyDashboard = async (req, res) => {
  try {
    const dashboard = await getFacultyDashboardData();

    return res.status(200).json(dashboard);
  } catch (error) {
    console.error("Error fetching faculty dashboard:", error);

    return res.status(500).json({
      message: "Failed to fetch faculty dashboard",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* =========================================================
   PROJECT APPROVALS — CONNECTED TO POSTGRES/SUPABASE
========================================================= */

export const getProjects = async (req, res) => {
  try {
    const projects = await getAllProjects();

    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching faculty projects:", error);

    return res.status(500).json({
      message: "Failed to fetch projects",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const normalizedStatus = String(status).trim().toLowerCase();

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
    ];

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message:
          "Status must be pending, approved, or rejected",
      });
    }

    /*
      This will work when faculty_id is included in the
      authenticated user's token/session.

      Until that mapping is implemented, approved_by will
      safely remain NULL instead of using a fake faculty ID.
    */
    const facultyId =
      req.user?.faculty_id ??
      req.user?.facultyId ??
      null;

    const project = await updateProjectApprovalStatus({
      projectId,
      status: normalizedStatus,
      facultyId,
      remarks:
        typeof remarks === "string" && remarks.trim()
          ? remarks.trim()
          : null,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error(
      "Error updating project approval status:",
      error
    );

    return res.status(500).json({
      message: "Failed to update project status",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* =========================================================
   COMPONENT REQUESTS — CONNECTED TO POSTGRES/SUPABASE
   READ-ONLY FOR FACULTY
========================================================= */

export const getComponentRequests = async (req, res) => {
  try {
    const requests = await getFacultyComponentRequests();

    return res.status(200).json(requests);
  } catch (error) {
    console.error(
      "Error fetching faculty component requests:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch component requests",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
/* =========================================================
   EVENTS — CONNECTED TO POSTGRES/SUPABASE
========================================================= */

export const getEvents = async (req, res) => {
  try {
    const events = await getFacultyEvents();

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching faculty events:", error);

    return res.status(500).json({
      message: "Failed to fetch events",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

export const addEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      eventDatetime,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Event title is required",
      });
    }

    let finalEventDatetime = eventDatetime;

    if (!finalEventDatetime && date) {
      const normalizedTime = time || "00:00";
      finalEventDatetime = `${date}T${normalizedTime}:00`;
    }

    if (!finalEventDatetime) {
      return res.status(400).json({
        message: "Event date and time are required",
      });
    }

    const facultyId =
      req.user?.faculty_id ??
      req.user?.facultyId ??
      null;

    const event = await createFacultyEvent({
      title: title.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      eventDatetime: finalEventDatetime,
      facultyId,
    });

    return res.status(201).json(event);
  } catch (error) {
    console.error("Error creating faculty event:", error);

    return res.status(500).json({
      message: "Failed to create event",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const deletedEvent = await removeFacultyEvent(eventId);

    if (!deletedEvent) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json({
      message: "Event deleted successfully",
      id: deletedEvent.id,
    });
  } catch (error) {
    console.error("Error deleting faculty event:", error);

    return res.status(500).json({
      message: "Failed to delete event",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
/* =========================================================
   NOTIFICATIONS
========================================================= */

const getAuthenticatedUserId = (req) =>
  req.user?.user_id ??
  req.user?.userId ??
  req.user?.id;

export const getNotifications = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Authenticated user ID is missing.",
      });
    }

    const [notifications, stats] = await Promise.all([
      getFacultyNotifications(userId),
      getFacultyNotificationStats(userId),
    ]);

    return res.status(200).json({
      stats,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching faculty notifications:", error);

    return res.status(500).json({
      message: "Failed to fetch notifications.",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

export const addNotification = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Authenticated user ID is missing.",
      });
    }

    const {
      title,
      message,
      sourceType,
      sourceId = null,
    } = req.body;

    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({
        message: "Title and message are required.",
      });
    }

    const allowedSourceTypes = [
      "all_students",
      "faculty_teams",
      "team",
    ];

    if (!allowedSourceTypes.includes(sourceType)) {
      return res.status(400).json({
        message: "Invalid notification audience.",
      });
    }

    if (sourceType === "team") {
      const parsedSourceId = Number(sourceId);

      if (!Number.isInteger(parsedSourceId) || parsedSourceId <= 0) {
        return res.status(400).json({
          message: "A valid team must be selected.",
        });
      }
    }

    const created = await createFacultyNotification({
      userId,
      title: title.trim(),
      message: message.trim(),
      sourceType,
      sourceId:
        sourceType === "team"
          ? Number(sourceId)
          : sourceId,
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error("Error creating faculty notification:", error);

    return res.status(500).json({
      message: "Failed to create notification.",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

export const archiveNotification = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const notificationId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        message: "Authenticated user ID is missing.",
      });
    }

    if (
      !Number.isInteger(notificationId) ||
      notificationId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid notification ID.",
      });
    }

    const archived = await archiveFacultyNotification({
      notificationId,
      userId,
    });

    if (!archived) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    return res.status(200).json(archived);
  } catch (error) {
    console.error("Error archiving faculty notification:", error);

    return res.status(500).json({
      message: "Failed to archive notification.",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const notificationId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        message: "Authenticated user ID is missing.",
      });
    }

    if (
      !Number.isInteger(notificationId) ||
      notificationId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid notification ID.",
      });
    }

    const deleted = await deleteFacultyNotification({
      notificationId,
      userId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      message: "Notification deleted successfully.",
      id: deleted.id,
    });
  } catch (error) {
    console.error("Error deleting faculty notification:", error);

    return res.status(500).json({
      message: "Failed to delete notification.",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};

/* =========================================================
   GALLERY APPROVALS — CONNECTED TO POSTGRES/SUPABASE
========================================================= */
export const getGalleryItems = async (req, res) => {
  console.log("Authenticated user:", req.user);

  try {
    const galleryRequests = await getFacultyGalleryRequests();

    return res.status(200).json(galleryRequests);
  } catch (error) {
    console.error(
      "Error fetching gallery requests:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch gallery requests",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

export const updateGalleryStatus = async (req, res) => {
  try {
    const requestId = Number(req.params.id);
    const { status, remarks } = req.body;

    if (!Number.isInteger(requestId) || requestId <= 0) {
      return res.status(400).json({
        message: "Invalid gallery request ID",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const normalizedStatus = String(status).trim().toLowerCase();

    const allowedStatuses = ["approved", "rejected"];

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Status must be approved or rejected",
      });
    }

    /*
      JWT only carries the authenticated user's id, not
      faculty_id. Resolve it from faculty.user_id — never
      fabricate this value.
    */
    const authenticatedUserId =
      req.user?.user_id ??
      req.user?.userId ??
      req.user?.id;

    if (authenticatedUserId === undefined || authenticatedUserId === null) {
      return res.status(401).json({
        message: "Authenticated user ID is missing.",
      });
    }

    const facultyId = await getFacultyIdByUserId(
      authenticatedUserId
    );

    if (!facultyId) {
      return res.status(403).json({
        message:
          "No faculty profile is linked to this account.",
      });
    }

    const updatedRequest = await updateFacultyGalleryRequestStatus({
      requestId,
      status: normalizedStatus,
      facultyId,
      remarks:
        typeof remarks === "string" && remarks.trim()
          ? remarks.trim()
          : null,
    });

    if (!updatedRequest) {
      return res.status(404).json({
        message: "Gallery request not found",
      });
    }

    return res.status(200).json(updatedRequest);
  } catch (error) {
    console.error(
      "Error updating gallery request status:",
      error
    );

    return res.status(500).json({
      message: "Failed to update gallery request",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* =========================================================
   STUDENT PROGRESS — TEMPORARY MOCK DATA
========================================================= */

const studentProgress = [
  {
    id: 1,
    student: "Rahul Kumar",
    team: "Team Alpha",
    project: "Smart Attendance",
    completion: 75,
    attendance: 92,
    status: "On Track",
  },
  {
    id: 2,
    student: "Aryan Mehta",
    team: "Team Beta",
    project: "AI Lab Assistant",
    completion: 45,
    attendance: 80,
    status: "Needs Attention",
  },
  {
    id: 3,
    student: "Aman Gupta",
    team: "Team Gamma",
    project: "Inventory Detection",
    completion: 90,
    attendance: 96,
    status: "Excellent",
  },
];

export const getStudentProgress = async (req, res) => {
  return res.status(200).json(studentProgress);
};
