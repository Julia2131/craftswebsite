import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import UploadLoading from "../components/UploadLoading";
import EmptyState from "../components/EmptyState";


const shopAccounts = [
  {
    id: 1,
    name: "TRẦN THỊ HƯỜNG",
    bankName: "MB BANK",
    accountNumber: "0988753730",
    orderSummary: "Đơn hàng gồm 1 Vòng tay đá, 1 Túi thêu tay của Hường Handmade",
  },
  {
    id: 2,
    name: "TRẦN THỊ HƯỜNG",
    bankName: "TECHCOMBANK",
    accountNumber: "1907 4325 0770 12",
    orderSummary: "Đơn hàng gồm 1 Áo thun, 1 Cốc của MadisonEmiliaDesigns",
  },
];

const defaultAmount = 100000;
const defaultNote = "Thanh toán đơn hàng";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (shopId, file) => {
    setUploadedImages((prev) => ({ ...prev, [shopId]: file }));
  };

  const handlePayment = () => {
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          setShowSuccess(true); // hiện overlay success
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  return (
    <>
        {!showSuccess && (
            <div className="max-w-5xl mx-auto p-6 space-y-6 relative">
            {shopAccounts.map((shop) => (
                <div
                key={shop.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border p-4 rounded-lg"
                >
                <div className="flex flex-col items-start gap-2">
                    <QRCodeCanvas
                    value={`${shop.bankName}|${shop.accountNumber}|${shop.name}|${defaultAmount}|${defaultNote}`}
                    size={128}
                    />
                    <span className="text-sm font-medium">{shop.bankName}</span>
                    <span className="text-xs text-gray-500">{shop.accountNumber}</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                    {uploadedImages[shop.id] ? (
                    <img
                        src={URL.createObjectURL(uploadedImages[shop.id])}
                        alt="Uploaded"
                        className="w-32 h-32 object-cover rounded-md border shadow-sm"
                    />
                    ) : (
                    <div className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-md text-gray-400 bg-gray-50">
                        Chưa tải ảnh
                    </div>
                    )}
                    <label className="cursor-pointer px-4 py-2 text-blue-600 rounded-md hover:bg-blue-200 transition text-sm">
                    Chọn ảnh
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(shop.id, e.target.files[0])}
                        className="hidden"
                    />
                    </label>
                </div>
                </div>
            ))}

            <div className="flex justify-end">
                <button
                onClick={handlePayment}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
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
                primaryActionText="Quay về danh sách đơn hàng"
                onPrimaryAction={() => navigate("/orders")}
            />
        )}
    </>
  );
}