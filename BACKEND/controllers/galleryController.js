import {
  getGalleryProjects,
  getProjectDetails,
  getGalleryStatistics,
} from "../services/galleryService.js";

// GET ALL GALLERY PROJECTS
export const fetchGalleryProjects = async (req, res) => {
  try {
    const { search, branch, faculty } = req.query;

    const projects = await getGalleryProjects({
      search,
      branch,
      faculty,
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch gallery projects.",
    });
  }
};

// GET PROJECT DETAILS
export const fetchProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await getProjectDetails(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch project details.",
    });
  }
};

//  GET GALLERY STATISTICS

export const fetchGalleryStatistics = async (_req, res) => {
  try {
    const statistics = await getGalleryStatistics();

    return res.status(200).json(statistics);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch gallery statistics.",
    });
  }
};