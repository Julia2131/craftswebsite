import { useMemo, useState } from "react";

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
  // 10 sản phẩm tượng trưng (lặp từ 4 ảnh)
  const slides = useMemo(() => {
    const base = [product1, product2, product3, product4];
    return Array.from({ length: 10 }, (_, i) => base[i % base.length]);
  }, []);

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

          <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Đăng nhập
          </button>
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

      {/* CAROUSEL nền xám - BỐ CỤC CHUẨN MẪU (không loop) */}
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
                Sàn thương mại điện tử chuyên biệt cho nghệ nhân và người yêu thích sản
                phẩm mang tính chất cá nhân, mới mẻ.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <SocialIcon label="Facebook" />
                <SocialIcon label="Instagram" />
                <SocialIcon label="TikTok" />
              </div>
            </div>

            {/* Shopping */}
            <div>
              <h3 className="mb-3 font-serif text-lg text-[#c07a46]">Shopping</h3>
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
              <h3 className="mb-3 font-serif text-lg text-[#c07a46]">Newsletter</h3>
              <p className="text-sm leading-6">Nhận tin ưu đãi từ các nghệ nhân.</p>

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
    </div>
  );
}

/**
 * Fixed3CardCarousel:
 * - Layout cố định đúng mẫu: trái nhỏ (vuông) - giữa to (vuông) - phải nhỏ (vuông)
 * - Không loop, không dải dài => không bao giờ lệch bố cục
 * - Nút trái/phải đổi active; click card cũng đổi active
 * - Animation nhẹ nhàng (mượt, không giật trang)
 */
function Fixed3CardCarousel({ slides }) {
  const [active, setActive] = useState(1); // bắt đầu ở item 2 cho giống mẫu

  const total = slides.length;

  const prevIndex = (active - 1 + total) % total;
  const nextIndex = (active + 1) % total;

  // Kích thước vuông đúng style mẫu
  const SIDE = 220;
  const CENTER = 320;

  const Card = ({ src, size, isCenter, onClick }) => (
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
          transform: isCenter ? "scale(1)" : "scale(1)",
          opacity: isCenter ? 1 : 0.95,
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
      {/* arrow left */}
      <button
        onClick={goPrev}
        className="text-3xl opacity-90 hover:opacity-100 transition-opacity duration-300"
        aria-label="Prev"
        type="button"
      >
        ‹
      </button>

      {/* 3 cards layout */}
      <div className="flex flex-1 items-end justify-center gap-20">
        <Card
          src={slides[prevIndex]}
          size={SIDE}
          isCenter={false}
          onClick={goPrev}
        />

        <div className="transition-transform duration-500 ease-in-out">
          <Card
            src={slides[active]}
            size={CENTER}
            isCenter={true}
            onClick={() => {}}
          />
        </div>

        <Card
          src={slides[nextIndex]}
          size={SIDE}
          isCenter={false}
          onClick={goNext}
        />
      </div>

      {/* arrow right */}
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

// ...existing helpers...
function SocialIcon({ label }) {
  return (
    <div className="h-8 w-8 rounded-sm bg-white/10 flex items-center justify-center text-sm">
      {label[0]}
    </div>
  );
}