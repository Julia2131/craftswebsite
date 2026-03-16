import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages-temp/Home.jsx";
import RegisterCCCD from "./pages-temp/RegisterCCCD.jsx";
import Log from "./pages-temp/Log.jsx";
import Profile from "./pages-temp/Profile.jsx";
import Address from "./pages-temp/Address.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/register-cccd" element={<RegisterCCCD />} />
        <Route path="/log" element={<Log />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/address" element={<Address />} />

        {/* nếu URL sai → quay về trang chủ */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}