import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "./style.css";

function Register() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
   // Cuộn lên đầu
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Mật khẩu không khớp!",
        text: "Vui lòng kiểm tra lại mật khẩu.",
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Đăng ký thành công!",
          text : "Hãy đăng nhập tài khoản để mua hàng nhé!",
          showConfirmButton: false,
          timer: 1500,
        });

        // Sau khi đăng ký xong → chuyển về login
        setTimeout(() => navigate("/login"), 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Đăng ký thất bại",
          text: data.message || "Email đã tồn tại hoặc dữ liệu không hợp lệ",
        });
      }
    } catch (err) {
      console.error("Lỗi:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi máy chủ",
        text: "Không thể kết nối đến server!",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="login-container d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow p-4" style={{ width: "400px", borderRadius: "16px" }}>
          <h2 className="text-center mb-4">Đăng ký</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập họ và tên..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Nhập email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Xác nhận mật khẩu</label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập lại mật khẩu..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Đăng ký
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            Đã có tài khoản?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Đăng nhập ngay
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
