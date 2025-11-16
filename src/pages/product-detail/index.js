import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GalleryCarousel from "../../components/detailCarousel";
import SpecsTable from "../../components/specs";
import { FaCartArrowDown } from "react-icons/fa";
import Swal from "sweetalert2";
import DiscountSection from "../../components/DiscountSection";
import { useCart } from "../../context/CartContext"; // Import context
import "./style.css";

function ProductDetail() {
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const { product: stateProduct } = location.state || {};
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart(); // Lấy fetchCart từ context
  const [product, setProduct] = useState(stateProduct || null);

  // Cập nhật lại khi click sang sản phẩm khác
  useEffect(() => {
    if (stateProduct) {
      setProduct(stateProduct);
    }
  }, [stateProduct]);

  //Fetch khi reload hoặc truy cập trực tiếp URL
  useEffect(() => {
    if (!stateProduct && id) {
      fetch(`${API_URL}/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error("Lỗi khi tải chi tiết sản phẩm:", err));
    }
  }, [id, stateProduct, API_URL]);

  // Thêm vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Vui lòng đăng nhập",
          text: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng",
        });
        return;
      }

      const res = await fetch(`${API_URL}/users/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });

      const data = await res.json();

      if (res.ok) {
        // Cập nhật giỏ hàng header ngay sau khi thêm
        await fetchCart();

        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: data.message || "Sản phẩm đã được thêm vào giỏ hàng",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Thêm thất bại",
          text: data.message || "Không thể thêm sản phẩm",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối server!",
        text: "Không thể kết nối đến máy chủ.",
      });
    }
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng đăng nhập",
        text: "Bạn cần đăng nhập để mua sản phẩm này",
      });
      return;
    }
    navigate("/checkout", { state: { buyNowItem: product } });
  };

  if (!product) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Đang tải sản phẩm...
      </p>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-detail-box">
        <div className="product-info">
          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-thumbnail">
            <p className="product-description">{product.description}</p>
            <img
              src={product.thumbnail}
              alt={product.name}
              className="product-thumbnail"
            />
          </div>

          <p className="product-detail-discount">Giảm giá {product.discount}%</p>

          <p className="product-detail-price">
            {(product.price * (100 - product.discount) / 100).toLocaleString("vi-VN")} VNĐ -
            <span style={{ textDecoration: "line-through", color: "#555" }}>
              {product.price.toLocaleString("vi-VN")} VNĐ
            </span>
          </p>

          <button className="btn btn-danger" onClick={handleCheckout}>
            Mua ngay
          </button>

          <button className="btn btn-success ms-3" onClick={handleAddToCart}>
            Thêm vào giỏ hàng <FaCartArrowDown />
          </button>

          <GalleryCarousel images={product.images} />
        </div>

        <SpecsTable specs={product.specs} />
      </div>

      <DiscountSection />
    </div>
  );
}

export default ProductDetail;
