import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function CartPage() {
  const { items, count, subtotal, updateQty, removeItem, clear } = useCart();
  const entries = Object.values(items);

  const handlePlaceOrder = () => {
    alert("Order placed! Thank you.");
    clear();
  };

  return (
    <main>
      <h1>Your Cart</h1>
      {entries.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/shop">Shop now</Link>.
        </p>
      ) : (
        <div className="cart">
          <ul className="cart-list">
            {entries.map(({ product, quantity }) => (
              <li key={product.id} className="cart-item">
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
                          updateQty(product.id, Number(e.target.value))
                        }
                      />
                    </label>
                    <button onClick={() => removeItem(product.id)}>
                      Remove
                    </button>
                  </div>
                </div>
                <div className="line-total">
                  ${(product.price * quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
          <aside className="summary">
            <p>Items: {count}</p>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <button className="checkout" onClick={handlePlaceOrder}>
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
