import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../services/firebase";

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

    try {
      const appVerifier = window.recaptchaVerifier;

      const phoneFormat = phone.replace(/^0/, "+84");

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneFormat,
        appVerifier
      );

      window.confirmationResult = confirmationResult;  // Mã phiên, Gửi cùng OTP  

      navigate("/verify-otp", { state: { phone } });

    } catch (err) {
      console.error(err);
      setError("Không gửi được OTP, thử lại sau");

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    }
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

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, // GOI BEN FIREBASE.JS
        "recaptcha-container",
        {
          size: "invisible"
        }
      );

      window.recaptchaVerifier.render();
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-[#f3f5f7] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-lg shadow">

        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">Đăng ký</h1>

          <button
            onClick={() => navigate("/log")}
            className="text-blue-600 font-medium hover:underline"
          >
            Đăng nhập
          </button>
        </div>

        {/* input phone */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Số điện thoại
          </label>

          <input
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Nhập số điện thoại"
            className={`w-full border rounded-md px-4 py-3 outline-none 
              ${error ? "border-red-500" : "border-slate-300"}
              focus:border-blue-500`}
          />

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}
        </div>

        {/* điều khoản */}
        <p className="text-xs text-slate-600 mt-6 leading-relaxed">
          Bằng việc nhấn vào nút <span className="font-medium">Đăng ký</span> là bạn đồng ý với{" "}
          <a
            href="/dieu-khoan"
            className="underline text-blue-600 hover:text-blue-700"
          >
            Điều khoản sử dụng
          </a>{" "}
          và{" "}
          <a
            href="/chinh-sach-bao-mat"
            className="underline text-blue-600 hover:text-blue-700"
          >
            chính sách bảo mật
          </a>{" "}
          của chúng tôi.
        </p>

        {/* button */}
        <button
          onClick={handleRegister}
          disabled={!canSubmit}
          className={`w-full mt-6 py-3 rounded-md font-semibold
            ${
              canSubmit
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-300 text-white cursor-not-allowed"
            }`}
        >
          Đăng ký
        </button>

        <div id="recaptcha-container"></div>

      </div>
    </div>
  );

}