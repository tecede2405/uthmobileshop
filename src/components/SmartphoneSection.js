import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SmartphoneSection() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/products/category/smartphone`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi tải smartphone:", err));
  }, [API_URL]);

  const handleClick = (product) => {
    navigate(`/products/detail/${product._id}`, { state: { product } });
  };

  return (
    <>
     <img
        src="https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:90/plain/https://dashboard.cellphones.com.vn/storage/690x300_iPhone_17_Pro_Opensale_v3.png"
        alt="Banner"
        className="product-banner-image"
      />
    <div className="products mt-3">
      <h2 className="mt-1 mb-4">Điện thoại</h2>
      <div className="product-list row g-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card col-5 col-sm-3 col-md-3 col-lg-3 col-xl-2 me-3 mt-3"
            onClick={() => handleClick(product)}
          >
            <img
              src={product.thumbnail}
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-discount">Giảm giá {product.discount}%</p>
            <p className="product-price">
              {(product.price * (100 - product.discount) / 100).toLocaleString("vi-VN")} VNĐ -{" "}
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#555",
                }}
              >
                {product.price.toLocaleString("vi-VN")} VNĐ
              </span>
            </p>
            <p className="product-installment">
              Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng
            </p>
          </div>
        ))}
      </div>
    </div>
    </>
 
  );
}

export default SmartphoneSection;
