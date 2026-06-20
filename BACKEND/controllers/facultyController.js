let projects = [
  {
    id: 1,
    title: "Smart Attendance",
    team: "Team Alpha",
    guide: "Dr. Sharma",
    status: "Pending",
  },
  {
    id: 2,
    title: "AI Lab Assistant",
    team: "Team Beta",
    guide: "Dr. Singh",
    status: "Approved",
  },
];

export const getProjects = async (req, res) => {
  res.status(200).json(projects);
};

export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const project = projects.find((p) => p.id === Number(id));

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.status = status;

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to update project" });
  }
};

let componentRequests = [
  {
    id: 1,
    component: "Arduino Uno",
    quantity: 5,
    team: "Team Alpha",
    requestedBy: "Rahul Kumar",
    date: "07-06-2026",
    purpose: "Attendance Device Prototype",
    status: "Pending",
  },
  {
    id: 2,
    component: "Raspberry Pi",
    quantity: 2,
    team: "Team Beta",
    requestedBy: "Aryan Mehta",
    date: "07-06-2026",
    purpose: "AI Processing Unit",
    status: "Pending",
  },
  {
    id: 3,
    component: "Ultrasonic Sensor",
    quantity: 10,
    team: "Team Gamma",
    requestedBy: "Aman Gupta",
    date: "07-06-2026",
    purpose: "Inventory Detection",
    status: "Approved",
  },
];

export const getComponentRequests = async (req, res) => {
  res.status(200).json(componentRequests);
};

export const updateComponentRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = componentRequests.find(
      (item) => item.id === Number(id)
    );

    if (!request) {
      return res.status(404).json({
        message: "Component request not found",
      });
    }

    request.status = status;

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update component request",
    });
  }
};
let events = [
  {
    id: 1,
    title: "Project Expo",
    venue: "Lab 1",
    date: "15-06-2026",
    description: "Annual project exhibition.",
  },
  {
    id: 2,
    title: "Mid Project Review",
    venue: "Seminar Hall",
    date: "20-06-2026",
    description: "Mid-semester project review.",
  },
  {
    id: 3,
    title: "Final Evaluation",
    venue: "Conference Room",
    date: "30-06-2026",
    description: "Final project assessment.",
  },
];

export const getEvents = async (req, res) => {
  res.status(200).json(events);
};

export const addEvent = async (req, res) => {
  try {
    const newEvent = {
      id: Date.now(),
      ...req.body,
    };

    events.push(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add event",
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    events = events.filter((event) => event.id !== Number(id));

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete event",
    });
  }
};
let notifications = [
  {
    id: 1,
    title: "Project Review Meeting",
    message: "All teams must attend the review meeting on 20 June.",
    date: "18-06-2026",
  },
  {
    id: 2,
    title: "Lab Closed",
    message: "Joe Lab will remain closed on Sunday.",
    date: "19-06-2026",
  },
];

export const getNotifications = async (req, res) => {
  res.status(200).json(notifications);
};

export const addNotification = async (req, res) => {
  try {
    const { title, message, date } = req.body;

    const notification = {
      id: notifications.length + 1,
      title,
      message,
      date,
    };

    notifications.push(notification);

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create notification",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    notifications = notifications.filter(
      (item) => item.id !== Number(id)
    );

    res.status(200).json({
      message: "Notification deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete notification",
    });
  }
};

let galleryItems = [
  {
    id: 1,
    title: "Project Expo Day 1",
    uploadedBy: "Rahul Kumar",
    team: "Team Alpha",
    image: "expo1.jpg",
    status: "Pending",
  },
  {
    id: 2,
    title: "Prototype Demo",
    uploadedBy: "Aryan Mehta",
    team: "Team Beta",
    image: "demo.jpg",
    status: "Approved",
  },
];

export const getGalleryItems = async (req, res) => {
  res.status(200).json(galleryItems);
};

export const updateGalleryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const item = galleryItems.find(
      (g) => g.id === Number(id)
    );

    if (!item) {
      return res.status(404).json({
        message: "Gallery item not found",
      });
    }

    item.status = status;

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update gallery item",
    });
  }
};

let studentProgress = [
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
  res.status(200).json(studentProgress);
};