import { useState, useMemo } from "react";
import video from "../assets/video.mp4";
import SearchBar from "../components/search/SearchBar";
import Sidebar from "../components/search/Sidebar";
import ProductCard from "../components/search/ProductCard";
import seller1 from "../assets/Seller 1.jpg";
import { useLocation } from "react-router-dom";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [mode, setMode] = useState("available"); // available | custom

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keywordFromURL = queryParams.get("q") || "";

  // fake data (sau này thay bằng API)
    const products = useMemo(() => {
    return [
        {
        id: 1,
        seller: "Hường Handmade",
        sellerAvatar: seller1,
        isVerified: true,

        content: "Vòng tay handmade làm từ đá tự nhiên, mỗi chiếc đều mang ý nghĩa riêng 💖",

        media: [
            { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
            { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
            { type: "image", url: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg"},
            { type: "video", url: video }, 
            { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
            { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
            { type: "image", url: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg"},
            { type: "video", url: video }, 
            { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
            { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
            { type: "image", url: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg"},
            { type: "video", url: video }, 
        ],

        price: 120000,
        rating: 4,
        stock: 5,
        certificate: "#",
        createdAt: "2026-03-20",
        },

        {
        id: 2,
        seller: "Thu Craft",
        sellerAvatar: seller1,

        content: "Túi vải thêu tay – phù hợp đi học, đi chơi 🎒",

        media: [
            { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
            { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
            { type: "video", url: video },
        ],

        price: 250000,
        rating: 5,
        stock: 2,
        certificate: "#",
        createdAt: "2026-03-18",
        },

        {
        id: 3,
        seller: "Di Studio",
        sellerAvatar: seller1,

        content: "Khung ảnh gỗ decor phòng cực chill 🌿",

        media: [
            { type: "image", url: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg"},
            { type: "video", url: video },
        ],

        price: 180000,
        rating: 3,
        stock: 10,
        certificate: "#",
        createdAt: "2026-03-15",
        },
    ];
    }, []);

  // autocomplete (fake)
    const suggestions = useMemo(() => {
    if (!keyword) return [];

    const keywords = products.flatMap((p) => [
        p.seller,
        p.content,
    ]);

    return keywords
        .filter((k) =>
        k.toLowerCase().includes(keyword.toLowerCase())
        )
        .slice(0, 5);
    }, [keyword, products]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR FILTER */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex flex-col gap-6 p-6">
        <SearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            suggestions={suggestions}
            mode={mode}
            setMode={setMode}
        />

        {/* RESULT */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} data={p} />
          ))}
        </div>
      </div>
    </div>
  );
}