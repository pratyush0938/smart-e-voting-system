import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";

// 🟢 Create Election (Admin)
export const createElection = async (req, res) => {
  try {
    const { title } = req.body;

    const election = await Election.create({
      title,
      createdBy: req.user._id,
    });

    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Get Latest Election (Admin)
export const getLatestElection = async (req, res) => {
  try {
    const election = await Election.findOne().sort({ createdAt: -1 });

    if (!election) {
      return res.status(404).json({ message: "No election found" });
    }

    res.json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Start Election
export const startElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    // Make all elections inactive
    await Election.updateMany({}, { isActive: false });

    election.isActive = true;
    election.startDate = new Date();
    await election.save();

    res.json({ message: "Election started successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 End Election
export const endElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    election.isActive = false;
    election.endDate = new Date();
    await election.save();

    res.json({ message: "Election ended successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Get Active Election
export const getActiveElection = async (req, res) => {
  try {
    const election = await Election.findOne({ isActive: true });

    if (!election) {
      return res.status(404).json({ message: "No active election" });
    }

    res.json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🏆 Get Election Results (WITH PERCENTAGE + TIE)
export const getElectionResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    if (election.isActive) {
      return res
        .status(400)
        .json({ message: "Election is still active. End it first." });
    }

    const candidates = await Candidate.find({
      election: election._id,
    }).sort({ voteCount: -1 });

    if (candidates.length === 0) {
      return res.status(404).json({ message: "No candidates found" });
    }

    const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

    const resultsWithPercentage = candidates.map((c) => ({
      ...c._doc,
      percentage:
        totalVotes === 0 ? 0 : ((c.voteCount / totalVotes) * 100).toFixed(2),
    }));

    const highestVotes = candidates[0].voteCount;

    const topCandidates = resultsWithPercentage.filter(
      (c) => c.voteCount === highestVotes,
    );

    let winner = null;
    let isTie = false;

    if (topCandidates.length > 1) {
      isTie = true;
    } else {
      winner = topCandidates[0];
    }

    res.json({
      election: election.title,
      winner,
      isTie,
      totalVotes,
      topCandidates,
      results: resultsWithPercentage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 Admin Analytics  ✅ FIXED (Better Vote Counting)
export const getAnalytics = async (req, res) => {
  try {
    const totalElections = await Election.countDocuments();
    const totalCandidates = await Candidate.countDocuments();

    const voteAggregation = await Candidate.aggregate([
      {
        $group: {
          _id: null,
          totalVotes: { $sum: "$voteCount" },
        },
      },
    ]);

    res.json({
      totalElections,
      totalCandidates,
      totalVotes: voteAggregation[0]?.totalVotes || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🕒 Election History (Only Ended Elections)
export const getElectionHistory = async (req, res) => {
  try {
    const elections = await Election.find({
      endDate: { $ne: null },
    }).sort({ createdAt: -1 });

    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
