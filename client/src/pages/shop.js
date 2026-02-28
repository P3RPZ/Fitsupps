import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/ProductCard";
import { getProducts } from "../api";

export function Shop() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setError(err.message || "Failed to load products");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <h1>Shop</h1>
      
      {error && (
        <div className="error-message" style={{ marginBottom: "1rem", padding: "1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--danger)", borderRadius: "6px", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p>No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={addItem} />
          ))}
        </div>
      )}
    </main>
  );
}
