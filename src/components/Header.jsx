import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ShoppingCart, User } from "lucide-react";
import logo from "../assets/Hero.png";
import searchIcon from "../assets/Icon.png";

export default function Header() {
  const navigate = useNavigate();
  
  const [image, setImage] = useState("");
  const [name, setname] = useState("");
  
  const token = localStorage.getItem("token");

  const API = import.meta.env.VITE_API_URL;

  // 2. Lắng nghe sự kiện đăng nhập/đăng xuất để cập nhật Header ngay lập tức
  useEffect(() => {
    const handleSync = async () => {

      if (!token) {
        setImage("");
        setname("");
        return;
      }
      // Lay anh 
      const res = await fetch(`${API}/nguoi-dung/me/anh-chan-dung`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      if (!res.ok) {
        console.error("API lỗi:", res.status);
        return;
      }

      const data = await res.json();
      setImage(data.anhChanDungUrl);
      localStorage.setItem("anhChanDungUrl", data.anhChanDungUrl);

      // Lay ten 
      const res1 = await fetch(`${API}/nguoi-dung/me/ten`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      if (!res1.ok) {
        console.error("API lỗi:", res.status);
        return;
      }

      const data1 = await res1.json();
      setname(data1.ten);
      localStorage.setItem("tenDangNhap", data1.ten);

    };

    handleSync();

    window.addEventListener("craft_user_updated", handleSync);
    window.addEventListener("storage", handleSync); // Đồng bộ giữa các tab
    return () => {
      window.removeEventListener("craft_user_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // click "Kênh người bán"
  const handleOpenSeller = async () => {
    if (!token) {
      alert("Vui lòng đăng nhập trước khi tạo tài khoản người bán");
      navigate("/log");
      return;
    }

    try {
      const res = await fetch(`${API}/thong-tin-nguoi-ban/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      // chưa có seller
      if (res.status === 404) {
        navigate("/switch-to-seller");
        return;
      }

      // lỗi server
      if (!res.ok) {
        console.error("Server error:", res.status);
        return;
      }

      navigate("/seller/home");

    } catch (err) {
      console.error("Seller navigation error:", err);
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      {/* Sub-header */}
      <div className="bg-[#f3f3f3] border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-1 flex justify-between text-[11px] text-gray-500 font-medium">
          <div className="flex gap-4">
            <span
              onClick={handleOpenSeller}
              className="cursor-pointer hover:text-blue-600 transition-colors"            
              >Kênh người bán
            </span>
            <span className="text-gray-300">|</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Trở thành Người bán Crafts</span>
          </div>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Hỗ trợ</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Thông báo</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-6">
        <img 
          src={logo} 
          className="h-10 cursor-pointer object-contain" 
          onClick={() => navigate("/")} 
          alt="logo" 
        />

        <div className="flex-1 flex items-center border rounded-md px-3 py-2 bg-white">
          <input className="w-full outline-none text-sm placeholder-gray-400" placeholder="Nội dung tìm kiếm ..." />
          <img src={searchIcon} className="h-5 w-5 cursor-pointer" alt="search" />
        </div>

        <div className="flex items-center gap-6 text-gray-600">
          <button className="hover:text-blue-600 transition-colors relative">
            <MessageCircle size={24} strokeWidth={1.5} />
          </button>
          
          {/* SỬA LỖI 2: Bấm icon giỏ hàng chuyển sang trang đơn hàng */}
          <button 
            className="hover:text-blue-600 transition-colors relative active:scale-90"
            onClick={() => navigate("/orders")}
          >
            <ShoppingCart size={24} strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold border-2 border-white">
              2
            </span>
          </button>

          {/* SỬA LỖI 1: Kiểm tra user để hiện "Đăng nhập" hoặc "Thông tin cá nhân" */}
          {token ? (
            <div 
              className="flex items-center gap-2 border-l pl-5 cursor-pointer hover:opacity-80 transition-all"
              onClick={() => navigate("/profile")}
            >
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
                {image ? (
                  <img src={image} className="h-full w-full object-cover" alt="avatar" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <User size={18} />
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                {name || "Người dùng"}
              </span>
            </div>
          ) : (
            /* Nếu chưa đăng nhập thì hiện nút Đăng nhập */
            <button 
              onClick={() => navigate("/log")}
              className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
}