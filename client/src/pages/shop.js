import React from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/ProductCard";

export function Shop() {
  const { addItem } = useCart();
  return (
    <main>
      <h1>Shop</h1>
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={addItem} />
        ))}
      </div>
    </main>
  );
}
