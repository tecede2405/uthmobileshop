// src/context/CartContext.js
import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/users/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể tải giỏ hàng");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Lỗi fetchCart:", err.message);
    }
  };

  // ✅ Tính tổng số lượng sản phẩm trong giỏ
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);