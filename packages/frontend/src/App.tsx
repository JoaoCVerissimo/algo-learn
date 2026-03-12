import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Dashboard } from "./components/Dashboard";
import { ProblemList } from "./components/problems/ProblemList";
import { ProblemDetail } from "./components/problems/ProblemDetail";
import { VisualizationPicker } from "./components/visualization/VisualizationPicker";
import { VisualizationPage } from "./components/visualization/VisualizationPage";

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problems/:slug" element={<ProblemDetail />} />
          <Route path="/visualize" element={<VisualizationPicker />} />
          <Route path="/visualize/:algorithm" element={<VisualizationPage />} />
        </Routes>
      </main>
    </div>
  );
}
