import { useEffect, useState } from "react";
import detailIcon from "../../assets/tt_chitiet.png";
import editIcon from "../../assets/tt_edit.png";
import deleteIcon from "../../assets/tt_xoa.png";
import { useNavigate } from "react-router-dom";
import arrows_up_down_circle_Icon from "../../assets/arrows_up_down_circle.png";
import { useLocation } from "react-router-dom";


const tabs = ["Chưa xử lý", "Duyệt", "Ẩn"]; 
// "Chưa xử lý" sp ở trạng thái LUU_HIEN, 
// "Duyệt" sp ở trạng thái DANG_BAN, 
// "Ẩn" sp ở trạng thái VI_PHAM

const columnsPending = [
  "Ảnh sản phẩm",
  "Tên Seller",
  "Ngày tạo",
  "Thao tác",
];

const columnsProcessed = [
  "Ảnh sản phẩm",
  "Tên Seller",
  "Ngày xử lý",
  "ID Admin thao tác",
  "Lý do", 
];

const statusMap = {
  0: "LUU_HIEN",   // Chưa xử lý 
  1: "DANG_BAN",   // Duyệt
  2: "VI_PHAM"     // Ẩn
};

export default function ContentModeration() {
    const location = useLocation();
    useEffect(() => {
        if (location.state?.tab !== undefined) {
        setActiveTab(location.state.tab);
        }
    }, [location.state]);

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [products, setProducts] = useState([]);
    const [searchInput, setSearchInput] = useState(""); // user thấy
    const [search, setSearch] = useState(""); // gửi API
    const [sort, setSort] = useState("desc");

    const isPending = activeTab === 0;
    const columns = isPending ? columnsPending : columnsProcessed;

    const gridClass = isPending
        ? "grid grid-cols-4"
        : "grid grid-cols-5";

    const handleSort = () => {
        const newSort = sort === "desc" ? "asc" : "desc";
        setSort(newSort);
    };

    useEffect(() => {

        const timer = setTimeout(() => {
            fetchProducts();
        }, 400);

        return () => clearTimeout(timer);

    }, [page, activeTab, sort, search]);

    const sellerid = localStorage.getItem("token");
    if (!sellerid) {
      alert("Vui lòng đăng nhập trước khi thao tác.");
      navigate("/log");
      return;
    }
    const API = import.meta.env.VITE_API_URL;

    
    const fetchProducts = async () => {
        const status = statusMap[activeTab];

        try {
            const res = await fetch(
            `${API}/san-pham-co-san/moderation-products?status=${status}&search=${search}&page=${page-1}&size=10&sort=${sort}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
            });

            // console.log(
            // `${API}/san-pham-co-san/moderation-products?status=${status}&search=${search}&page=${page-1}&size=10&sort=${sort}`            );

            if (!res.ok) {
                console.error("API error", res.status);
                setProducts([]);
                return;
            }

            const data = await res.json();
            console.log(data.content);

            setProducts(data.content || []);
            setTotalPages(data.totalPages || 1);

        } catch (err) {
            console.error(err);
            setProducts([]);
        }
    };

    const handleDetail = (id) => {
        navigate(`/admin/content-moderation/duyet/${id}`);
    };

  return (
    <div className="p-6">

        {/* TABS */}
        <div className="flex gap-4 mb-6">
            {tabs.map((tab, index) => (
            <button
                key={index}
                onClick={() => {
                    setActiveTab(index);
                    setPage(1);
                }}
                className={`px-4 py-2 rounded-lg ${
                activeTab === index
                    ? "bg-blue-500 text-white font-semibold"
                    : "bg-gray-200"
                }`}
            >
                {tab}
            </button>
            ))}
        </div>

        {/* SEARCH BAR */}
        <div className="mb-4 w-full">
            <div className="relative w-full">
                
                {/* Icon */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
                </span>

                {/* Input */}
                <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchInput}
                onChange={(e) => {

                    const value = e.target.value;

                    setSearchInput(value); // hiển thị đúng user nhập

                    const normalized = normalizeSearch(value);

                    if (!normalized) {
                        setSearch(""); // clear
                    } else {
                        setSearch(normalized);
                    }

                    console.log("User nhập:", value);
                    console.log("Search gửi API:", normalized);

                    setSearch(normalized); // dùng để gọi API
                    setPage(1);
                }}
                className="w-full border pl-10 pr-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                />
                
            </div>
        </div>

        <div className="flex justify-between items-center mb-3 text-sm">

            <div>
                <b>{products.length}</b> Sản phẩm
            </div>

            <div
                className="flex items-center gap-2 cursor-pointer hover:text-blue-500"
                onClick={() => {
                    const newSort = sort === "desc" ? "asc" : "desc";
                    setSort(newSort);
                }}
            >
                Sắp xếp theo hạn gửi hàng 
                {sort === "desc" ? "(Xa → Gần)" : "(Gần → Xa)"}

                <img
                    src={arrows_up_down_circle_Icon}
                    className="w-4 h-4"
                />
            </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow">

            {/* HEADER */}
            <div className={`${gridClass} gap-[10px] font-bold text-center`}>
            {columns.map((col, index) => (
                <div
                key={index}
                className="bg-[#6366F1] text-[#E0E7FF] py-2 "
                >
                {col}
                </div>
            ))}
            </div>

            {/* ROW */}
            {products.map((p) => (
            <div
                key={p.id}
                className={`${gridClass} gap-[10px] items-center border-t p-3 text-center`}
            >
            {/* Ảnh */}
            <div className="flex justify-center">
            <img
                src={p.anhSanPham}
                className="w-12 h-12 object-cover rounded"
            />
            </div>

            {/* Seller */}
            <div>{p.tenSeller}</div>

            {isPending ? (
            <>
                {/* Ngày tạo */}
                <div>
                {new Date(p.ngayTao).toLocaleDateString("vi-VN")}
                </div>

                {/* Thao tác */}
                <div className="flex flex-col justify-center gap-4 text-sm font-medium">
                <span
                    className="text-green-600 cursor-pointer hover:underline"
                    onClick={() => handleQuickApprove(p.idSanPhamCoSan)}
                >
                    Duyệt nhanh
                </span>

                <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => handleDetail(p.idSanPhamCoSan)}
                >
                    Xem chi tiết
                </span>
                </div>
            </>
            ) : (
            <>
                {/* Ngày xử lý */}
                <div>
                {new Date(p.ngayXuLy || p.ngayTao).toLocaleDateString("vi-VN")}
                </div>

                {/* ID Admin */}
                <div>
                {p.adminId || "N/A"}
                </div>

                {/* Lý do */}
                <div className="truncate max-w-[200px]">
                {p.lyDo || "-"}
                </div>
            </>
            )}
        </div>
        )
        
        )}
        </div>
        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2 mt-6">

        {/* PREV */}
        <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
        >
            Prev
        </button>

        {/* PAGE NUMBERS */}
        {Array.from({ length: totalPages }, (_, i) => (
            <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
                page === i + 1
                ? "bg-[#6366F1] text-white"
                : "bg-white"
            }`}
            >
            {i + 1}
            </button>
        ))}

        {/* NEXT */}
        <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-40"
        >
            Next
        </button>

        </div>
    </div>
  );
}

function normalizeSearch(text) {
  if (!text) return "";

  return text
    .toLowerCase()                         // lowercase
    .normalize("NFD")                      // tách dấu
    .replace(/[\u0300-\u036f]/g, "")       // bỏ dấu tiếng Việt
    .replace(/đ/g, "d")                    // đ -> d
    .replace(/[^a-z0-9]/g, "")             // bỏ ký tự đặc biệt + khoảng trắng
}