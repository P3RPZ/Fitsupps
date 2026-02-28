import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminGetStats } from "../../api";

export function AdminDashboard() {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      navigate("/");
      return;
    }

    adminGetStats()
      .then(setStats)
      .catch((err) => {
        console.error("Error loading stats:", err);
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn, isAdmin, navigate]);

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <main>
        <h1>Admin Dashboard</h1>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "#f5f5f5", padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#666" }}>Total Users</h3>
          <p style={{ fontSize: "2rem", margin: 0, fontWeight: "bold" }}>{stats?.totalUsers || 0}</p>
        </div>
        <div style={{ background: "#f5f5f5", padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#666" }}>Total Products</h3>
          <p style={{ fontSize: "2rem", margin: 0, fontWeight: "bold" }}>{stats?.totalProducts || 0}</p>
        </div>
        <div style={{ background: "#f5f5f5", padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#666" }}>Total Orders</h3>
          <p style={{ fontSize: "2rem", margin: 0, fontWeight: "bold" }}>{stats?.totalOrders || 0}</p>
        </div>
        <div style={{ background: "#f5f5f5", padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#666" }}>Total Revenue</h3>
          <p style={{ fontSize: "2rem", margin: 0, fontWeight: "bold" }}>${(stats?.totalRevenue || 0).toFixed(2)}</p>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Quick Actions</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link to="/admin/products" style={{ padding: "0.75rem 1.5rem", background: "#007bff", color: "white", textDecoration: "none", borderRadius: "4px" }}>
            Manage Products
          </Link>
          <Link to="/admin/orders" style={{ padding: "0.75rem 1.5rem", background: "#28a745", color: "white", textDecoration: "none", borderRadius: "4px" }}>
            Manage Orders
          </Link>
          <Link to="/admin/users" style={{ padding: "0.75rem 1.5rem", background: "#6c757d", color: "white", textDecoration: "none", borderRadius: "4px" }}>
            Manage Users
          </Link>
        </div>
      </div>

      {stats?.recentOrders && stats.recentOrders.length > 0 ? (
        <div>
          <h2>Recent Orders</h2>
          <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Order ID</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Customer</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Total</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ padding: "0.5rem" }}>
                      <Link to={`/admin/orders/${order._id}`}>#{order._id.slice(-8)}</Link>
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {order.user?.name || order.user?.email || "N/A"}
                    </td>
                    <td style={{ padding: "0.5rem" }}>${order.total.toFixed(2)}</td>
                    <td style={{ padding: "0.5rem" }}>
                      <span style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        background: order.status === "delivered" ? "#28a745" : order.status === "shipped" ? "#17a2b8" : order.status === "processing" ? "#ffc107" : "#6c757d",
                        color: "white",
                        fontSize: "0.875rem"
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <h2>Recent Orders</h2>
          <p>No recent orders.</p>
        </div>
      )}
    </main>
  );
}

