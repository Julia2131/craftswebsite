function SearchBar({ keyword, setKeyword, suggestions, mode, setMode }) {
  return (
    <div className="flex flex-col gap-3">
      {/* <div className="relative">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm sản phẩm, vật liệu..."
          className="w-full border border-slate-300 px-4 py-3 rounded-md focus:border-[#2563EB] outline-none"
        />

        {suggestions.length > 0 && (
          <div className="absolute w-full bg-white border mt-1 rounded-md shadow">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => setKeyword(s)}
                className="px-4 py-2 hover:bg-[#DBEAFE] cursor-pointer"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* TOGGLE */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("available")}
          className={`px-4 py-2 rounded-md border ${
            mode === "available"
              ? "bg-[#2563EB] text-white"
              : "bg-white text-slate-700"
          }`}
        >
          Hàng có sẵn
        </button>

        <button
          onClick={() => setMode("custom")}
          className={`px-4 py-2 rounded-md border ${
            mode === "custom"
              ? "bg-[#2563EB] text-white"
              : "bg-white text-slate-700"
          }`}
        >
          Đặt làm theo mẫu
        </button>
      </div>
    </div>
  );
}

export default SearchBar;