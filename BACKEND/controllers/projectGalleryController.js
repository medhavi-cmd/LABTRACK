import {
  submitProjectToGallery,
  getGalleryProjects,
  getGalleryStatistics,
} from "../services/projectGalleryService.js";

// SUBMIT PROJECT TO GALLERY

export const createGalleryRequest = async (
  req,
  res
) => {
  try {
    await submitProjectToGallery(
      req.user.id,
      req.body,
      req.files
    );

    return res.status(201).json({
      message:
        "Project submitted for gallery approval successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

