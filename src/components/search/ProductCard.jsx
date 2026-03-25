import { ShoppingCart, EyeOff } from "lucide-react";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";

export default function ProductCard({ data }) {
  const [liked, setLiked] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);

  const media = data.media || [];
  
  const handleHide = () => {
    console.log("Ẩn bài:", data.id);
  };

  return (
    <div className="flex flex-col w-full max-w-[900px] mx-auto bg-white border rounded-md shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-center p-3">
        
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <img
            src={data.sellerAvatar}
            alt="seller"
            className="w-12 h-12 rounded-full object-cover"
          />

          <div className="text-sm font-medium">{data.seller}</div>

          {/* YÊU THÍCH */}
          <button
            onClick={() => setLiked(!liked)}
            className={`ml-2 px-3 py-1 text-sm rounded-md border transition ${
              liked
                ? "bg-red-100 text-red-500 border-red-300"
                : "hover:bg-[#DBEAFE]"
            }`}
          >
            {liked ? "Đã thích" : "Yêu thích"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex gap-3">
          {/* CART */}
          <button className="bg-[#2563EB] p-2 rounded-md text-white hover:opacity-90">
            <ShoppingCart size={18} />
          </button>

          {/* HIDE */}
          <button
            onClick={handleHide}
            className="border p-2 rounded-md hover:bg-red-50"
            title="Không hiển thị bài này nữa"
          >
            <EyeOff size={18} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 pb-2 text-sm text-slate-700">
        {data.content || "Nội dung bài viết ..."}
      </div>

      {/* MEDIA */}

      {/* <div className="px-4">
        {media.length === 1 && (
          <img
            src={media[0].url}
            onClick={() => setPreviewIndex(0)}
            className="w-full max-h-[600px] object-cover cursor-pointer"
          />
        )}

        {media.length === 2 && (
          <div className="grid grid-cols-2 gap-1">
            {media.map((m, i) => (
              <img
                key={i}
                src={m.url}
                onClick={() => setPreviewIndex(i)}
                className="h-[300px] w-full object-cover cursor-pointer"
              />
            ))}
          </div>
        )}

        {media.length === 3 && (
          <div className="grid grid-cols-2 gap-1">
            <img
              src={media[0].url}
              onClick={() => setPreviewIndex(0)}
              className="row-span-2 h-full object-cover cursor-pointer"
            />
            {media.slice(1).map((m, i) => (
              <img
                key={i}
                src={m.url}
                onClick={() => setPreviewIndex(i + 1)}
                className="h-[150px] object-cover cursor-pointer"
              />
            ))}
          </div>
        )}

        {media.length >= 4 && (
          <div className="grid grid-cols-2 gap-1">
            {media.slice(0, 4).map((m, i) => (
              <div key={i} className="relative">
                <img
                  src={m.url}
                  onClick={() => setPreviewIndex(i)}
                  className="h-[150px] w-full object-cover cursor-pointer"
                />

                {i === 3 && media.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-semibold">
                    +{media.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* Loi video */}
      {/* <div className="relative h-[400px]">
        {media.slice(0, 5).map((m, i) => (
          <img
            key={i}
            src={m.url}
            onClick={() => setPreviewIndex(i)}
            className="absolute w-[220px] h-[220px] object-cover rounded-md shadow-lg cursor-pointer transition hover:scale-105"
            style={{
              top: `${i * 30}px`,
              left: `${i * 40}px`,
              transform: `rotate(${(i - 2) * 5}deg)`
            }}
          />
        ))}
      </div> */}

      {/* Loi video, Tran ah ra ngoai */}
      {/* <div className="relative h-[350px] overflow-visible">
        {media.slice(0, 4).map((m, i) => (
          <img
            key={i}
            src={m.url}
            onClick={() => setPreviewIndex(i)}
            className="absolute object-cover rounded-md cursor-pointer"
            style={{
              width: "260px",
              height: "200px",
              top: `${i * 60}px`,
              left: `${i % 2 === 0 ? "-40px" : "200px"}`
            }}
          />
        ))}
      </div> */}

      {/* Nhieu anh thi dep nhung loi video - CHON*/}
      {/* <div className="relative flex justify-center items-center h-[400px]">
        
        <img
          src={media[0]?.url}
          onClick={() => setPreviewIndex(0)}
          className="w-[300px] h-[300px] object-cover rounded-lg z-10 shadow-xl"
        />

        {media.slice(1, 5).map((m, i) => (
          <img
            key={i}
            src={m.url}
            onClick={() => setPreviewIndex(i + 1)}
            className="absolute w-[120px] h-[120px] object-cover rounded-md opacity-80 hover:scale-110 transition cursor-pointer"
            style={{
              top: `${Math.random() * 300}px`,
              left: `${Math.random() * 300}px`
            }}
          />
        ))}
      </div> */}

      {/* Loi video */}
      {/* <div className="flex gap-[-40px] overflow-x-auto px-4">
        {media.map((m, i) => (
          <img
            key={i}
            src={m.url}
            onClick={() => setPreviewIndex(i)}
            className="w-[250px] h-[250px] object-cover rounded-lg shadow-md cursor-pointer transition hover:scale-105"
            style={{
              marginLeft: i === 0 ? 0 : "-60px",
              zIndex: media.length - i
            }}
          />
        ))}
      </div> */}

      {/* Loi video */}
      {/* <div className="flex gap-2">
        {media.slice(0, 3).map((m, i) => (
          <img
            key={i}
            src={m.url}
            onClick={() => setPreviewIndex(i)}
            className="w-[200px] h-[200px] object-cover cursor-pointer"
            style={{
              clipPath: i === 0
                ? "polygon(0 0, 100% 0, 80% 100%, 0% 100%)"
                : "polygon(20% 0, 100% 0, 100% 100%, 0 100%)"
            }}
          />
        ))}
      </div> */}

      <div className="flex px-4">
        {media.map((m, i) => {
          const widthPercent = 1000 / media.length;

          const commonStyle = {
            width: `${widthPercent}%`,
            marginLeft: i === 0 ? 0 : "-8%",
            zIndex: media.length - i,
            transform: `rotate(${i % 2 === 0 ? -3 : 3}deg)`
          };

          const commonClass =
            "h-[260px] object-cover rounded-lg shadow-md cursor-pointer transition-all duration-500";

          return (
            <div
              key={i}
              style={commonStyle}
              className="relative"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1) rotate(0deg)";
                e.currentTarget.style.zIndex = 999;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotate(${i % 2 === 0 ? -3 : 3}deg)`;
                e.currentTarget.style.zIndex = media.length - i;
              }}
            >
              {/* IMAGE */}
              {m.type === "image" && (
                <img
                  src={m.url}
                  onClick={() => setPreviewIndex(i)}
                  className={commonClass + " w-full"}
                />
              )}

              {/* VIDEO */}
              {m.type === "video" && (
                <video
                  src={m.url}
                  className={commonClass + " w-full"}
                  muted
                  loop
                  onClick={() => setPreviewIndex(i)}
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                />
              )}

              {/* ICON VIDEO */}
              {m.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                    ▶
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* <div className="relative">

        <div className="flex overflow-x-auto px-4">
          {media.map((m, i) => (
            <img
              key={i}
              src={m.url}
              onClick={() => setPreviewIndex(i)}
              className="w-[220px] h-[220px] object-cover rounded-lg shadow-md cursor-pointer transition"
              style={{
                marginLeft: i === 0 ? 0 : "-60px",
                zIndex: media.length - i
              }}
            />
          ))}
        </div>

        {media.slice(0, 3).map((m, i) => (
          <img
            key={"float" + i}
            src={m.url}
            className="absolute w-[80px] h-[80px] object-cover rounded-md opacity-50 pointer-events-none"
            style={{
              top: `${Math.random() * 100}px`,
              right: `${Math.random() * 100}px`,
              animation: `floaty ${4 + i}s infinite`
            }}
          />
        ))}
      </div> */}

      {previewIndex !== null && (
        <PreviewModal
          media={media}
          index={previewIndex}
          setIndex={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}

      <div className="flex flex-wrap justify-between items-center px-4 py-3 text-sm gap-4">
        
        <div>Còn: {data.stock}</div>

        <div className="text-[#2563EB] font-semibold">
          {data.price?.toLocaleString()}đ
        </div>

        <div className="text-yellow-500">
          {"⭐".repeat(data.rating || 0)}
        </div>

        <a
          href={data.certificate}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline text-sm"
        >
          Chứng nhận
        </a>
      </div>
    </div>
  );
}

function PreviewModal({ media, index, setIndex, onClose }) {

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < media.length - 1) setIndex(index + 1);
    },
    onSwipedRight: () => {
      if (index > 0) setIndex(index - 1);
    },
    trackMouse: true, // kéo chuột cũng được
  });

  // NEXT / PREV
  const next = () => {
    if (index < media.length - 1) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        {...handlers}
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGE */}
        {media[index].type === "image" && (
          <img
            key={media[index].url}
            src={media[index].url}
            className="max-h-[90vh] max-w-[90vw] object-contain transition-opacity duration-300"
          />
        )}

        {/* VIDEO */}
        {media[index].type === "video" && (
          <video
            src={media[index].url}
            controls
            autoPlay
            className="max-h-[90vh] max-w-[90vw]"
          />
        )}

        {/* NÚT TRÁI */}
        {index > 0 && (
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/50 px-3 rounded"
          >
            ‹
          </button>
        )}

        {/* NÚT PHẢI */}
        {index < media.length - 1 && (
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/50 px-3 rounded"
          >
            ›
          </button>
        )}

        {/* ĐÓNG */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl"
        >
          ✕
        </button>

        {/* SỐ ẢNH */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
          {index + 1} / {media.length}
        </div>
      </div>
    </div>
  );
}
