import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function SDT() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const canSubmit = /^0\d{9}$/.test(phone);

  const API = import.meta.env.VITE_API_URL;
  
    
  const XIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const handleRegister = async () => {
    if (!canSubmit) return;

    const res = await fetch(`${API}/nguoi-dung/create/sdt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sdt: phone
      })
    });

    const data = await res.json();

    // lưu id user
    localStorage.setItem("register_user_id", data.id);

    navigate("/register-cccd");

  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // chỉ cho nhập số
    if (!/^\d*$/.test(value)) return;

    setPhone(value);

    if (value.length === 0) {
      setError("");
    } else if (!/^0\d{9}$/.test(value)) {
      setError("Số điện thoại phải gồm 10 số và bắt đầu bằng 0");
    } else {
      setError("");
    }
  };
  
return (

  <div className="flex flex-col items-center gap-6">

    <h2 className="text-2xl font-bold">
      Thiết lập thông tin người bán
    </h2>

    {/* tiền nhân công */}
    <div className="flex flex-col w-[480px] items-start gap-[5px]">

      <label className="flex items-center gap-2.5 p-2.5 cursor-pointer">
        <span className="text-xl text-color-text-main">
          Tiền nhân công
        </span>
      </label>

      <div className="relative w-full">
        <input
          name="tienNhanCong"
          value={form.tienNhanCong}
          onChange={handleChange}
          placeholder="VD: 100.000 VND / giờ"
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />
      </div>

      {errors.tienNhanCong && (
        <p className="text-red-500 text-sm mt-1">
          {errors.tienNhanCong}
        </p>
      )}

    </div>


    {/* tiền thương hiệu */}
    <div className="flex flex-col w-[480px] items-start gap-[5px]">

      <label className="flex items-center gap-2.5 p-2.5 cursor-pointer">
        <span className="text-xl text-color-text-main">
          Tiền thương hiệu
        </span>
      </label>

      <div className="relative w-full">
        <input
          name="tienThuongHieu"
          value={form.tienThuongHieu}
          onChange={handleChange}
          placeholder="VD: 50.000 VND / sản phẩm"
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />
      </div>

      {errors.tienThuongHieu && (
        <p className="text-red-500 text-sm mt-1">
          {errors.tienThuongHieu}
        </p>
      )}

    </div>


    {/* mã số thuế */}
    <div className="flex flex-col w-[480px] items-start gap-[5px]">

      <label className="flex items-center gap-2.5 p-2.5 cursor-pointer">
        <span className="text-xl text-color-text-main">
          Mã số thuế
        </span>
      </label>

      <div className="relative w-full">
        <input
          name="maSoThue"
          value={form.maSoThue}
          onChange={handleChange}
          placeholder="VD: 0312345678"
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />
      </div>

      {errors.maSoThue && (
        <p className="text-red-500 text-sm mt-1">
          {errors.maSoThue}
        </p>
      )}

    </div>


    <h3 className="text-lg font-semibold">
      Tài khoản ngân hàng
    </h3>


    {/* mã ngân hàng */}
    <div className="flex flex-col w-[480px] items-start gap-[5px]">

      <label className="flex items-center gap-2.5 p-2.5 cursor-pointer">
        <span className="text-xl text-color-text-main">
          Mã ngân hàng
        </span>
      </label>

      <div className="relative w-full">
        <input
          name="maNganHang"
          value={form.maNganHang}
          onChange={handleChange}
          placeholder="VD: VCB, TCB, ACB..."
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />
      </div>

      {errors.maNganHang && (
        <p className="text-red-500 text-sm mt-1">
          {errors.maNganHang}
        </p>
      )}

    </div>


    {/* số tài khoản */}
    <div className="flex flex-col w-[480px] items-start gap-[5px]">

      <label className="flex items-center gap-2.5 p-2.5 cursor-pointer">
        <span className="text-xl text-color-text-main">
          Số tài khoản
        </span>
      </label>

      <div className="relative w-full">
        <input
          name="soTaiKhoan"
          value={form.soTaiKhoan}
          onChange={handleChange}
          placeholder="VD: 0123456789"
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />
      </div>

      {errors.soTaiKhoan && (
        <p className="text-red-500 text-sm mt-1">
          {errors.soTaiKhoan}
        </p>
      )}

    </div>


    {/* tên tài khoản */}
    <div className="flex flex-col w-[480px] items-start gap-[5px]">

      <label className="flex items-center gap-2.5 p-2.5 cursor-pointer">
        <span className="text-xl text-color-text-main">
          Tên tài khoản
        </span>
      </label>

      <div className="relative w-full">
        <input
          name="tenTaiKhoan"
          value={form.tenTaiKhoan}
          onChange={handleChange}
          placeholder="VD: TRAN VAN A"
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />
      </div>

      {errors.tenTaiKhoan && (
        <p className="text-red-500 text-sm mt-1">
          {errors.tenTaiKhoan}
        </p>
      )}

    </div>


    <button
      onClick={handleSubmit}
      className="w-[480px] bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold"
    >
      Tạo tài khoản người bán
    </button>

  </div>

);

}