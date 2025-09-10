// src/pages/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-[#0b1020] text-gray-200 p-4">
      {/* soft halo */}
      <div
        className="pointer-events-none absolute inset-0
                   bg-[radial-gradient(60%_60%_at_50%_10%,rgba(255,145,255,0.12)_0%,rgba(0,0,0,0)_60%)]"
        aria-hidden
      />
      {/* warm top glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full
                   bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,140,90,0.10)_0%,rgba(0,0,0,0)_70%)] blur-2xl"
        aria-hidden
      />

      {/* Title: Neurallink + rotating words */}
      <h1 className="text-center leading-tight mb-6 text-4xl md:text-6xl font-bold">
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300">
          Neurallink
        </span>
        <span className="mt-2 inline-flex h-[1.2em] overflow-hidden align-top">
          <span className="flex flex-col animate-wordcycle will-change-transform">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300">
              collaborate
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300">
              create
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300">
              build together
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300">
              ship faster
            </span>
          </span>
        </span>
      </h1>

      {/* Sub description */}
      <p className="text-base md:text-lg text-center max-w-2xl text-gray-400 mb-8">
        A platform where developers and creators unite — find teammates,
        launch ideas, and keep momentum with AI-driven insights. Build smarter,
        together.
      </p>

      {/* CTA */}
      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 rounded-lg font-semibold text-white
                   bg-gradient-to-r from-fuchsia-500 to-orange-400
                   hover:from-fuchsia-400 hover:to-orange-300
                   shadow-lg shadow-fuchsia-900/30 border border-white/10
                   backdrop-blur-md transition"
      >
        Get started
      </button>
    </div>
  );
}
