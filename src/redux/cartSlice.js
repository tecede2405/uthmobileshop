import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { id, name, price, quantity, image }
  totalQuantity: 0,
  totalPrice: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(i => i.id === item.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(i => i.id !== id);

      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;
      const existing = state.items.find(i => i.id === id);
      if (existing) existing.quantity += 1;

      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const existing = state.items.find(i => i.id === id);
      if (existing && existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        state.items = state.items.filter(i => i.id !== id);
      }

      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    }
  }
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
