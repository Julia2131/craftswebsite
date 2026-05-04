import { useRef, useState, useEffect } from "react";

export default function VideoUploader({ onChange, value = [] }) {
  const inputRef = useRef(null);
  const [video, setVideo] = useState(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const newVideo = { file, url };

    setVideo(newVideo);

    if (onChange) {
      onChange([file]);
    }

    e.target.value = null;
  };

  const removeVideo = () => {
    if (video?.url) {
      URL.revokeObjectURL(video.url);
    }

    setVideo(null);

    if (onChange) {
      onChange([]);
    }

    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  // cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (video?.url) {
        URL.revokeObjectURL(video.url);
      }
    };
  }, [video]);

  // Trong VideoUploader.jsx
useEffect(() => {
  if (!value || value.length === 0) {
    setVideo(null);
    return;
  }

  const v = value[0];

  // Trường hợp 1: Dữ liệu là URL String từ Backend (khi Edit)
  if (typeof v === "string") {
    setVideo({ file: null, url: v });
    return;
  }

  // Trường hợp 2: Dữ liệu là File mới chọn từ máy tính
  if (v instanceof File) {
    const url = URL.createObjectURL(v);
    setVideo({ file: v, url });
  }
}, [value]);

  return (
    <div className="w-[240px]">

      {/* Trong phần render của VideoUploader */}
      {video ? (
        <div className="relative aspect-square w-full max-h-[300px] rounded-3xl overflow-hidden shadow-sm border border-stone-100 bg-stone-50">
          <video
            src={video.url}
            controls
            className="w-full h-full object-cover" // Giúp video lấp đầy khung mà không bị méo
          />
          <button
            onClick={removeVideo}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-white/80 backdrop-blur-md text-stone-800 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm"
          >
            ×
          </button>
        </div>
      ) : (
        // Khung upload khi trống
        <div
          onClick={handleClick}
          className="flex flex-col items-center justify-center aspect-square w-full max-h-[300px] border-2 border-dashed border-stone-200 rounded-3xl cursor-pointer hover:border-[#C58971] hover:bg-stone-50/50 transition-all group"
        >
          <div className="text-3xl text-stone-300 group-hover:scale-110 transition-transform">+</div>
          <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-2">Tải thước phim</div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleUpload}
        className="hidden"
      />

    </div>
  );
}