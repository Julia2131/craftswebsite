import { useEffect, useState } from "react";
import chatIcon from "../assets/ChatIcon.png";
import { useNavigate } from "react-router-dom";

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

        const res = await fetch(`${API}/nguoi-dung/${adminId}/anh-chan-dung`);
        const data = await res.json();

        if (data.success && data.anhChanDungUrl) {
          setAnhChanDungUrl(data.anhChanDungUrl);
        }

        const resTen = await fetch(`${API}/nguoi-dung/${adminId}/ten`);
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

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b">

      {/* LOGO */}
    <div 
      className="text-2xl font-bold text-blue-600 cursor-pointer"
      onClick={() => navigate("/admin/home")}
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

    </header>
  );
}