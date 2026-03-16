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
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("desc");

    const handleSort = () => {
        const newSort = sort === "desc" ? "asc" : "desc";
        setSort(newSort);
    };

    useEffect(() => {
        fetchProducts();
    }, [page, activeTab, sort]);

    const sellerid = localStorage.getItem("register_seller_id");
    if (!sellerid) {
      alert("Vui lòng đăng nhập trước khi tạo tài khoản người bán");
      navigate("/log");
      return;
    }
    const API = import.meta.env.VITE_API_URL;

    const fetchProducts = async () => {
        const status = statusMap[activeTab];

        try {
            const res = await fetch(
            `${API}/san-pham-co-san?sellerId=${sellerid}&status=${status}&page=${page}&size=10&sort=${sort}`
            );
            console.log(
            `${API}/san-pham-co-san?sellerId=${sellerid}&status=${status}&page=${page}&size=10&sort=${sort}`
            );

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

    const handleEdit = (id) => {
        navigate(`/seller/product/edit/${id}`);
    };

    const handleDelete = async (id) => {

        const res = await fetch(`${API}/san-pham-co-san/${id}/delete`, {
            method: "PUT",
        });

        if (!res.ok) {
            alert("Xóa sản phẩm thất bại");
            return;
        }

        alert("Đã xóa sản phẩm");
        window.location.reload();
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                const newSort = sort === "DESC" ? "ASC" : "DESC";
                setSort(newSort);
                fetchProducts();
                }}
            >
                Sắp xếp theo hạn gửi hàng 
                {sort === "DESC" ? "(Xa → Gần)" : "(Gần → Xa)"}

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