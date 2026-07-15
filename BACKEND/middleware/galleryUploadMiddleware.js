import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export const galleryUpload = upload.fields([
  {
    name: "coverImage",
    maxCount: 1,
  },
  {
    name: "galleryImages",
    maxCount: 10,
  },
  {
    name: "report",
    maxCount: 1,
  },
]);