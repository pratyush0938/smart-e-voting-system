import React from "react";

export default function CandidateCard({ candidate, onVote, disabled }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center gap-4 hover:shadow-lg transition">
      
      <h2 className="text-xl font-semibold">
        {candidate.name}
      </h2>

      <p className="text-gray-500">
        {candidate.department}
      </p>

      <button
        onClick={() => onVote(candidate._id)}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg text-white transition ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        Vote
      </button>
    </div>
  );
}