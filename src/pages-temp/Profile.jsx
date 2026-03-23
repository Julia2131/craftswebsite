import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Camera } from "lucide-react"; 
import Sidebar from "../components/Sidebar";

export default function Profile() {
  const navigate = useNavigate();
  const STORAGE_KEY = "craft_user";

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch { return null; }
  });

  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [profile, setProfile] = useState({
    username: user?.username || "",
    name: user?.name || "TRẦN THỊ HƯƠNG",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "nam",
    birthday: user?.birthday || "",
    avatar: user?.avatar || null,
    verified: user?.verified || true
  });

  useEffect(() => {
    const syncUser = () => {
      const updated = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (updated) {
        setUser(updated);
        setProfile(updated);
        setAvatar(updated.avatar);
      }
    };
    window.addEventListener("craft_user_updated", syncUser);
    return () => window.removeEventListener("craft_user_updated", syncUser);
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      setProfile({ ...profile, avatar: url });
    }
  };

  const handleSave = () => {
    const userData = { ...profile, avatar: avatar };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    window.dispatchEvent(new Event("craft_user_updated"));
    setUser(userData);
    alert("Đã lưu hồ sơ thành công!");
  };

  return (
    // XÓA THẺ <Layout> Ở ĐÂY - CHỈ GIỮ LẠI <section>
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="border-b pb-4 mb-8">
            <h1 className="text-xl font-bold text-gray-800">Hồ sơ của tôi</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý thông tin cá nhân để bảo mật tài khoản</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
            
            {/* FORM NHẬP LIỆU */}
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-gray-600 text-right">Họ và tên</label>
                <input 
                  name="name" 
                  value={profile.name} 
                  onChange={handleChange} 
                  className="w-full border rounded-md px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all" 
                />
              </div>

              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-gray-600 text-right">Email</label>
                <input 
                  name="email" 
                  value={profile.email} 
                  onChange={handleChange} 
                  className="w-full border rounded-md px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all" 
                />
              </div>

              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-gray-600 text-right">Số điện thoại</label>
                <input 
                  name="phone" 
                  value={profile.phone} 
                  onChange={handleChange} 
                  className="w-full border rounded-md px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all" 
                />
              </div>

              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-gray-600 text-right">Giới tính</label>
                <div className="flex gap-6">
                  {['nam', 'nu', 'khac'].map(g => (
                    <label key={g} className="flex gap-2 items-center capitalize cursor-pointer hover:text-blue-600 transition-colors">
                      <input 
                        type="radio" 
                        name="gender" 
                        value={g} 
                        checked={profile.gender === g} 
                        onChange={handleChange} 
                        className="w-4 h-4 accent-blue-600"
                      /> 
                      {g === 'nu' ? 'Nữ' : g === 'nam' ? 'Nam' : 'Khác'}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pl-[124px] pt-4">
                <button 
                  onClick={handleSave} 
                  className="bg-blue-600 text-white px-12 py-2.5 rounded-md hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95 transition-all font-medium"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>

            {/* PHẦN AVATAR */}
            <div className="flex flex-col items-center lg:border-l lg:pl-12">
              <div className="relative group">
                <div className="h-40 w-40 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-100 shadow-md">
                  {avatar ? (
                    <img src={avatar} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    <div className="flex items-center h-full justify-center text-gray-300">
                      <User size={60} strokeWidth={1} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera size={20} className="text-gray-600" />
                  <input type="file" className="hidden" onChange={handleAvatar} accept="image/*" />
                </label>
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">Dung lượng file tối đa 1MB</p>
                <p className="text-xs text-gray-400">Định dạng: .JPEG, .PNG</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}