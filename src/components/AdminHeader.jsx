import { useEffect, useState } from "react";
import chatIcon from "../assets/ChatIcon.png";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Hero.png";

export default function AdminHeader() {
  const navigate = useNavigate();
  const [anhChanDungUrl, setAnhChanDungUrl] = useState(null);
  const [ten, setTen] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const adminId = localStorage.getItem("register_admin_id");


  useEffect(() => {

    const fetchUserInfo = async () => {
      try {

        if (!adminId) return;

        const res = await fetch(`${API}/nguoi-dung/${adminId}/anh-chan-dung`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();

        if (data.success && data.anhChanDungUrl) {
          setAnhChanDungUrl(data.anhChanDungUrl);
        }

        const resTen = await fetch(`${API}/nguoi-dung/${adminId}/ten`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const dataTen = await resTen.json();

        if (dataTen.success && dataTen.ten) {
          setTen(dataTen.ten);
        } else {
          setTen("Admin");
        }

      } catch (err) {
        console.error("Không lấy được thông tin user:", err);

        // fallback
        setTen("Admin");
        setAnhChanDungUrl(null);
      }
    };

    fetchUserInfo();

  }, [adminId, API]);

    // click "Kênh người bán"
  const handleOpenSeller = async () => {
     const API = import.meta.env.VITE_API_URL;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vui lòng đăng nhập trước khi tạo tài khoản người bán");
      navigate("/log");
      return;
    }

    try {
      const res = await fetch(`${API}/thong-tin-nguoi-ban/me`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
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

      const sellerId = await res.json();

      console.log("sellerId:", sellerId);

      localStorage.setItem("register_seller_id", sellerId);

      navigate("/seller/home");

    } catch (err) {
      console.error("Seller navigation error:", err);
    }
  };

    // click "Kênh người mua"
  const handleOpenUser = async () => {
    const API = import.meta.env.VITE_API_URL;
    navigate("/");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">

      {/* Sub-header */}
      <div className="bg-[#f3f3f3] border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-1 flex justify-between text-[11px] text-gray-500 font-medium">
          <div className="flex gap-4">
            <span
              onClick={handleOpenUser}
              className="cursor-pointer hover:text-blue-600 transition-colors"            
              >Kênh người mua
            </span>
            <span className="text-gray-300">|</span>
            
            <span
              onClick={handleOpenSeller}
              className="cursor-pointer hover:text-blue-600 transition-colors"            
              >Kênh người mua 
            </span>
          </div>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Hỗ trợ</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Thông báo</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <img 
          src={logo} 
          className="h-10 cursor-pointer object-contain" 
          onClick={() => navigate("/seller/home")} 
          alt="logo" 
        />

      {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

        {/* Notification icon */}
        <img
        className="ml-2 h-5 w-5"
        alt="Chat"
        src={chatIcon}
        />

        {/* USER */}
        <div className="flex items-center gap-2">

        <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          {anhChanDungUrl ? (
            <img
              src={anhChanDungUrl}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm font-semibold text-slate-500">
              {ten ? ten.charAt(0).toUpperCase() : "A"}
            </div>
          )}
        </div>

          {/* TÊN */}
          <span className="text-sm font-medium">
            {ten || "Admin"}
          </span>

          <span className="text-gray-400 text-sm">
            | Super Admin
          </span>

        </div>

      </div>
          </div>
    </header>
  );
}