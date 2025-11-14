    import { useState,useEffect } from "react"; 
    import { useNavigate,useSearchParams } from 'react-router-dom';
   

    function SearchByBrand() {
        const API_URL = process.env.REACT_APP_API_URL;
        const [products, setProducts] = useState([]);
        const navigate = useNavigate(); 
        const [searchParams] = useSearchParams();

        const category = searchParams.get("category");
        const brand = searchParams.get("brand");

        useEffect(() => {
            if (!category || !brand) return; // chỉ fetch khi có đủ query
            fetch(`${API_URL}/products?category=${category}&brand=${brand}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.products || []);
                console.log(data.products);
            })
            .catch(err => console.log(err));
        }, [category, brand, API_URL]);

        const handleClick = (product) => {
            navigate(`/products/detail/${product._id}`, { state: { product } });
        };


        return(
            <>
                <div className="home">
                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:90/plain/https://dashboard.cellphones.com.vn/storage/690x300_iPhone_17_Pro_Opensale_v3.png" alt="Banner" className="product-banner-image" />
                    <div className="products">
                        <div className="product-list row g-4">
                            {products.map(product => (
                                <div key={product.id} className="product-card col-6 col-sm-4
                                col-md-3 col-lg-3 col-xl-2 me-2 mt-5" onClick={() => handleClick(product)}>
                                    <img src={product.thumbnail} alt={product.name} className="product-image" />
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-discount">Giảm giá {product.discount}%</p>
                                    <p className="product-price">
                                        {(product.price * (100 - product.discount) / 100).toLocaleString('vi-VN')} VNĐ - 
                                        <span style={{ textDecoration: 'line-through', color: '#555' }}>
                                            {product.price.toLocaleString('vi-VN')} VNĐ
                                        </span>
                                    </p>
                                    <p className="product-installment">Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </>
        )
    }

export default SearchByBrand;

