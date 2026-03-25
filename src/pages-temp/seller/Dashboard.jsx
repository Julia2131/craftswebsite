import { useEffect, useState } from "react";

export default function Dashboard() {

  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {

    const fetchProductCount = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          alert("Vui lòng đăng nhập trước khi tạo tài khoản người bán");
          navigate("/log");
          return;
        }

        const res = await fetch(
          `${API}/san-pham/dang-ban/count`
        , {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!res.ok) {
          throw new Error("Lỗi lấy số lượng");
        }

        const data = await res.json();

        console.log("Số sản phẩm đang bán:", data);

        setProductCount(data);

      } catch (err) {

        console.error("Lỗi khi lấy số sản phẩm:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchProductCount();

  }, []);

  return (
    <div className="min-h-screen bg-[#f3f5f7] p-6">

      {/* TITLE */}
      <h1 className="text-2xl font-semibold mb-6">
        Dashboard Seller
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        {/* Revenue */}
        <div className="bg-white p-6 rounded shadow">
          <div className="text-gray-500 text-sm">
            Doanh thu hôm nay
          </div>

          <div className="text-3xl font-bold mt-2">
            10
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded shadow">
          <div className="text-gray-500 text-sm">
            Đơn cần xử lý
          </div>

          <div className="text-3xl font-bold mt-2">
            10
          </div>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded shadow">

          <div className="text-gray-500 text-sm">
            Sản phẩm đang bán
          </div>

          <div className="text-3xl font-bold mt-2">

            {loading ? (
              <span className="text-gray-400 text-lg">
                Loading...
              </span>
            ) : (
              productCount
            )}

          </div>

        </div>

      </div>

      {/* MONEY SERVICES */}
      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-xl font-semibold mb-4">
          Dịch vụ kiếm tiền
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <button className="p-4 border rounded hover:bg-gray-100 text-left">
            Đăng sản phẩm
          </button>

          <button className="p-4 border rounded hover:bg-gray-100 text-left">
            Tạo sản phẩm đặt làm
          </button>

          <button className="p-4 border rounded hover:bg-gray-100 text-left">
            Quản lý vật liệu
          </button>

          <button className="p-4 border rounded hover:bg-gray-100 text-left">
            Tạo hợp đồng
          </button>

        </div>

      </div>

    </div>
  );
}