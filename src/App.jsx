import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages-temp/Home.jsx";
import RegisterCCCD from "./pages-temp/RegisterCCCD.jsx";

function ScanFace() {
  return (
    <div className="min-h-screen flex items-center justify-center text-2xl">
      Scan Face Screen (tạm thời)
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-cccd" element={<RegisterCCCD />} />
        <Route path="/scan-face" element={<ScanFace />} />
      </Routes>
    </BrowserRouter>
  );
}