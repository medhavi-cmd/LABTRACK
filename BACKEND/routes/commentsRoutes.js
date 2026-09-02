import express from "express";
import { listComments, createComment, removeComment } from "../controllers/commentsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listComments);
router.post("/", createComment);
router.delete("/:id", removeComment);

export default router;
