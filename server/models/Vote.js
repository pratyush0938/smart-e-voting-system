import mongoose from "mongoose";

const voteSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
  },
  { timestamps: true },
);

// Unique vote per student per election
voteSchema.index({ student: 1, election: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
