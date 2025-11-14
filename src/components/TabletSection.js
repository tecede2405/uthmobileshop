import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TabletSection() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/products/category/tablet`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi tải iPad:", err));
  }, [API_URL]);

  const handleClick = (product) => {
    navigate(`/products/detail/${product._id}`, { state: { product } });
  };

  return (
    <>
     <img
        src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/3b/64/3b64f61a029f085e54d5a17bf267990d.png"
        alt="Banner"
        className="product-banner-image"
    />
    <div className="products mt-3">
      <h2 className="mt-1 mb-1">Máy tính bảng</h2>
      <div className="product-list row g-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="product-card col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2 me-2 mt-5"
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

export default TabletSection;
