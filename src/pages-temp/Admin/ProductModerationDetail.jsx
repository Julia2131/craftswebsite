import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Image, Video, Package, DollarSign, Ruler, FileText } from "lucide-react";

const sections = [
  { id: "media", label: "Media", icon: Image },
  { id: "info", label: "Thông tin", icon: Package },
  { id: "size", label: "Kích thước", icon: Ruler },
  { id: "description", label: "Mô tả", icon: FileText },
];

export const ProductModerationDetail = () => {
  const API = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const sectionRefs = useRef({});
  const reasonRef = useRef(null);

  const [active, setActive] = useState("media");

  const [images, setImages] = useState([]);
  const [cover, setCover] = useState(null);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reason, setReason] = useState("");

  const [form, setForm] = useState({});

  // ===== FETCH =====
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`${API}/san-pham-co-san/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();

      setForm({
        description: data.moTa,
        price: data.gia,
        weight: data.canNang,
        quantity: data.soLuongBanDau,
        soGioLamViecUocTinh: data.sanPham?.soGioLamViecUocTinh,
        size: {
          length: data.chieuDai,
          width: data.chieuRong,
          height: data.chieuCao
        }
      });

      const links = data.sanPham?.anhVideos?.map(v => v.link) || [];

      const imageLinks = links.filter(l => l.match(/\.(jpg|png|jpeg|webp)$/i));
      const videoLinks = links.filter(l => l.match(/\.(mp4|mov|webm)$/i));

      setImages(imageLinks);
      setVideos(videoLinks);
      setCover(imageLinks[0]);
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    fetch(`${API}/danh-muc`)
      .then(res => res.json())
      .then(setCategories);
  }, []);

  // ===== SCROLL ACTIVE =====
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.3 }
    );

    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // ===== ACTION =====
  const shake = () => {
    reasonRef.current.classList.add("animate-shake");
    setTimeout(() => reasonRef.current.classList.remove("animate-shake"), 500);
  };

  const handleApprove = async () => {
    if (!reason.trim()) return shake();

    await fetch(`${API}/nhat-ky-kiem-toan/approve/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(reason)
    });

    navigate("/admin/content-moderation", { state: { tab: 1 } });
  };

  const handleViolation = async () => {
    if (!reason.trim()) return shake();

    await fetch(`${API}/nhat-ky-kiem-toan/violation/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(reason)
    });

    navigate("/admin/content-moderation", { state: { tab: 2 } });
  };

  return (
    <div className="bg-[#FDFBF7] text-[#2f2f2f] flex px-24 py-12 gap-16">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-48 sticky top-24 h-fit">
        {sections.map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => sectionRefs.current[s.id]?.scrollIntoView({ behavior: "smooth" })}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition
                ${active === s.id ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-black"}`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {s.label}
            </button>
          );
        })}
      </aside>

      {/* ===== CONTENT ===== */}
      <div className="flex-1 space-y-24">

        {/* MEDIA */}
        <motion.section
          id="media"
          ref={el => sectionRefs.current["media"] = el}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-serif text-2xl mb-6">Media</h2>

          {/* COVER */}
          {cover && (
            <img src={cover} className="rounded-3xl mb-6 shadow-lg w-full max-h-[400px] object-cover" />
          )}

          {/* GRID */}
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, i) => (
              <img key={i} src={img} className="aspect-square object-cover rounded-2xl hover:scale-105 transition" />
            ))}
          </div>
        </motion.section>

        {/* INFO */}
        <motion.section
          id="info"
          ref={el => sectionRefs.current["info"] = el}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-serif text-2xl mb-6">Thông tin</h2>

          <div className="grid grid-cols-3 gap-6">
            <InfoCard label="Giá" value={form.price} />
            <InfoCard label="Số lượng" value={form.quantity} />
            <InfoCard label="Cân nặng" value={form.weight} />
          </div>
        </motion.section>

        {/* SIZE */}
        <motion.section
          id="size"
          ref={el => sectionRefs.current["size"] = el}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-serif text-2xl mb-6">Kích thước</h2>

          <div className="grid grid-cols-3 gap-6">
            <InfoCard label="Dài" value={form.size?.length} />
            <InfoCard label="Rộng" value={form.size?.width} />
            <InfoCard label="Cao" value={form.size?.height} />
          </div>
        </motion.section>

        {/* DESCRIPTION */}
        <motion.section
          id="description"
          ref={el => sectionRefs.current["description"] = el}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-serif text-2xl mb-6">Câu chuyện</h2>

          <div className="bg-stone-50 p-8 rounded-2xl leading-relaxed text-gray-700">
            {form.description}
          </div>
        </motion.section>

        {/* ACTION */}
        <div className="pt-10 border-t">
          <textarea
            ref={reasonRef}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do kiểm duyệt..."
            className="w-full p-6 rounded-2xl bg-stone-50 outline-none border"
          />

          <div className="flex justify-center gap-6 mt-8">
            <button onClick={() => navigate(-1)} className="px-8 py-3 rounded-full bg-stone-200">
              Quay lại
            </button>

            <button onClick={handleApprove} className="px-10 py-3 rounded-full bg-emerald-500 text-white shadow">
              Duyệt
            </button>

            <button onClick={handleViolation} className="px-10 py-3 rounded-full bg-rose-500 text-white shadow">
              Vi phạm
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-stone-50 p-6 rounded-2xl border">
    <p className="text-xs uppercase text-gray-400">{label}</p>
    <p className="text-lg font-semibold mt-2">{value || "-"}</p>
  </div>
);