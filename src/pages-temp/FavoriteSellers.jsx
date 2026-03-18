import React from "react";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";

export default function FavoriteSellers() {
  const sellers = [
    { name: "Trang Shop", avatar: "https://picsum.photos/150", products: ["https://picsum.photos/50", "https://picsum.photos/51", "https://picsum.photos/52"] },
    { name: "Dũng Shop", avatar: "https://picsum.photos/151", products: ["https://picsum.photos/53", "https://picsum.photos/54", "https://picsum.photos/55"] },
    { name: "Quỳnh Anh Shop", avatar: "https://picsum.photos/152", products: ["https://picsum.photos/56", "https://picsum.photos/57", "https://picsum.photos/58"] },
  ];

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex gap-8">
          <Sidebar />
          <div className="flex-1 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-8 text-gray-800">Người bán yêu thích</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {sellers.map((seller, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  {/* Ảnh sản phẩm nhỏ bên trái */}
                  <div className="flex flex-col gap-2">
                    {seller.products.map((p, i) => (
                      <img key={i} src={p} className="w-12 h-12 object-cover rounded border" alt="p" />
                    ))}
                  </div>
                  {/* Ảnh chính của shop */}
                  <div className="flex-1">
                    <img src={seller.avatar} className="w-full h-48 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all" alt={seller.name} />
                    <p className="mt-3 font-medium text-gray-700">{seller.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}