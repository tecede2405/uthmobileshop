import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Tạo rào chắn chỉ admin mới được phép truy cập
function AdminGuard({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "admin";

    if (!isAdmin) {
      Swal.fire({
        icon: "error",
        title: "Truy cập bị từ chối",
        text: "Chỉ có admin mới có quyền truy cập",
        confirmButtonText: "Quay lại trang chủ",
      }).then(() => {
        navigate("/");
      });
    }
  }, [navigate]);

  return children;
}

export default AdminGuard;