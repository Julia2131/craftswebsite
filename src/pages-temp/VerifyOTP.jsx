import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  const API = import.meta.env.VITE_API_URL;

  const canSubmit = /^\d{6}$/.test(otp);

  const handleOtpChange = (e) => {
    const value = e.target.value;

    // chỉ cho nhập số
    if (!/^\d*$/.test(value)) return;

    setOtp(value);

    if (value.length === 0) {
      setError("");
    } else if (value.length !== 6) {
      setError("OTP phải gồm 6 số");
    } else {
      setError("");
    }
  };

  const handleVerify = async () => {
    if (!canSubmit) return;

    if (!window.confirmationResult) {
      setError("Phiên OTP đã hết, vui lòng thử lại");
      return;
    }

    try {
      setLoading(true);
      
      const result = await window.confirmationResult.confirm(otp);

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

      // const confirmationResult = await signInWithPhoneNumber(
      //   auth,
      //   phoneFormat,
      //   appVerifier
      // );

      if (!data.success) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/register-cccd", { state: { phone } });

    } catch (err) {
      console.error(err);
      setError("Không gửi được OTP, thử lại sau");

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5f7] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-lg shadow">

        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">Xác thực OTP</h1>

          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 font-medium hover:underline"
          >
            Quay lại
          </button>
        </div>

        {/* mô tả */}
        <p className="text-sm text-slate-600 mb-6">
          Mã OTP đã được gửi đến số{" "}
          <span className="font-medium">{phone}</span>
        </p>

        {/* input OTP */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Nhập mã OTP
          </label>

          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Nhập 6 số"
            maxLength={6}
            className={`w-full border rounded-md px-4 py-3 outline-none text-center tracking-widest text-lg
              ${error ? "border-red-500" : "border-slate-300"}
              focus:border-blue-500`}
          />

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}
        </div>

        {/* button */}
        <button
          onClick={handleVerify}
          disabled={!canSubmit || loading}
          className={`w-full mt-6 py-3 rounded-md font-semibold
            ${
              canSubmit && !loading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-300 text-white cursor-not-allowed"
            }`}
        >
          {loading ? "Đang xác thực..." : "Xác nhận"}
        </button>

      </div>
    </div>
  );
}