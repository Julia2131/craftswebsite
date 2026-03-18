import React from "react";
import { Facebook, Instagram, Youtube, Plus } from "lucide-react";
import footerBg from "../assets/Footer-background.jpg";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100">
      <div
        className="mx-auto max-w-6xl px-10 py-12 rounded-t-xl shadow-inner overflow-hidden"
        style={{
          backgroundImage: `url(${footerBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 text-[#b06b3b] gap-12 text-sm font-sans">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#c07a46]">Info</h3>
            <p className="leading-6 opacity-90 text-justify">
              Sàn thương mại điện tử chuyên biệt cho nghệ nhân và người yêu thích sản phẩm mang tính chất cá nhân, mới mẻ.
            </p>
            <div className="flex gap-5 mt-6">
              <Facebook size={22} strokeWidth={1.5} className="cursor-pointer hover:text-[#c07a46] transition-transform hover:scale-110" />
              <Instagram size={22} strokeWidth={1.5} className="cursor-pointer hover:text-[#c07a46] transition-transform hover:scale-110" />
              <Youtube size={22} strokeWidth={1.5} className="cursor-pointer hover:text-[#c07a46] transition-transform hover:scale-110" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#c07a46]">Shopping</h3>
            <ul className="space-y-2 opacity-90 cursor-pointer">
              <li className="hover:underline hover:text-[#c07a46]">Đồ Decor & Nội thất</li>
              <li className="hover:underline hover:text-[#c07a46]">Trang sức thủ công</li>
              <li className="hover:underline hover:text-[#c07a46]">Quà tặng & Phụ kiện</li>
              <li className="hover:underline hover:text-[#c07a46]">Sản phẩm bán chạy</li>
              <li className="hover:underline hover:text-[#c07a46]">Nghệ nhân tiêu biểu</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#c07a46]">Trust</h3>
            <ul className="space-y-2 opacity-90 cursor-pointer">
              <li className="hover:underline">Chính sách bảo mật (eKYC & CCD)</li>
              <li className="hover:underline">Quy trình giải quyết khiếu nại</li>
              <li className="hover:underline">Chính sách vận chuyển</li>
              <li className="hover:underline">Xác thực ví điện tử</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#c07a46]">Newsletter</h3>
            <p className="opacity-90 leading-6 italic">Nhận tin ưu đãi từ các nghệ nhân.</p>
            <div className="mt-4 flex">
              <button className="border border-[#c07a46]/40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/40 transition-all active:scale-90">
                <Plus size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white py-4 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em] font-sans">
        © 2026 Crafts Website Project - Build with Love
      </div>
    </footer>
  );
}