import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function ElectionHistory() {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get("/elections");
      setElections(data.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">
          🕒 Election History
        </h1>

        {elections.length === 0 ? (
          <p>No elections found.</p>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow">
            <table className="w-full text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                  <th className="p-3">Results</th>
                </tr>
              </thead>
              <tbody>
                {elections.map((e) => (
                  <tr key={e._id} className="border-t">
                    <td className="p-3">{e.title}</td>
                    <td className="p-3">
                      {e.isActive
                        ? "🟢 Active"
                        : e.endDate
                        ? "🔴 Ended"
                        : "Not Started"}
                    </td>
                    <td className="p-3">
                      {e.startDate
                        ? new Date(
                            e.startDate
                          ).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-3">
                      {e.endDate
                        ? new Date(
                            e.endDate
                          ).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-3">
                      {e.endDate && (
                        <button
                          onClick={() =>
                            navigate(
                              `/results/${e._id}`
                            )
                          }
                          className="bg-blue-600 text-white px-4 py-1 rounded"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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