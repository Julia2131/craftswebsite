import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/Hero.png";
import searchIcon from "../assets/Icon.png";
import footerBg from "../assets/Footer-background.jpg";

import {
FaFacebookF,
FaInstagram,
FaTiktok
} from "react-icons/fa";

export default function Profile() {

const navigate = useNavigate()

const [user,setUser]=useState(()=>{
  try{
    return JSON.parse(localStorage.getItem("craft_user")) || null
  }catch{
    return null
  }
})

const [avatar,setAvatar]=useState(user?.avatar || null)

const [profile,setProfile]=useState(()=>{
  const saved = localStorage.getItem("craft_user")

  if(saved){
    return JSON.parse(saved)
  }

  return {
    username:"",
    name:"TRẦN THỊ HƯƠNG",
    email:"",
    phone:"",
    gender:"nam",
    birthday:"",
    avatar:null,
    verified:true
  }
})

useEffect(()=>{

  const syncUser=()=>{
    try{
      setUser(JSON.parse(localStorage.getItem("craft_user")) || null)
    }catch{
      setUser(null)
    }
  }

  window.addEventListener("craft_user_updated",syncUser)

  return ()=>{
    window.removeEventListener("craft_user_updated",syncUser)
  }

},[])

const handleChange=(e)=>{
setProfile({
...profile,
[e.target.name]:e.target.value
})
}

const handleAvatar=(e)=>{

const file=e.target.files[0]

if(file){

const url = URL.createObjectURL(file)

setAvatar(url)

setProfile({
...profile,
avatar:url
})

}

}

const handleSave = () => {

const userData = {
...profile,
avatar: avatar || profile.avatar
}

localStorage.setItem(
"craft_user",
JSON.stringify(userData)
)

window.dispatchEvent(
new Event("craft_user_updated")
)

setUser(userData)

alert("Đã lưu hồ sơ")

}

return (

<div className="min-h-screen bg-[#f3f3f3]">

{/* HEADER */}

<header className="mx-auto max-w-6xl px-4">

<div className="flex justify-between text-xs text-gray-500 py-1">
<div>Kênh người bán</div>
<div>Hỗ trợ</div>
</div>

<div className="flex items-center gap-4 py-3">

<img
src={logo}
className="h-10 cursor-pointer"
onClick={()=>navigate("/")}
/>

<div className="flex flex-1 items-center border rounded-md px-3 py-2 bg-white">

<input
className="w-full outline-none"
placeholder="Nội dung tìm kiếm ..."
/>

<img src={searchIcon} className="h-5 w-5"/>

</div>

<div className="flex items-center gap-6 text-xl">

<div>💬</div>
<div>🛒</div>

<div className="flex items-center gap-2">

<div className="h-8 w-8 rounded-full overflow-hidden bg-gray-300">

{user?.avatar ? (
<img
src={user.avatar}
className="h-full w-full object-cover"
/>
) : null}

</div>

<span className="text-sm">
{user?.name || "Người dùng"}
</span>

</div>

</div>

</div>

</header>

{/* MAIN */}

<section className="mx-auto max-w-6xl px-4 py-6">

<div className="flex gap-8">

{/* SIDEBAR */}

<div className="w-56 bg-[#e6eef9] p-5 text-sm">

<div className="font-semibold mb-4">
Tài khoản của tôi
</div>

<ul className="space-y-3">

<li className="text-blue-600 font-medium">
Hồ sơ
</li>

<li
className="cursor-pointer"
onClick={()=>navigate("/address")}
>
Địa chỉ
</li>
<li>Đổi mật khẩu</li>
<li>Chứng chỉ</li>
<li>Đơn mua</li>
<li>Người bán yêu thích</li>
<li>Hợp đồng</li>

</ul>

</div>

{/* PROFILE */}

<div className="flex-1">

<h1 className="text-xl font-semibold mb-2">
Hồ sơ của tôi
</h1>

<p className="text-sm text-gray-600 mb-6">
Quản lý thông tin hồ sơ để bảo mật tài khoản
</p>

<div className="grid grid-cols-[1fr_220px] gap-12">

{/* FORM */}

<div className="space-y-4 text-sm">

<div className="grid grid-cols-[150px_1fr] items-center">

<label className="text-right pr-4">
Tên đăng nhập
</label>

<input
name="username"
value={profile.username}
onChange={handleChange}
className="border rounded px-3 py-1"
/>

</div>

<div className="grid grid-cols-[150px_1fr] items-center">

<label className="text-right pr-4">
Tên
</label>

<input
name="name"
value={profile.name}
onChange={handleChange}
className="border rounded px-3 py-1"
/>

</div>

<div className="grid grid-cols-[150px_1fr] items-center">

<label className="text-right pr-4">
Email
</label>

<input
name="email"
value={profile.email}
onChange={handleChange}
className="border rounded px-3 py-1"
/>

</div>

<div className="grid grid-cols-[150px_1fr] items-center">

<label className="text-right pr-4">
Số điện thoại
</label>

<input
name="phone"
value={profile.phone}
onChange={handleChange}
className="border rounded px-3 py-1"
/>

</div>

<div className="grid grid-cols-[150px_1fr] items-center">

<label className="text-right pr-4">
Giới tính
</label>

<div className="flex gap-6">

<label className="flex gap-2 items-center">
<input
type="radio"
name="gender"
value="nam"
checked={profile.gender==="nam"}
onChange={handleChange}
/>
Nam
</label>

<label className="flex gap-2 items-center">
<input
type="radio"
name="gender"
value="nu"
checked={profile.gender==="nu"}
onChange={handleChange}
/>
Nữ
</label>

<label className="flex gap-2 items-center">
<input
type="radio"
name="gender"
value="khac"
checked={profile.gender==="khac"}
onChange={handleChange}
/>
Khác
</label>

</div>

</div>

<div className="grid grid-cols-[150px_1fr] items-center">

<label className="text-right pr-4">
Ngày sinh
</label>

<input
type="date"
name="birthday"
value={profile.birthday}
onChange={handleChange}
className="border rounded px-3 py-1"
/>

</div>

<div className="pl-[150px] pt-4">

<button
onClick={handleSave}
className="bg-blue-600 text-white px-8 py-2 rounded"
>
Lưu
</button>

</div>

</div>

{/* AVATAR */}

<div className="flex flex-col items-center">

<div className="h-40 w-40 rounded-full overflow-hidden bg-gray-200">

{avatar ? (
<img src={avatar} className="w-full h-full object-cover"/>
) : (
<div className="w-full h-full flex items-center justify-center text-gray-500">
Avatar
</div>
)}

</div>

<label className="mt-4 border px-4 py-2 rounded text-blue-600 cursor-pointer">

Chọn ảnh

<input
type="file"
className="hidden"
onChange={handleAvatar}
/>

</label>

</div>

</div>

</div>

</div>

</section>

{/* FOOTER */}

<footer className="mt-16">

<div
className="mx-auto max-w-6xl px-10 py-12"
style={{
backgroundImage:`url(${footerBg})`,
backgroundSize:"cover"
}}
>

<div className="grid grid-cols-4 text-[#b06b3b] gap-16 text-sm">

<div>

<h3 className="text-lg mb-4 font-serif">
Info
</h3>

<p>
Sàn thương mại điện tử chuyên biệt cho nghề nhân
và người yêu thích sản phẩm mang tính chất cá nhân,
mới mẻ.
</p>

<div className="flex gap-6 mt-6 text-lg">

<FaFacebookF/>
<FaInstagram/>
<FaTiktok/>

</div>

</div>

<div>

<h3 className="text-lg mb-4 font-serif">
Shopping
</h3>

<p>Đồ Decor & Nội thất</p>
<p>Trang sức thủ công</p>
<p>Quà tặng & Phụ kiện</p>
<p>Sản phẩm bán chạy</p>
<p>Nghệ nhân tiêu biểu</p>

</div>

<div>

<h3 className="text-lg mb-4 font-serif">
Trust
</h3>

<p>Chính sách bảo mật (eKYC & CCD).</p>
<p>Quy trình giải quyết khiếu nại</p>
<p>Chính sách vận chuyển & kiểm hàng.</p>
<p>Hướng dẫn xác thực ví điện tử.</p>

</div>

<div>

<h3 className="text-lg mb-4 font-serif">
Newsletter
</h3>

<p>Nhận tin ưu đãi từ các nghệ nhân.</p>

<div className="mt-6 border rounded-full w-10 h-10 flex items-center justify-center">
+
</div>

</div>

</div>

</div>

</footer>

</div>

)
useEffect(() => {
  const savedUser = JSON.parse(localStorage.getItem("user"))

  if (savedUser) {
    setName(savedUser.name)
    setEmail(savedUser.email)
    setPhone(savedUser.phone)
    setAvatar(savedUser.avatar)
  }
}, [])

}
