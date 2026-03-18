import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, MessageSquare, MapPin, Star, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function OrderList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  
  // Dữ liệu mẫu (Gồm cả đánh giá sao)
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      shop: "MadisonEmiliaDesigns", 
      name: "Áo thun phong cách", 
      price: 200000, 
      qty: 1, 
      img: "https://picsum.photos/100/130", 
      status: "pending",
      address: "Số 1, Chùa Láng, Đống Đa, Hà Nội",
      phone: "0988 123 234"
    },
    { 
      id: 3, 
      shop: "Crafts Store", 
      name: "Túi vải Canvas", 
      price: 150000, 
      qty: 1, 
      img: "https://picsum.photos/102/130", 
      status: "completed",
      rating: 0 // Trạng thái sao mặc định
    }
  ]);

  // Logic Tăng/Giảm số lượng
  const handleQty = (id, delta) => {
    setOrders(orders.map(o => o.id === id ? { ...o, qty: Math.max(1, o.qty + delta) } : o));
  };

  // Logic Chọn sao đánh giá
  const handleRating = (id, score) => {
    setOrders(orders.map(o => o.id === id ? { ...o, rating: score } : o));
  };

  const filteredOrders = activeTab === "all" ? orders : orders.filter(o => o.status === activeTab);

  return (
    // QUAN TRỌNG: Tuyệt đối KHÔNG bọc thẻ <Layout> ở đây nếu App.jsx đã bọc
    <section className="mx-auto max-w-6xl px-4 py-8 flex gap-8">
      <Sidebar />
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-6 font-sans">
        
        {/* TABS */}
        <div className="flex border-b mb-6 text-sm text-gray-500 font-medium overflow-x-auto">
          {["all", "pending", "shipping", "completed"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 border-b-2 capitalize transition-all ${
                activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent"
              }`}
            >
              {tab === 'all' ? 'Tất cả' : tab === 'pending' ? 'Chờ thanh toán' : tab === 'shipping' ? 'Vận chuyển' : 'Hoàn thành'}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="space-y-8">
          {filteredOrders.map((item) => (
            <div key={item.id} className="border-b last:border-0 pb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-800">{item.shop}</span>
                  <button className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                    <MessageSquare size={12} /> Chat
                  </button>
                </div>
                <span className="text-[10px] font-bold text-orange-500 uppercase italic">
                  {item.status === 'pending' && "Chờ thanh toán"}
                  {item.status === 'completed' && "Đã hoàn thành"}
                </span>
              </div>
              
              <div className="flex gap-6">
                <img src={item.img} className="w-20 h-24 object-cover rounded border" alt="p" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                  
                  {/* SỬA THÔNG TIN NHẬN HÀNG (Tab Tất cả) */}
                  {activeTab === "all" && item.status === "pending" && (
                    <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-100">
                      <p className="text-[11px] text-gray-600 flex items-center gap-1">
                        <MapPin size={12}/> {item.address} | SĐT: {item.phone}
                      </p>
                      <button className="text-[10px] text-blue-600 mt-1 hover:underline">Thay đổi thông tin nhận hàng</button>
                    </div>
                  )}

                  {/* LOGIC ĐÁNH GIÁ SAO (Tab Hoàn thành) */}
                  {item.status === "completed" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded border">
                      <p className="text-xs font-bold mb-2">Đánh giá sản phẩm:</p>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={18} 
                            className={`cursor-pointer transition-colors ${star <= item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            onClick={() => handleRating(item.id, star)}
                          />
                        ))}
                      </div>
                      <textarea placeholder="Chia sẻ cảm nhận..." className="w-full text-xs p-2 border rounded bg-white outline-none" rows="2"></textarea>
                      <button className="mt-2 text-[10px] bg-white border px-4 py-1 rounded hover:bg-gray-50">Gửi</button>
                    </div>
                  )}
                </div>

                <div className="text-right space-y-4">
                  <div className="text-sm font-bold text-blue-600">{(item.price * item.qty).toLocaleString()} đ</div>
                  
                  {/* LOGIC TĂNG GIẢM SỐ LƯỢNG */}
                  {item.status === "pending" && (
                    <div className="flex items-center border rounded-md bg-white">
                      <button onClick={() => handleQty(item.id, -1)} className="p-1.5 hover:bg-gray-100"><Minus size={14}/></button>
                      <span className="px-3 text-sm font-bold">{item.qty}</span>
                      <button onClick={() => handleQty(item.id, 1)} className="p-1.5 hover:bg-gray-100"><Plus size={14}/></button>
                    </div>
                  )}
                </div>
              </div>

              {item.status === "pending" && activeTab === "pending" && (
                <div className="flex justify-end mt-4">
                   <button onClick={() => navigate("/checkout")} className="bg-blue-600 text-white px-8 py-2 rounded-sm text-sm font-bold shadow hover:bg-blue-700 active:scale-95 transition-all">Thanh toán</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}