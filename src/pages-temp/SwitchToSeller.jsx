
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, CreditCard, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "../components/FormInput";
import provincesData from "../assets/vietnam-provinces.json";

export default function SwitchToSeller() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [step, setStep] = useState(1);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    tienNhanCong: "",
    tienThuongHieu: "",
    maSoThue: "",
    province: "",
    district: "",
    ward: "",
    cuThe: "",
    maNganHang: "",
    tenNganHang: "",
    soTaiKhoan: "",
    tenTaiKhoan: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("https://api.vietqr.io/v2/banks")
      .then(res => res.json())
      .then(data => setBanks(data.data || []))
      .catch(() => setBanks([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const selectedProvince = provincesData.find(p => p.name === form.province);
  const districts = selectedProvince?.districts || [];
  const wards = districts.find(d => d.name === form.district)?.wards || [];

  /* ===== VALIDATION giữ nguyên ===== */
  const validateStep1 = () => {
    const e = {};
    if (!/^\d+$/.test(form.tienNhanCong)) e.tienNhanCong = "Phải là số";
    if (!/^\d+$/.test(form.tienThuongHieu)) e.tienThuongHieu = "Phải là số";
    if (!/^\d{10}(\d{3})?$/.test(form.maSoThue)) e.maSoThue = "MST không hợp lệ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.province) e.province = "Chọn tỉnh";
    if (!form.district) e.district = "Chọn quận";
    if (!form.ward) e.ward = "Chọn phường";
    if (!form.cuThe) e.cuThe = "Nhập địa chỉ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.maNganHang) e.maNganHang = "Chọn ngân hàng";
    if (!/^\d{6,20}$/.test(form.soTaiKhoan)) e.soTaiKhoan = "6-20 số";
    if (form.tenTaiKhoan.length < 3) e.tenTaiKhoan = "Tên quá ngắn";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if ((step === 1 && validateStep1()) || (step === 2 && validateStep2())) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setLoading(true);

    try {
      // TODO: API địa chỉ
      // const diaChiRes = await fetch(`${API}/dia-chi`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      //   body: JSON.stringify({
      //     province: form.province,
      //     district: form.district,
      //     ward: form.ward,
      //     cuThe: form.cuThe,
      //   }),
      // });

      // const diaChi = await diaChiRes.json();

      // // TODO: API seller
      // await fetch(`${API}/thong-tin-nguoi-ban`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      //   body: JSON.stringify({
      //     tienNhanCong: Number(form.tienNhanCong),
      //     tienThuongHieu: Number(form.tienThuongHieu),
      //     maSoThue: form.maSoThue,
      //     diaChiId: diaChi.id,
      //     nganHang: {
      //       maNganHang: form.maNganHang,
      //       tenNganHang: form.tenNganHang,
      //       soTaiKhoan: form.soTaiKhoan,
      //       tenTaiKhoan: form.tenTaiKhoan,
      //     },
      //   }),
      // });

    await fetch(`${API}/thong-tin-nguoi-ban/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });

      navigate("/seller/home");
    } catch {
      alert("Lỗi tạo tài khoản");
    }

    setLoading(false);
  };

  const steps = [
    { icon: User, label: "Thông tin" },
    { icon: MapPin, label: "Kho hàng" },
    { icon: CreditCard, label: "Ngân hàng" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">

      <div className="w-full max-w-4xl p-10 rounded-3xl backdrop-blur-xl bg-white/60 shadow-xl border border-white/40">

        {/* TITLE */}
        <h2 className="text-4xl font-semibold tracking-wide mb-2 text-[#3E3E3E]">
          Trở thành Người bán
        </h2>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Một hành trình tinh tế bắt đầu từ những chi tiết nhỏ
        </p>

        {/* STEPPER */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = step >= i + 1;

            return (
              <div key={i} className="flex-1 flex items-center">
                <div className="flex flex-col items-center w-full">
                  <div className={`transition-all duration-300
                    ${active ? "text-[#C58971] drop-shadow-[0_0_6px_rgba(197,137,113,0.6)]" : "text-gray-300"}
                  `}>
                    {step > i + 1 ? <Check /> : <Icon />}
                  </div>
                  <span className="text-xs mt-2 tracking-wide">{s.label}</span>
                </div>

                {i < steps.length - 1 && (
                  <div className="h-[1px] flex-1 bg-gray-300 mx-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* CONTENT ANIMATION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35 }}
            className="grid gap-5"
          >

            {step === 1 && (
              <>
                <FormInput
                  name="tienNhanCong"
                  label="Tiền nhân công"
                  value={form.tienNhanCong}
                  onChange={handleChange}
                  error={errors.tienNhanCong}
                  icon={"₫/hour"}
                />

                <p className="text-xs italic text-gray-400">
                  Giá trị của sự tỉ mỉ là vô giá, hãy định giá công sức của bạn thật xứng đáng.
                </p>

                <FormInput
                  name="tienThuongHieu"
                  label="Tiền thương hiệu"
                  value={form.tienThuongHieu}
                  onChange={handleChange}
                  error={errors.tienThuongHieu}
                  icon={"₫/item"}
                />

                <FormInput
                  name="maSoThue"
                  label="Mã số thuế"
                  value={form.maSoThue}
                  onChange={handleChange}
                  error={errors.maSoThue}
                  placeholder="10 hoặc 13 chữ số"
                />
              </>
            )}

            {step === 2 && (
              <>
                <select name="province" onChange={handleChange} className="p-3 rounded-xl bg-white/70 border border-gray-200">
                  <option>Chọn Tỉnh</option>
                  {provincesData.map(p => <option key={p.name}>{p.name}</option>)}
                </select>

                <select name="district" onChange={handleChange} className="p-3 rounded-xl bg-white/70 border">
                  <option>Chọn Quận</option>
                  {districts.map(d => <option key={d.name}>{d.name}</option>)}
                </select>

                <select name="ward" onChange={handleChange} className="p-3 rounded-xl bg-white/70 border">
                  <option>Chọn Phường</option>
                  {wards.map(w => <option key={w.name}>{w.name}</option>)}
                </select>

                <FormInput name="cuThe" label="Địa chỉ cụ thể" value={form.cuThe} onChange={handleChange} error={errors.cuThe}/>
              </>
            )}

            {step === 3 && (
              <>
                <select
                  className="p-3 rounded-xl bg-white/70 border"
                  onChange={(e) => {
                    const bank = banks.find(b => b.code === e.target.value);
                    setForm({
                      ...form,
                      maNganHang: bank.code,
                      tenNganHang: bank.name,
                    });
                  }}
                >
                  <option>Chọn ngân hàng</option>
                  {banks.map(b => (
                    <option key={b.code} value={b.code}>
                      {b.shortName} - {b.name}
                    </option>
                  ))}
                </select>

                <FormInput 
                  name="soTaiKhoan" 
                  label="Số tài khoản" 
                  value={form.soTaiKhoan} 
                  onChange={handleChange} 
                  error={errors.soTaiKhoan}
                  type="number"
                />
                <FormInput 
                  name="tenTaiKhoan" 
                  label="Tên tài khoản" 
                  value={form.tenTaiKhoan} 
                  onChange={handleChange} 
                  error={errors.tenTaiKhoan}
                  placeholder="VIẾT HOA KHÔNG DẤU"
                />
              </>
            )}

          </motion.div>
        </AnimatePresence>

        {/* ACTION */}
        <div className="flex justify-between mt-10">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 rounded-xl bg-gray-200 hover:-translate-y-1 transition"
            >
              Quay lại
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-xl bg-[#8DA399] text-white hover:bg-[#7c9187] hover:-translate-y-1 transition shadow-md"
            >
              Tiếp tục
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl bg-[#C58971] text-white hover:bg-[#b9775f] hover:-translate-y-1 transition shadow-lg"
            >
              {loading ? "Đang xử lý..." : "Hoàn tất"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}