import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ImageUploader from "../../components/ImageUploader";
import VideoUploader from "../../components/VideoUploader";
import InputField from "../../components/InputField";
import DimensionInput from "../../components/DimensionInput";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";

const sections = [
  { id: "images", label: "Hình ảnh sản phẩm" },
  { id: "cover", label: "Hình bìa" },
  { id: "videos", label: "Video sản phẩm" },
  { id: "quantity", label: "Số lượng" },
  { id: "price", label: "Giá" },
  { id: "weight", label: "Cân nặng" },
  { id: "worktime", label: "Thời gian làm sản phẩm" },
  { id: "size", label: "Kích thước" },
  { id: "description", label: "Mô tả sản phẩm" },
  { id: "category", label: "Danh mục" },
];

export const ProductModerationDetail = () => {
  const API = import.meta.env.VITE_API_URL;

  const containerRef = useRef(null);
  const sectionRefs = useRef({});
  const navigate = useNavigate();
  const { id } = useParams();

//   const [form, setForm] = useState({});
  const [images, setImages] = useState([]);
  const [cover, setCover] = useState(null);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);

  const [reason, setReason] = useState("");

  const [form, setForm] = useState({
    description: "",
    price: "",
    weight: "",
    quantity: "",
    soGioLamViecUocTinh: "",
    categoryId: "",
    size: {
        length: "",
        width: "",
        height: ""
    }
    });

  useEffect(() => {

    const fetchProduct = async () => {

      const res = await fetch(`${API}/san-pham-co-san/${id}`);
      const data = await res.json();

      setForm({
        description: data.moTa,
        price: data.gia,
        giaGoc: data.giaGoc,
        weight: data.canNang,
        quantity: data.soLuongBanDau,

        soGioLamViecUocTinh: data.sanPham?.soGioLamViecUocTinh,

        categoryId: data.sanPham?.danhMuc?.id,

        size: {
          length: data.chieuDai,
          width: data.chieuRong,
          height: data.chieuCao
        }
      });

      const links = data.sanPham?.anhVideos?.map(v => v.link) || [];

      const imageLinks = links.filter(l =>
        l.includes(".jpg") || l.includes(".png") || l.includes(".jpeg")
      );

      const videoLinks = links.filter(l =>
        l.includes(".mp4") || l.includes(".mov")
      );

      setImages(imageLinks);
      setVideos(videoLinks);

      if (imageLinks.length > 0) {
        setCover(imageLinks[0]);
      }

    };

    fetchProduct();

  }, [id]);

  useEffect(() => {
    fetch(`${API}/danh-muc`)
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

    const handleApprove = async () => {

    if (!reason.trim()) {
        alert("Vui lòng nhập lý do trước khi duyệt");
        return;
    }

    try {

        const res = await fetch(
        `${API}/nhat-ky-kiem-toan/approve/${id}`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(reason)
        }
        );

        if (!res.ok) {
        throw new Error("Approve failed");
        }

        alert("Đã duyệt sản phẩm");

        navigate("/admin/content-moderation", {
          state: { tab: 1 } // 1 = Duyệt
        });

    } catch (err) {

        console.error(err);
        alert("Lỗi khi duyệt");

    }
    };

    const handleViolation = async () => {

    if (!reason.trim()) {
        alert("Vui lòng nhập lý do vi phạm");
        return;
    }

    try {

        const res = await fetch(
        `${API}/nhat-ky-kiem-toan/violation/${id}`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(reason)
        }
        );

        if (!res.ok) {
        throw new Error("Violation failed");
        }

        alert("Đã đánh dấu vi phạm");

        navigate("/admin/content-moderation");

    } catch (err) {

        console.error(err);
        alert("Lỗi khi đánh dấu vi phạm");

    }
    };

  return (

    <div className="flex flex-col h-screen bg-white px-[120px] pt-[40px]">

      <h1 className="text-3xl font-bold mb-6">
        Kiểm duyệt sản phẩm
      </h1>

      <div className="flex flex-1 gap-10 overflow-hidden">

        {/* Sidebar */}

        <nav className="w-[230px] sticky top-[120px] h-fit">
          <div className="flex flex-col gap-2">

            {sections.map((item) => (

              <button
                key={item.id}
                onClick={() =>
                  sectionRefs.current[item.id]?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-left px-4 py-2 rounded-lg hover:bg-[#6366F1] hover:text-white"
              >
                {item.label}
              </button>

            ))}

          </div>
        </nav>

        {/* Content */}

        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto pr-4"
        >

          {sections.map((section) => (

            <div
              key={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className="mb-16"
            >

              <SectionBlock
                id={section.id}
                title={section.label}
                form={form}
                categories={categories}
                images={images}
                cover={cover}
                videos={videos}
              />

            </div>

          ))}

          {/* Lý do */}

          <div className="max-w-[600px] mt-10">

            <FormInput
              label="Lý do vi phạm"
              type="textarea"
              value={reason}
              placeholder="Nhập lý do nếu sản phẩm vi phạm..."
              onChange={(e) => setReason(e.target.value)}
            />

          </div>

        </div>

      </div>

      {/* Buttons */}

      <div className="flex justify-center gap-6 border-t pt-4 pb-2 bg-white">

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>

        <Button
          variant="success"
          onClick={handleApprove}
        >
          Duyệt
        </Button>

        <Button
          variant="danger"
          onClick={handleViolation}
        >
          Vi phạm
        </Button>

      </div>

    </div>
  );
};

const SectionBlock = ({
  id,
  title,
  form,
  categories,
  images,
  cover,
  videos
}) => {

  return (

    <section className="border-b pb-10">

      <h2 className="text-xl font-semibold mb-6">
        {title}
      </h2>

      {id === "images" && (
        <ImageUploader value={images} readOnly />
      )}

      {id === "cover" && (
        <ImageUploader value={cover ? [cover] : []} readOnly />
      )}

      {id === "videos" && (
        <VideoUploader value={videos} readOnly />
      )}

      {id === "quantity" && (
        <InputField
          label="Số lượng"
          value={form.quantity}
          disabled
        />
      )}

      {id === "price" && (
        <InputField
          label="Giá"
          value={form.price}
          disabled
        />
      )}

      {id === "weight" && (
        <InputField
          label="Cân nặng"
          value={form.weight}
          disabled
        />
      )}

      {id === "worktime" && (
        <InputField
          label="Thời gian làm"
          value={form.soGioLamViecUocTinh}
          disabled
        />
      )}

      {id === "size" && (
        <DimensionInput
          value={form.size}
          readOnly
        />
      )}

      {id === "description" && (
        <FormInput
          type="textarea"
          value={form.description}
          disabled
        />
      )}

      {id === "category" && (
        <select
          className="border rounded-lg px-3 py-2 w-full"
          value={form.categoryId}
          disabled
        >

          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.ten}
            </option>
          ))}

        </select>
      )}

    </section>
  );
};

export default ProductModerationDetail;