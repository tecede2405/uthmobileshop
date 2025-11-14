import './App.css';
import Layout from './pages/Layout/layoutDefault';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/index';
import ProductDetail from './pages/product-detail/index';
import SearchByBrand from './pages/searchByBrand/index';
import SearchByName from './pages/searchByName/index';
import AdminProducts from "./pages/admin/products/index";
import Cart from "./pages/cart/index";
import Checkout from "./pages/checkout/index";
import Login from "./pages/login/index.login";
import Register from "./pages/register/index";
import OderHistoryPage from "./pages/oders-history/index";
import EditProductPage from "./pages/admin/EditProductsPage/index";
import CreateProductPage from "./pages/admin/CreateProductPage/index";
import AdminOrderPage from "./pages/admin/OderPage/index";
import AdminGuard from "./components/AdminGuard";
import Admin from "./pages/admin/DashBoard/index";


function App() {
  return (
   <>
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/products/detail/:id" element={<ProductDetail key={window.location.pathname} />} />
        <Route path="/search" element={<SearchByBrand />} />
        <Route path="/search-name" element={<SearchByName />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-history" element={<OderHistoryPage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />}/>
      <Route path="/admin" 
          element={
              <AdminGuard>
                <Admin />
              </AdminGuard>}
      />
      <Route path="/admin/products" 
          element={
              <AdminGuard>
                <AdminProducts />
              </AdminGuard>}
      />
      <Route path="/admin/products/edit/:id" element={
        <AdminGuard>
          <EditProductPage />
        </AdminGuard>
        } />
      <Route path="/admin/products/create" element={
        <AdminGuard>
          <CreateProductPage />
        </AdminGuard>
        } />
      <Route path="/admin/orders" element={
        <AdminGuard>
          <AdminOrderPage />
        </AdminGuard>
        } />
    </Routes>
   </>
  );
}

export default App;
