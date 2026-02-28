import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import Confetti from "react-confetti";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ResultPage() {
  const { id } = useParams();

  const [results, setResults] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isTie, setIsTie] = useState(false);
  const [topCandidates, setTopCandidates] = useState([]);
  const [electionTitle, setElectionTitle] = useState("");
  const [totalVotes, setTotalVotes] = useState(0);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data } = await API.get(`/elections/results/${id}`);

      setElectionTitle(data.election);
      setWinner(data.winner);
      setResults(data.results);
      setIsTie(data.isTie);
      setTopCandidates(data.topCandidates);
      setTotalVotes(data.totalVotes);

      if (data.winner && !data.isTie) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

    } catch (err) {
      setError(err.response?.data?.message || "Results not available.");
    }
  };

  const chartData = {
    labels: results.map((c) => c.name),
    datasets: [
      {
        label: "Votes",
        data: results.map((c) => c.voteCount),
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#ef4444",
          "#f59e0b",
          "#3b82f6",
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: chartType === "pie" },
      title: {
        display: true,
        text: "Election Vote Distribution",
      },
    },
  };

  return (
    <>
      <Navbar />

      {showConfetti && <Confetti />}

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Election Results
        </h1>

        <h2 className="text-lg text-gray-600 mb-6">
          {electionTitle}
        </h2>

        {error && (
          <p className="text-red-600 font-semibold">{error}</p>
        )}

        {/* 🏆 Winner */}
        {winner && !isTie && (
          <div className="bg-white p-6 rounded-2xl shadow mb-8 border-l-4 border-green-500">
            <h2 className="text-xl font-bold text-green-600">
              🏆 Winner: {winner.name}
            </h2>
            <p className="text-gray-600">
              Department: {winner.department}
            </p>
            <p className="font-semibold mt-2">
              Total Votes: {winner.voteCount}
            </p>
          </div>
        )}

        {/* 🤝 Tie */}
        {isTie && (
          <div className="bg-yellow-100 p-6 rounded-2xl shadow mb-8 border-l-4 border-yellow-500">
            <h2 className="text-xl font-bold text-yellow-700 mb-4">
              🤝 It's a Tie!
            </h2>

            {topCandidates.map((c) => (
              <p key={c._id} className="font-semibold">
                {c.name} ({c.department}) — {c.voteCount} votes
              </p>
            ))}
          </div>
        )}

        {/* 📊 Total Votes */}
        <div className="mb-6 text-center font-semibold text-gray-700">
          Total Votes Cast: {totalVotes}
        </div>

        {/* 📊 Charts */}
        {results.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow mb-8">

            <div className="flex gap-4 mb-6 justify-center">
              <button
                onClick={() => setChartType("bar")}
                className={`px-4 py-2 rounded-lg ${
                  chartType === "bar"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Bar Chart
              </button>

              <button
                onClick={() => setChartType("pie")}
                className={`px-4 py-2 rounded-lg ${
                  chartType === "pie"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Pie Chart
              </button>
            </div>

            {chartType === "bar" ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Pie data={chartData} options={chartOptions} />
            )}
          </div>
        )}

        {/* 📋 Table with Percentage */}
        {results.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold text-lg mb-4">
              All Candidates
            </h2>

            <table className="w-full text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Votes</th>
                  <th className="p-3">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {results.map((c, index) => (
                  <tr key={c._id} className="border-t">
                    <td className="p-3 font-semibold">
                      {index + 1}
                    </td>
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.department}</td>
                    <td className="p-3 font-semibold">
                      {c.voteCount}
                    </td>
                    <td className="p-3 font-semibold">
                      {c.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}