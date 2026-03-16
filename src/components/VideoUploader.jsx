import { useRef, useState, useEffect } from "react";

export default function VideoUploader({ onChange }) {
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

    // reset input để có thể upload lại cùng file
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

  return (
    <div className="w-[240px]">

      {video ? (
        <div className="relative aspect-square border rounded-lg overflow-hidden">

          <video
            src={video.url}
            controls
            className="w-full h-full object-cover"
          />

          <button
            onClick={removeVideo}
            className="
              absolute top-1 right-1
              w-6 h-6
              flex items-center justify-center
              bg-red-500 text-white
              rounded-full
              hover:bg-red-600
            "
          >
            −
          </button>

        </div>
      ) : (
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
            Tải video lên
          </div>
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