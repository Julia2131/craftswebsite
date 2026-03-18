import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import Assets
import product1 from "../assets/Product 1.png";
import product2 from "../assets/Product 2.png";
import product3 from "../assets/product 3.png";
import product4 from "../assets/Product 4.png";
import banner1 from "../assets/image 5.png";
import banner2 from "../assets/image 6.png";
import banner3 from "../assets/image 7.png";
import seller1 from "../assets/Seller 1.jpg";
import seller2 from "../assets/Seller 2.jpg";
import seller3 from "../assets/Seller 3.jpg";

export default function Home() {
  const navigate = useNavigate();

  const slides = useMemo(() => {
    const base = [product1, product2, product3, product4];
    return Array.from({ length: 10 }, (_, i) => base[i % base.length]);
  }, []);

  // ===== AUTH MODAL LOGIC (Giữ lại để dùng cho nút Đăng ký/Đăng nhập nếu cần) =====
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };
  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };
  const closeAuth = () => setAuthOpen(false);

  const goRegisterCCCD = () => {
    closeAuth();
    navigate("/register-cccd");
  };

  return (
    <div className="bg-white text-slate-900 pb-10">
      {/* PHẦN HEADER ĐÃ ĐƯỢC XÓA TẠI ĐÂY 
          VÌ ĐÃ CÓ TRONG LAYOUT.JSX 
      */}

      {/* PRODUCT SECTION */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 font-serif text-2xl">Gói Trọn Tâm Tình</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[product1, product2, product3, product4].map((src, i) => (
            <div key={i} className="overflow-hidden rounded-md bg-slate-100 group cursor-pointer">
              <img src={src} alt="product" className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* CAROUSEL */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-md bg-slate-600/80 p-6 text-white shadow-lg">
          <div className="mb-4 text-sm opacity-80">March 18, 2026 [Hôm nay]</div>
          <Fixed3CardCarousel slides={slides} />
        </div>
      </section>

      {/* DẤU ẤN ĐỘC BẢN */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Dấu Ấn Độc Bản</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[banner1, banner2, banner3].map((src, i) => (
            <div key={i} className="overflow-hidden rounded-sm bg-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <img src={src} alt="banner" className="h-20 w-full object-cover md:h-24" />
            </div>
          ))}
        </div>
      </section>

      {/* NEW SELLER */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="mb-8 font-serif text-2xl border-b pb-4">New Seller</h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {[seller1, seller2, seller3].map((src, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-52 w-52 overflow-hidden rounded-full bg-slate-100 md:h-60 md:w-60 border-4 border-white shadow-xl">
                <img src={src} alt="seller" className="h-full w-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
              <p className="mt-4 font-medium text-gray-600 italic">Nghệ nhân tiêu biểu</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHẦN FOOTER ĐÃ ĐƯỢC XÓA TẠI ĐÂY 
          VÌ ĐÃ CÓ TRONG LAYOUT.JSX 
      */}

      {/* AUTH MODAL */}
      {authOpen && (
        <AuthModal
          mode={authMode}
          onClose={closeAuth}
          onGoLogin={() => setAuthMode("login")}
          onGoRegister={() => setAuthMode("register")}
          onStartEKYCRegister={goRegisterCCCD}
        />
      )}
    </div>
  );
}

// --- CÁC COMPONENT PHỤ TRỢ (GIỮ NGUYÊN) ---

function Fixed3CardCarousel({ slides }) {
  const [active, setActive] = useState(1);
  const total = slides.length;
  const prevIndex = (active - 1 + total) % total;
  const nextIndex = (active + 1) % total;
  
  const Card = ({ src, size, onClick }) => (
    <button type="button" onClick={onClick} className="focus:outline-none transition-all duration-500" style={{ width: size, height: size }}>
      <div className="h-full w-full overflow-hidden rounded-sm bg-white/10" style={{ boxShadow: "0 0 0 4px rgba(255,255,255,0.55) inset", opacity: 0.95 }}>
        <img src={src} alt="slide" className="h-full w-full object-cover select-none" />
      </div>
    </button>
  );

  return (
    <div className="flex items-center justify-between gap-6">
      <button onClick={() => setActive(prevIndex)} className="text-4xl hover:text-blue-300 transition-colors">‹</button>
      <div className="flex flex-1 items-end justify-center gap-10 md:gap-20">
        <Card src={slides[prevIndex]} size={180} onClick={() => setActive(prevIndex)} />
        <Card src={slides[active]} size={280} onClick={() => {}} />
        <Card src={slides[nextIndex]} size={180} onClick={() => setActive(nextIndex)} />
      </div>
      <button onClick={() => setActive(nextIndex)} className="text-4xl hover:text-blue-300 transition-colors">›</button>
    </div>
  );
}

function AuthModal({ mode, onClose, onGoLogin, onGoRegister, onStartEKYCRegister }) {
  const isLogin = mode === "login";
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[720px] max-w-[92vw] bg-white px-12 py-10 shadow-2xl rounded-lg">
        <button className="absolute -right-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-xl shadow-lg" onClick={onClose}>×</button>
        <div className="flex items-start justify-between">
          <h1 className="font-serif text-4xl">{isLogin ? "Đăng nhập" : "Đăng ký"}</h1>
          <WipeButton onClick={isLogin ? onGoRegister : onGoLogin} className="px-8 py-2">{isLogin ? "Đăng ký" : "Đăng nhập"}</WipeButton>
        </div>
        <div className="mt-10 space-y-8 text-center">
          {isLogin ? (
            <WipeButton className="w-[220px] px-12 py-3 mx-auto">Đăng nhập ngay</WipeButton>
          ) : (
            <WipeButton className="w-[220px] px-12 py-3 mx-auto" onClick={onStartEKYCRegister}>Đăng ký với eKYC</WipeButton>
          )}
        </div>
      </div>
    </div>
  );
}

function WipeButton({ children, className = "", type = "button", onClick }) {
  return (
    <button type={type} onClick={onClick} className={["group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-blue-600 bg-white text-blue-600 text-sm font-medium transition-colors duration-300", className].join(" ")}>
      <span className="pointer-events-none absolute inset-0 z-0 translate-x-[-110%] group-hover:translate-x-0 bg-blue-600 transition-transform duration-500 ease-out" />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{children}</span>
    </button>
  );
}