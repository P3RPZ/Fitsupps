import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState({});

  //add item to cart
  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev[product.id];
      const nextQty = (existing ? existing.quantity : 0) + (quantity || 1);
      return {
        ...prev,
        [product.id]: { product, quantity: nextQty },
      };
    });
  };

  //remove item from cart
  const removeItem = (productId) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  //update quantity
  const updateQty = (productId, quantity) => {
    setItems((prev) => {
      if (!quantity || quantity <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      const existing = prev[productId];
      if (!existing) return prev;
      return {
        ...prev,
        [productId]: { ...existing, quantity },
      };
    });
  };

  //clear cart
  const clear = () => setItems({});

  const entries = Object.values(items);
  const count = entries.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = entries.reduce(
    (sum, it) => sum + it.quantity * it.product.price,
    0
  );

  const value = {
    items,
    count,
    subtotal,
    addItem,
    removeItem,
    updateQty,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
