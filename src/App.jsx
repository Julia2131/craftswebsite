import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages-temp/Home.jsx";
import RegisterCCCD from "./pages-temp/RegisterCCCD.jsx";
import Log from "./pages-temp/Log.jsx";
import SDT from "./pages-temp/SDT.jsx";
import ResetAccount from "./pages-temp/ReAccount.jsx";
import SwitchToSeller from "./pages-temp/SwitchToSeller.jsx";
import Dashboard from "./pages-temp/seller/Dashboard.jsx";
import SellerLayout from "./layouts/SellerLayout.jsx";
import { PostCreateReadyMade } from "./pages-temp/seller/PostCreateReadyMade.jsx";
import ProductCreateSuccess from "./pages-temp/seller/ProductCreateSuccess.jsx";
import SellerProducts from "./pages-temp/seller/SellerProducts.jsx";
import SuperDashboard from "./pages-temp/Admin/Dashboard.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ContentModeration from "./pages-temp/Admin/ContentModeration.jsx";
import ProductModerationDetail from "./pages-temp/Admin/ProductModerationDetail.jsx";

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
        <Route path="/seller" element={<SellerLayout />}> {/* Role SELLER */}
          <Route path="home" element={<Dashboard />} />
          <Route path="product/success" element={<ProductCreateSuccess />} />
          <Route path="product/all" element={<SellerProducts />} />
          <Route path="product/create" element={<PostCreateReadyMade />} />
          <Route path="product/edit/:id" element={<PostCreateReadyMade />} />
        </Route> {/* Role SUPER_ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="home" element={<SuperDashboard />} />
          <Route path="content-moderation" element={<ContentModeration />} />
          <Route path="content-moderation/duyet/:id" element={<ProductModerationDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}