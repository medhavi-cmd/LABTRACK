import cors from 'cors';
import express from 'express';

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));

app.get('/', (_req, res) => {
  res.json({ message: 'LABTRACK API is running' });
});

export default app;