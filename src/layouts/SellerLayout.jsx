import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import SellerSidebar from "../components/SellerSidebar";
import SellerHeader from "../components/SellerHeader";

export default function SellerLayout() {
  const location = useLocation();

  // 1. Logic ẩn sidebar theo route
  const hideNavigation =
    location.pathname.includes("/seller/product/create") ||
    location.pathname.includes("/seller/product/edit");

  // 2. State sidebar
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 3. Responsive handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint

      setIsMobile(mobile);
      setIsOpen(!mobile); // mobile => false, desktop => true
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // =========================
  // RENDER
  // =========================

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* HEADER */}
      <div className="relative z-50">
        <SellerHeader />
      </div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden relative lg:px-[20px]">

        {/* ================= SIDEBAR ================= */}
        {!hideNavigation && (
          <>
            {/* Sidebar desktop */}
            <aside
              className={`
                hidden lg:flex
                flex-col
                bg-white
                border-r
                shadow-xl
                transition-all duration-300 ease-in-out
                overflow-hidden
                ${isOpen ? "w-64" : "w-0"}
              `}
            >
              <div
                className={`
                  transition-opacity duration-300
                  ${isOpen ? "opacity-100" : "opacity-0"}
                  w-64
                `}
              >
                <SellerSidebar />
              </div>
            </aside>

            {/* Sidebar mobile overlay */}
            {isMobile && isOpen && (
              <>
                {/* backdrop */}
                <div
                  className="fixed inset-0 bg-black/40 z-40"
                  onClick={() => setIsOpen(false)}
                />

                {/* drawer */}
                <aside className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-2xl">
                  <SellerSidebar />
                </aside>
              </>
            )}
          </>
        )}

        {/* ================= MAIN ================= */}
        <main className="flex-1 bg-gray-100 overflow-y-auto relative">

          {/* Toggle Button */}
          {!hideNavigation && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="absolute top-3 left-3 z-30 p-2 rounded-lg bg-white shadow hover:bg-gray-100 transition"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <Outlet />
        </main>

      </div>
    </div>
  );
}