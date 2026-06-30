import express from "express";
import { fetchIssuedComponents } from "../controllers/issuedComponentsController.js";

const router = express.Router();

router.get("/", fetchIssuedComponents);

export default router;