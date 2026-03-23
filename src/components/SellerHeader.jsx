import { useEffect, useState } from "react";
import chatIcon from "../assets/ChatIcon.png";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Hero.png";
import { MessageCircle} from "lucide-react";


export default function SellerHeader() {
  const navigate = useNavigate();
  const [anhChanDungUrl, setAnhChanDungUrl] = useState(null);
  const [ten, setTen] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("register_user_id");


  useEffect(() => {
    const fetchUserInfo  = async () => {
        try {
            // Lấy ảnh chân dung từ backend
            const res = await fetch(`${API}/nguoi-dung/${userId}/anh-chan-dung`);
            const data = await res.json();
            if(data.success) {
                setAnhChanDungUrl(data.anhChanDungUrl);
            } else {
                console.error("Lỗi khi lấy ảnh chân dung:", data.message);
            }
            // Lấy tên người dùng từ backend
            const resTen = await fetch(`${API}/nguoi-dung/${userId}/ten`);
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

  // click "Kênh người mua"
  const handleOpenUser = async () => {

    const userId = localStorage.getItem("register_user_id");

    if (!userId) {
      alert("Vui lòng đăng nhập trước khi chuyển sang tài khoản người mua.");
      navigate("/log");
      return;
    }

    try {
      navigate("/");

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
              onClick={handleOpenUser}
              className="cursor-pointer hover:text-blue-600 transition-colors"
              >Kênh người mua 
            </span>
            <span className="text-gray-300">|</span>
            {/* <span className="cursor-pointer hover:text-blue-600 transition-colors">Trở thành Người bán Crafts</span> */}
          </div>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Hỗ trợ</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Thông báo</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
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

          <div className="flex items-center gap-6 text-gray-600">
            <button className="hover:text-blue-600 transition-colors relative">
              <MessageCircle size={24} strokeWidth={1.5} />
            </button>

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

        </div>
      </div>

    </header>
  );
}