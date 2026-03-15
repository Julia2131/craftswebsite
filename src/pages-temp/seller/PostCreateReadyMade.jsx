import { useRef, useState, useEffect } from "react";
import Button from "../../components/Button";
import ImageUploader from "../../components/ImageUploader";
import InputField from "../../components/InputField";
import DimensionInput from "../../components/DimensionInput";
import VideoUploader from "../../components/VideoUploader";

const sections = [
  { id: "images", label: "Hình ảnh sản phẩm" },
  { id: "cover", label: "Hình bìa" },
  { id: "video", label: "Video sản phẩm" },
  { id: "quantity", label: "Số lượng" },
  { id: "price", label: "Giá" },
  { id: "weight", label: "Cân nặng" },
  { id: "size", label: "Kích thước" },
];

export const PostCreateReadyMade = () => {
  const containerRef = useRef(null);
  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState("images");

  const scrollToSection = (id) => {
    const section = sectionRefs.current[id];
    if (!section) return;

    const top =
      section.offsetTop - 80;

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

  useEffect(() => {
    const el = containerRef.current;
    el.addEventListener("scroll", handleScroll);

    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const [form, setForm] = useState({
    video: "",
    quantity: "",
    price: "",
    weight: "",
    size: {
        length: "",
        width: "",
        height: "",
    },
    });

  return (
    <div className="flex flex-col h-screen bg-white px-[120px] pt-[40px]">

      {/* HEADING */}
      <h1 className="text-3xl font-bold mb-6">
        Tạo sản phẩm
      </h1>

      <div className="flex flex-1 gap-10 overflow-hidden">

        {/* LEFT NAVIGATION */}

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

        {/* RIGHT CONTENT */}

        <div className="flex flex-col flex-1 overflow-hidden">

          {/* SCROLL AREA */}

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
                {/* <SectionBlock title={section.label} /> */}
                <SectionBlock
                    id={section.id}
                    title={section.label}
                    form={form}
                    setForm={setForm}
                />
              </div>
            ))}

          </div>

          {/* ACTION BUTTONS */}

          <div className="flex justify-center gap-6 border-t pt-4 pb-2 bg-white">

            <Button variant="danger">
                Hủy
            </Button>

            <Button variant="outline">
                Xem trước
            </Button>

            <Button variant="primary">
                Lưu và ẩn
            </Button>

            <Button variant="success">
                Lưu và hiển thị
            </Button>

          </div>

        </div>

      </div>
    </div>
  );
};

// const SectionBlock = ({ title }) => {
//   return (
//     <section className="border-b pb-10">

//       <h2 className="text-xl font-semibold mb-4">
//         {title}
//       </h2>

//       <div className="w-full h-[180px] border rounded-lg flex items-center justify-center text-gray-400">
//         Nội dung {title}
//       </div>

//     </section>
//   );
// };

const SectionBlock = ({ id, title, form, setForm }) => {
  return (
    <section className="border-b pb-10">

      <h2 className="text-xl font-semibold mb-4">
        {title}
      </h2>

      {id === "images" && (
        <ImageUploader multiple />
      )}

      {id === "cover" && (
        <ImageUploader multiple={false} />
      )}

      {id === "video" && (
        <VideoUploader />
        )}

      {id === "quantity" && (
        <InputField
          label="Số lượng"
          type="number"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
        />
      )}

      {id === "price" && (
        <InputField
          label="Giá bán"
          type="number"
          suffix="₫"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />
      )}

      {id === "weight" && (
        <InputField
          label="Cân nặng"
          type="number"
          suffix="kg"
          value={form.weight}
          onChange={(e) =>
            setForm({ ...form, weight: e.target.value })
          }
        />
      )}

      {id === "size" && (
        <DimensionInput
          value={form.size}
          setValue={(v) =>
            setForm({ ...form, size: v })
          }
        />
      )}

    </section>
  );
};
