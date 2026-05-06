import { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuData = [
  {
    title: "Danh sách nghi vấn",
  },
  {
    title: "Kiểm tra tính toàn vẹn",
  },
  {
    title: "Trích xuất hồ sơ",
  },
  {
    title: "Duyệt bài đăng",
    path: "/admin/content-moderation",
  },
  {
    title: "Tiếp nhận yêu cầu",
  },
  {
    title: "Xử lý tranh chấp",
  },
  {
    title: "Quản lý tài khoản",
    items: ["Tất cả", "Cấu hình phân quyền"],
  },
  {
    title: "Giám sát hoạt động",
    items: ["Chi tiết hoạt động", "Bảo trì & Cập nhật"],
  },
  {
    title: "Cấu hình biểu phí & RBAC",
    items: ["Biểu phí & Hoa hồng", "Danh mục"],
  },
];

export default function AdminSidebar() {
  const [activeItem, setActiveItem] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const navigate = useNavigate();

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
          <button
            onClick={() => {
              if (section.path) {
                navigate(section.path);
              } else {
                toggleSection(sectionIndex);
              }
            }}
            className="flex justify-between items-center w-full font-bold text-gray-700 px-2 py-2 hover:bg-[#6366F1] hover:text-white rounded"
          >
            {section.title}
          </button>

          {openSections[sectionIndex] && section.items && (
            <div className="flex flex-col gap-1 mt-1">
              {section.items.map((item, itemIndex) => {
                const key = `${sectionIndex}-${itemIndex}`;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveItem(key);

                      if (item === "Duyệt bài đăng") {
                        navigate("/admin/content-moderation");
                      }

                      if (item === "Cấu hình phân quyền"){
                        navigate("/admin/permission-matrix");
                      }
                    }}
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