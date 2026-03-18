import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle, Clock, Truck } from "lucide-react";

export default function PaymentQR() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, processing, success
  const [timer, setTimer] = useState(20);

  // Xử lý tải ảnh
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  // Bắt đầu đếm ngược khi ở trạng thái processing
  useEffect(() => {
    let interval;
    if (status === "processing" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setStatus("success");
    }
    return () => clearInterval(interval);
  }, [status, timer]);

  const handleConfirm = () => {
    setStatus("processing");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl border text-center">
        
        {/* TRẠNG THÁI 1: ĐANG TẢI ẢNH / QUÉT MÃ */}
        {status === "idle" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-bold text-gray-800">Quét mã QR để thanh toán</h2>
            <div className="relative inline-block border-4 border-blue-50 p-2 rounded-xl">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=example" className="w-56 h-56" alt="qr"/>
            </div>
            <div className="text-red-500 text-2xl font-black">280.000 VND</div>

            <div className="border-t pt-6 text-left">
              <p className="text-sm font-medium text-gray-700 mb-4 text-center">Tải ảnh minh chứng đã thanh toán:</p>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-48 cursor-pointer hover:bg-gray-50 transition-all relative overflow-hidden">
                {image ? (
                  <img src={image} className="w-full h-full object-cover" alt="preview" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Upload size={32} strokeWidth={1.5} className="mb-2" />
                    <span className="text-xs font-sans">Nhấn để chọn ảnh</span>
                  </div>
                )}
                <input type="file" className="hidden" onChange={handleUpload} />
              </label>
            </div>

            {/* HIỆN NÚT XÁC NHẬN KHI ĐÃ CÓ ẢNH */}
            {image && (
              <button 
                onClick={handleConfirm}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 animate-in slide-in-from-bottom-2"
              >
                Xác nhận đã chuyển khoản
              </button>
            )}
          </div>
        )}

        {/* TRẠNG THÁI 2: ĐANG XỬ LÝ (20 GIÂY) */}
        {status === "processing" && (
          <div className="py-10 space-y-6 animate-in zoom-in duration-500 text-center">
            <div className="relative w-24 h-24 mx-auto">
                <Clock className="w-24 h-24 text-blue-500 animate-spin-slow" strokeWidth={1} />
                <span className="absolute inset-0 flex items-center justify-center font-bold text-blue-600">{timer}s</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Đang xử lý ...</h2>
            <p className="text-gray-500 text-sm">Hệ thống đang kiểm tra giao dịch của bạn.<br/>Vui lòng đợi trong giây lát.</p>
            <button 
                onClick={() => setStatus("idle")}
                className="px-6 py-2 border rounded-full text-sm text-gray-400 hover:bg-gray-50 transition-all"
            >
                Trở lại
            </button>
          </div>
        )}

        {/* TRẠNG THÁI 3: THÀNH CÔNG */}
        {status === "success" && (
          <div className="py-10 space-y-6 animate-in bounce-in duration-700 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={50} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Thanh toán thành công!</h2>
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 text-left">
              <Truck className="text-green-600 shrink-0" />
              <p className="text-sm text-green-700 font-medium font-sans">Đơn hàng đã được xác nhận. Chúng tôi sẽ sớm giao hàng đến bạn!</p>
            </div>
            <button 
              onClick={() => navigate("/orders")}
              className="w-full bg-gray-900 text-white py-3 rounded-md font-bold hover:bg-black transition-all shadow-lg"
            >
              Xem đơn hàng của tôi
            </button>
          </div>
        )}

      </div>
    </div>
  );
}