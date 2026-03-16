import React from "react";

export default function UploadLoading({
  progress = 0,
  title = "Đang xử lý...",
  description = "Vui lòng chờ trong giây lát",
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="
        bg-white
        w-[420px]
        rounded-xl
        shadow-xl
        p-8
        text-center
        flex flex-col gap-6
      ">

        {/* ICON */}
        <div className="text-5xl">🎨</div>

        {/* TITLE */}
        <div className="text-xl font-semibold">
          {title}
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full">

          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />

          </div>

          <div className="text-sm text-gray-500 mt-2">
            {progress}%
          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="text-gray-500 text-sm">
          {description}
        </div>

      </div>

    </div>
  );
}


  // const [loading, setLoading] = useState(false);
  // const [progress, setProgress] = useState(0);

  // Them vao muc lon nhat cua return 
  //   {loading && (
  //   <UploadLoading
  //     progress={progress}
  //     title="Đang tạo sản phẩm handmade..."
  //     description="Đang tải hình ảnh và video lên hệ thống"
  //   />
  // )}

  // setLoading(true);
  // setProgress(20);
  // them vao ham chay khi nhan nut 
  