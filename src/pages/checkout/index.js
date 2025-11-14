import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useCart } from "../../context/CartContext";
import "./style.css";

function CheckoutPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const [items, setItems] = useState([]);
  const [method, setMethod] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const buyNowItem = location.state?.buyNowItem;
    const itemsFromCart = location.state?.items;

    if (buyNowItem) {
      setItems([buyNowItem]);
    } else if (Array.isArray(itemsFromCart)) {
      setItems(itemsFromCart);
    } else {
      setItems([]);
    }
  }, [location.state]);

  const total = items.reduce((sum, item) => {
    const price = item.price || item.productId?.price || 0;
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  const handleConfirm = async () => {
    const { name, phone, address, date, time } = formData;
    const token = localStorage.getItem("token");

    if (!name.trim() || !phone.trim()) {
      Swal.fire({ icon: "warning", title: "Vui lòng nhập tên và số điện thoại" });
      return;
    }

    if (method === "cod" && !address.trim()) {
      Swal.fire({ icon: "warning", title: "Vui lòng nhập địa chỉ giao hàng" });
      return;
    }

    if (method === "store" && (!date || !time)) {
      Swal.fire({ icon: "warning", title: "Vui lòng chọn ngày và giờ đến cửa hàng" });
      return;
    }

    const orderItems = items.map((item) => ({
      productId: item.productId?._id || item._id,
      quantity: item.quantity || 1,
      price: item.productId?.price || item.price || 0,
    }));

    const orderData = {
      items: orderItems,
      method,
      info: {
        name,
        phone,
        ...(method === "cod" && { address }),
        ...(method === "store" && { date, time }),
      },
      total,
    };

    try {
      Swal.fire({ title: "Đang xử lý đơn hàng...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      // Gửi đơn hàng
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Không thể tạo đơn hàng");

      // Xóa giỏ hàng
      await fetch(`${API_URL}/users/cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchCart(); // cập nhật lại header

      Swal.fire({
        icon: "success",
        title: "Đặt hàng thành công!",
        text: "Đơn hàng của bạn đã được ghi nhận.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/order-history"); // hoặc chuyển về trang chủ nếu chưa có trang lịch sử

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi khi đặt hàng",
        text: err.message || "Vui lòng thử lại sau.",
      });
    }
  };

  return (
    <div className="checkout-page container mt-5 mb-5">
      <h2 className="text-center mb-4">Thanh toán đơn hàng</h2>

      {items.length === 0 ? (
        <p className="text-center">Không có sản phẩm để thanh toán.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="text-center">
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {items.map((item) => {
                const product = item.productId || item;
                const quantity = item.quantity || 1;
                const price = product.price || 0;
                return (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        width="70"
                        style={{ borderRadius: "8px" }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{price.toLocaleString()}₫</td>
                    <td>{quantity}</td>
                    <td>{(price * quantity).toLocaleString()}₫</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <h4 className="mt-4">
            Tổng tiền:{" "}
            <span className="text-danger fw-bold">
              {total.toLocaleString()}₫
            </span>
          </h4>

          <Form className="mt-4 checkout-form">
            <Form.Group>
              <Form.Label>Phương thức thanh toán</Form.Label>
              <Form.Select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="">-- Chọn phương thức --</option>
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="store">Thanh toán tại cửa hàng</option>
              </Form.Select>
            </Form.Group>

            {(method === "cod" || method === "store") && (
              <>
                <Form.Group className="mt-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập họ tên"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </Form.Group>
              </>
            )}

            {method === "cod" && (
              <Form.Group className="mt-3">
                <Form.Label>Địa chỉ giao hàng</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập địa chỉ nhận hàng"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </Form.Group>
            )}

            {method === "store" && (
              <>
                <Form.Group className="mt-3">
                  <Form.Label>Ngày đến cửa hàng</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Giờ đến cửa hàng</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </Form.Group>
              </>
            )}
          </Form>

          <div className="text-end mt-4">
            <Button variant="primary" size="lg" onClick={handleConfirm}>
              Xác nhận
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default CheckoutPage;