import React from "react";
import { Link } from "react-router-dom";

export function ProductCard({ product, onAdd }) {
  const productId = product._id || product.id;
  return (
    <article className="product-card">
      <Link to={`/product/${productId}`} className="thumb">
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="body">
        <h3 className="title">
          <Link to={`/product/${productId}`}>{product.name}</Link>
        </h3>
        <p className="category">{product.category}</p>
        <div className="meta">
          <span className="price">${product.price.toFixed(2)}</span>
          <button className="add" onClick={() => onAdd(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
