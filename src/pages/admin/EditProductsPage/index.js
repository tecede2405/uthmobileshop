import { useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import HeaderAdmin from "../../../components/HeaderAdmin"; 
import Footer from "../../../components/footer";

function EditProductPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Không thể tải sản phẩm");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Lỗi", text: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Không thể cập nhật sản phẩm");

      Swal.fire({ icon: "success", title: "Thành công",text: "Cập nhật sản phẩm thành công", timer: 1500, showConfirmButton: false });
      navigate("/admin");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
    <HeaderAdmin />
      <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">Sửa sản phẩm</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : product ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên sản phẩm</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Giá</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Thương hiệu</Form.Label>
            <Form.Control
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Danh mục</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ảnh chính (thumbnail)</Form.Label>
            <Form.Control
              type="text"
              name="thumbnail"
              value={product.thumbnail}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select name="status" value={product.status} onChange={handleChange}>
              <option value="active">Còn hàng</option>
              <option value="inactive">Hết hàng</option>
              <option value="coming">Sắp ra mắt</option>
            </Form.Select>
          </Form.Group>

          <div className="text-end">
            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      ) : (
        <p className="text-center text-danger">Không tìm thấy sản phẩm</p>
      )}
    </div>
    <Footer />
    </>
    
  );
}

export default EditProductPage;