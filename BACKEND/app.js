import cors from 'cors';
import express from 'express';
import componentRequestRoutes from "./routes/componentRequestRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import componentRoutes from "./routes/componentRoutes.js";
import studentRequestRoutes from "./routes/studentRequestRoutes.js";
import studentDashboardRoutes from "./routes/studentDashboardRoutes.js";
import topbarRoutes from "./routes/topbarRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();


app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use("/api/requests", componentRequestRoutes);


// student routes
app.use("/api/auth", authRoutes);
app.use("/api/student",studentRoutes);
app.use("/api/team",teamRoutes);
app.use("/api/components", componentRoutes);
app.use("/api/student-requests", studentRequestRoutes);
app.use("/api/student-dashboard", studentDashboardRoutes);
app.use("/api/topbar", topbarRoutes);
app.use("/api/events", eventRoutes);

//labstaff routes
app.use("/api/inventory", inventoryRoutes);


app.get('/', (_req, res) => {
  res.json({ message: 'LABTRACK API is running' });
});

export default app;