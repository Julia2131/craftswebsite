import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../services/uploadToCloudinary";

export default function RegisterCCCD() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [cccdInfo, setCccdInfo] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const triggerPick = () => inputRef.current?.click();

  // ================= RESET =================
  const resetAll = () => {
    setFile(null);
    setPreviewUrl("");
    setImageUrl("");
    setCccdInfo(null);
    setIsConverted(false);
    setIsConverting(false);
    setErrorMsg("");

    inputRef.current.value = null;
  };

  // ================= PICK IMAGE =================
  const onPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    resetAll(); // reset sạch trước khi xử lý ảnh mới

    setFile(f);
    setIsConverting(true);

    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    try {
      const uploadedUrl = await uploadToCloudinary(f, "cccd");
      setImageUrl(uploadedUrl);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/nguoidung/scan/cccd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl: uploadedUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "OCR thất bại");
      }

      setCccdInfo(data);
      setIsConverted(true);
      setErrorMsg("");

    } catch (err) {
      console.error(err);

      // ❗ KHÔNG reset ảnh → giữ lại để user thấy ảnh lỗi
      setErrorMsg("Ảnh mờ / không đọc được CCCD. Vui lòng thử ảnh khác.");
      setCccdInfo(null);
      setIsConverted(false);

    } finally {
      setIsConverting(false);
    }
  };

  // cleanup memory leak
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canConfirm = !!cccdInfo && !isConverting;

  const onConfirm = async () => {
    if (!canConfirm) return;

    const user = {
      name: cccdInfo.cccd.hoTen,
      avatar: imageUrl,
      verified: true,
      verifiedAt: new Date().toISOString(),
    };

    console.log("Upload OK:", user);
    navigate("/reset-account");
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#f3f5f7] flex items-center justify-center p-6">
      <div className="relative w-full max-w-6xl bg-white border-4 border-blue-500 p-10">

        <button
          onClick={() => navigate("/")}
          className="absolute -right-5 top-10 w-12 h-12 rounded-full bg-blue-600 text-white text-2xl"
        >
          ×
        </button>

        <h1 className="text-center text-4xl font-serif">Đăng ký CCCD</h1>

        <div className="mt-12 grid grid-cols-2 gap-12">

          {/* LEFT IMAGE */}
          <div>
            <div className="text-lg mb-3">Ảnh CCCD</div>

            <div
              onClick={triggerPick}
              className="relative w-full h-72 bg-gray-200 cursor-pointer overflow-hidden group"
            >
              {!previewUrl ? (
                <div className="flex items-center justify-center h-full text-slate-600">
                  ⬆️ Tải ảnh lên
                </div>
              ) : (
                <>
                  <img
                    src={previewUrl}
                    className="w-full h-full object-cover"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center gap-3">

                    {/* reload icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerPick();
                      }}
                      className="bg-white px-3 py-1 rounded"
                    >
                      🔄 Đổi ảnh
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetAll();
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      🗑 Xoá
                    </button>

                  </div>
                </>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPick}
            />
          </div>

          {/* RIGHT INFO */}
          <div>
            <div className="text-lg mb-3">Thông tin CCCD</div>

            {errorMsg && (
              <div className="mb-3 text-red-600 font-medium">
                {errorMsg}
              </div>
            )}

            {file && isConverting && (
              <div className="text-slate-500">Đang xử lý OCR...</div>
            )}

            {cccdInfo && (
              <div className="grid grid-cols-2 gap-y-2 text-sm">

                <div>Số CCCD:</div>
                <div>{cccdInfo.cccd.soCCCD}</div>

                <div>Họ tên:</div>
                <div>{cccdInfo.cccd.hoTen}</div>

                <div>Ngày sinh:</div>
                <div>{cccdInfo.cccd.ngaySinh}</div>

                <div>Giới tính:</div>
                <div>{cccdInfo.cccd.gioiTinh}</div>

                <div>Địa chỉ:</div>
                <div>{cccdInfo.cccd.noiThuongTru}</div>

                <div>Ngày cấp:</div>
                <div>{cccdInfo.cccd.ngayCap}</div>

              </div>
            )}
          </div>
        </div>

        {/* ACTION */}
        <div className="mt-10 text-center">
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`px-10 py-3 rounded ${
              canConfirm
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
          >
            Xác nhận
          </button>
        </div>

      </div>
    </div>
  );
}