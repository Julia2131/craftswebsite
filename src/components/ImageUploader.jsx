import { useRef, useState } from "react";

export default function ImageUploader({ multiple = true, limit = 8, onChange }) {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);

  const handleClick = () => {
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

  return (
    <div className="grid grid-cols-5 gap-4">

      {/* IMAGE PREVIEW */}
      {images.map((img, i) => (
        <div
          key={i}
          className="relative w-full aspect-square border rounded-lg overflow-hidden"
        >
          <img
            src={img.url}
            className="w-full h-full object-cover"
          />

          {/* REMOVE BUTTON */}
          <button
            onClick={() => removeImage(i)}
            className="
              absolute top-1 right-1
              w-6 h-6
              flex items-center justify-center
              bg-red-500 text-white
              text-sm font-bold
              rounded-full
              hover:bg-red-600
              transition
            "
          >
            −
          </button>
        </div>
      ))}

      {/* UPLOAD BOX */}
      {images.length < limit && (
        <div
          onClick={handleClick}
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