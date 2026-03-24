import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  return (
    // XÓA THẺ <Layout> Ở ĐÂY. Chỉ dùng <div>
    <div className="mx-auto max-w-5xl px-4 py-8 font-sans">
      <div className="bg-[#e9f2ff] p-6 rounded shadow-sm border-l-4 border-blue-500 mb-6">
         <h3 className="text-blue-600 font-bold mb-4 flex items-center gap-2">
            <MapPin size={18}/> Địa chỉ nhận hàng
         </h3>
         <div className="flex justify-between items-center text-sm">
            <div>
               <p className="font-bold">Địa chỉ 2</p>
               <p className="text-gray-600">Hồ Chí Minh, Huyện Mê Linh, Xã Mê Linh, đường 23</p>
               <p className="font-medium">0988 123 234</p>
            </div>
            <button className="text-blue-500 hover:underline">Thay đổi</button>
         </div>
      </div>
      
      {/* Các nội dung sản phẩm khác giữ nguyên... */}
      
      <div className="flex justify-end mt-8">
        <button 
          onClick={() => navigate("/payment-qr")}
          className="bg-blue-600 text-white px-12 py-3 rounded font-bold shadow-lg hover:bg-blue-700 transition"
        >
          Mua hàng
        </button>
      </div>
    </div>
  );
}