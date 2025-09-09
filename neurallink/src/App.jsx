// export default function App() {
//   return (
//     <div className="w-screen h-screen bg-pink-500 flex items-center justify-center">
//       <h1 className="text-3xl font-bold text-blue-500 underline">
//         Tailwind Working 🚀
//       </h1>
//     </div>
//   );
// }


// src/App.jsx
import React from "react";
import Navbar from "./components/common-components/Navbar";
import Footer from "./components/common-components/Footer";

function App() {
  return (
    <div className="w-screen h-screen flex flex-col bg-pink-500">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-500 underline">
          Tailwind Working 🚀
        </h1>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
