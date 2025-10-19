import express from "express";
import { askQuery } from "../controllers/chatController.js";

const router = express.Router();

router.post("/ask", askQuery);

export default router;
