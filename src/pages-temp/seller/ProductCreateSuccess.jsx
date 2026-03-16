import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/EmptyState";

function ProductCreateSuccess() {
  const navigate = useNavigate();

  return (
    <EmptyState
      illustration="🎉"
      title="Tạo sản phẩm thành công!"
      description="Sản phẩm của bạn đã được lưu vào hệ thống."
      primaryActionText="Về trang quản lý"
      onPrimaryAction={() => navigate("/seller/home")}
      secondaryActionText="Tạo sản phẩm mới"
      onSecondaryAction={() => navigate("/seller/product/create")}
    />
  );
}

export default ProductCreateSuccess;