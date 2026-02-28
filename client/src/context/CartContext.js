import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from "../api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(false);

  // Load cart from backend when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      getCart()
        .then((cart) => {
          const cartItems = {};
          cart.items.forEach((item) => {
            if (item.product) {
              cartItems[item.product._id || item.product.id] = {
                product: item.product,
                quantity: item.quantity,
              };
            }
          });
          setItems(cartItems);
        })
        .catch((err) => {
          console.error("Error loading cart:", err);
        })
        .finally(() => setLoading(false));
    } else {
      // Clear cart when user logs out
      setItems({});
    }
  }, [isLoggedIn]);

  // Helper to sync to backend
  const syncToBackend = async (action, ...args) => {
    if (isLoggedIn) {
      try {
        await action(...args);
        // Reload cart from backend to ensure sync
        const cart = await getCart();
        const cartItems = {};
        cart.items.forEach((item) => {
          if (item.product) {
            cartItems[item.product._id || item.product.id] = {
              product: item.product,
              quantity: item.quantity,
            };
          }
        });
        setItems(cartItems);
      } catch (err) {
        console.error("Error syncing cart:", err);
        throw err;
      }
    }
  };

  //add item to cart
  const addItem = async (product, quantity = 1) => {
    const productId = product._id || product.id;
    const existing = items[productId];
    const nextQty = (existing ? existing.quantity : 0) + (quantity || 1);

    // Update local state immediately
    setItems((prev) => ({
      ...prev,
      [productId]: { product, quantity: nextQty },
    }));

    // Sync to backend if logged in
    if (isLoggedIn) {
      await syncToBackend(apiAddToCart, productId, quantity);
    }
  };

  //remove item from cart
  const removeItem = async (productId) => {
    // Update local state immediately
    setItems((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });

    // Sync to backend if logged in
    if (isLoggedIn) {
      await syncToBackend(apiRemoveFromCart, productId);
    }
  };

  //update quantity
  const updateQty = async (productId, quantity) => {
    if (!quantity || quantity <= 0) {
      // Remove item
      await removeItem(productId);
      return;
    }

    const existing = items[productId];
    if (!existing) return;

    // Update local state immediately
    setItems((prev) => ({
      ...prev,
      [productId]: { ...existing, quantity },
    }));

    // Sync to backend if logged in
    if (isLoggedIn) {
      await syncToBackend(apiUpdateCartItem, productId, quantity);
    }
  };

  //clear cart
  const clear = async () => {
    // Update local state immediately
    setItems({});

    // Sync to backend if logged in
    if (isLoggedIn) {
      await syncToBackend(apiClearCart);
    }
  };

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
    loading,
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
