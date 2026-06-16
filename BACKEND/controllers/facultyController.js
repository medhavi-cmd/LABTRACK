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
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.status = status;

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update project",
    });
  }
};