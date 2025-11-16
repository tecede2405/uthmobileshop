import { useState, useEffect } from "react"; 
import { useNavigate, useSearchParams } from "react-router-dom";

function SearchByName() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const name = searchParams.get("name");

  useEffect(() => {
    if (!name) return;

    setLoading(true);
    fetch(`${API_URL}/products/search?name=${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tìm sản phẩm:", err);
        setLoading(false);
      });
  }, [name, API_URL]);

  console.log(products);

  const handleClick = (product) => {
    navigate(`/products/detail/${product._id}`, { state: { product } });
  };

  return (
    <>
      <div className="home">
        <img
          src="https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:90/plain/https://dashboard.cellphones.com.vn/storage/690x300_iPhone_17_Pro_Opensale_v3.png"
          alt="Banner"
          className="product-banner-image"
        />

        <div className="products">
          <h2 className="mt-4 mb-3 text-center">
            Kết quả tìm kiếm cho: <span style={{ color: "red" }}>{name}</span>
          </h2>

          {loading ? (
            <p className="text-center">Đang tải sản phẩm...</p>
          ) : products.length === 0 ? (
            <p className="text-center">Không tìm thấy sản phẩm nào phù hợp.</p>
          ) : (
            <div className="product-list row g-4">
              {products.map((product) => (
                <div
                  key={product._id || product.id}
                  className="product-card col-5 col-sm-4 col-md-3 col-lg-3 col-xl-2 me-2 mt-3"
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
                    {product.price * (100 - product.discount) / 100} -{" "}
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#555",
                      }}
                    >
                      ${product.price}
                    </span>
                  </p>
                  <p className="product-installment">
                    Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchByName;
