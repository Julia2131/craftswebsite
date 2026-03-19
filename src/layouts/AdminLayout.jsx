import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {

  const location = useLocation();

  const hideNavigation =
    location.pathname === "/admin/home";


  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1">

        {/* HEADER */}
        <AdminHeader />

        {/* MAIN */}
        <main className="flex-1 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}