import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "../../api";

export function AdminProducts() {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      navigate("/");
      return;
    }
    loadProducts();
  }, [isLoggedIn, isAdmin, navigate]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await adminGetProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingProduct) {
        await adminUpdateProduct(editingProduct._id, productData);
      } else {
        await adminCreateProduct(productData);
      }

      setFormData({ name: "", image: "", price: "", category: "", description: "" });
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      setError(err.message || "Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      image: product.image,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await adminDeleteProduct(id);
      loadProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: "", image: "", price: "", category: "", description: "" });
  };

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Manage Products</h1>
        <div>
          <Link to="/admin" style={{ marginRight: "1rem", color: "#007bff", textDecoration: "none" }}>
            ← Back to Dashboard
          </Link>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingProduct(null);
              setFormData({ name: "", image: "", price: "", category: "", description: "" });
            }}
            style={{ padding: "0.75rem 1.5rem", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            + Add Product
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: "1rem", background: "#f8d7da", color: "#721c24", borderRadius: "4px", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {showForm && (
        <div style={{ background: "#f5f5f5", padding: "2rem", borderRadius: "8px", marginBottom: "2rem" }}>
          <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
                style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
              />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                style={{ padding: "0.75rem 1.5rem", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                {editingProduct ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{ padding: "0.75rem 1.5rem", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found. Create your first product!</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {products.map((product) => (
            <div key={product._id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
              <img src={product.image} alt={product.name} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px", marginBottom: "1rem" }} />
              <h3 style={{ margin: "0 0 0.5rem 0" }}>{product.name}</h3>
              <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>{product.category}</p>
              <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold" }}>${product.price.toFixed(2)}</p>
              <p style={{ margin: "0 0 1rem 0", fontSize: "0.875rem", color: "#666" }}>{product.description}</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleEdit(product)}
                  style={{ flex: 1, padding: "0.5rem", background: "#ffc107", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  style={{ flex: 1, padding: "0.5rem", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

