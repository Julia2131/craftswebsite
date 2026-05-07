import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import UploadLoading from "../components/UploadLoading";
import EmptyState from "../components/EmptyState";
import ImageUploader from "../components/ImageUploader";
import { uploadToCloudinary } from "../services/uploadToCloudinary";

// const shopAccounts = [
//   {
//     shopId: 1,
//     accountName: "TRAN THI HUONG", // bỏ dấu cho chắc
//     maNganHang: "MB",
//     accountNumber: "123456789", // dùng số thật
//     orderSummary: "Don hang 1 Vong tay, 1 Tui",
//     amount: 35000,
//   },
//   {
//     shopId: 2,
//     accountName: "TRAN THI HUONG",
//     maNganHang: "TCB", // ❗ sửa
//     accountNumber: "19074325077012",
//     orderSummary: "Don hang 1 Ao, 1 Coc",
//     amount: 35000,
//   },
// ];

// const defaultAmount = 100000;
// const defaultNote = "Thanh toán đơn hàng";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeShopId, setActiveShopId] = useState(null);
  const [shopAccounts, setShopAccounts] = useState([]);
  const location = useLocation();

  // LẤY SẢN PHẨM ĐƯỢC CHỌN TỪ TRANG CREATE ORDER QUA NAVIGATE STATE
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;
  const paymentInfo = location.state?.paymentInfo || [];

  useEffect(() => {
    if (paymentInfo.length > 0) {
      setShopAccounts(paymentInfo);
    }
  }, [paymentInfo]);

  const handleFileChange = (orderId, file) => {
    setUploadedImages((prev) => ({ ...prev, [orderId]: file }));
  };

  const handlePayment = async () => {
    const isAllUploaded =
      shopAccounts.every(
        (shop) => uploadedImages[shop.orderId]
      );

    if (!isAllUploaded) {
      alert("Vui lòng upload ảnh cho tất cả shop!");
      return;
    }

    setLoading(true);

    try {
      const uploads = await Promise.all(
        Object.entries(uploadedImages).map(async ([orderId, file]) => {
          const url =
            typeof file === "string"
              ? file
              : await uploadToCloudinary(file, "payment-proof");

          return {
            orderId: Number(orderId),
            imageUrl: url
          };
        })
      );

      await fetch(`${API}/orders/payment/upload-proof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(uploads)
      });

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // Kiểm tra xem đã upload đủ ảnh cho tất cả shop chưa
  const isAllUploaded =
  shopAccounts.length > 0 &&
  shopAccounts.every(
    (shop) => uploadedImages[shop.orderId]
  );

  return (
    <>
        {!showSuccess && (
            <div className="max-w-5xl mx-auto p-6 space-y-6 relative">
              {shopAccounts.map((shop) => (
                <div
                  key={shop.shopId}
                  className="border rounded-xl shadow-sm p-5 flex flex-col gap-4"
                >
                  {/* HEADER */}
                  <div className="font-semibold text-lg text-gray-800">
                    Thanh toán cho shop #{shop.shopName}
                  </div>

                  {/* BODY */}
                  <div className="flex gap-6 items-start">

                    {/* QR */}
                    <div className="flex flex-col items-center">
                      <img
                        src={`https://img.vietqr.io/image/${shop.maNganHang}-${shop.accountNumber}-compact.png?amount=${shop.amount}&addInfo=${encodeURIComponent(shop.orderSummary)}`}
                        alt="QR"
                        className="w-[160px] h-[160px] border rounded-lg"
                      />
                      <span className="text-xs text-gray-500 mt-2 text-center">
                        Quét mã để thanh toán
                      </span>
                    </div>

                    {/* INFO */}
                    <div className="flex flex-col gap-2 flex-1 text-sm">
                      <div>
                        <span className="text-gray-500">Ngân hàng:</span>{" "}
                        <b>{shop.bankName}</b>
                      </div>

                      <div>
                        <span className="text-gray-500">Số tài khoản:</span>{" "}
                        <b>{shop.accountNumber}</b>
                      </div>

                      <div>
                        <span className="text-gray-500">Chủ tài khoản:</span>{" "}
                        <b>{shop.accountName}</b>
                      </div>

                      <div>
                        <span className="text-gray-500">Nội dung:</span>{" "}
                        <span className="italic">{shop.orderSummary}</span>
                      </div>

                      <div className="text-lg font-bold text-blue-600 mt-2">
                        {shop.amount?.toLocaleString?.() ?? 0} đ
                      </div>
                    </div>

                    {/* UPLOAD */}
                    <div className="w-[180px]">

                      {uploadedImages[shop.orderId] ? (
                        <div className="w-[180px]">
                          <img
                            src={
                              typeof uploadedImages[shop.orderId] === "string"
                                ? uploadedImages[shop.orderId]
                                : URL.createObjectURL(uploadedImages[shop.orderId])
                            }
                            className="w-full h-[180px] object-cover rounded-lg border"
                          />
                        </div>
                        ) : (
                          <div className="w-[180px]">
                            <div className="text-sm mb-2 font-medium">
                              Ảnh xác nhận
                            </div>

                            <ImageUploader
                              multiple={false}
                              limit={1}
                              onChange={(files) =>
                                handleFileChange(shop.orderId, files?.[0] || null)
                              }
                            />
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                  <button
                    onClick={handlePayment}
                    disabled={!isAllUploaded}
                    className={`px-6 py-2 rounded-lg transition text-white
                      ${isAllUploaded
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Thanh toán
                  </button>
              </div>
            </div>
        )}
        {/* Overlay loading */}
        {loading && (
            <UploadLoading
            progress={progress}
            title="Đang tạo đơn hàng..."
            description="Vui lòng chờ trong giây lát"
            />
        )}

        {/* Khi thanh toán xong */}
        {showSuccess && (
            <EmptyState
                illustration="✅"
                title="Đơn hàng đã tạo thành công!"
                description="Seller đã nhận đơn hàng của bạn. Hãy chờ xác nhận từ seller."
                primaryActionText="Về trang chủ"
                onPrimaryAction={() => navigate("/")}
            />
        )}
    </>
  );
}