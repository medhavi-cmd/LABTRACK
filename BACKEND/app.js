import cors from 'cors';
import express from 'express';
import componentRequestRoutes from "./routes/componentRequestRoutes.js";

const app = express();


app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use("/api/requests", componentRequestRoutes);


app.get('/', (_req, res) => {
  res.json({ message: 'LABTRACK API is running' });
});

export default app;