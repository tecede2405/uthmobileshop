import { FaCartArrowDown, FaBars} from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { CiSearch, CiClock1 } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import logo from "../assets/image/logo.png";
import { useCart } from "../context/CartContext";

function Header({ onToggleSidebar } ) {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef(null);
  const [user, setUser] = useState(null);
  const { cartCount, fetchCart } = useCart(); // ✅ Lấy từ Context
  const [showSearchInput, setShowSearchInput] = useState(false);


  // ✅ Lấy thông tin user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location.pathname]);

  // ✅ Tự động reload giỏ hàng mỗi khi đổi trang
  useEffect(() => {
    fetchCart();
  }, [location.pathname, fetchCart]);

  const handleClickHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  // thao tác trang giỏ hàng
  const handleClickCart = () => {
    if (!user) {
      Swal.fire({
        title: "Bạn cần đăng nhập để thực hiện thao tác này",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      navigate("/cart");
    }
  };


  // thao tác trang lịch sử mua hàng
  const handleClickHistory = () => {
    if (!user) {
      Swal.fire({
        title: "Bạn cần đăng nhập để xem lịch sử đặt hàng",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      navigate("/order-history");
    }
  };


  const handleSearch = () => {
    if (keyword.trim() !== "") {
      navigate(`/search-name?name=${encodeURIComponent(keyword.trim())}`);
    }
  };

  // Reset ô tìm kiếm khi đổi trang
  useEffect(() => {
    setKeyword("");
    if (inputRef.current) inputRef.current.value = "";
  }, [location.pathname]);

  const handleLogout = () => {
  Swal.fire({
    title: 'Bạn có chắc chắn muốn đăng xuất?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Có, đăng xuất',
    cancelButtonText: 'Hủy',
  }).then((result) => {
    if (result.isConfirmed) {
      // ✅ Xóa user và token
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);

      // ✅ Thông báo đã đăng xuất thành công
      Swal.fire({
        icon: 'success',
        title: 'Đăng xuất thành công',
        text: 'Shop hẹn gặp lại bạn nhé!',
        timer: 2000,
        showConfirmButton: false,
      });

      // ✅ Điều hướng về login
      navigate("/login");
    }
  });
};

  const handleLogin = () => navigate("/login");

  return (
    <>
      <header className="header">
        <div className="container page-header">
          <button
            className="btn-menu-toggle d-md-none"
            onClick={onToggleSidebar}
          >
            <FaBars size={24} />
          </button>

          <img
            src={logo}
            alt="logo"
            className="logo-page"
            onClick={handleClickHome}
          />

      
          <div className="page-search">
            <input
              type="text"
              className="search-input"
              placeholder="Bạn muốn mua gì?"
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              ref={inputRef}
            />
            <CiSearch
              className="search-button me-2"
              onClick={() => setShowSearchInput(!showSearchInput)}
            />
          </div>


          <div className="page-cart" onClick={handleClickCart}>
            <p className="cart-title">Giỏ hàng ({cartCount})</p>
            <FaCartArrowDown className="header-icon"/>
          </div>

          <div className="page-contact" onClick={handleClickHistory}>
            <p className="contact-title">Lịch sử</p>
            <CiClock1 className="header-icon"/>
          </div>


          {/* Đăng nhập / Đăng xuất */}
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
            <div className="page-login" onClick={handleLogin}>
              <p className="login-title">Đăng nhập</p>
              <RxAvatar className="header-icon"/>
            </div>
          )}
        </div>
    </header>
    <div className="mobile-search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Bạn muốn mua gì?"
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        ref={inputRef}
      />
      <button className="btn btn-primary btn-sm" onClick={handleSearch}>
        Tìm kiếm
      </button>
    </div>
    </>
  );
}

export default Header;
