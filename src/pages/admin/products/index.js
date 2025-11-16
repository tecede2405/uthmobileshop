import { useEffect, useState } from "react";
import { Table, Button, Spinner, Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import HeaderAdmin from "../../../components/HeaderAdmin";
import Footer from "../../../components/footer";
import "./style.css";

function AdminProductPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Lấy từ khóa tìm kiếm từ URL
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("name") || "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${API_URL}/admin/products?page=${page}&limit=${limit}&name=${encodeURIComponent(keyword)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Không thể tải sản phẩm");
        }

        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Lỗi", text: err.message });
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProducts();
  }, [token, page, API_URL, keyword]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Xóa sản phẩm?",
      text: "Bạn có chắc muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể xóa sản phẩm");

      setProducts((prev) => prev.filter((p) => p._id !== id));
      setTotal((prevTotal) => prevTotal - 1);

      if (products.length === 1 && page > 1) {
        setPage((prevPage) => prevPage - 1);
      } else {
        setLoading(true);
      }

      Swal.fire({
        icon: "success",
        title: "Đã xóa sản phẩm",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.message });
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const confirm = await Swal.fire({
      title: "Thay đổi trạng thái?",
      text: `Bạn có chắc muốn chuyển sang trạng thái "${newStatus === "active" ? "Còn hàng" : "Hết hàng"}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/admin/products/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Không thể cập nhật trạng thái");

      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã cập nhật trạng thái",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.message });
    }
  };

  const renderStatusBadge = (status, id) => {
    let color = "secondary";
    let label = "Đang cập nhật";

    if (status === "active") {
      color = "success";
      label = "Còn hàng";
    } else if (status === "inactive") {
      color = "danger";
      label = "Hết hàng";
    } else if (status === "coming") {
      color = "warning";
      label = "Sắp ra mắt";
    }

    return (
      <Badge
        bg={color}
        style={{ cursor: "pointer" }}
        onClick={() => handleToggleStatus(id, status)}
      >
        {label}
      </Badge>
    );
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1 || total === 0) return null;

    return (
      <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNumber = i + 1;
          return (
            <Button
              key={pageNumber}
              variant={page === pageNumber ? "primary" : "outline-primary"}
              onClick={() => {
                setLoading(true);
                setPage(pageNumber);
              }}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <HeaderAdmin />
      <div className="container mt-4 mb-5">
        <h2 className="text-center mb-1">Quản lý sản phẩm</h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <div className="text-end mb-2">
              <Button variant="success" onClick={() => navigate("/admin/products/create")}>
                + Thêm sản phẩm mới
              </Button>
            </div>

            <Table striped bordered hover responsive>
              <thead className="text-center table-light">
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      Không tìm thấy sản phẩm nào.
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr key={item._id}>
                      <td data-label="Ảnh">
                        <img src={item.thumbnail} alt={item.name} width="70" className="rounded" />
                      </td>
                      <td data-label="Tên">{item.name}</td>
                      <td data-label="Giá" className="text-danger fw-bold">
                        {item.price.toLocaleString()}
                      </td>
                      <td data-label="Trạng thái">{renderStatusBadge(item.status, item._id)}</td>
                      <td data-label="Hành động">
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/admin/products/edit/${item._id}`)}
                        >
                          Sửa
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(item._id)}>
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </Table>

            {renderPagination()}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default AdminProductPage;