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
          <p>Email: support@uthshop.vn</p>
          <p>Địa chỉ: 02 Võ Oanh, P25 , Quận Bình Thạnh, Tp.HCM</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2330.313467269104!2d106.71578844689289!3d10.803309234910815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175293dceb22197%3A0x755bb0f39a48d4a6!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBHaWFvIFRow7RuZyBW4bqtbiBU4bqjaSBUaMOgbmggUGjhu5EgSOG7kyBDaMOtIE1pbmggLSBDxqEgc-G7nyAx!5e0!3m2!1svi!2s!4v1763567676802!5m2!1svi!2s"
            width="100%"
            height="150px"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          ></iframe>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Trang này chỉ nhằm mục đích học tập, không nhằm cho mục đích kinh doanh!</p>
      </div>
    </footer>
  );
}
