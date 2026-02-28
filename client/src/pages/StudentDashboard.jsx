import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function StudentDashboard() {
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElection();
  }, []);

  const fetchElection = async () => {
    try {
      const { data } = await API.get("/elections/active");
      setElection(data);
      fetchCandidates();
    } catch (err) {
      setElection(null);
      setMessage("No active election currently.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const { data } = await API.get("/candidates");
      setCandidates(data);
    } catch {
      setCandidates([]);
    }
  };

  const voteHandler = async (candidateId) => {
  try {
    const res = await API.post("/votes", { candidateId });
    console.log(res.data);
    setMessage("✅ Vote submitted successfully!");
  } catch (err) {
    console.log("FULL ERROR:", err.response);
    setMessage(err.response?.data?.message || "Error submitting vote");
  }
};

  if (loading)
    return <div className="p-10 text-center">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Student Voting Panel
        </h1>

        {message && (
          <div className="mb-6 p-4 bg-white shadow rounded-lg text-center font-semibold">
            {message}
          </div>
        )}

        {!election && (
          <div className="text-center text-gray-600">
            No election is active right now.
          </div>
        )}

        {election && (
          <>
            <div className="bg-white p-6 rounded-2xl shadow mb-8">
              <h2 className="text-xl font-semibold mb-2">
                Election: {election.title}
              </h2>
              <p className="text-gray-600">
                Please cast your vote carefully.
              </p>
            </div>

            {candidates.length === 0 ? (
              <p className="text-gray-500">
                No candidates available.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {candidates.map((candidate) => (
                  <div
                    key={candidate._id}
                    className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-bold">
                      {candidate.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {candidate.department}
                    </p>

                    <button
                      onClick={() => voteHandler(candidate._id)}
                      className="w-full py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Vote
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}