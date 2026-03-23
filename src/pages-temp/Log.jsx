import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Log() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  const canSubmit = username.trim().length > 0 && pass.trim().length > 0;

  const API = import.meta.env.VITE_API_URL;
  
  const handleLogin = async () => {
    if (!canSubmit) return;

    try {
      const res = await fetch(`${API}/nguoi-dung/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          username: username,
          password: pass,
        }),
      });

      const data = await res.json();

      if (data.success) {

        const user = {
          name: username,
          loginAt: new Date().toISOString(),
        };

        localStorage.setItem("craft_user", JSON.stringify(user));

        // lưu token 
        localStorage.setItem("token", data.token);

        // lưu roles
        localStorage.setItem("roles", JSON.stringify(data.roles));

        window.dispatchEvent(new Event("craft_user_updated"));

        const roles = data.roles;

        // phân luồng
        if (roles.includes("SUPER_ADMIN")) {
          localStorage.setItem("register_admin_id", data.userId);
          navigate("/admin/home");
        }
        else if (roles.includes("SELLER")) {
          localStorage.setItem("register_seller_id", data.userId);
          navigate("/seller/home");
        }
        else {
          navigate("/");
        }

      } else {
        alert("Sai tên đăng nhập hoặc mật khẩu");
      }
    } catch (err) {
      console.error(err);
      alert("Không kết nối được server");
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-[#f3f5f7] p-6">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 shadow-sm rounded-md p-10">
        {/* close */}
        <button
          onClick={() => navigate("/")}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-800"
          aria-label="Close"
          type="button"
        >
          ✕
        </button>

        <h1 className="text-center font-serif text-4xl">Đăng nhập</h1>

        <div className="mt-10 space-y-6">
          {/* Tên đăng nhập */}
          <div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên đăng nhập"
              className="w-full rounded-md border border-slate-300 px-4 py-4 outline-none focus:border-blue-500"
              inputMode="numeric"
            />
          </div>

          {/* pass */}
          <div>
            <div className="relative">
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
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
          </div>

          {/* quên mk */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-slate-600 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* login */}
          <button
            onClick={handleLogin}
            disabled={!canSubmit}
            className={[
              "w-full rounded-md py-4 font-semibold",
              canSubmit
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-300 text-white cursor-not-allowed opacity-70",
            ].join(" ")}
          >
            Đăng nhập
          </button>

          {/* ekyc */}
          <button
            onClick={() => navigate("/cam")}
            className="w-full rounded-md border border-blue-600 py-4 font-semibold text-blue-600 hover:bg-blue-50"
          >
            Đăng nhập bằng eKYC
          </button>

          {/* đăng ký */}
          <div className="pt-2 text-center text-sm text-slate-600">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/sdt")}
              className="font-semibold text-blue-600 hover:underline"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}