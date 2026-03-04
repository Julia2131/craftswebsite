import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterCCCD() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");     // dùng để preview trong trang
  const [avatarDataUrl, setAvatarDataUrl] = useState(""); // ✅ base64 để lưu localStorage
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);

  const triggerPick = () => inputRef.current?.click();

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // reset flow mỗi lần chọn ảnh mới
    setFile(f);
    setIsConverted(false);
    setAvatarDataUrl("");

    // preview bằng objectURL (nhẹ)
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    // ✅ tạo base64 để lưu user/avatar
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarDataUrl(reader.result); // base64 string
    };
    reader.readAsDataURL(f);

    // bắt đầu “convert”
    setIsConverting(true);
    setTimeout(() => {
      setIsConverting(false);
      setIsConverted(true);
    }, 2200);
  };

  // dọn preview URL tránh leak (OK vì avatar dùng base64)
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canConfirm = !!file && isConverted && !isConverting;

  const onConfirm = () => {
    if (!canConfirm) return;

    const fakeUser = {
      name: "Người dùng",
      avatar: avatarDataUrl || "", // ✅ base64
      verified: true,
      verifiedAt: new Date().toISOString(),
    };

    localStorage.setItem("craft_user", JSON.stringify(fakeUser));

    // ✅ bắn event để Home update ngay (khỏi refresh)
    window.dispatchEvent(new Event("craft_user_updated"));

    // ✅ về Home
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f3f5f7] flex items-center justify-center p-6">
      <div className="relative w-full max-w-6xl bg-white border-4 border-blue-500 p-10">
        <button
          onClick={() => navigate("/")}
          className="absolute -right-5 top-10 w-12 h-12 rounded-full bg-blue-600 text-white text-2xl flex items-center justify-center hover:bg-blue-700"
          aria-label="Close"
        >
          ×
        </button>

        <div className="text-slate-400 text-sm">Auth/eKYC-Upload-ID</div>
        <h1 className="text-center font-serif text-4xl mt-4">Đăng ký</h1>

        <div className="mt-12 grid grid-cols-2 gap-12">
          {/* LEFT */}
          <div>
            <div className="text-lg mb-3">Ảnh mặt trước căn cước công dân</div>

            <div
              onClick={triggerPick}
              className="w-full h-72 bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
              role="button"
              tabIndex={0}
              title="Bấm để tải ảnh"
            >
              {!previewUrl ? (
                <div className="text-center text-slate-700">
                  <div className="text-3xl">⬆️</div>
                  <div className="mt-2 font-medium">Tải ảnh lên</div>
                </div>
              ) : (
                <img
                  src={previewUrl}
                  alt="cccd-preview"
                  className="w-full h-full object-cover"
                />
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

          {/* RIGHT */}
          <div>
            <div className="text-lg mb-3">Thông tin trích xuất được</div>

            {!file && (
              <div className="text-sm text-slate-500">
                Vui lòng tải ảnh CCCD để hệ thống trích xuất thông tin.
              </div>
            )}

            {file && isConverting && (
              <div className="space-y-3">
                <div className="h-4 w-2/3 bg-slate-200 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-slate-200 animate-pulse rounded" />
                <div className="h-4 w-2/5 bg-slate-200 animate-pulse rounded" />
                <div className="h-4 w-4/5 bg-slate-200 animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-slate-200 animate-pulse rounded" />
                <div className="mt-4 text-xs text-slate-500">
                  Đang trích xuất dữ liệu từ ảnh (OCR)...
                </div>
              </div>
            )}

            {file && isConverted && !isConverting && (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-700 font-medium">
                  Chưa tích hợp OCR (Back-end)
                </div>
                <div className="mt-2 text-sm text-slate-600 leading-6">
                  Khi tích hợp OCR, hệ thống sẽ tự động đọc các trường như: Số
                  CCCD, Họ tên, Ngày sinh, Giới tính, Địa chỉ, Ngày cấp...
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  Demo FE hiện tại: mô phỏng upload → chuyển đổi → xác nhận.
                </div>
              </div>
            )}
          </div>
        </div>

        {file && (
          <div className="mt-10 text-center">
            <div className="font-semibold italic">
              {isConverting
                ? "Đang chuyển đổi ảnh sang dạng Vector để đối soát sinh trắc học..."
                : "Chuyển đổi hoàn tất. Bạn có thể xác nhận."}
            </div>

            {isConverting && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-600">
                <span className="inline-block w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 flex items-end justify-between gap-6">
          <p className="text-xs text-slate-600 max-w-3xl">
            Hệ thống chỉ lưu trữ tạm thời ảnh gốc CCCD trong vòng 24 giờ để phục vụ đối soát pháp lý.
            Sau thời gian này, ảnh gốc sẽ tự động bị xoá; hệ thống chỉ lưu giữ thông tin định danh và
            vector đặc trưng đã mã hoá.
          </p>

          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className={[
              "px-10 py-3 rounded-md font-semibold",
              canConfirm
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-300 text-white cursor-not-allowed opacity-70",
            ].join(" ")}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}