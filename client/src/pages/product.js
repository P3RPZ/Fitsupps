import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../api";
import { useCart } from "../context/CartContext";

export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    setError("");
    getProductById(id)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.error("Error loading product:", err);
        setError(err.message || "Failed to load product");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h1>Loading product...</h1>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h1>Product Not Found</h1>
          <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link to="/shop" style={{ color: "var(--accent)", textDecoration: "none" }}>
            ← Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="product-page">
      <div className="product-hero">
        <img src={product.image} alt={product.name} />
        <div>
          <h1>{product.name}</h1>
          <p className="price">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <button onClick={() => addItem(product)}>Add to Cart</button>
        </div>
      </div>
    </main>
  );
}
