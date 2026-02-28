import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [electionTitle, setElectionTitle] = useState("");
  const [latestElection, setLatestElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    fetchLatestElection();
  }, []);

  useEffect(() => {
    if (latestElection?._id) {
      fetchCandidates();
    }
  }, [latestElection]);

  const fetchLatestElection = async () => {
    try {
      const { data } = await API.get("/elections/latest");
      setLatestElection(data);
    } catch {
      setLatestElection(null);
    }
  };

  const fetchCandidates = async () => {
    try {
      const { data } = await API.get(
        `/candidates?electionId=${latestElection._id}`
      );
      setCandidates(data);
    } catch {
      setCandidates([]);
    }
  };

  const createElection = async () => {
    if (!electionTitle) return alert("Enter election title");

    await API.post("/elections", { title: electionTitle });
    alert("Election created successfully");
    setElectionTitle("");
    fetchLatestElection();
  };

  const startElection = async () => {
    if (!latestElection) return;
    await API.put(`/elections/start/${latestElection._id}`);
    alert("Election Started Successfully");
    fetchLatestElection();
  };

  const endElection = async () => {
    if (!latestElection) return;
    await API.put(`/elections/end/${latestElection._id}`);
    alert("Election Ended Successfully");
    fetchLatestElection();
  };

  const addCandidate = async () => {
    if (!latestElection) return alert("Create election first");
    if (!latestElection.isActive)
      return alert("Start election first");
    if (!candidateName || !department)
      return alert("Enter all candidate details");

    await API.post("/candidates", {
      name: candidateName,
      department,
      election: latestElection._id,
    });

    alert("Candidate added successfully");
    setCandidateName("");
    setDepartment("");
    fetchCandidates();
  };

  const deleteCandidate = async (id) => {
    await API.delete(`/candidates/${id}`);
    fetchCandidates();
  };

  return (
    <>
      <Navbar />

      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Admin Dashboard
        </h1>

        {/* 🔥 New Navigation Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate("/admin/analytics")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            📊 Admin Analytics
          </button>

          <button
            onClick={() => navigate("/admin/history")}
            className="bg-gray-700 text-white px-6 py-2 rounded-lg"
          >
            🕒 Election History
          </button>
        </div>

        {/* Create Election */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="font-semibold mb-4 text-lg">
            Create Election
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Election Title"
              value={electionTitle}
              onChange={(e) => setElectionTitle(e.target.value)}
              className="border p-3 rounded w-full"
            />
            <button
              onClick={createElection}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              Create
            </button>
          </div>
        </div>

        {/* Election Controls */}
        {latestElection && (
          <div className="bg-white p-6 rounded-2xl shadow mb-8">
            <h2 className="font-semibold text-lg mb-4">
              Election: {latestElection.title}
            </h2>

            <div className="flex gap-4">

              {!latestElection.startDate && (
                <button
                  onClick={startElection}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  Start Election
                </button>
              )}

              {latestElection.isActive && (
                <button
                  onClick={endElection}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg"
                >
                  End Election
                </button>
              )}

              {!latestElection.isActive &&
                latestElection.endDate && (
                  <span className="text-red-600 font-semibold">
                    Election Ended
                  </span>
                )}

              <button
                onClick={() =>
                  navigate(`/results/${latestElection._id}`)
                }
                className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                View Results
              </button>
            </div>
          </div>
        )}

        {/* Add Candidate */}
        {latestElection?.isActive && (
          <div className="bg-white p-6 rounded-2xl shadow mb-8">
            <h2 className="font-semibold text-lg mb-4">
              Add Candidate
            </h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Candidate Name"
                value={candidateName}
                onChange={(e) =>
                  setCandidateName(e.target.value)
                }
                className="border p-3 rounded w-full"
              />
              <input
                type="text"
                placeholder="Department"
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
                className="border p-3 rounded w-full"
              />
              <button
                onClick={addCandidate}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Candidate List */}
        {latestElection?.isActive && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold text-lg mb-4">
              Candidate List
            </h2>

            {candidates.length === 0 ? (
              <p className="text-gray-500">
                No candidates added yet.
              </p>
            ) : (
              <table className="w-full text-center">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3">Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => (
                    <tr key={c._id} className="border-t">
                      <td className="p-3">{c.name}</td>
                      <td className="p-3">{c.department}</td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            deleteCandidate(c._id)
                          }
                          className="bg-red-500 text-white px-4 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
}