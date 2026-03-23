import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}