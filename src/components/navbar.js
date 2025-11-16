import { Drawer, Menu, Grid, Layout } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Sider } = Layout;
const { useBreakpoint } = Grid;

function SidebarNav({ visible, onClose }) {
  const navigate = useNavigate();
  const screens = useBreakpoint(); // 👈 Lấy thông tin kích thước màn hình

  const isDesktop = screens.md; // md = ≥768px

  const brandMap = {
    iphone: 'Apple',
    samsung: 'Samsung',
    xiaomi: 'Xiaomi',
    oppo: 'Oppo',
    asus: 'Asus',
    acer: 'Acer',
    dell: 'Dell',
    hp: 'HP',
    lenovo: 'Lenovo',
    air: 'iPad Air',
    pro: 'iPad Pro'
  };

  const items = [
    {
      key: 'sub1',
      icon: <UserOutlined />,
      label: 'Điện thoại',
      children: [
        { key: 'smartphone-iphone', label: 'iPhone' },
        { key: 'smartphone-samsung', label: 'Samsung' },
        { key: 'smartphone-xiaomi', label: 'Xiaomi' },
        { key: 'smartphone-oppo', label: 'Oppo' },
        { key: 'smartphone-vivo', label: 'Vivo' }
      ]
    },
    {
      key: 'sub2',
      icon: <LaptopOutlined />,
      label: 'Laptop',
      children: [
        { key: 'laptop-asus', label: 'Asus' },
        { key: 'laptop-acer', label: 'Acer' },
        { key: 'laptop-dell', label: 'Dell' },
        { key: 'laptop-hp', label: 'HP' },
        { key: 'laptop-lenovo', label: 'Lenovo' }
      ]
    },
    {
      key: 'sub3',
      icon: <NotificationOutlined />,
      label: 'Máy tính bảng',
      children: [
        { key: 'tablet-samsung', label: 'Samsung' },
        { key: 'tablet-Apple', label: 'iPad Air' },
        { key: 'tablet-xiaomi', label: 'Xiaomi' }
      ]
    }
  ];

  const handleClick = (e) => {
    const [category, brandKey] = e.key.split('-');
    const brand = brandMap[brandKey] || brandKey;
    navigate(`/search?category=${category}&brand=${brand}`);
    onClose(); // đóng Drawer nếu đang mở
  };

  // 👉 Nếu là desktop, hiển thị Sider cố định
  if (isDesktop) {
    return (
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultOpenKeys={['sub1', 'sub2', 'sub3']}
          items={items}
          onClick={handleClick}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
    );
  }

  // 👉 Nếu là mobile, hiển thị Drawer
  return (
    <Drawer
      title="Danh mục sản phẩm"
      placement="left"
      onClose={onClose}
      open={visible}
      width={250}
    >
      <Menu
        mode="inline"
        defaultOpenKeys={['sub1', 'sub2', 'sub3']}
        items={items}
        onClick={handleClick}
      />
    </Drawer>
  );
}

export default SidebarNav;