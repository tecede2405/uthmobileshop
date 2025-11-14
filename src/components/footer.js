import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-column">
          <h4>Về Chúng tôi</h4>
          <ul>
            <li><Link to="/about">Giới thiệu</Link></li>
            <li><Link to="/news">Tin tức</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Chính sách</h4>
          <ul>
            <li><Link to="/warranty">Bảo hành</Link></li>
            <li><Link to="/return-policy">Đổi trả</Link></li>
            <li><Link to="/privacy">Bảo mật thông tin</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Liên hệ</h4>
          <p>Hotline: <b>0123.456.789</b></p>
          <p>Email: support@mobileshop.vn</p>
          <p>Địa chỉ: Bình Thạnh, Tp.HCM</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Trang này chỉ nhằm mục đích học tập, không nhằm cho mục đích kinh doanh!</p>
      </div>
    </footer>
  );
}
