// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


export default function ResetAccount() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [usernameList, setUsernameList] = useState([]);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  
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

  useEffect(() => {
    fetch(`${API}/nguoidung/tendangnhap`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setUsernameList(data);
      });
  }, []);

  const valid =
    name.trim() !== "" &&
    password.trim() !== "" &&
    confirm.trim() !== "" &&
    password === confirm &&
    usernameError === "";

  const handleSubmit = async () => {
    if (!valid) return;

    const userId = localStorage.getItem("token");

    const res = await fetch(`${API}/nguoidung/setpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        password: password,
        tenDangNhap: name
      })
    });

    const data = await res.json();

    localStorage.setItem("tenDangNhap", data.tenDangNhap);
    localStorage.setItem("trangThaiXacThuc", data.trangThaiXacThuc);

    navigate("/");
  };

  const handleNameChange = (e) => {
    let value = e.target.value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s/g, "")
      .toLowerCase();
    setName(value);
    const error = validateUsername(value);
    setUsernameError(error);
  };

  const validateUsername = (value) => {

    if (value.length === 0) return "";

    if (!/^[a-zA-Z0-9_]{4,20}$/.test(value)) {
      return "Tên đăng nhập chỉ gồm chữ, số, _";
    }

    if (usernameList.includes(value)) {
      return "Tên đăng nhập đã tồn tại";
    }

    return "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    if (value.length === 0) {
      setPasswordError("");
    } else if (!passwordRegex.test(value)) {
      setPasswordError("Mật khẩu phải ≥ 8 ký tự, gồm chữ và số");
    } else {
      setPasswordError("");
    }

    if (confirm && value !== confirm) {
      setConfirmError("Mật khẩu không khớp");
    } else {
      setConfirmError("");
    }
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value;

    setConfirm(value);

    if (value !== password) {
      setConfirmError("Mật khẩu không khớp");
    } else {
      setConfirmError("");
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-[#f3f5f7] p-6">

      {/* card */}
      <div className="inline-flex flex-col items-end gap-[18px] p-[50px] bg-white border-[5px] border-solid border-color-user-cta">

        <div className="flex flex-col gap-10 py-[30px] w-[480px]">

          {/* title */}
          <h1 className="text-[40px] text-black">
            Cài đặt lại tài khoản
          </h1>

          {/* Tên đăng nhập */}
          <div className="flex flex-col gap-1">

            <label className="text-xl">
              Tên đăng nhập
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="VD: NguyenVanA"
                value={name}
                onChange={handleNameChange}
                className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
              />
            </div>  

            {usernameError && (
              <p className="text-red-500 text-sm mt-1">
                {usernameError}
              </p>
            )}

          </div>

          {/* Mật khẩu */}
          <div>
            <label className="text-xl">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={handlePasswordChange}
                type={showPass ? "text" : "password"}
                placeholder="Mật khẩu"
                className="w-full rounded-md border border-slate-300 px-4 py-4 pr-12 outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                title={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPass ? (
                  <EyeSlashIcon className="h-5 w-5 transition-transform hover:scale-110" />
                ) : (
                  <EyeIcon className="h-5 w-5 transition-transform hover:scale-110" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">
                {passwordError}
              </p>
            )}   
          </div>

          {/* nhập lại mật khẩu */}
          <div className="flex flex-col gap-1">

            <div className="relative">
              <input
                value={confirm}
                onChange={handleConfirmChange}
                type={showRePass ? "text" : "password"}
                // autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                className="w-full rounded-md border border-slate-300 px-4 py-4 pr-12 outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowRePass(!showRePass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
              >
                {showRePass ? (
                  <EyeSlashIcon className="h-5 w-5 transition-transform hover:scale-110" />
                ) : (
                  <EyeIcon className="h-5 w-5 transition-transform hover:scale-110" />
                )}
              </button>
            </div>

            {confirmError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmError}
              </p>
            )}

          </div>

          {/* login */}
          <button
            onClick={handleSubmit}
            disabled={!valid}
            className={[
              "w-full rounded-md py-4 font-semibold",
              valid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-300 text-white cursor-not-allowed opacity-70",
            ].join(" ")}
          >
            Đăng nhập
          </button>

        </div>

      </div>

      {/* close */}
      <button
        onClick={() => navigate("/")}
        className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700"
      >
        <XIcon />
      </button>

    </div>
  );
}