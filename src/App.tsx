import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { CertLookupPage } from "./pages/CertLookupPage";
import { CertificatePage } from "./pages/CertificatePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cert" element={<CertLookupPage />} />
      <Route path="/cert/:nim" element={<CertificatePage />} />
    </Routes>
  );
}

export default App;
