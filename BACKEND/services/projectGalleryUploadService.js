import supabase from "../config/supabase.js";

// UPLOAD PROJECT COVER IMAGE

export const uploadProjectCover = async (file) => {
  console.log("===== COVER UPLOAD =====");
  console.log("Original Name:", file.originalname);
  console.log("Mime:", file.mimetype);
  console.log("Size:", file.size);

  const fileName = `cover-${Date.now()}-${file.originalname}`;

  console.log("Uploading to bucket: project-images");
  console.log("Path:", fileName);

  const result = await supabase.storage
    .from("project-images")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  console.log(result);

  if (result.error) {
    throw new Error(result.error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("project-images")
    .getPublicUrl(fileName);

  return publicUrl;
};

// UPLOAD PROJECT GALLERY IMAGE

export const uploadProjectImage = async (file) => {
  const fileName = `image-${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("project-images")
    .getPublicUrl(fileName);

  return publicUrl;
};

// UPLOAD PROJECT REPORT PDF

export const uploadProjectReport = async (file) => {
  const fileName = `report-${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("project-reports")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("project-reports")
    .getPublicUrl(fileName);

  return publicUrl;
};