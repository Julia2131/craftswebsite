import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  MapPin, 
  Lock, 
  Award, 
  ShoppingBag, 
  Heart, 
  FileText 
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy dữ liệu user an toàn
  const user = JSON.parse(localStorage.getItem("craft_user") || "{}");

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 flex-shrink-0">
      {/* 1. Phần Thông tin User nhỏ trên đầu */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="h-12 w-12 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center shadow-sm">
          {user.avatar ? (
            <img src={user.avatar} className="h-full w-full object-cover" alt="avatar" />
          ) : (
            <User size={20} className="text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate text-gray-800">
            {user.name || "Người dùng"}
          </div>
          <button 
            onClick={() => navigate("/profile")}
            className="text-xs text-blue-500 hover:underline flex items-center gap-1"
          >
            Sửa hồ sơ
          </button>
        </div>
      </div>

      {/* 2. Danh sách Menu (Đã xóa bỏ phần lặp lại) */}
      <nav className="space-y-1">
        <SidebarItem 
          icon={<User size={18} />} 
          label="Hồ sơ" 
          active={isActive("/profile")} 
          onClick={() => navigate("/profile")} 
        />
        <SidebarItem 
          icon={<MapPin size={18} />} 
          label="Địa chỉ" 
          active={isActive("/address")} 
          onClick={() => navigate("/address")} 
        />
        <SidebarItem icon={<Lock size={18} />} label="Đổi mật khẩu" />
        <SidebarItem icon={<Award size={18} />} label="Chứng chỉ" />
        
        {/* Chỉ giữ lại một dòng Đơn mua có icon */}
        <SidebarItem 
          icon={<ShoppingBag size={18} />} 
          label="Đơn mua" 
          active={isActive("/orders")} 
          onClick={() => navigate("/orders")} 
        />
        
        {/* Chỉ giữ lại một dòng Người bán yêu thích có icon */}
        <SidebarItem 
          icon={<Heart size={18} />} 
          label="Người bán yêu thích" 
          active={isActive("/favorites")} 
          onClick={() => navigate("/favorites")} 
        />
        
        <SidebarItem icon={<FileText size={18} />} label="Hợp đồng" />
      </nav>
    </div>
  );
}

// Component phụ trợ để render từng dòng menu
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-md cursor-pointer transition-all duration-200 ${
        active 
        ? "bg-blue-50 text-blue-600 font-bold shadow-sm" 
        : "text-gray-600 hover:bg-white hover:text-blue-500"
      }`}
    >
      <span className={active ? "text-blue-600" : "text-gray-400"}>
        {icon}
      </span>
      <span className="text-sm">{label}</span>
    </div>
  );
}