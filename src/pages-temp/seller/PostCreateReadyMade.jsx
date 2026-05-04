import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, FileText, Banknote, Truck, Check } from "lucide-react";
import { uploadToCloudinary } from "../../services/uploadToCloudinary";
import UploadLoading from "../../components/UploadLoading";
import ImageUploader from "../../components/ImageUploader";
import VideoUploader from "../../components/VideoUploader";

const STEPS = [
  { id: 1, label: "Hình ảnh", icon: Camera },
  { id: 2, label: "Mô tả", icon: FileText },
  { id: 3, label: "Tài chính", icon: Banknote },
  { id: 4, label: "Vận chuyển", icon: Truck },
];
 
export const PostCreateReadyMade = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    giaGoc: "",
    weight: "",
    quantity: "",
    soGioLamViecUocTinh: "",
    categoryId: "",
    length: "",
    width: "",
    height: "",
    images: [], // Danh sách File hoặc URL cũ
    cover: null, // File hoặc URL cũ
    videos: [], // Danh sách File hoặc URL cũ
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(`${API}/danh-muc`).then(res => res.json()).then(setCategories);

    if (isEdit && token) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`${API}/san-pham-co-san/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          
          // Tách link ảnh và video từ API
          const links = data.sanPham?.anhVideos?.map(v => v.link) || [];
          const images = links.filter(l => l.match(/\.(jpg|jpeg|png|webp)$/i));
          const videos = links.filter(l => l.match(/\.(mp4|mov|webm)$/i));

          setForm({
            name: data.sanPham?.ten || "",
            description: data.moTa || "",
            price: data.gia || "",
            giaGoc: data.giaGoc || "",
            weight: data.canNang || "",
            quantity: data.soLuongBanDau || "",
            soGioLamViecUocTinh: data.sanPham?.soGioLamViecUocTinh || "",
            categoryId: data.sanPham?.danhMuc?.id || "",
            length: data.chieuDai || "",
            width: data.chieuRong || "",
            height: data.chieuCao || "",
            // Đổ trực tiếp mảng String vào để Component Uploader hiển thị
            images: images, 
            videos: videos,
            cover: images[0] || null,
          });
        } catch (err) {
          console.error("Lỗi lấy dữ liệu edit:", err);
        }
      };
      fetchProduct();
    }
  }, [id, token]);

  const validateStep = () => {
    let newErrors = {};
    if (step === 1 && !form.cover) newErrors.cover = "Nàng ơi, hãy chọn một tấm ảnh bìa thật xinh nhé!";
    if (step === 2) {
      if (!form.name || form.name.trim().length < 3) newErrors.name = "Nàng ơi, đặt tên cho tác phẩm nhé (ít nhất 3 ký tự).";
      if (!form.description || form.description.length < 10) newErrors.description = "Nàng kể thêm câu chuyện sản phẩm nhé (ít nhất 10 ký tự).";
      if (!form.categoryId) newErrors.categoryId = "Nàng chọn một danh mục phù hợp nha.";
    }
    if (step === 3) {
      if (!form.price || form.price <= 0) newErrors.price = "Nàng đừng quên điền giá sản phẩm nhé!";
      if (!form.quantity || form.quantity <= 0) newErrors.quantity = "Nàng ơi, sản phẩm này hiện có bao nhiêu món nhỉ?";
    }
    if (step === 4) {
      if (!form.weight) newErrors.weight = "Cân nặng giúp tính phí ship chính xác hơn đó.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep()) setStep(s => s + 1); };

  const handleSubmit = async (trangThai) => {
    setLoading(true);
    setProgress(20);

    try {
      // Hàm xử lý upload: Nếu là string (URL cũ) thì giữ nguyên, nếu là File thì upload mới
      const uploadHandler = async (files) => {
        const arr = Array.isArray(files) ? files : [files];
        return Promise.all(
          arr.filter(f => f).map(file => 
            typeof file === "string" ? file : uploadToCloudinary(file, "san-pham")
          )
        );
      };

      const coverUrls = await uploadHandler(form.cover);
      const imageUrls = await uploadHandler(form.images);
      const videoUrls = await uploadHandler(form.videos);

      setProgress(70);

      const payload = {
        ten: form.name,
        moTa: form.description,
        gia: Number(form.price),
        giaGoc: Number(form.giaGoc),
        canNang: Number(form.weight),
        chieuDai: Number(form.length),
        chieuRong: Number(form.width),
        chieuCao: Number(form.height),
        soLuongBanDau: Number(form.quantity),
        soLuongHienTai: Number(form.quantity),
        danhMucId: Number(form.categoryId),
        soGioLamViecUocTinh: Number(form.soGioLamViecUocTinh),
        // mediaLinks: [...coverUrls, ...imageUrls, ...videoUrls],
        coverUrls: coverUrls?.[0] || null, // anh bia là ảnh đầu tiên trong mảng coverUrls
        imageUrls: imageUrls,
        videoUrls: videoUrls,
        trangThaiSanPham: trangThai,
        trangThaiSPCS: trangThai,
        trangThaiChungChi: trangThai
      };

      // in ra payload trước khi gửi để debug
      console.log("Payload gửi đi:", payload);

      const url = isEdit ? `${API}/san-pham-co-san/${id}` : `${API}/san-pham-co-san`;
      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      setProgress(100);
      navigate(isEdit ? "/seller/product/all" : "/seller/product/success");
    } catch (err) {
      alert("Nàng ơi, có lỗi nhỏ xảy ra rồi!");
      console.error("Lỗi khi tạo/sửa sản phẩm:", err);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#333] font-light">
      {loading && <UploadLoading progress={progress} title="Đang thổi hồn vào sản phẩm..." />}

      <div className="max-w-4xl mx-auto pt-16 pb-24 px-6">
        {/* STEPPER - Luxury Terracotta Style */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif mb-8 text-[#3E3E3E]">{isEdit ? "Cập nhật tác phẩm" : "Tạo tác phẩm mới"}</h1>
          
          {/* DEBUG VIEW - Hường dùng cái này để xem link ảnh thực tế */}
{/* {isEdit && (
  <div className="mb-6 p-4 bg-stone-100 rounded-xl text-[10px] font-mono overflow-auto max-h-40 border border-stone-200">
    <p className="font-bold text-stone-500 mb-1">🔍 DEBUG: Dữ liệu từ Backend trả về React:</p>
    <pre>{JSON.stringify(form.images, null, 2)}</pre>
    <p className="mt-2 font-bold text-stone-500">🖼️ Link Cover hiện tại: {typeof form.cover === 'string' ? form.cover : 'Là File/Null'}</p>
  </div>
)} */}

          <div className="flex justify-between items-center relative max-w-md mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-stone-200 -z-10" />
            {STEPS.map((s) => {
              const Icon = s.icon;
              const active = step >= s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500
                    ${active ? "bg-[#C58971] border-[#C58971] text-white shadow-lg" : "bg-white border-stone-200 text-stone-300"}`}>
                    {step > s.id ? <Check size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest ${step === s.id ? "text-[#C58971] font-bold" : "text-stone-400"}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN FORM */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-white/50 min-h-[500px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-serif border-b pb-4">Hình ảnh & Thước phim</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1">
                      <label className="text-xs font-semibold text-stone-400 mb-2 block uppercase tracking-tighter">Ảnh bìa đại diện</label>
                      <div className="aspect-square rounded-2xl overflow-hidden shadow-inner">
                         <ImageUploader 
                            multiple={false} 
                            value={form.cover ? (Array.isArray(form.cover) ? form.cover : [form.cover]) : []} 
                            onChange={(files) => setForm({...form, cover: files[0]})} 
                         />
                      </div>
                      {errors.cover && <p className="text-rose-400 text-[10px] mt-2 italic">{errors.cover}</p>}
                    </div>
                    <div className="col-span-3">
                      <label className="text-xs font-semibold text-stone-400 mb-2 block uppercase tracking-tighter">Album chi tiết</label>
                      <ImageUploader multiple limit={8} value={form.images} onChange={(f) => setForm({...form, images: f})} />
                    </div>
                  </div>
                  <div className="max-w-xs">
                    <label className="text-xs font-semibold text-stone-400 mb-2 block uppercase tracking-tighter">Video giới thiệu</label>
                    <VideoUploader value={form.videos} onChange={(v) => setForm({...form, videos: v})} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-serif border-b pb-4">Kể về câu chuyện tác phẩm</h3>
                  <div className="space-y-2">
                    <input
                      className="w-full p-5 rounded-2xl border bg-stone-50/50 outline-none focus:border-[#C58971] transition-all"
                      value={form.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm(prev => ({ ...prev, name: value }));
                        if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                      }}
                      placeholder="Tên tác phẩm của Nàng..."
                    />
                    {errors.name && (
                      <p className="text-rose-400 text-xs italic">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <textarea
                      className={`w-full p-6 rounded-2xl border ${errors.description ? "border-rose-300" : "border-stone-100"} bg-stone-50/50 outline-none focus:border-[#C58971] min-h-[180px] transition-all`}
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                      placeholder="Nàng hãy chia sẻ về chất liệu, cảm hứng thiết kế..."
                    />
                    {errors.description && <p className="text-rose-400 text-xs italic">{errors.description}</p>}
                  </div>
                  <div className="max-w-sm">
                    <label className="text-xs font-semibold text-stone-400 mb-2 block uppercase tracking-tighter">Danh mục sản phẩm</label>
                    <select
                      className="w-full p-4 rounded-xl border-none bg-stone-100 text-sm outline-none focus:ring-1 focus:ring-[#C58971]"
                      value={form.categoryId}
                      onChange={(e) => setForm({...form, categoryId: e.target.value})}
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.ten}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-serif border-b pb-4">Định giá & Công sức</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <LuxuryInput label="Giá bán (₫)" name="price" value={form.price} onChange={setForm} error={errors.price} />
                    <LuxuryInput label="Số lượng hiện có" name="quantity" value={form.quantity} onChange={setForm} error={errors.quantity} />
                  </div>
                  <div className="max-w-xs">
                    <LuxuryInput label="Công sức (Phút)" name="soGioLamViecUocTinh" value={form.soGioLamViecUocTinh} onChange={setForm} />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-serif border-b pb-4">Đóng gói & Vận chuyển</h3>
                  <div className="max-w-xs">
                    <LuxuryInput label="Cân nặng (kg)" name="weight" value={form.weight} onChange={setForm} error={errors.weight} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <LuxuryInput label="Dài (cm)" name="length" value={form.length} onChange={setForm} />
                    <LuxuryInput label="Rộng (cm)" name="width" value={form.width} onChange={setForm} />
                    <LuxuryInput label="Cao (cm)" name="height" value={form.height} onChange={setForm} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ACTIONS */}
          <div className="flex justify-between mt-12">
            <button onClick={step === 1 ? () => navigate(-1) : () => setStep(s => s - 1)} className="text-stone-400 hover:text-stone-600 font-medium">
              {step === 1 ? "Hủy bỏ" : "Quay lại"}
            </button>
            <div className="flex gap-4">
              {step < 4 ? (
                <button onClick={handleNext} className="px-10 py-3 rounded-full bg-stone-800 text-white hover:bg-black transition shadow-lg">Tiếp theo</button>
              ) : (
                <>
                  <button onClick={() => handleSubmit("LUU_AN")} className="px-8 py-3 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50">Lưu nháp</button>
                  <button onClick={() => handleSubmit("LUU_HIEN")} className="px-10 py-3 rounded-full bg-[#C58971] text-white shadow-lg hover:shadow-orange-200">Đăng bán</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LuxuryInput = ({ label, name, value, onChange, error, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">{label}</label>
    <input
      className={`w-full p-4 rounded-xl bg-stone-50 border ${error ? "border-rose-300" : "border-transparent"} focus:bg-white focus:border-[#C58971] transition-all outline-none text-sm`}
      value={value}
      placeholder={placeholder || "..."}
      onChange={(e) => onChange(prev => ({...prev, [name]: e.target.value}))}
      type="number"
    />
    {error && <p className="text-rose-400 text-[10px] italic">{error}</p>}
  </div>
);