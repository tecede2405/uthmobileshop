import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
function DiscountSection({ percentage = 10 }) {
  const API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/products/discount/${percentage}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error("Lỗi khi tải sản phẩm giảm giá:", err));
  }, [percentage, API_URL]);

  const handleClick = (product) => {
    navigate(`/products/detail/${product._id}`, { state: { product } });
  };

  return (
    <>
       <img
        src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/e2/c1/e2c1befdc30f51a23deac36758a3a148.png"
        alt="Banner"
        className="banner-image"
      />
      <div className="products mt-3 ms-4 mb-0">
        <ScrollToTop />
        <h2 className="discount-title mt-1 mb-1">Sản phẩm khuyến mãi hôm nay</h2>
        <div className="product-list row g-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="product-card col-5 col-sm-3 col-md-3 col-lg-3 col-xl-2 me-3 mt-5"
                onClick={() => handleClick(product)}
              >
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-discount">
                  Giảm giá {product.discountPercentage}%
                </p>
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
            ))
          ) : (
            <p>Không có sản phẩm nào giảm giá trên {percentage}%</p>
          )}
        </div>
      </div>
    </>
  );
}

export default DiscountSection;
