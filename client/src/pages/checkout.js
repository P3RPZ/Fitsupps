import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api";

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (Object.keys(items).length === 0 && !orderId) {
      navigate("/cart");
    }
  }, [items, orderId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const entries = Object.values(items);
      const orderItems = entries.map(({ product, quantity }) => ({
        product: product._id || product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      }));

      const orderData = {
        items: orderItems,
        total: subtotal,
        shippingAddress,
      };

      const order = await createOrder(orderData);
      setOrderId(order._id);
      clear();
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation if order was placed
  if (orderId) {
    return (
      <main>
        <h1>Order Confirmation</h1>
        <div className="confirmation">
          <p>Thank you for your order!</p>
          <p>Your order has been placed successfully.</p>
          <p>Order ID: {orderId}</p>
          <Link to="/shop">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <main>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} className="checkout-form">
        {error && <div className="error-message">{error}</div>}

        <div className="shipping-section">
          <h2>Shipping Address</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={shippingAddress.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="street"
              value={shippingAddress.street}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={shippingAddress.state}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={shippingAddress.zipCode}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={shippingAddress.country}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div style={{ marginBottom: "1rem" }}>
            {Object.values(items).map(({ product, quantity }) => {
              const productId = product._id || product.id;
              return (
                <div key={productId} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>{product.name}</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>
                      ${product.price.toFixed(2)} x {quantity}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontWeight: "600" }}>
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "1rem" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem" }}>
              Total: ${subtotal.toFixed(2)}
            </p>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </main>
  );
}
