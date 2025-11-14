import { useEffect, useState } from "react";
import { Table, Button, Spinner, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import HeaderAdmin from "../../../components/HeaderAdmin";
import Footer from "../../../components/footer";

function AdminOrderPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể tải đơn hàng" });
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token, API_URL]);

  const handleConfirm = async (id) => {
    const confirm = await Swal.fire({
      title: "Duyệt đơn hàng?",
      text: "Bạn có chắc muốn duyệt đơn này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Duyệt",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/admin/orders/${id}/confirm`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể duyệt đơn");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? updated.order : o))
      );

      Swal.fire({ icon: "success", title: "Đã duyệt đơn", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.message });
    }
  };

  const renderStatus = (status) => {
    const map = {
      pending: { color: "secondary", label: "Chờ duyệt" },
      confirmed: { color: "primary", label: "Đã duyệt" },
      completed: { color: "success", label: "Hoàn tất" },
      cancelled: { color: "danger", label: "Đã hủy" },
    };
    return <Badge bg={map[status]?.color}>{map[status]?.label}</Badge>;
  };

  return (
    <>
      <HeaderAdmin />
      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">Quản lý đơn hàng</h2>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="text-center table-light">
              <tr>
                <th>Người đặt</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Sản phẩm</th>
                <th>Phương thức</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="text-center align-middle">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.info.name}</td>
                  <td>{order.info.phone}</td>
                  <td>{order.info.address}</td>
                  <td>
                    <ul className="list-unstyled mb-0 text-start">
                      {order.items?.map((item, idx) => (
                        <li key={idx}>
                          {item.productId?.thumbnail && (
                            <img src={item.productId.thumbnail} alt={item.productId.name} width={40} className="me-2" />
                          )}
                          {item.productId?.name ? `${item.productId.name} x${item.quantity}` : "Sản phẩm không xác định"}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{order.method === "cod" ? "Giao tận nơi" : "Nhận tại cửa hàng"}</td>
                  <td className="text-danger fw-bold">{order.total.toLocaleString()}₫</td>
                  <td>{renderStatus(order.status)}</td>
                  <td>
                    {order.status === "pending" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleConfirm(order._id)}
                      >
                        Duyệt
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
      <Footer />
    </>
  );
}

export default AdminOrderPage;