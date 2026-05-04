import { useState } from "react";
import {
  Check,
  Minus,
  Plus,
  Trash2,
  Store,
} from "lucide-react";
import video from "../assets/video.mp4";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRef } from "react";
import PreviewModal from "../components/search/ProductCard";

/* ===== CHECKBOX (giữ logic, đổi UI) ===== */
const CheckboxIcon = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-5 h-5 flex items-center justify-center rounded border transition
      ${checked ? "bg-[#3B82F6] border-[#3B82F6]" : "bg-white border-gray-300"}
    `}
  >
    {checked && <Check size={14} className="text-white" />}
  </button>
);

/* ===== ICON BUTTON ===== */
const IconBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="p-1 border rounded hover:bg-gray-100 transition"
  >
    {children}
  </button>
);

export default function CartPage() {
  const [shops, setShops] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [previewMedia, setPreviewMedia] = useState([]);
  const navigate = useNavigate();
  const timeoutRef = useRef({});

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  /*LOAD CART*/
  useEffect(() => {
    if (!token) {
      alert("Vui lòng đăng nhập trước khi tạo tài khoản người bán");
      navigate("/log");
      return;
    }

    fetch(`${API}/gio-hang`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        console.log("API DATA:", data);
        setShops(data.shops || []);
      })
      .catch(() => setShops([]));
    console.log("useEffect 2");
  }, [token]);

  /*CHECK PRODUCT xác định item(sản phẩm, shop, all) nào được chọn để xử lý tiếp (tính tiền, thanh toán, xóa, …)*/ 
  const allChecked = shops.every((s) => s.checked);
  const handleAllCheck = () => {
    const newVal = !allChecked;

    setShops((prev) =>
      prev.map((shop) => ({
        ...shop,
        checked: newVal,
        products: shop.products.map((p) => ({
          ...p,
          checked: newVal,
        })),
      }))
    );
  };

  /* CALL API TO CHECK PRODUCT */
  const handleProductCheck = (shopId, cartItemId) => {
    // console.log("cartItemId: ", cartItemId);
    setShops((prev) =>
      prev.map((shop) => {
        if (shop.shopId === shopId) {
          const updated = shop.products.map((p) =>
            p.cartItemId === cartItemId
              ? { ...p, checked: !p.checked }
              : p
          );

          return {
            ...shop,
            products: updated,
            checked: updated.every((p) => p.checked),
          };
        }
        return shop;
      })
    );

    fetch(`${API}/gio-hang/${cartItemId}/check`, {
      method: "PATCH",
      headers: { Authorization: "Bearer " + token },
    });
  };

  /* CALL API TO UPDATE QUANTITY*/
  const handleQuantityChange = (shopId, cartItemId, delta) => {
    let newQuantity = 1;

    setShops((prev) =>
      prev.map((shop) => {
        if (shop.shopId === shopId) {
          return {
            ...shop,
            products: shop.products.map((p) => {
              if (p.cartItemId === cartItemId) {
                newQuantity = Math.max(1, p.quantity + delta);
                return { ...p, quantity: newQuantity };
              }
              return p;
            }),
          };
        }
        return shop;
      })
    );

    // debounce
    if (timeoutRef.current[cartItemId]) {
      clearTimeout(timeoutRef.current[cartItemId]);
    }

    timeoutRef.current[cartItemId] = setTimeout(() => {
      fetch(`${API}/gio-hang/${cartItemId}/quantity?quantity=${newQuantity}`, {
        method: "PATCH",
        headers: { Authorization: "Bearer " + token },
      });
    }, 500);
  };
  useEffect(() => {
    return () => {
      Object.values(timeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  /*DELETE*/
  const handleDelete = (cartItemId) => {
    setShops((prev) =>
      prev
        .map((shop) => ({
          ...shop,
          products: shop.products.filter(
            (p) => p.cartItemId !== cartItemId
          ),
        }))
        .filter((shop) => shop.products.length > 0) // 🔥 thêm dòng này
    );

    fetch(`${API}/gio-hang/${cartItemId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
  };

  /*TOTAL*/
  const total = shops.reduce((sum, shop) => {
    return (
      sum +
      shop.products.reduce((s, p) => {
        if (!p.checked) return s;
        return s + p.price * p.quantity;
      }, 0)
    );
  }, 0);

  // TRUYỀN SẢN PHẨM ĐÃ CHỌN QUA TRANG CREATE ORDER 
  // const handleCheckout = async () => {
  //   const selectedCartItemIds = shops.flatMap(shop =>
  //     shop.products
  //       .filter(p => p.checked)
  //       .map(p => p.cartItemId)
  //   );

  //   if (selectedCartItemIds.length === 0) {
  //     alert("Vui lòng chọn ít nhất một sản phẩm");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${API}/orders/init`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //       body: JSON.stringify({ cartItemIds: selectedCartItemIds }),
  //     });

  //     if (!response.ok) throw new Error("Khởi tạo đơn hàng thất bại");

  //     const createdOrders = await response.json();

  //     navigate("/create-order", { state: { createdOrders } });

  //   } catch (err) {
  //     alert("Lỗi: " + err.message);
  //   }
  // };
  const handleCheckout = async () => {
    const cartItemIds = shops.flatMap(s => s.products.filter(p => p.checked).map(p => p.cartItemId));
    if (cartItemIds.length === 0) return alert("Chọn sản phẩm!");
    console.log("Selected cartItemIds:", cartItemIds);

    const res = await fetch(`${API}/orders/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ cartItemIds })
    });
    
    if (res.ok) {
        const createdOrders = await res.json(); // Đây là List<ShopDTO>
        console.log("Created Orders:", createdOrders);
        navigate("/create-order", { state: { createdOrders } });
    }
  };

return (
  <div className="flex flex-col gap-6">

    {/* HEADER */}
    <div className="bg-[#EDF4FF] rounded-lg p-4 flex items-center gap-4 text-sm font-medium px-4 md:px-10">
      <CheckboxIcon checked={allChecked} onChange={handleAllCheck} />
      <div className="grid w-full" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
        <div className="flex items-center">Sản phẩm</div>
        <div className="flex items-center justify-center">Đơn giá</div>
        <div className="flex items-center justify-center">Số lượng</div>
        <div className="flex items-center justify-center">Thao tác</div>
      </div>
    </div>

    {/* EMPTY */}
    {shops.length === 0 && (
      <div className="text-center text-gray-500">Không có sản phẩm</div>
    )}

    {/* SHOPS */}
    {shops.map((shop) => (
      <div key={shop.shopId} className="bg-white rounded-xl p-4 shadow-sm">

        {/* SHOP */}
        <div className="flex items-center gap-3 mb-4 px-4 md:px-6">
          <CheckboxIcon
            checked={shop.checked}
            onChange={() => handleAllCheck()} // nếu chưa có API shop check
          />
          <Store size={18} className="text-[#2563EB]" />
          <span className="font-medium">{shop.shopName}</span>
        </div>

        {/* PRODUCTS */}
        <div className="flex flex-col gap-4 px-4 md:px-6">
          {shop.products.map((p) => (
            <div
              key={p.cartItemId}
              className="grid items-center gap-4 border-t pt-4"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
            >

              {/* LEFT */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CheckboxIcon
                    checked={p.checked}
                    onChange={() =>
                      handleProductCheck(shop.shopId, p.cartItemId)
                    }
                  />
                  <span>{p.name}</span>
                </div>

                {/* MEDIA IMAGE VIDEO */}
                {(p.cover || p.imageUrls?.length || p.videoUrls?.length) && (
                  <div className="flex px-2">
                    {[
                      ...(p.cover ? [{ type: "image", url: p.cover }] : []),
                      ...(p.imageUrls || []).map(url => ({ type: "image", url })),
                      ...(p.videoUrls || []).map(url => ({ type: "video", url })),
                    ]
                      .slice(0, 4)
                      .map((m, i) => (
                        <div
                          key={m.url}
                          className="relative mr-[-20px] hover:z-50 hover:scale-110 transition"
                          onClick={() => {
                            setPreviewMedia([
                              ...(p.cover ? [{ type: "image", url: p.cover }] : []),
                              ...(p.imageUrls || []).map(url => ({ type: "image", url })),
                              ...(p.videoUrls || []).map(url => ({ type: "video", url })),
                            ]);
                            setPreviewIndex(i);
                          }}
                        >
                          {m.type === "image" && (
                            <img
                              src={m.url}
                              className="h-[120px] w-[120px] object-cover rounded-lg shadow"
                            />
                          )}

                          {m.type === "video" && (
                            <video
                              src={m.url}
                              className="h-[120px] w-[120px] object-cover rounded-lg shadow"
                              muted
                            />
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* PRICE */}
              <div className="text-center">
                {p.price.toLocaleString()} đ
              </div>

              {/* QUANTITY */}
              <div className="flex items-center justify-center gap-2">
                <IconBtn onClick={() => handleQuantityChange(shop.shopId, p.cartItemId, -1)}>
                  <Minus size={14} />
                </IconBtn>
                <span className="px-3 py-1 border rounded">{p.quantity}</span>
                <IconBtn onClick={() => handleQuantityChange(shop.shopId, p.cartItemId, 1)}>
                  <Plus size={14} />
                </IconBtn>
              </div>

              {/* ACTION */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => handleDelete(p.cartItemId)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}

    {/* FOOTER */}
    <div className="sticky bottom-0 bg-white p-4 rounded-xl shadow flex justify-between items-center px-4 md:px-10">
      <div className="flex items-center gap-3">
        <CheckboxIcon checked={allChecked} onChange={handleAllCheck} />
        <span>Chọn tất cả</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-lg font-semibold">
          Tổng:
          <span className="text-[#2563EB] ml-2">
            {total.toLocaleString()} đ
          </span>
        </div>

        <button
          className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={handleCheckout}
        >
          Mua hàng
        </button>
      </div>
    </div>

    {/* PREVIEW */}
    {previewIndex !== null && previewMedia.length > 0 && (
      <PreviewModal
        media={previewMedia}
        index={previewIndex}
        setIndex={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    )}
  </div>
);
}