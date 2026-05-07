import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, MapPin, Star, X, Heart } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function OrderList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho Modal Đánh giá
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusMap = {
        all: "all",
        pending_confirm: "CHO_XAC_NHAN",
        pending_pickup: "CHO_LAY_HANG",
        shipping: "CHO_GIAO_HANG",
        delivered: "DA_GIAO",
        cancelled: "DA_HUY"
      };

      const statusParam = statusMap[activeTab] || "all";
      const response = await fetch(`${API}/donhang/my-orders?status=${statusParam}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [activeTab]);

  // Mở Pop-up cute
  const handleOpenReview = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  // Gửi xác nhận & Đánh giá về Backend
  const handleConfirmAndReview = async () => {
    try {
      const response = await fetch(`${API}/donhang/${selectedOrderId}/confirm-received`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ rating, comment })
      });

      if (response.ok) {
        alert("Xác nhận thành công! Cảm ơn nàng đã ủng hộ nha ✨");
        setShowModal(false);
        setComment("");
        setRating(5);
        fetchOrders();
      }
    } catch (err) { alert("Có lỗi xảy ra rồi nàng ơi!"); }
  };

  // Logic màu hồng đậm dần cho số sao
  const getStarStyle = (index) => {
    const isSelected = index < rating;
    if (!isSelected) return "text-gray-200 fill-transparent";
    
    // Đậm dần theo index: 1 sao nhạt, 5 sao cực đậm
    const colors = ["#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777"]; 
    return `fill-[${colors[rating-1]}] text-[${colors[rating-1]}]`;
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 flex gap-8 relative">
      <Sidebar />
      <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 font-sans">
        {/* TABS */}
        <div className="w-full overflow-x-auto hide-scrollbar">
          <div className="flex border-b mb-6 text-sm text-gray-400 font-medium min-w-max">
            {[
              { key: "all", label: "Tất cả" },
              { key: "pending_confirm", label: "Chờ xác nhận" },
              { key: "pending_pickup", label: "Chờ lấy hàng" },
              { key: "shipping", label: "Chờ giao hàng" },
              { key: "delivered", label: "Đã giao" },
              { key: "cancelled", label: "Đã hủy" },
            ].map(tab => (
              <button 
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 px-6 border-b-2 transition-all ${
                  activeTab === tab.key ? "border-blue-500 text-blue-600" : "border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-8">
          {loading ? <div className="text-center py-10">Đang tải...</div> : orders.map((item) => (
            <div key={item.id} className="border-b last:border-0 pb-8 group">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-700">Mã đơn: #{item.maDon}</span>
                <span className="text-[10px] font-bold text-blue-500 uppercase px-2 py-1 bg-blue-50 rounded">
                  {item.status}
                </span>
              </div>
              <div className="flex gap-6">
                <img src={item.productImg || "https://via.placeholder.com/100"} className="w-20 h-24 object-cover rounded-xl border-2 border-blue-50" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{item.productName}</h4>
                  <div className="text-xs text-gray-400 mt-1">Số lượng: {item.quantity}</div>
                  
                  {/* NÚT ĐÃ NHẬN HÀNG Ở MỤC CHỜ GIAO HÀNG */}
                  {item.status === "CHO_GIAO_HANG" && (
                    <button 
                      onClick={() => handleOpenReview(item.id)}
                      className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                      Đã nhận được hàng
                    </button>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">{item.totalPrice?.toLocaleString()} đ</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POP-UP REVIEW CUTE MÀU HỒNG */}
      {showModal && (
        <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative border-4 border-blue-50 scale-100 animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-300 hover:text-blue-400 transition-colors">
              <X size={24} />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-block p-4 bg-blue-50 rounded-full text-blue-500 mb-2">
                <Heart size={32} className="fill-blue-500 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Tuyệt vời quá!</h2>
              <p className="text-xs text-gray-400 px-6">Nàng hãy chia sẻ cảm nhận về sản phẩm cho tụi mình biết nhé ~</p>
            </div>

            {/* STAR RATING - HỒNG ĐẬM DẦN */}
            <div className="flex justify-center gap-2 my-8">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  size={36}
                  onClick={() => setRating(i + 1)}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-125 ${
                    i < rating ? `fill-current ${
                      rating === 1 ? "text-pink-100" : 
                      rating === 2 ? "text-pink-200" : 
                      rating === 3 ? "text-pink-300" : 
                      rating === 4 ? "text-pink-400" : "text-pink-700"
                    }` : "text-gray-200"
                  }`}
                />
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Sản phẩm xinh lắm ạ, shop đóng gói kỹ..."
              className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-2xl p-4 text-sm outline-none focus:border-blue-300 transition-all h-28 resize-none placeholder:text-gray-300"
            />

            <button
              onClick={handleConfirmAndReview}
              className="w-full mt-6 bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Gửi đánh giá & Hoàn tất <Heart size={16} fill="white" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}