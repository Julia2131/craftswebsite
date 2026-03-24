import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import ImageUploader from "../../components/ImageUploader";
import InputField from "../../components/InputField";
import DimensionInput from "../../components/DimensionInput";
import VideoUploader from "../../components/VideoUploader";
import FormInput from "../../components/FormInput";
import { uploadToCloudinary } from "../../services/uploadToCloudinary";
import UploadLoading from "../../components/UploadLoading";
import { useParams } from "react-router-dom";

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

export const PostCreateReadyMade = () => {

  const API = import.meta.env.VITE_API_URL;

  const containerRef = useRef(null);
  const navigate = useNavigate();
  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState("images");

  const [categories, setCategories] = useState([]);

  const [images, setImages] = useState([]);
  const [cover, setCover] = useState(null);
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    description: "",
    price: "",
    giaGoc: "",
    weight: "",
    quantity: "",
    soGioLamViecUocTinh: "",
    categoryId: "",
    size: {
      length: "",
      width: "",
      height: "",
    }
  });

  const [errors, setErrors] = useState({
    quantity: "",
    price: "",
    weight: "",
    description: "",
    size: {
      length: "",
      width: "",
      height: "",
    },
  });

  useEffect(() => {

      if (!id) {

        // reset toàn bộ form khi tạo mới
        setForm({
          description: "",
          price: "",
          giaGoc: "",
          weight: "",
          quantity: "",
          soGioLamViecUocTinh: "",
          categoryId: "",
          size: {
            length: "",
            width: "",
            height: "",
          }
        });

        setImages([]);
        setVideos([]);
        setCover(null);

        return;
      }

    const fetchProduct = async () => {

      const res = await fetch(`${API}/san-pham-co-san/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();

      console.log("DATA", data);

      setForm({
        description: data.moTa || "",
        price: data.gia || "",
        giaGoc: data.giaGoc || "",
        weight: data.canNang || "",
        quantity: data.soLuongBanDau || "",

        soGioLamViecUocTinh: data.sanPham?.soGioLamViecUocTinh || "",

        categoryId: data.sanPham?.danhMuc?.id || "",

        size: {
          length: data.chieuDai || "",
          width: data.chieuRong || "",
          height: data.chieuCao || ""
        }
      });

      const links = data.sanPham?.anhVideos?.map(v => v.link) || [];

      const imageLinks = links.filter(l =>
        l.includes(".jpg") || l.includes(".png") || l.includes(".jpeg")
      );

      const videoLinks = links.filter(l =>
        l.includes(".mp4") || l.includes(".mov")
      );

      console.log("====== ALL MEDIA LINKS ======");
      console.log("RAW LINKS:", links);

      console.log("------ IMAGE LINKS ------");
      imageLinks.forEach((link, i) => {
        console.log(`IMG ${i + 1}:`, link);
      });

      console.log("------ VIDEO LINKS ------");
      videoLinks.forEach((link, i) => {
        console.log(`VIDEO ${i + 1}:`, link);
      });

      console.log("TOTAL IMG:", imageLinks.length);
      console.log("TOTAL VIDEO:", videoLinks.length);

      console.log("================================");

      setImages(imageLinks);
      setVideos(videoLinks);

      if (imageLinks.length > 0) {
        setCover(imageLinks[0]);
      }

    };

    fetchProduct();

  }, [id]);

  useEffect(() => {
    console.log("FORM STATE", form);
  }, [form]);

  const uploadFiles = async (files, folder) => {

    if (!files) return [];

    const fileArray = (Array.isArray(files) ? files : [files])
    .filter(f => f);

    const urls = await Promise.all(
      fileArray.map(file => {

        if (typeof file === "string") return file;

        return uploadToCloudinary(file, folder);
      })
    );

    return urls;
  };

  const uploadMedia = async () => {

    const coverUrls = await uploadFiles(cover, "san-pham/cover");

    const imageUrls = await uploadFiles(images, "san-pham/images");

    const videoUrls = await uploadFiles(videos, "san-pham/video");

    return [
      ...(coverUrls || []),
      ...(imageUrls || []),
      ...(videoUrls || [])
    ];
  };

  const scrollToSection = (id) => {
    const section = sectionRefs.current[id];
    if (!section) return;

    const top = section.offsetTop - 80;

    containerRef.current.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const scrollTop = containerRef.current.scrollTop;

    let current = activeSection;

    sections.forEach((sec) => {
      const el = sectionRefs.current[sec.id];
      if (!el) return;

      if (scrollTop >= el.offsetTop - 120) {
        current = sec.id;
      }
    });

    setActiveSection(current);
  };

  const sellerid = localStorage.getItem("register_seller_id");

  useEffect(() => {
    if (!sellerid) {
      alert("Vui lòng đăng nhập trước khi tạo sản phẩm");
      navigate("/log");
    }
  }, []);

  const buildPayload = () => {
    return {

      moTa: form.description,

      gia: Number(form.price),
      giaGoc: Number(form.giaGoc),

      canNang: Number(form.weight),

      chieuDai: Number(form.size.length),
      chieuRong: Number(form.size.width),
      chieuCao: Number(form.size.height),

      soLuongBanDau: Number(form.quantity),
      soLuongHienTai: Number(form.quantity),

      trangThaiSPCS: "LUU_AN",

      sellerId: sellerid,
      danhMucId: Number(form.categoryId),

      trangThaiSanPham: "NHAP",

      soGioLamViecUocTinh: Number(form.soGioLamViecUocTinh),

      trangThaiChungChi: "LUU_AN"

    };
  };

  useEffect(() => {
    fetch(`${API}/danh-muc`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    el.addEventListener("scroll", handleScroll);

    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const createProduct = async (trangThai) => {

    try {

      setLoading(true);
      setProgress(20);

      const mediaLinks = await uploadMedia();

      setProgress(60);

      const payload = buildPayload();

      payload.trangThaiSanPham = trangThai;
      payload.trangThaiChungChi = trangThai;
      payload.trangThaiSPCS = trangThai;

      payload.mediaLinks = mediaLinks;
      console.log("PAYLOAD", payload);

      const res = await fetch(`${API}/san-pham-co-san`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Tạo sản phẩm thất bại");
      }

      setProgress(100);

      navigate("/seller/product/success");

    } catch (err) {

      console.error(err);
      alert("Có lỗi xảy ra");

    } finally {

      setLoading(false);

    }
  };

  const updateProduct = async (trangThai) => {

    setLoading(true);

    const mediaLinks = await uploadMedia();

    const payload = buildPayload();

    payload.trangThaiSanPham = trangThai;
    payload.trangThaiChungChi = trangThai;
    payload.trangThaiSPCS = trangThai;

    payload.mediaLinks = mediaLinks;

    console.log("PAYLOAD", payload);

    await fetch(`${API}/san-pham-co-san/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(payload)
    });

    setLoading(false);

    navigate("/seller/product/all");
  };

  return (
    <>
      {loading && (
        <UploadLoading
          progress={progress}
          title={
            isEdit
              ? "Đang cập nhật sản phẩm handmade..."
              : "Đang tạo sản phẩm handmade..."
          }
          description={
            isEdit
              ? "Đang cập nhật hình ảnh và video lên hệ thống"
              : "Đang tải hình ảnh và video lên hệ thống"
          }
        />
      )}

      <div className="flex flex-col h-screen bg-white px-[120px] pt-[40px]">

        <h1 className="text-3xl font-bold mb-6">
          {isEdit ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm"}
        </h1>

        <div className="flex flex-1 gap-10 overflow-hidden">

          <nav className="w-[230px] sticky top-[120px] h-fit">
            <div className="flex flex-col gap-2">
              {sections.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left px-4 py-2 rounded-lg transition
                  ${
                    activeSection === item.id
                      ? "bg-[#4338CA] text-white"
                      : "hover:bg-[#6366F1] hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex flex-col flex-1 overflow-hidden">

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
                    setForm={setForm}
                    errors={errors}
                    setErrors={setErrors}
                    validateField={() => {}}
                    validateSize={() => {}}
                    categories={categories}
                    setImages={setImages}
                    setCover={setCover}
                    setVideos={setVideos}
                    images={images}
                    cover={cover}
                    videos={videos}
                  />
                </div>
              ))}

            </div>

            <div className="flex justify-center gap-6 border-t pt-4 pb-2 bg-white">

              <Button variant="danger">Hủy</Button>

              <Button variant="outline">Xem trước</Button>

              <Button
                variant="primary"
                onClick={() => {
                  if (isEdit)
                    updateProduct("LUU_AN")
                  else
                    createProduct("LUU_AN")
                }}
              >
                Lưu và ẩn
              </Button>

              <Button
                variant="success"
                onClick={() => {
                  if (isEdit)
                    updateProduct("LUU_HIEN")
                  else
                    createProduct("LUU_HIEN")
                }}
              >
                Lưu và hiển thị
              </Button>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

const SectionBlock = ({
  id,
  title,
  form,
  setForm,
  errors,
  setErrors,
  validateField,
  validateSize,
  categories,
  setImages,
  setCover,
  setVideos,
  images,
  cover,
  videos
}) =>  {  return (
    <section className="border-b pb-10">

      <h2 className="text-xl font-semibold mb-6">
        {title}
      </h2>

      {id === "images" && (
        <ImageUploader 
          multiple 
          // value={images ? [images] : []}
          value={images}
          onChange={(files) => setImages(files)}
        />
      )}

      {id === "cover" && (
        <ImageUploader 
          multiple={false} 
          value={cover ? [cover] : []}
          // value={cover}
          // onChange={(file) => setCover(file)}
          onChange={(files) => setCover(files[0] || null)}
        />
      )}

      {id === "videos" && (
        <VideoUploader 
          multiple
          // value={videos ? [videos] : []}
          value={videos}
          onChange={(files) => setVideos(files)}
        />
      )}

      {id === "quantity" && (
        <div className="max-w-[320px]">
          <InputField
            id="product-quantity"
            label="Số lượng"
            type="number"
            placeholder="Nhập số lượng sản phẩm"
            helperText="Số lượng tồn kho"
            error={errors.quantity}
            value={form.quantity}
            onChange={(e) => {
              const value = e.target.value;

              setForm({ ...form, quantity: value });
              validateField("quantity", value);
            }}
          />
        </div>
      )}

      {id === "price" && (
        <div className="max-w-[320px]">
          <InputField
            id="product-price"
            label="Giá bán"
            type="number"
            placeholder="Nhập giá bán"
            helperText="Giá hiển thị cho khách hàng"
            error={errors.price}
            suffix="₫"
            value={form.price}
            onChange={(e) => {
              const value = e.target.value;

              setForm({ ...form, price: value });
              validateField("price", value);
            }}
          />
        </div>
      )}

      {id === "weight" && (
        <div className="max-w-[320px]">
          <InputField
            id="product-weight"
            label="Cân nặng sau khi đóng gói"
            type="number"
            placeholder="Nhập cân nặng"
            helperText="Dùng để tính phí vận chuyển"
            error={errors.weight}
            suffix="kg"
            value={form.weight}
            onChange={(e) => {
              const value = e.target.value;

              setForm({ ...form, weight: value });
              validateField("weight", value);
            }}
          />
        </div>
      )}

      {id === "size" && (
        <div className="max-w-[500px]">
          <DimensionInput
            value={form.size}
            setValue={(v) =>
              setForm({ ...form, size: v })
            }
            errors={errors.size}
            validateSize={validateSize}
          />
        </div>
      )}

      {id === "category" && (
        <div className="max-w-[320px]">
          <label className="block mb-2 font-medium">
            Chọn danh mục
          </label>

          <select
            className="border rounded-lg px-3 py-2 w-full"
            value={form.categoryId}
            onChange={(e) =>
              setForm({
                ...form,
                categoryId: e.target.value,
              })
            }
          >
            <option value="">-- Chọn danh mục --</option>

            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ten}
              </option>
            ))}
          </select>
        </div>
      )}

      {id === "worktime" && (
        <div className="max-w-[320px]">
          <InputField
            id="product-worktime"
            label="Số giờ làm một sản phẩm"
            type="number"
            placeholder="Nhập số giờ làm"
            helperText="Thời gian ước tính để làm sản phẩm"
            value={form.soGioLamViecUocTinh}
            suffix="Phút"
            onChange={(e) => {
              const value = e.target.value;

              setForm({
                ...form,
                soGioLamViecUocTinh: value
              });
            }}
          />
        </div>
      )}

      {id === "description" && (
        <div className="max-w-[600px]">
          <FormInput
          label="Câu chuyện thú vị về sản phẩm"
          name="product-description"
          type="textarea"
          value={form.description}
          placeholder="Hãy kể câu chuyện về sản phẩm..."
          helper="Ví dụ: chất liệu, cách sử dụng, cảm hứng thiết kế"
          error={errors.description}
          onChange={(e) => {
            const value = e.target.value;
            setForm({ ...form, description: value });
            validateField("description", value);
          }}
          />
          </div>
        )}

    </section>
  );

};
