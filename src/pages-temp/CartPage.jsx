import { useState } from "react";
import {
  Check,
  Minus,
  Plus,
  Trash2,
  Store,
} from "lucide-react";
import video from "../assets/video.mp4";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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

/* ===== FAKE DATA giữ nguyên ===== */
// const initialShops = [
//   {
//     id: 1,
//     name: "MadisonEmiliaDesigns",
//     checked: true,
//     products: [
//       {
//         id: 101,
//         name: "Áo thun",
//         price: 200000,
//         quantity: 1,
//         checked: true,
//         image: "https://via.placeholder.com/150",
//       },
//       {
//         id: 102,
//         name: "Cốc",
//         price: 75000,
//         quantity: 1,
//         checked: true,
//         image: "https://via.placeholder.com/150",
//       },
//     ],
//   },
// ];

const initialShops = [
  {
    id: 1,
    name: "Hường Handmade",
    checked: true,
    products: [
      {
        id: 101,
        name: "Vòng tay đá",
        price: 120000,
        quantity: 1,
        checked: true,
        media: [
            { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
            { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
            { type: "image", url: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg"},
            { type: "video", url: video }, 
            { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
            { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
            { type: "image", url: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg"},
            { type: "video", url: video }, 
            { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
            { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
            { type: "image", url: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg"},
            { type: "video", url: video }, 
        ],
      },
      {
        id: 102,
        name: "Túi thêu tay",
        price: 250000,
        quantity: 1,
        checked: true,
        media: [
          { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
          { type: "video", url: video },
        ],
      },
    ],
  },
];

export default function CartPage() {
  const [shops, setShops] = useState(initialShops);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [previewMedia, setPreviewMedia] = useState([]);
  const allChecked = shops.every((s) => s.checked);
  const navigate = useNavigate();

  // ===== LOGIC CHECKBOX =====
  const handleAllCheck = () => {
    const newVal = !allChecked;
    setShops((prev) =>
      prev.map((shop) => ({
        ...shop,
        checked: newVal,
        products: shop.products.map((p) => ({ ...p, checked: newVal })),
      }))
    );
  };

  const handleShopCheck = (shopId) => {
    setShops((prev) =>
      prev.map((shop) => {
        if (shop.id === shopId) {
          const newVal = !shop.checked;
          return {
            ...shop,
            checked: newVal,
            products: shop.products.map((p) => ({
              ...p,
              checked: newVal,
            })),
          };
        }
        return shop;
      })
    );
  };

  const handleProductCheck = (shopId, productId) => {
    setShops((prev) =>
      prev.map((shop) => {
        if (shop.id === shopId) {
          const updatedProducts = shop.products.map((p) =>
            p.id === productId ? { ...p, checked: !p.checked } : p
          );
          return {
            ...shop,
            products: updatedProducts,
            checked: updatedProducts.every((p) => p.checked),
          };
        }
        return shop;
      })
    );
  };

  const handleQuantityChange = (shopId, productId, delta) => {
    setShops((prev) =>
      prev.map((shop) => {
        if (shop.id === shopId) {
          return {
            ...shop,
            products: shop.products.map((p) =>
              p.id === productId ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
            ),
          };
        }
        return shop;
      })
    );
  };

  const handleDelete = (shopId, productId) => {
    setShops((prev) =>
      prev.map((shop) => ({
        ...shop,
        products: shop.products.filter((p) => p.id !== productId),
      }))
    );
  };

  const total = shops.reduce((sum, shop) => {
    return (
      sum +
      shop.products.reduce((s, p) => {
        if (!p.checked) return s;
        return s + p.price * p.quantity;
      }, 0)
    );
  }, 0);

  // ===== COMMON STYLE CHO MEDIA =====
  const commonClass = "h-[150px] object-cover rounded-lg shadow-md cursor-pointer transition-all duration-500";

  const commonStyle = (i, len) => ({
    width: `${100 / len}%`,
    marginLeft: i === 0 ? 0 : "-8%",
    zIndex: len - i,
    transform: `rotate(${i % 2 === 0 ? -3 : 3}deg)`,
  });

  return (
    <div className="flex flex-col gap-6">
        {/* HEADER */}
        <div className="bg-[#EDF4FF] rounded-lg p-4 flex items-center gap-4 text-sm font-medium px-4 md:px-10">
        <CheckboxIcon checked={allChecked} onChange={handleAllCheck} />
        <div className="grid w-full" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
            <div className="flex items-center justify-start h-12 px-2">Sản phẩm</div>
            <div className="flex items-center justify-center h-12 px-2">Đơn giá</div>
            <div className="flex items-center justify-center h-12 px-2">Số lượng</div>
            <div className="flex items-center justify-center h-12 px-2">Thao tác</div>
        </div>
        </div>

        {/* SHOPS */}
        {shops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-xl p-4">

                {/* SHOP */}
                <div className="flex items-center gap-3 mb-4 px-4 md:px-6">
                    <CheckboxIcon
                    checked={shop.checked}
                    onChange={() => handleShopCheck(shop.id)}
                    />
                    <Store size={18} className="text-[#2563EB]" />
                    <span className="font-medium">{shop.name}</span>
                </div>

                {/* PRODUCTS */}
                <div className="flex flex-col gap-4 px-4 md:px-6">
                    {shop.products.map((p) => (
                        <div key={p.id} className="grid items-center gap-4 border-t pt-4" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>

                        {/* LEFT: NAME + MEDIA */}
                        <div className="justify-start flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <CheckboxIcon checked={p.checked} onChange={() => handleProductCheck(shop.id, p.id)} />
                                <span>{p.name}</span>
                            </div>

                            <div className="flex px-2">
                                {p.media.slice(0, 4).map((m, i) => (
                                <div
                                    key={i}
                                    style={commonStyle(i, p.media.slice(0, 4).length)}
                                    className="relative"
                                    onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.1) rotate(0deg)";
                                    e.currentTarget.style.zIndex = 999;
                                    }}
                                    onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = `rotate(${i % 2 === 0 ? -3 : 3}deg)`;
                                    e.currentTarget.style.zIndex = p.media.slice(0, 4).length - i;
                                    }}
                                    onClick={() => {
                                    setPreviewMedia(p.media);
                                    setPreviewIndex(i);
                                    }}
                                >
                                    {m.type === "image" && (
                                    <img src={m.url} className={commonClass + " w-full"} />
                                    )}
                                    {m.type === "video" && (
                                    <>
                                        <video
                                        src={m.url}
                                        className={commonClass + " w-full"}
                                        muted
                                        loop
                                        onMouseEnter={(e) => e.currentTarget.play()}
                                        onMouseLeave={(e) => e.currentTarget.pause()}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">▶</div>
                                        </div>
                                    </>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>

                        {/* PRICE */}
                        <div className="flex items-center justify-center">
                            {p.price.toLocaleString()} đ
                        </div>

                        {/* QUANTITY */}
                        <div className="flex items-center justify-center gap-2">
                            <IconBtn onClick={() => handleQuantityChange(shop.id, p.id, -1)}><Minus size={14} /></IconBtn>
                            <span className="px-3 py-1 border rounded">{p.quantity}</span>
                            <IconBtn onClick={() => handleQuantityChange(shop.id, p.id, 1)}><Plus size={14} /></IconBtn>
                        </div>

                        {/* ACTION */}
                        <div className="flex items-center justify-center">
                            <button
                                onClick={() => handleDelete(shop.id, p.id)}
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
                Tổng: <span className="text-[#2563EB] ml-2">{total.toLocaleString()} đ</span>
            </div>

            <button 
              className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate("/create-order")} 
            >
                Mua hàng
            </button>
            </div>
        </div>

        {/* PREVIEW MODAL */}
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