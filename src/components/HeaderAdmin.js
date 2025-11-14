import logo from "../assets/image/logo.png";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { BsFillHandbagFill } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { AiOutlineProduct } from "react-icons/ai";

function HeaderAdmin() {
  const [user, setUser] = useState(null);
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy thông tin user mỗi khi route thay đổi
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location.pathname]);

  // Reset ô tìm kiếm khi chuyển route
  useEffect(() => {
    setKeyword("");
    if (inputRef.current) inputRef.current.value = "";
  }, [location.pathname]);

  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/admin/products?name=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container page-header d-flex justify-content-between align-items-center">
        <img
          src={logo}
          alt="logo"
          className="logo-page"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/admin")}
        />

        <div className="page-search d-flex align-items-center">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm"
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            ref={inputRef}
          />
          <CiSearch
            className="search-button me-2"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div
          className="page-contact d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/admin/products")}
        >
          <p className="contact-title mb-0 me-2">Quản lý sản phẩm</p>
          <AiOutlineProduct />
        </div>

        <div
          className="page-contact d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/admin/orders")}
        >
          <p className="contact-title mb-0 me-2">Quản lý đơn hàng</p>
          <BsFillHandbagFill />
        </div>

        {user ? (
          <div className="page-login d-flex align-items-center">
            <p className="login-title mb-0 me-2">
              <b>{user.username}</b>
            </p>
            <button
              className="login-button btn btn-sm btn-outline-danger"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <div
            className="page-login d-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={handleLogin}
          >
            <p className="login-title mb-0 me-2">Đăng nhập</p>
            <RxAvatar size={24} />
          </div>
        )}
      </div>
    </header>
  );
}

export default HeaderAdmin;