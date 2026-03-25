import { useState, useEffect } from "react";
import video from "../assets/video.mp4";
import { useNavigate } from "react-router-dom";

// FAKE DATA: có thể thay bằng API fetch()
const fakeOrdersAPI = () => Promise.resolve([
  {
    id: 1,
    shopName: "Hường Handmade",
    avatar: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg",
    shippingFee: 15000,
    messageToShop: "Giao hàng sớm nếu được",
    products: [
      {
        id: 101,
        name: "Vòng tay đá",
        price: 120000,
        quantity: 1,
        media: [
          { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
          { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
          { type: "video", url: video }, 
        ],
      },
      {
        id: 102,
        name: "Túi thêu tay",
        price: 250000,
        quantity: 1,
        media: [
          { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
        ],
      },
    ],
  },
    {
    id: 2,
    shopName: "Hường Handmade",
    avatar: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg",
    shippingFee: 15000,
    messageToShop: "Giao hàng sớm nếu được",
    products: [
      {
        id: 101,
        name: "Vòng tay đá",
        price: 120000,
        quantity: 1,
        media: [
          { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
          { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
        ],
      },
      {
        id: 102,
        name: "Túi thêu tay",
        price: 250000,
        quantity: 1,
        media: [
          { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
        ],
      },
    ],
  },
]);

// FAKE ADDRESS API
const fakeAddressAPI = () =>
  Promise.resolve({
    fullName: "Nguyễn Văn A",
    phone: "0988 123 234",
    street: "Đường 23",
    commune: "Xã Mê Linh",
    district: "Huyện Mê Linh",
    city: "Hồ Chí Minh",
  },
  {
      fullName: "Nguyễn Văn A",
      phone: "0988 123 234",
      street: "Đường 23",
      commune: "Xã Mê Linh",
      district: "Huyện Mê Linh",
      city: "Hồ Chí Minh",
    },
);

export default function CreateOrder() {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shopMessage, setShopMessage] = useState(fakeOrdersAPI.messageToShop || "");
  const [address, setAddress] = useState(null);
  const navigate = useNavigate();

  // load orders
  useEffect(() => {
    fakeOrdersAPI().then((data) => {
      setOrders(data);
      const total = data.reduce(
        (sum, shop) =>
          sum +
          shop.products.reduce((s, p) => s + p.price * p.quantity, 0) +
          shop.shippingFee,
        0
      );
      setTotalAmount(total);
    });

    // load address từ API
    fakeAddressAPI().then((data) => setAddress(data));
  }, []);

  // hàm xử lý input thay đổi
  const handleMessageChange = (value) => {
    setShopMessage(value);
    // nếu muốn gọi API ngay khi nhập cũng được, ví dụ auto-save
    // callApiUpdateMessage(value);
  };

  // hàm submit khi nhấn Enter hoặc nút gửi
  const submitMessage = async () => {
    try {
      // gọi API lưu message
      await callApiUpdateMessage(shop.id, shopMessage);
      console.log("Lời nhắn đã được lưu!");
    } catch (err) {
      console.error("Lưu lời nhắn thất bại:", err);
    }
  };

  // ví dụ API giả lập
  const callApiUpdateMessage = async (shopId, message) => {
    // fetch/post tới API của bạn
    // return fetch(`/api/shop/${shopId}/message`, { method: 'POST', body: JSON.stringify({ message }) })
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  // load data từ API/fake DB
  useEffect(() => {
    fakeOrdersAPI().then((data) => {
      setOrders(data);

      const total = data.reduce(
        (sum, shop) =>
          sum +
          shop.products.reduce((s, p) => s + p.price * p.quantity, 0) +
          shop.shippingFee,
        0
      );
      setTotalAmount(total);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      {/* Địa chỉ nhận hàng */}
      <div className="bg-[#EDF4FF] rounded-xl shadow p-4 px-4 md:px-10">
        <h2 className="text-xl font-semibold mb-4">Địa chỉ nhận hàng</h2>
        {address ? (
          <div className="space-y-4">
            {/* Nếu muốn hiển thị nhiều địa chỉ, map addresses */}
            {[address].map((item, idx) => (
              <div key={idx} className="flex justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800 uppercase">{item.fullName}</span>
                    <span className="text-gray-400 border-l pl-3">{item.phone}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {item.city}, {item.district}, {item.commune}, {item.street}
                  </p>
                  {/* Mặc định */}
                  <span className="inline-block mt-1 text-[10px] text-red-500 border border-red-500 px-1.5 py-0.5 rounded-sm font-bold">
                    MẶC ĐỊNH
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2 text-sm text-blue-600">
                  <button className="hover:underline">Cập nhật</button>
                  {/* Nếu không phải mặc định thì hiển thị xóa */}
                  {/* <button className="hover:underline text-gray-400">Xóa</button> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Đang tải địa chỉ...</p>
        )}
      </div>

      {/* Từng shop */}
      {orders.map((shop) => (
        <div key={shop.id} className="bg-white rounded-xl shadow p-4 px-4 md:px-10">
          <div className="flex items-center gap-3 mb-4">
            <img src={shop.avatar} alt="shop" className="w-10 h-10 rounded-full" />
            <h3 className="font-medium">{shop.shopName}</h3>
          </div>
          {/* Sản phẩm */}
          <div className="flex flex-col gap-3 border-t pt-2">
            {shop.products.map((p) => (
              <div 
                key={p.id} 
                className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-4 py-2"
              >
                <div className="flex gap-3 items-center">
                  {/* Hiển thị media tối đa 3 */}
                  <div className="flex overflow-x-auto px-2">
                    {p.media.slice(0, 3).map((m, i) => {
                      const isVideo = m.type === "video"; // giả sử mỗi media có field type: "image" | "video"
                      return isVideo ? (
                        <video
                          key={i}
                          src={m.url}
                          className="w-[80px] h-[80px] object-cover rounded-lg shadow-md cursor-pointer transition"
                          style={{
                            marginLeft: i === 0 ? 0 : "-30px",
                            zIndex: p.media.slice(0, 3).length - i,
                          }}
                          controls
                        />
                      ) : (
                        <img
                          key={i}
                          src={m.url}
                          alt={p.name}
                          className="w-[80px] h-[80px] object-cover rounded-lg shadow-md cursor-pointer transition"
                          style={{
                            marginLeft: i === 0 ? 0 : "-30px",
                            zIndex: p.media.slice(0, 3).length - i,
                          }}
                        />
                      );
                    })}
                  </div>
                  {/* Tên sản phẩm */}
                  <span className="ml-2">{p.name}</span>
                </div>
                <span>{p.price.toLocaleString()} đ</span>
                <span>{p.quantity}</span>
                <span>{(p.price * p.quantity).toLocaleString()} đ</span>
              </div>
            ))}
          </div>
          {/* Thông tin phí ship và message */}
          <div className="flex justify-between mt-3 border-t pt-2 items-center">
            {/* Phí ship */}
            <span>Phí ship: {shop.shippingFee.toLocaleString()} đ</span>

            {/* Input lời nhắn */}
            <div className="flex-1 flex items-center border rounded-md px-3 py-1 bg-white ml-4">
              <input
                value={shopMessage}
                onChange={(e) => handleMessageChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitMessage(); // gọi API
                  }
                }}
                className="w-full outline-none text-sm placeholder-gray-400"
                placeholder="Nhập lời nhắn cho shop ..."
              />
            </div>
          </div>
          {/* Tổng tiền shop */}
          <div className="flex justify-end mt-2 font-semibold">
            Tổng shop:{" "}
            {(
              shop.products.reduce((s, p) => s + p.price * p.quantity, 0) +
              shop.shippingFee
            ).toLocaleString()}{" "}
            đ
          </div>
        </div>
      ))}

      <div className="bg-[#EDF4FF] rounded-xl shadow p-4 px-4 md:px-10">
        {/* Tổng thanh toán */}
        <div className="flex justify-end font-bold text-lg px-4 md:px-10">
          Tổng thanh toán: {totalAmount.toLocaleString()} đ
        </div>

        {/* Button mua hàng */}
        <div className="flex justify-end mt-4 px-4 md:px-10">
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            onClick={() => navigate("/payment-page")}   
          >
            Mua hàng
          </button>
        </div>
        </div>
      </div>
  );
}