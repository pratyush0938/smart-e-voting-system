import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AdminAnalytics() {
  const navigate = useNavigate();

  const [elections, setElections] = useState([]);
  const [totalElections, setTotalElections] = useState(0);
  const [activeElection, setActiveElection] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get("/elections");

      setElections(data);
      setTotalElections(data.length);

      const active = data.find((e) => e.isActive);
      setActiveElection(active || null);

      let votes = 0;
      let candidates = 0;

      for (let election of data) {
        const res = await API.get(
          `/elections/results/${election._id}`
        ).catch(() => null);

        if (res?.data?.results) {
          candidates += res.data.results.length;
          votes += res.data.results.reduce(
            (sum, c) => sum + c.voteCount,
            0
          );
        }
      }

      setTotalVotes(votes);
      setTotalCandidates(candidates);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">
          📊 Admin Analytics Dashboard
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Total Elections</h2>
            <p className="text-3xl font-bold mt-2">
              {totalElections}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Active Election</h2>
            <p className="text-lg font-semibold mt-2">
              {activeElection
                ? activeElection.title
                : "None"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Total Candidates</h2>
            <p className="text-3xl font-bold mt-2">
              {totalCandidates}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">Total Votes Cast</h2>
            <p className="text-3xl font-bold mt-2">
              {totalVotes}
            </p>
          </div>

        </div>

        <div className="mt-10">
          <button
            onClick={() => navigate("/admin")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}