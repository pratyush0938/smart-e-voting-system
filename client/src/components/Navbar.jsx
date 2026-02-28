import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide">
          Smart E-Voting
        </h1>

        {/* Right Side */}
        {user && (
          <div className="flex items-center gap-6">
            
            <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
              {user.role}
            </span>

            <span className="font-medium">
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}