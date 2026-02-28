import Vote from "../models/Vote.js";
import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";

export const castVote = async (req, res) => {
  try {
    const { candidateId } = req.body;

    const activeElection = await Election.findOne({ isActive: true });

    if (!activeElection) {
      return res.status(400).json({ message: "No active election" });
    }

    const candidate = await Candidate.findOne({
      _id: candidateId,
      election: activeElection._id,
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const existingVote = await Vote.findOne({
      student: req.user._id, // 🔥 FIXED
      election: activeElection._id,
    });

    if (existingVote) {
      return res.status(400).json({ message: "You have already voted" });
    }
    if (!activeElection.isActive) {
      return res.status(400).json({ message: "Election has ended" });
    }

    await Vote.create({
      student: req.user._id, // 🔥 FIXED
      candidate: candidateId,
      election: activeElection._id,
    });

    candidate.voteCount += 1;
    await candidate.save();

    res.json({ message: "Vote cast successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
