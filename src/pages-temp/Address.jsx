import { useState, useEffect } from "react"
import logo from "../assets/Hero.png"
import searchIcon from "../assets/Icon.png"
import footerBg from "../assets/Footer-background.jpg"
import { useNavigate } from "react-router-dom"

import {
FaFacebookF,
FaInstagram,
FaTiktok
} from "react-icons/fa"

export default function Address() 
{
 
const navigate = useNavigate()
const user = JSON.parse(localStorage.getItem("user")) || {}

const [addresses,setAddresses]=useState([
{
id:1,
name:"Địa chỉ 1",
phone:"0988 123 234",
address:"Hà Nội, Huyện Mê Linh, Xã Mê Linh, đường 23",
default:true
},
{
id:2,
name:"Địa chỉ 2",
phone:"0988 123 234",
address:"Hồ Chí Minh, Huyện Mê Linh, Xã Mê Linh, đường 23",
default:false
},
{
id:3,
name:"Địa chỉ 3",
phone:"0988 123 234",
address:"Phú Thọ, Huyện Mê Linh, Xã Mê Linh, đường 23",
default:false
}
])

useEffect(()=>{
  const savedUser = JSON.parse(localStorage.getItem("user"))
  if(savedUser){
    setUser(savedUser)
  }
    },[])

const setDefault=(id)=>{

setAddresses(
addresses.map(a=>({
...a,
default:a.id===id
}))
)

}

return(

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

<div className="h-8 w-8 rounded-full bg-gray-300"/>

<span className="text-sm">
{user.name || "Người dùng"}
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

<li
className="cursor-pointer"
onClick={()=>navigate("/profile")}
>
Hồ sơ
</li>

<li className="text-blue-600 font-medium">
Địa chỉ
</li>

<li>Đổi mật khẩu</li>
<li>Chứng chỉ</li>
<li>Đơn mua</li>
<li>Người bán yêu thích</li>
<li>Hợp đồng</li>

</ul>

</div>

{/* ADDRESS */}

<div className="flex-1">

<div className="border border-blue-400 p-6 bg-white">

<div className="flex justify-between items-center mb-6">

<h2 className="text-lg font-semibold">
Địa chỉ của tôi
</h2>

<button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
Thêm địa chỉ mới
<span className="text-xl">+</span>
</button>

</div>

{addresses.map((item)=>(
<div key={item.id} className="border-b py-4">

<div className="flex justify-between">

<div>

<div className="font-medium">
{item.name} &nbsp;&nbsp; {item.phone}
</div>

<div className="text-gray-600 text-sm">
{item.address}
</div>

{item.default &&(
<span className="text-red-500 text-xs border border-red-500 px-2 py-1 mt-2 inline-block">
Mặc định
</span>
)}

</div>

<div className="text-sm space-y-2 text-right">

<div className="text-blue-600 cursor-pointer">
Cập nhật
</div>

<div
className="border px-3 py-1 rounded cursor-pointer"
onClick={()=>setDefault(item.id)}
>
Thiết lập mặc định
</div>

</div>

</div>

</div>
))}

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

}