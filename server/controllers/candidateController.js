import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";

// ➕ Add Candidate (Admin)
export const addCandidate = async (req, res) => {
  try {
    const { name, department } = req.body;

    const activeElection = await Election.findOne({ isActive: true });

    if (!activeElection) {
      return res.status(400).json({ message: "No active election" });
    }

    const candidate = await Candidate.create({
      name,
      department,
      election: activeElection._id,
    });

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get Candidates (Student/Admin)
export const getCandidates = async (req, res) => {
  try {
    const { electionId } = req.query;

    let candidates;

    // ✅ If electionId is provided (Admin Dashboard case)
    if (electionId) {
      candidates = await Candidate.find({ election: electionId });
    }
    // ✅ Otherwise use active election (Student Dashboard case)
    else {
      const activeElection = await Election.findOne({ isActive: true });

      if (!activeElection) {
        return res.status(404).json({ message: "No active election" });
      }

      candidates = await Candidate.find({
        election: activeElection._id,
      });
    }

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Candidate (Admin)
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await candidate.deleteOne();

    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
