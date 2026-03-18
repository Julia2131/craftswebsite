import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages-temp/Home.jsx";
import RegisterCCCD from "./pages-temp/RegisterCCCD.jsx";
import Log from "./pages-temp/Log.jsx";
import Profile from "./pages-temp/Profile.jsx";
import Address from "./pages-temp/Address.jsx";
import Layout from "./components/Layout";
import FavoriteSellers from "./pages-temp/FavoriteSellers.jsx";
import OrderList from "./pages-temp/OrderList.jsx";
import Checkout from "./pages-temp/Checkout";
import PaymentQR from "./pages-temp/PaymentQR";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. CÁC TRANG KHÔNG DÙNG LAYOUT CHUNG (Nếu có trang nào đặc biệt) */}
        <Route path="/log" element={<Log />} />
        <Route path="/register-cccd" element={<RegisterCCCD />} />

        {/* 2. CÁC TRANG SỬ DỤNG LAYOUT (Có Header & Footer) */}
        {/* Tớ bọc tất cả vào Layout để bạn không phải viết lặp lại nhiều lần */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/address" element={<Layout><Address /></Layout>} />
        <Route path="/orders" element={<Layout><OrderList /></Layout>} />
        <Route path="/favorites" element={<Layout><FavoriteSellers /></Layout>} />
        
        {/* Luồng thanh toán cũng nên có Header/Footer cho chuyên nghiệp */}
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/payment-qr" element={<Layout><PaymentQR /></Layout>} />

        {/* 3. ĐIỀU HƯỚNG KHI SAI URL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}