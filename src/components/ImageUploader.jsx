import { useRef, useState, useEffect } from "react";

// Click để dán ảnh (Ctrl + V) <br />
// Double click để chọn file
export default function ImageUploader({ multiple = true, limit = 8, onChange, value = [] }) {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const containerRef = useRef(null);

  const handleClick = () => {
    containerRef.current?.focus();
    inputRef.current.click();
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const updated = [...prev, ...newImages].slice(0, limit);

      if (onChange) {
        onChange(updated.map((img) => img.file));
      }

      return updated;
    });

    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      if (onChange) {
        onChange(updated.map((img) => img.file));
      }

      return updated;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handlePaste = (e) => {

    const items = e.clipboardData.items;
    const files = [];

    for (let item of items) {
      if (item.type.startsWith("image/")) {
        files.push(item.getAsFile());
      }
    }

    if (files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = (files) => {
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const updated = [...prev, ...newImages].slice(0, limit);

      if (onChange) {
        onChange?.(updated.map((img) => img.file));
      }

      return updated;
    });
  };

  // Trong ImageUploader.jsx
  useEffect(() => {
    if (!value || value.length === 0) {
      setImages([]);
      return;
    }

    // Chuyển đổi dữ liệu từ prop 'value' (có thể là String hoặc File) sang state hiển thị
    const formattedImages = value.map((img) => {
        if (typeof img === "string") {
          return { file: null, url: img }; // Nếu là URL từ Backend
        }
        if (img instanceof File) {
          return { file: img, url: URL.createObjectURL(img) }; // Nếu là File mới chọn
        }
        return img; // Nếu đã là object {file, url}
      });

      setImages(formattedImages);
    }, [value]);

  return (
    <div
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onPaste={handlePaste} // Lắng nghe paste tại đây
      tabIndex={0} // Bắt buộc phải có để div có thể focus
    >

      {/* IMAGE PREVIEW */}
      {images.map((img, i) => (
        <div key={i} className="relative w-full aspect-square border rounded-2xl overflow-hidden shadow-sm">
          <img
            src={img.url} // Sử dụng thuộc tính url đã được chuẩn hóa ở trên
            className="w-full h-full object-cover"
            alt="san pham"
          />
          <button
            onClick={(e) => {
              e.stopPropagation(); // Tránh kích hoạt sự kiện click của container
              removeImage(i);
            }}
            className="absolute top-2 right-2 w-6 h-6 bg-rose-500/80 text-white rounded-full"
          >
            ×
          </button>
        </div>
      ))}

      {/* UPLOAD BOX */}
      {images.length < limit && (
        <div
          onClick={() => {
            containerRef.current?.focus(); // 👈 chỉ focus thôi
          }}
          onDoubleClick={() => {
            inputRef.current.click(); // 👈 double click mới mở file
          }}
          className="
            flex flex-col items-center justify-center
            aspect-square
            border-2 border-dashed
            rounded-lg
            cursor-pointer
            hover:border-indigo-500
            text-gray-500
            hover:text-indigo-600
            transition
          "
        >
          <div className="text-3xl font-bold">+</div>

          <div className="text-sm mt-1 text-center px-2">
            Vui lòng tải ảnh lên
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}