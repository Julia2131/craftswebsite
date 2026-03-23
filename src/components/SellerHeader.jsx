import { useEffect, useState } from "react";
import chatIcon from "../assets/ChatIcon.png";
import { useNavigate } from "react-router-dom";

export default function SellerHeader() {
  const navigate = useNavigate();
  const [anhChanDungUrl, setAnhChanDungUrl] = useState(null);
  const [ten, setTen] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("token");


  useEffect(() => {
    const fetchUserInfo  = async () => {
        try {
            // Lấy ảnh chân dung từ backend
            const res = await fetch(`${API}/nguoi-dung/me/anh-chan-dung`, {
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            });
            const data = await res.json();
            if(data.success) {
                setAnhChanDungUrl(data.anhChanDungUrl);
            } else {
                console.error("Lỗi khi lấy ảnh chân dung:", data.message);
            }
            // Lấy tên người dùng từ backend
            const resTen = await fetch(`${API}/nguoi-dung/me/ten`, {
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            });
            const dataTen = await resTen.json();
            if(dataTen.success) {
                setTen(dataTen.ten);
            } else {
                console.error("Lỗi khi lấy tên người dùng:", dataTen.message);
            }
        } catch (err) {
            console.error("Lỗi khi lấy ảnh chân dung:", err);
        }
    };

    if (userId) {
        fetchUserInfo();
    }
    }, [userId, API]);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b">

      {/* LOGO */}
    <div 
      className="text-2xl font-bold text-blue-600 cursor-pointer"
      onClick={() => navigate("/seller/home")}
    >
      LOGO
    </div>

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
                <div className="h-full w-full flex items-center justify-center text-sm text-slate-500">
                S
                </div>
            )}
        </div>

          {/* TÊN */}
          <span className="text-sm font-medium">
            {ten || "Loading..."}
          </span>

          <span className="text-gray-400 text-sm">
            | Seller
          </span>

        </div>

      </div>

    </header>
  );
}