import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { CertLookupPage } from "./pages/CertLookupPage";
import { CertificatePage } from "./pages/CertificatePage";
import { QuizPage } from "./pages/QuizPage";
import { QuizChartPage } from "./pages/QuizChartPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cert" element={<CertLookupPage />} />
      <Route path="/cert/:nim" element={<CertificatePage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/quiz/chart" element={<QuizChartPage />} />
    </Routes>
  );
}

export default App;
