import express from "express";
import {
  createElection,
  startElection,
  endElection,
  getActiveElection,
  getElectionResults,
  getLatestElection,
  getAnalytics,
  getElectionHistory,
} from "../controllers/electionController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createElection);
router.put("/start/:id", protect, adminOnly, startElection);
router.put("/end/:id", protect, adminOnly, endElection);

router.get("/", protect, adminOnly, getElectionHistory); // ✅ ADD THIS

router.get("/active", getActiveElection);
router.get("/results/:id", getElectionResults);
router.get("/latest", protect, adminOnly, getLatestElection);
router.get("/analytics", protect, adminOnly, getAnalytics);
router.get("/history", protect, adminOnly, getElectionHistory);

export default router;
