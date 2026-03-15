import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages-temp/Home.jsx";
import RegisterCCCD from "./pages-temp/RegisterCCCD.jsx";
import Log from "./pages-temp/Log.jsx";
import SDT from "./pages-temp/SDT.jsx";
import ResetAccount from "./pages-temp/ReAccount.jsx";
import SwitchToSeller from "./pages-temp/SwitchToSeller.jsx";
import Dashboard from "./pages-temp/seller/Dashboard.jsx";
import SellerLayout from "./layouts/SellerLayout.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-cccd" element={<RegisterCCCD />} />
        <Route path="/log" element={<Log />} />
        <Route path="/sdt" element={<SDT />} />
        <Route path="/reset-account" element={<ResetAccount />} />
        <Route path="/switch-to-seller" element={<SwitchToSeller />} />
        <Route path="/seller" element={<SellerLayout />}>
          <Route path="home" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}