import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SwitchToSeller({ buyerId }) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    tienNhanCong: "",
    tienThuongHieu: "",
    maSoThue: "",
    maNganHang: "",
    tenNganHang: "",
    soTaiKhoan: "",
    tenTaiKhoan: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const [errors, setErrors] = useState({});

  const handleSubmit = () => {

    const newErrors = {};

    if (!form.tienNhanCong) {
      newErrors.tienNhanCong = "Vui lòng nhập tiền nhân công";
    }

    if (!form.maSoThue) {
      newErrors.maSoThue = "Vui lòng nhập mã số thuế";
    }

    if (!form.soTaiKhoan) {
      newErrors.soTaiKhoan = "Vui lòng nhập số tài khoản";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // có lỗi thì dừng
    }

    // nếu không lỗi thì call API
    console.log("submit form", form);
  };
  const API = import.meta.env.VITE_API_URL;

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">

      <h2 className="text-2xl font-bold">
        Thiết lập thông tin người bán
      </h2>

      {/* tiền nhân công */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Tiền nhân công
        </label>

        <input
          name="tienNhanCong"
          value={form.tienNhanCong}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />

        {errors.tienNhanCong && (
          <p className="text-red-500 text-sm">
            {errors.tienNhanCong}
          </p>
        )}
      </div>

      {/* tiền thương hiệu */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Tiền thương hiệu
        </label>

        <input
          name="tienThuongHieu"
          value={form.tienThuongHieu}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />

        {errors.tienThuongHieu && (
          <p className="text-red-500 text-sm">
            {errors.tienThuongHieu}
          </p>
        )}
      </div>

      {/* mã số thuế */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Mã số thuế
        </label>

        <input
          name="maSoThue"
          value={form.maSoThue}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />

        {errors.maSoThue && (
          <p className="text-red-500 text-sm">
            {errors.maSoThue}
          </p>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-4">
        Tài khoản ngân hàng
      </h3>

      {/* mã ngân hàng */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Mã ngân hàng
        </label>

        <input
          name="maNganHang"
          value={form.maNganHang}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />

        {errors.maNganHang && (
          <p className="text-red-500 text-sm">
            {errors.maNganHang}
          </p>
        )}
      </div>

      {/* số tài khoản */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Số tài khoản
        </label>

        <input
          name="soTaiKhoan"
          value={form.soTaiKhoan}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />

        {errors.soTaiKhoan && (
          <p className="text-red-500 text-sm">
            {errors.soTaiKhoan}
          </p>
        )}
      </div>

      {/* tên tài khoản */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Tên tài khoản
        </label>

        <input
          name="tenTaiKhoan"
          value={form.tenTaiKhoan}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
        />

        {errors.tenTaiKhoan && (
          <p className="text-red-500 text-sm">
            {errors.tenTaiKhoan}
          </p>
        )}
      </div>

      {/* button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold"
      >
        Tạo tài khoản người bán
      </button>

    </div>
  );

}