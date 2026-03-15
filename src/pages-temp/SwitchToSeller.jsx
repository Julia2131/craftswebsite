import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

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

    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const [errors, setErrors] = useState({});

  const API = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("register_user_id");
  
  const handleSubmit = async () => {

    const newErrors = {};

    const userId = localStorage.getItem("register_user_id");
    if (!userId) {
      alert("Vui lòng đăng nhập trước khi tạo tài khoản người bán");
      navigate("/log");
      return;
    }

    // tiền nhân công
    if (!form.tienNhanCong) {
      newErrors.tienNhanCong = "Vui lòng nhập tiền nhân công";
    } else if (!/^\d+$/.test(form.tienNhanCong)) {
      newErrors.tienNhanCong = "Tiền nhân công phải là số";
    }

    // tiền thương hiệu
    if (!form.tienThuongHieu) {
      newErrors.tienThuongHieu = "Vui lòng nhập tiền thương hiệu";
    } else if (!/^\d+$/.test(form.tienThuongHieu)) {
      newErrors.tienThuongHieu = "Tiền thương hiệu phải là số";
    }

    // mã số thuế (10 hoặc 13 số)
    if (!form.maSoThue) {
      newErrors.maSoThue = "Vui lòng nhập mã số thuế";
    } else if (!/^\d{10}(\d{3})?$/.test(form.maSoThue)) {
      newErrors.maSoThue = "Mã số thuế phải có 10 hoặc 13 chữ số";
    }

    // mã ngân hàng
    if (!form.maNganHang) {
      newErrors.maNganHang = "Vui lòng nhập mã ngân hàng";
    }

    // số tài khoản
    if (!form.soTaiKhoan) {
      newErrors.soTaiKhoan = "Vui lòng nhập số tài khoản";
    } else if (!/^\d{6,20}$/.test(form.soTaiKhoan)) {
      newErrors.soTaiKhoan = "Số tài khoản phải từ 6-20 chữ số";
    }

    // tên tài khoản
    if (!form.tenTaiKhoan) {
      newErrors.tenTaiKhoan = "Vui lòng nhập tên tài khoản";
    } else if (form.tenTaiKhoan.length < 3) {
      newErrors.tenTaiKhoan = "Tên tài khoản quá ngắn";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    console.log("submit form", form);

    try {
      const payload = {
        nguoiDungId: userId,
        tienNhanCong: Number(form.tienNhanCong),
        tienThuongHieu: Number(form.tienThuongHieu),
        maSoThue: form.maSoThue,
        nganHang: {
          maNganHang: form.maNganHang,
          tenNganHang: form.tenNganHang,
          soTaiKhoan: form.soTaiKhoan,
          tenTaiKhoan: form.tenTaiKhoan
        }
      };

      const res = await fetch(`${API}/thong-tin-nguoi-ban`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Có lỗi xảy ra");
        return;
      }

      console.log(data);

      try{
        //gọi API lấy sellerId
        const sellerRes = await fetch(`${API}/thong-tin-nguoi-ban/by-user/${userId}`);
        const sellerId = await sellerRes.json();

        //lưu sellerId
        localStorage.setItem("register_seller_id", sellerId);

        console.log("register_seller_id:", sellerId);
      }catch(err){
        console.error(`Lỗi khi lấy sellerId: ${err}`);
      }

      navigate("/seller/home");
    } catch (err) {
      console.error(`Lỗi khi tạo tài khoản người bán: ${err}`);
      alert("Có lỗi xảy ra khi tạo tài khoản người bán");
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">

      <h2 className="text-2xl font-bold">
        Thiết lập thông tin người bán
      </h2>

      {/* tiền nhân công */}
      <FormInput
        label="Tiền nhân công"
        name="tienNhanCong"
        value={form.tienNhanCong}
        onChange={handleChange}
        placeholder="Ví dụ: 100000"
        helper="Số tiền bạn nhận khi hoàn thành sản phẩm"
        error={errors.tienNhanCong}
        icon="₫"
      />

      {/* tiền thương hiệu */}
      <FormInput
        label="Tiền thương hiệu"
        name="tienThuongHieu"
        value={form.tienThuongHieu}
        onChange={handleChange}
        placeholder="Ví dụ: 50000"
        helper="Chi phí thương hiệu thu trên mỗi sản phẩm"
        error={errors.tienThuongHieu}
        icon="₫"
      />

      {/* mã số thuế */}
      <FormInput
        label="Mã số thuế"
        name="maSoThue"
        value={form.maSoThue}
        onChange={handleChange}
        placeholder="0123456789"
        helper="Mã số thuế doanh nghiệp (10 hoặc 13 số)"
        error={errors.maSoThue}
        icon="🏢"
      />

      <h3 className="text-lg font-semibold mt-4">
        Tài khoản ngân hàng
      </h3>

      {/* mã ngân hàng */}
      <FormInput
        label="Mã ngân hàng"
        name="maNganHang"
        value={form.maNganHang}
        onChange={handleChange}
        placeholder="VCB"
        helper="Ví dụ: VCB, TCB, BIDV"
        error={errors.maNganHang}
        icon="🏦"
      />


      {/* số tài khoản */}
      <FormInput
        label="Số tài khoản"
        name="soTaiKhoan"
        value={form.soTaiKhoan}
        onChange={handleChange}
        placeholder="1234567890"
        helper="6–20 chữ số"
        error={errors.soTaiKhoan}
        icon="💳"
      />

      {/* tên tài khoản */}
      <FormInput
        label="Tên tài khoản"
        name="tenTaiKhoan"
        value={form.tenTaiKhoan}
        onChange={handleChange}
        placeholder="NGUYEN VAN A"
        helper="Phải trùng với tên trên ngân hàng"
        error={errors.tenTaiKhoan}
        icon="👤"
      />
      
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
