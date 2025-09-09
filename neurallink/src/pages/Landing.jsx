// src/pages/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to dashboard (with sidebar)
    navigate("/dashboard");
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-4">
      <h1 className="text-5xl font-bold mb-6 text-center">
        Welcome to Neurallink
      </h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        Connect with collaborators, find projects, track your GitHub progress, and get AI-assisted recommendations.
      </p>
      <button
        onClick={handleGetStarted}
        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </div>
  );
}
