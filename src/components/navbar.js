import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

function SidebarNav() {
  const navigate = useNavigate();

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
        { key: 'laptop-lenovo', label: 'Lenovo' },
      ]
    },
    {
      key: 'sub3',
      icon: <NotificationOutlined />,
      label: 'Máy tính bảng',
      children: [
        { key: 'tablet-samsung', label: 'Samsung' },
        { key: 'tablet-Apple', label: 'iPad Air' },
        { key: 'tablet-xiaomi', label: 'Xiaomi' },
      ]
    }
  ];

  
  const handleClick = (e) => {
    const [category, brandKey] = e.key.split('-');
    const brand = brandMap[brandKey] || brandKey;

    navigate(`/search?category=${category}&brand=${brand}`);
  };

  return (
    <>
    <div className="navbar">
      <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultOpenKeys={['sub1', 'sub2', 'sub3']}
        style={{ height: '100%',borderRight: 0}}
        items={items}
        onClick={handleClick}
      />
      </Sider>
    </div>
      
    </>
    
  );
}

export default SidebarNav;