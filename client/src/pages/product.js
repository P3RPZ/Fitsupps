import React from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../data/products";
import { useCart } from "../context/CartContext";

export function ProductPage() {
  const { id } = useParams();
  const product = getProductById(id);
  const { addItem } = useCart();

  if (!product) {
    return (
      <main>
        <h1>Product Not Found</h1>
        <p>We couldn't find what you're looking for.</p>
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
