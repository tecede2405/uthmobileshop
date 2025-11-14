import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import HeaderAdmin from "../../../components/HeaderAdmin";
import Footer from "../../../components/footer";

function CreateProductPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    brand: "",
    category: "",
    stock: "",
    thumbnail: "",
    description: "",
    status: "active",
    discount: 0,
    discountPercentage: 0,
    imagesText: "",
    specs: {
      screen: "",
      chip: "",
      ram: "",
      storage: "",
      battery: "",
      camera: "",
      weight: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("specs.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        specs: { ...prev.specs, [key]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: ["price", "stock", "discount", "discountPercentage"].includes(name)
          ? Number(value)
          : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      images: form.imagesText
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url !== ""),
    };
    delete payload.imagesText;

    try {
      const res = await fetch(`${API_URL}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Không thể tạo sản phẩm");
      }

      Swal.fire({
        icon: "success",
        title: "Đã thêm sản phẩm",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/admin/products");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.message });
    }
  };

  return (
    <>
      <HeaderAdmin />
      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">➕ Thêm sản phẩm mới</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tên sản phẩm</Form.Label>
                <Form.Control name="name" value={form.name} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Giá</Form.Label>
                <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Thương hiệu (brand)</Form.Label>
                <Form.Control name="brand" value={form.brand} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Danh mục (Category)</Form.Label>
                <Form.Control name="category" value={form.category} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số lượng kho</Form.Label>
                <Form.Control type="number" name="stock" value={form.stock} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ảnh đại diện (thumbnail)</Form.Label>
                <Form.Control name="thumbnail" value={form.thumbnail} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select name="status" value={form.status} onChange={handleChange}>
                  <option value="active">Còn hàng</option>
                  <option value="inactive">Hết hàng</option>
                  <option value="coming">Sắp ra mắt</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả sản phẩm</Form.Label>
                <Form.Control as="textarea" rows={4} name="description" value={form.description} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Giảm giá (VNĐ)</Form.Label>
                <Form.Control type="number" name="discount" value={form.discount} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phần trăm giảm giá (%)</Form.Label>
                <Form.Control type="number" name="discountPercentage" value={form.discountPercentage} onChange={handleChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ảnh phụ (mỗi dòng 1 URL)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="imagesText"
                  value={form.imagesText}
                  onChange={handleChange}
                />
              </Form.Group>

              <h5 className="mt-4 mb-3">Thông số kỹ thuật</h5>
              {["screen", "chip", "ram", "storage", "battery", "camera", "weight"].map((spec) => (
                <Form.Group className="mb-2" key={spec}>
                  <Form.Label>{spec.toUpperCase()}</Form.Label>
                  <Form.Control
                    name={`specs.${spec}`}
                    value={form.specs[spec]}
                    onChange={handleChange}
                  />
                </Form.Group>
              ))}
            </Col>
          </Row>

          <div className="text-end mt-4">
            <Button variant="primary" type="submit">
              Lưu sản phẩm
            </Button>
          </div>
        </Form>
      </div>
      <Footer />
    </>
  );
}

export default CreateProductPage;