import express from "express";
import {
  addCandidate,
  getCandidates,
  deleteCandidate,
} from "../controllers/candidateController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Add Candidate (Admin)
router.post("/", protect, adminOnly, addCandidate);

// 📋 Get Candidates (Student + Admin)
// Supports:
// 1️⃣ Active election (default)
// 2️⃣ Specific election using ?electionId=xxx
router.get("/", protect, getCandidates);

// ❌ Delete Candidate (Admin)
router.delete("/:id", protect, adminOnly, deleteCandidate);

export default router;
