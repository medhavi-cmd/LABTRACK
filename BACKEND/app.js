import cors from "cors";
import express from "express";
import facultyRoutes from "./routes/facultyRoutes.js";
import componentRequestRoutes from "./routes/componentRequestRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import issuedComponentsRoutes from "./routes/issuedComponentsRoutes.js";
import componentRoutes from "./routes/componentRoutes.js";
import studentRequestRoutes from "./routes/studentRequestRoutes.js";
import studentDashboardRoutes from "./routes/studentDashboardRoutes.js";
import topbarRoutes from "./routes/topbarRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import issueHistoryRoutes from "./routes/issueHistoryRoutes.js";
import purchaseRequestRoutes from "./routes/purchaseRequestRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import projectGalleryRoutes from "./routes/projectGalleryRoutes.js";
import returnManagementRoutes from "./routes/returnManagementRoutes.js";

const app = express();


app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use("/api/faculty", facultyRoutes);



// student routes
app.use("/api/auth", authRoutes);
app.use("/api/student",studentRoutes);
app.use("/api/team",teamRoutes);
app.use("/api/components", componentRoutes);
app.use("/api/student-requests", studentRequestRoutes);
app.use("/api/student-dashboard", studentDashboardRoutes);
app.use("/api/topbar", topbarRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/issue-history", issueHistoryRoutes);
app.use("/api/purchase-requests", purchaseRequestRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/project-gallery", projectGalleryRoutes);

//labstaff routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/requests", componentRequestRoutes);
app.use("/api/issued-components", issuedComponentsRoutes);
app.use("/api/returns", returnManagementRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "LABTRACK API is running",
  });
});

export default app;