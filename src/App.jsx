import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages-temp/Home.jsx";
import RegisterCCCD from "./pages-temp/RegisterCCCD.jsx";
import Log from "./pages-temp/Log.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-cccd" element={<RegisterCCCD />} />
        <Route path="/log" element={<Log />} />
      </Routes>
    </BrowserRouter>
  );
}