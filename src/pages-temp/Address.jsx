import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, MapPin } from "lucide-react"; 
import Sidebar from "../components/Sidebar";

export default function Address() {
  const navigate = useNavigate();
  const STORAGE_KEY = "craft_user";
  const ADDR_KEY = "user_addresses";

  const [showModal, setShowModal] = useState(false);  {/* Thêm địa chỉ mới */}
  const [addresses, setAddresses] = useState(() => {
  const saved = localStorage.getItem(ADDR_KEY);
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "TRẦN THỊ HƯƠNG", phone: "0988 123 234", address: "Số 1, Ngõ 10, Phố Chùa Láng, Phường Láng Thượng, Quận Đống Đa, Hà Nội", default: true },
    ];
  });

  const [newAddr, setNewAddr] = useState({ name: "", phone: "", detail: "", isDefault: false });

  const handleSaveAddress = () => {
    if (!newAddr.name || !newAddr.phone || !newAddr.detail) return alert("Vui lòng nhập đủ thông tin!");
    
    const id = Date.now();
    const updated = [...addresses, { ...newAddr, id, address: newAddr.detail, default: newAddr.isDefault }];
    
    if (newAddr.isDefault) {
      setAddresses(updated.map(a => ({ ...a, default: a.id === id })));
    } else {
      setAddresses(updated);
    }
    
    setShowModal(false);
    setNewAddr({ name: "", phone: "", detail: "", isDefault: false });
  };

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const districts = selectedProvince
    ? ADDRESS_DATA.find(p => p.name === selectedProvince)?.districts || []
    : [];
  const wards = selectedDistrict
    ? districts.find(d => d.name === selectedDistrict)?.wards || []
    : [];


  return (
    // XÓA THẺ <Layout> Ở ĐÂY
    <section className="mx-auto max-w-6xl px-4 py-8 relative">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <div className="flex-1 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8 border-b pb-5">
            <h2 className="text-xl font-bold text-gray-800">Địa chỉ của tôi</h2>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-md font-medium"
            >
              <Plus size={18} /> Thêm địa chỉ mới
            </button>
          </div>

          <div className="space-y-6">
            {addresses.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-6 last:border-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800 uppercase">{item.name}</span>
                    <span className="text-gray-400 border-l pl-3">{item.phone}</span>
                  </div>
                  <p className="text-sm text-gray-500">{item.address}</p>
                  {item.default && (
                    <span className="inline-block mt-2 text-[10px] text-red-500 border border-red-500 px-1.5 py-0.5 rounded-sm font-bold">MẶC ĐỊNH</span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 text-sm text-blue-600">
                  <button className="hover:underline">Cập nhật</button>
                  {!item.default && <button className="hover:underline text-gray-400">Xóa</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thêm địa chỉ mới */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Địa chỉ mới</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Họ tên & SDT */}
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Họ và tên" 
                  className="border rounded px-4 py-3 outline-none focus:border-blue-500"
                  onChange={(e) => setNewAddr({...newAddr, name: e.target.value})}
                />
                <input 
                  type="text" placeholder="Số điện thoại" 
                  className="border rounded px-4 py-3 outline-none focus:border-blue-500"
                  onChange={(e) => setNewAddr({...newAddr, phone: e.target.value})}
                />
              </div>

              {/* Chọn Tỉnh/Quận/Phường */}
              <div className="space-y-2 relative">
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-300" size={18} />
                  <span className="text-sm text-gray-500">Chọn địa chỉ</span>
                </div>

                {/* Tỉnh/Thành phố */}
                <select
                  className="w-full border rounded px-4 py-3 outline-none focus:border-blue-500 text-sm"
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict("");
                    setSelectedWard("");
                    setNewAddr({...newAddr, province: e.target.value, district: "", ward: ""});
                  }}
                >
                  <option value="">-- Chọn Tỉnh/Thành phố --</option>
                  {ADDRESS_DATA.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>

                {/* Quận/Huyện */}
                {districts.length > 0 && (
                  <select
                    className="w-full border rounded px-4 py-3 outline-none focus:border-blue-500 text-sm mt-1 max-h-40 overflow-y-auto"
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setSelectedWard("");
                      setNewAddr({...newAddr, district: e.target.value, ward: ""});
                    }}
                  >
                    <option value="">-- Chọn Quận/Huyện --</option>
                    {districts.map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                )}

                {/* Phường/Xã */}
                {wards.length > 0 && (
                  <select
                    className="w-full border rounded px-4 py-3 outline-none focus:border-blue-500 text-sm mt-1 max-h-40 overflow-y-auto"
                    value={selectedWard}
                    onChange={(e) => {
                      setSelectedWard(e.target.value);
                      setNewAddr({...newAddr, ward: e.target.value});
                    }}
                  >
                    <option value="">-- Chọn Phường/Xã --</option>
                    {wards.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Địa chỉ cụ thể */}
              <textarea 
                placeholder="Địa chỉ cụ thể" 
                rows="3"
                className="w-full border rounded px-4 py-3 outline-none focus:border-blue-500 text-sm"
                onChange={(e) => setNewAddr({...newAddr, detail: e.target.value})}
              ></textarea>

              {/* Checkbox mặc định */}
              <label className="flex items-center gap-2 cursor-pointer py-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-blue-600"
                  checked={newAddr.isDefault}
                  onChange={(e) => setNewAddr({...newAddr, isDefault: e.target.checked})}
                />
                <span className="text-sm text-gray-500 italic">Đặt làm địa chỉ mặc định</span>
              </label>
            </div>
  

            <div className="p-6 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border rounded-md hover:bg-white text-gray-600 transition-all"
              >
                Trở Lại
              </button>
              <button 
                onClick={handleSaveAddress}
                className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition-all font-medium"
              >
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const ADDRESS_DATA = [
  {
    name: "Hà Nội",
    districts: [
      {
        name: "Hoàn Kiếm",
        wards: ["Phúc Tân", "Hàng Bạc", "Hàng Bông"]
      },
      {
        name: "Ba Đình",
        wards: ["Phúc Xá", "Trúc Bạch", "Ngọc Hà"]
      },
    ]
  },
  {
    name: "TP. Hồ Chí Minh",
    districts: [
      {
        name: "Quận 1",
        wards: ["Bến Nghé", "Bến Thành", "Cầu Kho"]
      },
      {
        name: "Quận 3",
        wards: ["Phường 1", "Phường 2", "Phường 3"]
      },
    ]
  },
  {
    name: "Đà Nẵng",
    districts: [
      {
        name: "Hải Châu",
        wards: ["Thạch Thang", "Hải Châu I", "Hải Châu II"]
      },
      {
        name: "Sơn Trà",
        wards: ["An Hải Bắc", "An Hải Đông", "Thọ Quang"]
      },
    ]
  }
];