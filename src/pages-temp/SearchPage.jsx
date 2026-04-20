import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../components/search/SearchBar";
import Sidebar from "../components/search/Sidebar";
import ProductCard from "../components/search/ProductCard";
import seller1 from "../assets/Seller 1.jpg";
import video from "../assets/video.mp4";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [mode, setMode] = useState("available"); // available | custom
  const [products, setProducts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const keywordFromURL = queryParams.get("q") || "";

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Sync keyword từ URL → input
  useEffect(() => {
    setKeyword(keywordFromURL);
  }, [keywordFromURL]);

  // CALL API
  useEffect(() => {
    if (!keywordFromURL) return;

    fetch(`${API}/san-pham-co-san/moderation-products-user?search=${encodeURIComponent(keywordFromURL || "")}`)
      .then(res => res.json())
      .then(data => setProducts(data.content || []))
      .catch(() => setProducts([]));
  }, [keywordFromURL]);

  // HANDLE SEARCH (update URL)
  const handleSearch = (value) => {
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  // autocomplete từ products thật
  const suggestions = useMemo(() => {
    if (!keyword) return [];

    return products
      .flatMap((p) => [p.tenSeller])
      .filter((k) =>
        k?.toLowerCase().includes(keyword.toLowerCase())
      )
      .slice(0, 5);
  }, [keyword, products]);

  // GO LA SEARCH 
  useEffect(() => { 
    const timeout = setTimeout(() => {
      const normalized = keyword.trim();

      if (normalized !== keywordFromURL) {
        navigate(`/search?q=${encodeURIComponent(normalized)}`);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [keyword]);
  

  // fake data (sau này thay bằng API)
    // const products = useMemo(() => {
    // return [
    //     {
    //     id: 1,
    //     seller: "Hường Handmade",
    //     sellerAvatar: seller1,
    //     isVerified: true,

    //     content: "Vòng tay handmade làm từ đá tự nhiên, mỗi chiếc đều mang ý nghĩa riêng 💖",

    //     media: [
    //         { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
    //         { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
    //         { type: "image", url: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg"},
    //         { type: "video", url: video }, 
    //         { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
    //         { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
    //         { type: "image", url: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg"},
    //         { type: "video", url: video }, 
    //         { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
    //         { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
    //         { type: "image", url: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg"},
    //         { type: "video", url: video }, 
    //     ],

    //     price: 120000,
    //     rating: 4,
    //     stock: 5,
    //     certificate: "#",
    //     createdAt: "2026-03-20",
    //     },

    //     {
    //     id: 2,
    //     seller: "Thu Craft",
    //     sellerAvatar: seller1,

    //     content: "Túi vải thêu tay – phù hợp đi học, đi chơi 🎒",

    //     media: [
    //         { type: "image", url: "https://i.pinimg.com/1200x/26/f9/4c/26f94c54dd1a29fc33e32c50efa90581.jpg" },
    //         { type: "image", url: "https://i.pinimg.com/1200x/63/43/9a/63439aeac41bf6ea593416a56e488aa7.jpg" },
    //         { type: "video", url: video },
    //     ],

    //     price: 250000,
    //     rating: 5,
    //     stock: 2,
    //     certificate: "#",
    //     createdAt: "2026-03-18",
    //     },

    //     {
    //     id: 3,
    //     seller: "Di Studio",
    //     sellerAvatar: seller1,

    //     content: "Khung ảnh gỗ decor phòng cực chill 🌿",

    //     media: [
    //         { type: "image", url: "https://i.pinimg.com/736x/a2/65/59/a2655972679f5ff1c9080eec5282ea88.jpg"},
    //         { type: "video", url: video },
    //     ],

    //     price: 180000,
    //     rating: 3,
    //     stock: 10,
    //     certificate: "#",
    //     createdAt: "2026-03-15",
    //     },
    // ];
    // }, []);
  // autocomplete (fake)
    // const suggestions = useMemo(() => {
    // if (!keyword) return [];

    // const keywords = products.flatMap((p) => [
    //     p.seller,
    //     p.content,
    // ]);

    // return keywords
    //     .filter((k) =>
    //     k.toLowerCase().includes(keyword.toLowerCase())
    //     )
    //     .slice(0, 5);
    // }, [keyword, products]);

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
          onSearch={handleSearch} 
        />

        {/* RESULT */}
        <div className="grid grid-cols-1 gap-6">
          {products.length === 0 ? (
            <p className="text-gray-400">Không tìm thấy sản phẩm</p>
          ) : (
            products.map((p) => (
              <ProductCard key={p.id} data={p} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}