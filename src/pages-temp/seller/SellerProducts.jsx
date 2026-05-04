import { useEffect, useState } from "react";
import detailIcon from "../../assets/tt_chitiet.png";
import editIcon from "../../assets/tt_edit.png";
import deleteIcon from "../../assets/tt_xoa.png";
import { useNavigate } from "react-router-dom";
import arrows_up_down_circle_Icon from "../../assets/arrows_up_down_circle.png";


const tabs = ["Lưu và ẩn", "Lưu và hiện", "Đang bán", "Hết hàng", "Vi phạm"];

const columns = [
  "Ảnh sản phẩm",
  "Giá",
  "Mô tả",
  "Số lượng ban đầu",
  "Chứng chỉ",
  "Thao tác",
];

const statusMap = {
  0: "LUU_AN",
  1: "LUU_HIEN",
  2: "DANG_BAN",
  3: "HET_HANG",
  4: "VI_PHAM"
}; 

export default function SellerProducts() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [products, setProducts] = useState([]);
    const [searchInput, setSearchInput] = useState(""); // user thấy
    const [search, setSearch] = useState(""); // gửi API
    const [sort, setSort] = useState("desc");

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

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
        alert("Vui lòng đăng nhập trước khi tạo sản phẩm");
        navigate("/log");
        }
    }, []);

    const API = import.meta.env.VITE_API_URL;

    const fetchProducts = async () => {
    const status = statusMap[activeTab];

    try {
        const res = await fetch(
        `${API}/san-pham-co-san?status=${status}&search=${search}&page=${page-1}&size=10&sort=gia,${sort}`,
        {
            headers: {
            "Authorization": `Bearer ${token}`
            }
        }
        );

        if (!res.ok) {
            console.error("API error", res.status);
            setProducts([]);
            return;
        }

        const data = await res.json();

        setProducts(data.content || []);
        setTotalPages(data.totalPages || 1);

    } catch (err) {
        console.error(err);
        setProducts([]);
    }
    };

    const handleEdit = (id) => {
        navigate(`/seller/product/edit/${id}`);
    };

    const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Bạn có chắc muốn xóa sản phẩm?");
    if (!confirmDelete) return;

    try {
        const res = await fetch(`${API}/san-pham-co-san/${id}/delete`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`
        }
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
        alert(data?.error || "Xóa sản phẩm thất bại");
        return;
        }

        alert("Đã xóa sản phẩm");

        // ✅ Cách tốt hơn reload
        setProducts(prev => prev.filter(p => p.id !== id));

    } catch (err) {
        console.error(err);
        alert("Lỗi mạng hoặc server");
    }
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
            <div className="grid grid-cols-6 gap-[10px] font-bold text-center">
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
                className="grid grid-cols-6 gap-[10px] items-center border-t p-3 text-center"
            >
                <div className="flex items-center gap-2 justify-center">
                    <img src={p.image} className="w-10 h-10 object-cover" />
                    {p.loaiSanPham}
                </div>

                <div>{p.gia}</div>

                {p.moTa?.length > 30
                    ? p.moTa.substring(0, 30) + "..."
                    : p.moTa}

                <div className="text-sm">{p.soLuongBanDau}</div>

                <div>{p.chungChiId}</div>

                <div className="flex justify-center gap-3">
                <img
                    src={detailIcon}
                    className="w-5 h-5 cursor-pointer hover:scale-110 transition"
                    onClick={() => handleDetail(p.id)}
                />

                <img
                    src={editIcon}
                    className="w-5 h-5 cursor-pointer hover:scale-110 transition"
                    onClick={() => handleEdit(p.id)}
                />

                <img
                    src={deleteIcon}
                    className="w-5 h-5 cursor-pointer hover:scale-110 transition"
                    onClick={() => handleDelete(p.id)}
                />
                </div>
            </div>
            ))}
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