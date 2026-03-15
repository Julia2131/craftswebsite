import SellerSidebar from "../components/SellerSidebar";
import SellerHeader from "../components/SellerHeader";
import { Outlet } from "react-router-dom";

export default function SellerLayout() {
  return (
    <div className="flex h-screen">

      <SellerSidebar />

      <div className="flex flex-col flex-1">

        <SellerHeader />

        <div className="flex-1 bg-gray-100">
          <Outlet />
        </div>

      </div>

    </div>
  );
}