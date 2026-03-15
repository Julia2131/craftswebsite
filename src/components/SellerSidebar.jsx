import { useState } from "react";

const menuData = [
  {
    title: "Quản lý đơn hàng",
    items: ["Tất cả", "Cài đặt vận chuyển"],
  },
  {
    title: "Quản lý sản phẩm",
    items: ["Tất cả sản phẩm", "Thêm sản phẩm"],
  },
  {
    title: "Chăm sóc khách hàng",
    items: ["Quản lý Chat", "Quản lý đánh giá"],
  },
  {
    title: "Tài chính",
    items: ["Quản lý vật liệu", "Doanh thu", "Tài khoản ngân hàng"],
  },
  {
    title: "Dữ liệu",
    items: ["Phân tích bán hàng", "Hiệu quả hoạt động"],
  },
  {
    title: "Quản lý shop",
    items: ["Hồ sơ shop"],
  },
];

export default function SellerSidebar() {
  const [activeItem, setActiveItem] = useState(null);
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-60 bg-[#E0E7FF] h-screen flex flex-col p-3">

      {menuData.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-3">

          {/* TITLE */}
          <button
            onClick={() => toggleSection(sectionIndex)}
            className="flex justify-between items-center w-full font-bold text-gray-700 px-2 py-2 hover:bg-[#6366F1] hover:text-white rounded"
          >
            {section.title}

            <span
              className={`transition-transform ${
                openSections[sectionIndex] ? "rotate-180" : ""
              }`}
            >
              ^
            </span>
          </button>

          {/* ITEMS */}
          {openSections[sectionIndex] && (
            <div className="flex flex-col gap-1 mt-1">

              {section.items.map((item, itemIndex) => {
                const key = `${sectionIndex}-${itemIndex}`;

                return (
                  <button
                    key={key}
                    onClick={() => setActiveItem(key)}
                    className={`text-left px-4 py-2 rounded text-sm
                    ${
                      activeItem === key
                        ? "bg-[#4338CA] text-white"
                        : "hover:bg-[#6366F1] hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

            </div>
          )}

        </div>
      ))}

    </div>
  );
}