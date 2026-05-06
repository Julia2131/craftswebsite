import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
 
  const location = useLocation();

  const hideNavigation =
    location.pathname.includes("/admin/content-moderation/duyet") ;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      
      <div className="flex flex-1">
        {hideNavigation ? null : <AdminSidebar />}
        <main className="flex-1 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}