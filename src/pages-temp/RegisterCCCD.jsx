import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../services/uploadToCloudinary";

export default function RegisterCCCD() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");     // dùng để preview trong trang
  const [avatarDataUrl, setAvatarDataUrl] = useState(""); // ✅ base64 để lưu localStorage
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [cccdInfo, setCccdInfo] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const triggerPick = () => inputRef.current?.click();

  const onPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    setAvatarDataUrl("");

    setFile(f);
    setIsConverted(false);
    setCccdInfo(null);
    setIsConverting(true);

    // preview bằng objectURL (nhẹ)
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    try {
      const imageUrl = await uploadToCloudinary(f, "cccd");

      setImageUrl(imageUrl);

      const token = localStorage.getItem("token");
      
      const API = import.meta.env.VITE_API_URL;
      
      const res = await fetch(`${API}/nguoi-dung/scan-cccd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: imageUrl
        })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();

      setCccdInfo(data);

      setIsConverted(true);

    } catch (err) {

      console.error(err);
      alert("Không thể đọc CCCD");
      setFile(null);
      setPreviewUrl("");
      setCccdInfo(null);

    } finally {

      setIsConverting(false);

    }

  };

  // dọn preview URL tránh leak (OK vì avatar dùng base64)
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canConfirm = !!cccdInfo && !isConverting;

  const onConfirm = async () => {
    if (!canConfirm) return;

    try{ 

      if (!cccdInfo) return;

      const user = {
        name: cccdInfo.hoTen,
        avatar: imageUrl,
        verified: true,
        verifiedAt: new Date().toISOString()
      };

      // localStorage.setItem("craft_user", JSON.stringify(user));

      // bắn event để Home update ngay (khỏi refresh)
      // window.dispatchEvent(new Event("craft_user_updated"));

      console.log("Ảnh CCCD đã upload:", imageUrl);
      
      // về Home
      navigate("/reset-account");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload ảnh thất bại " + err.message);
    }
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

            
            {file && !isConverting && (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4">

                {!cccdInfo ? (
                  <>
                    <div className="text-sm text-slate-700 font-medium">
                      Đang chờ đọc thông tin CCCD
                    </div>

                    <div className="mt-2 text-sm text-slate-600 leading-6">
                      Hệ thống sẽ tự động nhận diện và trích xuất các thông tin từ CCCD như:
                      Số CCCD, Họ tên, Ngày sinh, Giới tính, Địa chỉ thường trú và Ngày cấp.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-semibold text-slate-800 mb-2">
                      Thông tin nhận diện từ CCCD
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-700">
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
                  </>
                )}

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