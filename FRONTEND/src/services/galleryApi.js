import { request } from "./teamApi";

// GET ALL GALLERY PROJECTS

export const getGalleryProjects = (params = {}) => {
  const query = new URLSearchParams(params).toString();

  return request(
    `/gallery${query ? `?${query}` : ""}`
  );
};


//  GALLERY STATISTICS

export const getGalleryStatistics = () =>
  request("/gallery/statistics");


  //  PROJECT DETAILS

export const getProjectDetails = (projectId) =>
  request(`/gallery/${projectId}`);


  //  SUBMIT PROJECT TO GALLERY

export const submitProjectToGallery = async ({
  description,
  objective,
  coverImage,
  galleryImages,
  report,
}) => {
  const formData = new FormData();

  formData.append("description", description);
  formData.append("objective", objective);

  if (coverImage) {
    formData.append("coverImage", coverImage);
  }

  if (report) {
    formData.append("report", report);
  }

  galleryImages.forEach((image) => {
    formData.append("galleryImages", image);
  });

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/project-gallery/submit`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};