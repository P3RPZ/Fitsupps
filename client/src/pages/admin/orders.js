import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminGetOrders, adminGetOrderById, adminUpdateOrderStatus } from "../../api";

export function AdminOrders() {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      navigate("/");
      return;
    }

    if (id) {
      loadOrder(id);
    } else {
      loadOrders();
    }
  }, [isLoggedIn, isAdmin, navigate, id]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminGetOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadOrder = async (orderId) => {
    try {
      setLoading(true);
      const data = await adminGetOrderById(orderId);
      setOrder(data);
    } catch (err) {
      console.error("Error loading order:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      if (id) {
        loadOrder(id);
      } else {
        loadOrders();
      }
    } catch (err) {
      setError(err.message || "Failed to update order status");
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

  if (id && order) {
    return (
      <main style={{ padding: "2rem" }}>
        <Link to="/admin/orders" style={{ color: "#007bff", textDecoration: "none", marginBottom: "1rem", display: "inline-block" }}>
          ← Back to Orders
        </Link>
        <h1>Order Details</h1>

        {error && (
          <div style={{ padding: "1rem", background: "#f8d7da", color: "#721c24", borderRadius: "4px", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <div style={{ background: "#f5f5f5", padding: "2rem", borderRadius: "8px", marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Order ID:</strong> {order._id}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Customer:</strong> {order.user?.name || order.user?.email || "N/A"}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Status:</strong>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
              style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h2>Shipping Address</h2>
          <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px" }}>
            <p>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        <div>
          <h2>Order Items</h2>
          <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px" }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: idx < order.items.length - 1 ? "1px solid #ddd" : "none" }}>
                <img src={item.image} alt={item.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 0.5rem 0" }}>{item.name}</h4>
                  <p style={{ margin: "0 0 0.5rem 0" }}>${item.price.toFixed(2)} x {item.quantity}</p>
                  <p style={{ margin: 0, fontWeight: "bold" }}>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Manage Orders</h1>
        <Link to="/admin" style={{ color: "#007bff", textDecoration: "none" }}>
          ← Back to Dashboard
        </Link>
      </div>

      {error && (
        <div style={{ padding: "1rem", background: "#f8d7da", color: "#721c24", borderRadius: "4px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Order ID</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Customer</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Total</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Status</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Date</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ padding: "0.5rem" }}>#{order._id.slice(-8)}</td>
                  <td style={{ padding: "0.5rem" }}>{order.user?.name || order.user?.email || "N/A"}</td>
                  <td style={{ padding: "0.5rem" }}>${order.total.toFixed(2)}</td>
                  <td style={{ padding: "0.5rem" }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{ padding: "0.25rem" }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "0.5rem" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "0.5rem" }}>
                    <Link to={`/admin/orders/${order._id}`} style={{ color: "#007bff", textDecoration: "none" }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

