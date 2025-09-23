import React from "react";
import { Routes, Route, Link } from "react-router-dom";
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
} from "./pages";
import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Navbar = () => {
  const { count } = useCart();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    alert("You have been logged out successfully.");
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
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
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
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
