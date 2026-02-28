import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminGetUsers, adminUpdateUserAdminStatus } from "../../api";

export function AdminUsers() {
  const { isLoggedIn, isAdmin, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      navigate("/");
      return;
    }
    loadUsers();
  }, [isLoggedIn, isAdmin, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminGetUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId, currentAdminStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentAdminStatus ? "remove" : "grant"} admin access?`)) {
      return;
    }

    try {
      await adminUpdateUserAdminStatus(userId, !currentAdminStatus);
      loadUsers();
    } catch (err) {
      setError(err.message || "Failed to update user");
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Manage Users</h1>
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
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Name</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Email</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Admin</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Joined</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const userId = user.id || user._id;
                const currentUserId = currentUser?.id || currentUser?._id;
                return (
                  <tr key={userId}>
                    <td style={{ padding: "0.5rem" }}>{user.name}</td>
                    <td style={{ padding: "0.5rem" }}>{user.email}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {user.isAdmin ? (
                        <span style={{ padding: "0.25rem 0.5rem", background: "#28a745", color: "white", borderRadius: "4px", fontSize: "0.875rem" }}>
                          Admin
                        </span>
                      ) : (
                        <span style={{ padding: "0.25rem 0.5rem", background: "#6c757d", color: "white", borderRadius: "4px", fontSize: "0.875rem" }}>
                          User
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "0.5rem" }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {currentUserId !== userId && (
                        <button
                          onClick={() => handleToggleAdmin(userId, user.isAdmin)}
                          style={{
                            padding: "0.5rem 1rem",
                            background: user.isAdmin ? "#dc3545" : "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          {user.isAdmin ? "Remove Admin" : "Make Admin"}
                        </button>
                      )}
                      {currentUserId === userId && (
                        <span style={{ color: "#666", fontSize: "0.875rem" }}>Current User</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

