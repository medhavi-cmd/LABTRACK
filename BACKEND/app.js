import cors from "cors";
import express from "express";
import facultyRoutes from "./routes/facultyRoutes.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use("/api/faculty", facultyRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "LABTRACK API is running",
  });
});

export default app;