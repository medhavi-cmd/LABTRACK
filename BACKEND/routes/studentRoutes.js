import express from "express";

import {
  completeProfile,
  fetchProfile
}
from "../controllers/studentController.js";

const router =
  express.Router();
  

router.post("/complete-profile", completeProfile);

router.get("/profile/:userId", fetchProfile);

export default router;