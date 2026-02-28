import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrders } from "../api";

export function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setError("");
    getOrders()
      .then(setOrders)
      .catch((err) => {
        console.error("Error loading orders:", err);
        setError(err.message || "Failed to load orders. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <main>
        <h1>My Orders</h1>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>My Orders</h1>
      
      {error && (
        <div className="error-message" style={{ marginBottom: "1rem", padding: "1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--danger)", borderRadius: "6px", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div>
          <p>You haven't placed any orders yet.</p>
          <Link to="/shop">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id.slice(-8)}</h3>
                <span className={`status status-${order.status}`}>
                  {order.status}
                </span>
              </div>
              <p className="order-date">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p>
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <p className="order-total">Total: ${order.total.toFixed(2)}</p>
                <p className="shipping-address">
                  Ship to: {order.shippingAddress.name},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
