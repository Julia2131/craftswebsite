import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/Hero.png";
import searchIcon from "../assets/Icon.png";

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

import footerBg from "../assets/Footer-background.jpg";

export default function Home() {
  const navigate = useNavigate();

  const slides = useMemo(() => {
    const base = [product1, product2, product3, product4];
    return Array.from({ length: 10 }, (_, i) => base[i % base.length]);
  }, []);

  // ===== AUTH MODAL =====
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

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

  // ===== USER STATE (fake login from localStorage) =====
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("craft_user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("craft_user")) || null);
      } catch {
        setUser(null);
      }
    };

    // sync ngay khi vào Home
    syncUser();

    // thay đổi từ tab khác
    window.addEventListener("storage", syncUser);

    // ✅ thay đổi ngay sau khi confirm CCCD (cùng tab)
    window.addEventListener("craft_user_updated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("craft_user_updated", syncUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("craft_user");
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center gap-4">
          <img src={logo} alt="logo" className="h-10 object-contain" />

          <div className="flex flex-1 items-center rounded-md border border-slate-300 px-3 py-2">
            <input
              className="w-full outline-none placeholder:text-slate-400"
              placeholder="Nội dung tìm kiếm ..."
            />
            <img src={searchIcon} alt="search" className="ml-2 h-5 w-5" />
          </div>

          {/* ✅ Nếu đã xác thực -> hiện avatar, nếu chưa -> hiện nút đăng nhập */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm text-slate-500">
                      U
                    </div>
                  )}
                </div>

                <div className="leading-tight">
                  <div className="text-sm font-medium text-slate-800">
                    {user.name || "Người dùng"}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-[2px]",
                        user.verified
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200",
                      ].join(" ")}
                    >
                      {user.verified ? "Đã xác thực eKYC" : "Chưa xác thực"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openLogin}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </header>

      {/* PRODUCT SECTION */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 font-serif text-2xl">Gói Trọn Tâm Tình</h2>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[product1, product2, product3, product4].map((src, i) => (
            <div key={i} className="overflow-hidden rounded-md bg-slate-100">
              <img
                src={src}
                alt={`product-${i + 1}`}
                className="h-52 w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CAROUSEL */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-md bg-slate-600/80 p-6 text-white">
          <div className="mb-4 text-sm opacity-80">Month Day, Year [Today]</div>
          <Fixed3CardCarousel slides={slides} />
        </div>
      </section>

      {/* DẤU ẤN ĐỘC BẢN */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 font-serif text-2xl">Dấu Ấn Độc Bản</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[banner1, banner2, banner3].map((src, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-sm bg-slate-100 shadow-sm"
            >
              <img
                src={src}
                alt={`banner-${i + 1}`}
                className="h-16 w-full object-cover md:h-20"
              />
            </div>
          ))}
        </div>
      </section>

      {/* NEW SELLER */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="mb-8 font-serif text-2xl">New Seller</h2>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {[seller1, seller2, seller3].map((src, i) => (
            <div key={i} className="flex justify-center">
              <div className="h-52 w-52 overflow-hidden rounded-full bg-slate-100 md:h-60 md:w-60">
                <img
                  src={src}
                  alt={`seller-${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-4">
        <div
          className="mx-auto max-w-6xl overflow-hidden rounded-sm px-6 py-10 md:px-10"
          style={{
            backgroundImage: `url(${footerBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="grid grid-cols-1 gap-10 text-[#b06b3b] md:grid-cols-4">
            {/* Info */}
            <div>
              <h3 className="mb-3 font-serif text-lg text-[#c07a46]">Info</h3>
              <p className="text-sm leading-6">
                Sàn thương mại điện tử chuyên biệt cho nghệ nhân và người yêu
                thích sản phẩm mang tính chất cá nhân, mới mẻ.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <SocialIcon label="Facebook" />
                <SocialIcon label="Instagram" />
                <SocialIcon label="TikTok" />
              </div>
            </div>

            {/* Shopping */}
            <div>
              <h3 className="mb-3 font-serif text-lg text-[#c07a46]">
                Shopping
              </h3>
              <ul className="space-y-2 text-sm leading-6">
                <li>Đồ Decor &amp; Nội thất</li>
                <li>Trang sức thủ công</li>
                <li>Quà tặng &amp; Phụ kiện</li>
                <li>Sản phẩm bán chạy</li>
                <li>Nghệ nhân tiêu biểu (Sellers).</li>
              </ul>
            </div>

            {/* Trust */}
            <div>
              <h3 className="mb-3 font-serif text-lg text-[#c07a46]">Trust</h3>
              <ul className="space-y-2 text-sm leading-6">
                <li>Chính sách bảo mật (eKYC &amp; CCD).</li>
                <li>Quy trình giải quyết khiếu nại (Dispute).</li>
                <li>Chính sách vận chuyển &amp; Kiểm hàng.</li>
                <li>Hướng dẫn xác thực ví điện tử.</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="mb-3 font-serif text-lg text-[#c07a46]">
                Newsletter
              </h3>
              <p className="text-sm leading-6">
                Nhận tin ưu đãi từ các nghệ nhân.
              </p>

              <button
                type="button"
                className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c07a46]/40 text-2xl text-[#c07a46] hover:bg-white/40 transition"
                aria-label="Add"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </footer>

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

/** Carousel giữ nguyên */
function Fixed3CardCarousel({ slides }) {
  const [active, setActive] = useState(1);
  const total = slides.length;
  const prevIndex = (active - 1 + total) % total;
  const nextIndex = (active + 1) % total;

  const SIDE = 220;
  const CENTER = 320;

  const Card = ({ src, size, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="focus:outline-none"
      style={{ width: size, height: size }}
      title="Click để chọn"
    >
      <div
        className="h-full w-full overflow-hidden rounded-sm bg-white/10 transition-transform duration-500 ease-in-out"
        style={{
          boxShadow: "0 0 0 4px rgba(255,255,255,0.55) inset",
          opacity: 0.95,
        }}
      >
        <img
          src={src}
          alt="slide"
          className="h-full w-full object-cover select-none"
          draggable={false}
        />
      </div>
    </button>
  );

  const goPrev = () => setActive(prevIndex);
  const goNext = () => setActive(nextIndex);

  return (
    <div className="flex items-center justify-between gap-6">
      <button
        onClick={goPrev}
        className="text-3xl opacity-90 hover:opacity-100 transition-opacity duration-300"
        aria-label="Prev"
        type="button"
      >
        ‹
      </button>

      <div className="flex flex-1 items-end justify-center gap-20">
        <Card src={slides[prevIndex]} size={SIDE} onClick={goPrev} />

        <button
          type="button"
          onClick={() => {}}
          className="focus:outline-none"
          style={{ width: CENTER, height: CENTER }}
          title="Active"
        >
          <div
            className="h-full w-full overflow-hidden rounded-sm bg-white/10 transition-transform duration-500 ease-in-out"
            style={{
              boxShadow: "0 0 0 4px rgba(255,255,255,0.55) inset",
              opacity: 1,
            }}
          >
            <img
              src={slides[active]}
              alt="active-slide"
              className="h-full w-full object-cover select-none"
              draggable={false}
            />
          </div>
        </button>

        <Card src={slides[nextIndex]} size={SIDE} onClick={goNext} />
      </div>

      <button
        onClick={goNext}
        className="text-3xl opacity-90 hover:opacity-100 transition-opacity duration-300"
        aria-label="Next"
        type="button"
      >
        ›
      </button>
    </div>
  );
}

function SocialIcon({ label }) {
  return (
    <div
      className="h-8 w-8 rounded-sm bg-white/10 flex items-center justify-center text-sm"
      title={label}
      aria-label={label}
    >
      {label[0]}
    </div>
  );
}

/** AuthModal: thêm action đi sang trang CCCD */
function AuthModal({
  mode,
  onClose,
  onGoLogin,
  onGoRegister,
  onStartEKYCRegister,
}) {
  const isLogin = mode === "login";
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close overlay"
      />

      <div className="relative z-10 w-[720px] max-w-[92vw] bg-white px-12 py-10 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-8 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-2xl hover:bg-blue-700"
          aria-label="Close"
        >
          ×
        </button>

        <div className="flex items-start justify-between">
          <h1 className="font-serif text-4xl">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </h1>

          {isLogin ? (
            <WipeButton onClick={onGoRegister} className="px-8 py-2">
              Đăng ký
            </WipeButton>
          ) : (
            <WipeButton onClick={onGoLogin} className="px-8 py-2">
              Đăng nhập
            </WipeButton>
          )}
        </div>

        <div className="mt-10 space-y-8">
          {isLogin ? (
            <>
              <div>
                <label className="mb-3 block font-serif text-lg">Họ và tên</label>
                <input
                  className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="mb-3 block font-serif text-lg">Mật khẩu</label>
                <div className="relative">
                  <input
                    className="w-full rounded-md border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
                    type={showPass ? "text" : "password"}
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
                    aria-label="Toggle password"
                    title="Hiện/ẩn mật khẩu"
                  >
                    👁
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="font-serif text-lg hover:underline"
                  type="button"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <div className="flex flex-col items-center gap-4 pt-2">
                <WipeButton className="w-[220px] px-12 py-3">
                  Đăng nhập
                </WipeButton>

                <div className="text-sm text-slate-500">Hoặc</div>

                <WipeButton className="w-[220px] px-12 py-3">
                  Đăng nhập bằng eKYC
                </WipeButton>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="mb-3 block font-serif text-lg">
                  Số điện thoại
                </label>
                <input
                  className="w-full rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="0*********"
                />
              </div>

              <p className="text-sm text-slate-600">
                Bằng việc nhấn vào nút Đăng ký là bạn đồng ý với{" "}
                <span className="underline cursor-pointer">Điều khoản</span> sử
                dụng và{" "}
                <span className="underline cursor-pointer">chính sách</span>{" "}
                bảo mật của chúng tôi
              </p>

              <div className="flex justify-end pt-2">
                <WipeButton
                  className="w-[220px] px-12 py-3"
                  onClick={onStartEKYCRegister}
                >
                  Đăng ký
                </WipeButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function WipeButton({ children, className = "", type = "button", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        "group relative inline-flex items-center justify-center",
        "overflow-hidden rounded-md border border-blue-600",
        "bg-white text-blue-600",
        "text-sm font-medium",
        "transition-colors duration-300 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none absolute inset-0 z-0",
          "translate-x-[-110%] group-hover:translate-x-0",
          "bg-blue-600",
          "transition-transform duration-500 ease-out",
        ].join(" ")}
      />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
    </button>
  );
}