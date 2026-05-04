function Sidebar() {
  return (
    <div className="w-72 border-r p-4 space-y-6">
      <h2 className="font-semibold text-lg">Bộ lọc</h2>

      {/* GIÁ */}
      <div>
        <h3 className="font-medium mb-2">Giá</h3>
        <input type="range" className="w-full" />
        <div className="flex justify-between text-sm text-gray-500">
          <span>0</span>
          <span>1.000.000</span>
        </div>
      </div>

      {/* ĐÁNH GIÁ */}
      <div>
        <h3 className="font-medium mb-2">Đánh giá</h3>
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-2">
            <input type="checkbox" />
            <span>{"⭐".repeat(star)}</span>
          </div>
        ))}
      </div>

      {/* THỜI GIAN */}
      <div>
        <h3 className="font-medium mb-2">Thời gian</h3>
        {["< 1 tuần", "1-4 tuần", "> 1 tháng"].map((t) => (
          <div key={t} className="flex gap-2">
            <input type="checkbox" />
            <span>{t}</span>
          </div>
        ))}
      </div>

      {/* UY TÍN */}
      <div>
        <h3 className="font-medium mb-2">Độ uy tín</h3>
        <div className="flex gap-2">
          <input type="checkbox" />
          <span>Seller đã định danh</span>
        </div>
        <div className="flex gap-2">
          <input type="checkbox" />
          <span>Có chứng chỉ bảo trợ</span>
        </div>
      </div>

      {/* ĐỊA PHƯƠNG */}
      <div>
        <h3 className="font-medium mb-2">Địa phương</h3>
        <select className="w-full border p-2 rounded">
          <option>Toàn quốc</option>
          <option>Hà Nội</option>
          <option>TP.HCM</option>
          <option>Bắc Giang</option>
        </select>
      </div>
    </div>
  );
}
export default Sidebar;