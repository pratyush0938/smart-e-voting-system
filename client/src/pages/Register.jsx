import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    role: "student",
    adminSecret: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(formData);
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          {/* Role Select */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="student">Register as Student</option>
            <option value="admin">Register as Admin</option>
          </select>

          {/* Show Student ID only if student */}
          {formData.role === "student" && (
            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          )}

          {/* Show Secret Key only if admin */}
          {formData.role === "admin" && (
            <input
              type="password"
              name="adminSecret"
              placeholder="Enter Admin Secret Key"
              value={formData.adminSecret}
              onChange={handleChange}
              required
              className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          )}

          <button
            type="submit"
            className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have account?{" "}
          <Link
            to="/"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}