import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend } from "chart.js";
import HeaderAdmin from "../../../components/HeaderAdmin";
import Footer from "../../../components/footer";
import "./style.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend);

function AdminDashboardPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [API_URL, token]);

  if (loading || !stats) {
    return (
      <>
        <HeaderAdmin />
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  const revenueChart = {
    labels: stats.revenueByMonth.map((r) => r.month),
    datasets: [
      {
        label: "Doanh thu (₫)",
        data: stats.revenueByMonth.map((r) => r.total),
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const orderStatusChart = {
    labels: ["Chờ duyệt", "Đã duyệt", "Hoàn tất", "Đã hủy"],
    datasets: [
      {
        label: "Số đơn",
        data: [
          stats.orderStatus.pending,
          stats.orderStatus.confirmed,
          stats.orderStatus.completed,
          stats.orderStatus.cancelled,
        ],
        backgroundColor: ["#6c757d", "#0d6efd", "#198754", "#dc3545"],
      },
    ],
  };

  const topProductsChart = {
    labels: stats.topProducts.map((p) => p.name),
    datasets: [
      {
        label: "Số lượng bán",
        data: stats.topProducts.map((p) => p.sold),
        backgroundColor: "#ffc107",
      },
    ],
  };

  return (
    <>
      <HeaderAdmin />
      <Container className="mt-5 mb-5">
        <h2 className="text-center mb-4">Thống kê tổng quan</h2>

        <Row className="mb-2">
          <Col md={6}>
            <Card className="p-3 mb-2">
              <h5 className="text-center">Doanh thu theo tháng</h5>
              <Bar data={revenueChart} />
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-3">
              <h5 className="text-center">Trạng thái đơn hàng</h5>
              <Pie data={orderStatusChart} />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="p-3">
              <h5 className="text-center">Top sản phẩm bán chạy</h5>
              <Bar data={topProductsChart} />
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default AdminDashboardPage;