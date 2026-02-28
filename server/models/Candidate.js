import mongoose from "mongoose";

const candidateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    voteCount: {
      type: Number,
      default: 0,
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Candidate", candidateSchema);
