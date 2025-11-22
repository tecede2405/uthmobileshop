// src/pages/Cart.js
import React, { useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./style.css";


const Cart = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { cart, setCart, fetchCart } = useCart();
  const token = localStorage.getItem("token");

  // Cuộn lên đầu
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" }); 
  }, []);
  
  useEffect(() => {
    if (token) fetchCart();
    else navigate("/login");
  }, [token, navigate, fetchCart]);

  const handleRemove = async (productId) => {
    const confirm = await Swal.fire({
      title: "Xóa sản phẩm này?",
      text: "Bạn có chắc muốn xóa sản phẩm khỏi giỏ hàng không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, xóa ngay!",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/users/cart/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể xóa sản phẩm");

      const data = await res.json();
      setCart(data.cart);
      fetchCart();

      Swal.fire({
        icon: "success",
        title: "Đã xóa sản phẩm",
        text: "Sản phẩm đã được xóa khỏi giỏ hàng!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.message });
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await fetch(`${API_URL}/users/cart/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!res.ok) throw new Error("Không thể cập nhật số lượng");
      const data = await res.json();
      setCart(data.cart);
      fetchCart();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.message });
    }
  };

  const handleClearCart = async () => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa giỏ hàng?",
      text: "Bạn có chắc muốn xóa toàn bộ sản phẩm khỏi giỏ hàng không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, xóa tất cả!",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/users/cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể xóa toàn bộ giỏ hàng");

      setCart([]);
      fetchCart();

      Swal.fire({
        icon: "success",
        title: "Đã xóa toàn bộ giỏ hàng",
        text: "Chúc quý khách mua sắm vui vẻ!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.message });
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Swal.fire({ icon: "warning", title: "Giỏ hàng trống!" });
      return;
    }
    navigate("/checkout", { state: { items: cart, fromCart: true } });
  };
  const getDiscountedPrice = (item) => {
    const price = item.productId.price;
    const discount = item.productId.discount || 0; // mặc định 0 nếu không có giảm giá
    return price * (1 - discount / 100);
  };

  const totalPrice = cart.reduce(
  (sum, item) => sum + getDiscountedPrice(item) * (item.quantity || 1),
  0 );



  return (
    <div className="cart container mt-5 mb-3">
      <h2 className="mb-4 text-center">🛒 Giỏ hàng của bạn</h2>

      {cart.length === 0 ? (
        <p className="text-center">Giỏ hàng trống</p>
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
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="text-center">
  {cart.map((item) => (
    <tr key={item.productId._id}>
      <td data-label="Ảnh">
        <img
          src={item.productId.thumbnail}
          alt={item.productId.name}
          width="70"
          style={{ borderRadius: "8px" }}
        />
      </td>
      <td data-label="Tên sản phẩm">{item.productId.name}</td>
      <td data-label="Giá">{getDiscountedPrice(item).toLocaleString()}₫</td>
      <td data-label="Số lượng">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            handleQuantityChange(item.productId._id, item.quantity - 1)
          }
        >
          -
        </Button>{" "}
        {item.quantity}{" "}
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            handleQuantityChange(item.productId._id, item.quantity + 1)
          }
        >
          +
        </Button>
      </td>
      <td data-label="Tổng">
        {(getDiscountedPrice(item) * item.quantity).toLocaleString()}₫
      </td>
      <td data-label="Hành động">
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleRemove(item.productId._id)}
        >
          Xóa
        </Button>
      </td>
    </tr>
  ))}
</tbody>

          </Table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button variant="outline-danger" onClick={handleClearCart}>
              🗑️ Xóa tất cả
            </Button>

            <h5 className="mb-0">
              Tổng cộng:{" "}
              <span className="text-danger fw-bold">
                {totalPrice.toLocaleString()}₫
              </span>
            </h5>

            <Button variant="success" onClick={handleCheckout}>
              💳 Thanh toán
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;