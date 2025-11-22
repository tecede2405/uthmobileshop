import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/image/logo.png";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "./style.css";

function Login() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

    // Cuộn lên đầu
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Lưu token vào localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công!",
          text: "Chào mừng bạn đến với Mobile Shop",
          showConfirmButton: false,
          timer: 1500,
        });

        // Nếu là admin → chuyển qua /admin, còn lại về trang chủ
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại",
          text: data.message || "Sai email hoặc mật khẩu",
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


  const handleBack = () => {
    navigate("/");
  }
  return (
    <>
      <Header />
      <div className="login-container d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow p-4" style={{ width: "400px", borderRadius: "16px" }}>
          <img src={logo} alt="logo" className="logo-login" onClick={handleBack} />
          <h2 className="text-center mb-4">Đăng nhập</h2>
          <form onSubmit={handleSubmit}>
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

            <button type="submit" className="btn btn-primary w-100">
              Đăng nhập
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            Chưa có tài khoản?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Đăng ký ngay
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </>
    
  );
}

export default Login;
