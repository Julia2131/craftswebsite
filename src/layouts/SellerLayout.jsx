import SellerSidebar from "../components/SellerSidebar";
import SellerHeader from "../components/SellerHeader";
import { Outlet, useLocation } from "react-router-dom";

export default function SellerLayout() {

  const location = useLocation();

  const hideNavigation =
  location.pathname.includes("/seller/product/create") ||
  location.pathname.includes("/seller/product/edit");

  return (
    <div className="flex flex-col min-h-screen">

      {/* HEADER */}
      <SellerHeader />

      {/* BODY */}
      <div className="flex flex-1">

        {!hideNavigation && <SellerSidebar />}

        <main className="flex-1 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}