import { useEffect, useState } from "react";
import { Table, Accordion, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

function OrderHistoryPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "Đang chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Đã hoàn tất";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  // Cuộn lên đầu
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Tải danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Không thể tải đơn hàng");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi tải lịch sử đơn hàng",
          text: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token, API_URL]);

  // Hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Bạn có chắc muốn hủy đơn hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, hủy đơn",
      cancelButtonText: "Không",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Không thể hủy đơn hàng");

        Swal.fire({
          icon: "success",
          title: "Đã hủy đơn hàng thành công",
          timer: 2000,
          showConfirmButton: false,
        });

        // Reload lại danh sách đơn hàng
        const updated = await fetch(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await updated.json();
        setOrders(data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi hủy đơn hàng",
          text: err.message,
        });
      }
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">Lịch sử mua hàng</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center">Bạn chưa mua đơn hàng nào</p>
      ) : (
        <Accordion defaultActiveKey="0">
          {orders.map((order, index) => (
            <Accordion.Item eventKey={index.toString()} key={order._id}>
              <Accordion.Header>
                Đơn hàng ngày {new Date(order.createdAt).toLocaleDateString()} –{" "}
                {order.total.toLocaleString()}₫ –{" "}
                {order.method === "cod" ? "COD" : "Tại cửa hàng"} –{" "}
                <span className="text-success">
                  Trạng thái: {translateStatus(order.status)}
                </span>
              </Accordion.Header>
              <Accordion.Body>
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
                    {order.items.map((item) => {
                      const product = item.productId;
                      return (
                        <tr key={product._id}>
                          <td>
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              width="60"
                              style={{ borderRadius: "6px" }}
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>{item.price.toLocaleString()}₫</td>
                          <td>{item.quantity}</td>
                          <td>
                            {(item.price * item.quantity).toLocaleString()}₫
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>

                <div className="mt-3">
                  <strong>Thông tin người nhận:</strong>
                  <ul>
                    <li>Họ tên: {order.info.name}</li>
                    <li>Số điện thoại: {order.info.phone}</li>
                    {order.method === "cod" && (
                      <li>Địa chỉ: {order.info.address}</li>
                    )}
                    {order.method === "store" && (
                      <>
                        <li>Ngày đến: {order.info.date}</li>
                        <li>Giờ đến: {order.info.time}</li>
                      </>
                    )}
                  </ul>
                </div>

                {order.status === "pending" && (
                  <div className="mt-3 text-end">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Hủy đơn hàng
                    </button>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </div>
  );
}

export default OrderHistoryPage;