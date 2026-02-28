import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import {
  Home,
  Shop,
  ProductPage,
  CartPage,
  CheckoutPage,
  AboutPage,
  ContactPage,
  LoginPage,
  RegisterPage,
  OrdersPage,
  AdminDashboard,
  AdminProducts,
  AdminOrders,
  AdminUsers,
} from "./pages";
import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Chatbot from "./components/Chatbot";

const Navbar = () => {
  const { count } = useCart();
  const { isLoggedIn, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <nav>
        <Link to="/" className="brand">
          ＦｉｔＳｕｐｐｓ
        </Link>
        <div className="links">
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {isLoggedIn ? (
            <>
              <Link to="/orders">Orders</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <span className="user-name">{user?.name || user?.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          <Link to="/cart">Cart ({count})</Link>
        </div>
      </nav>
    </header>
  );
};

const Footer = () => (
  <footer className="footer">
    <p>© {new Date().getFullYear()} FitSupps. All rights reserved.</p>
  </footer>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Routes>
          <Footer />
          <Chatbot />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
