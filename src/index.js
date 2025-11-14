import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
    <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </ BrowserRouter>
  </CartProvider>
  
);

reportWebVitals();
