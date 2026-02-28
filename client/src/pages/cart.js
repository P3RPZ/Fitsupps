import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function CartPage() {
  const { items, count, subtotal, updateQty, removeItem, loading } = useCart();
  const entries = Object.values(items);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [updatingItem, setUpdatingItem] = useState(null);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleUpdateQty = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItem(productId);
    setError("");
    try {
      await updateQty(productId, newQuantity);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError(err.message || "Failed to update quantity. Please try again.");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    setUpdatingItem(productId);
    setError("");
    try {
      await removeItem(productId);
    } catch (err) {
      console.error("Error removing item:", err);
      setError(err.message || "Failed to remove item. Please try again.");
    } finally {
      setUpdatingItem(null);
    }
  };

  return (
    <main>
      <h1>Your Cart</h1>
      
      {error && (
        <div className="error-message" style={{ marginBottom: "1rem", padding: "1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--danger)", borderRadius: "6px", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {loading && entries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p>Loading cart...</p>
        </div>
      ) : entries.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/shop">Shop now</Link>.
        </p>
      ) : (
        <div className="cart">
          <ul className="cart-list">
            {entries.map(({ product, quantity }) => {
              const productId = product._id || product.id;
              const isUpdating = updatingItem === productId;
              return (
                <li key={productId} className="cart-item" style={{ opacity: isUpdating ? 0.6 : 1 }}>
                  <img src={product.image} alt={product.name} />
                  <div className="info">
                    <h3>{product.name}</h3>
                    <p>${product.price.toFixed(2)}</p>
                    <div className="controls">
                      <label>
                        Qty
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) =>
                            handleUpdateQty(productId, Number(e.target.value))
                          }
                          disabled={isUpdating}
                        />
                      </label>
                      <button 
                        onClick={() => handleRemoveItem(productId)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "..." : "Remove"}
                      </button>
                    </div>
                  </div>
                  <div className="line-total">
                    ${(product.price * quantity).toFixed(2)}
                  </div>
                </li>
              );
            })}
          </ul>
          <aside className="summary">
            <p>Items: {count}</p>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <button className="checkout" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
