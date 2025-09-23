import React from "react";
import { Link } from "react-router-dom";

export function CheckoutPage() {
  return (
    <main>
      <h1>Order Confirmation</h1>
      <div className="confirmation">
        <p>Thank you for your order!</p>
        <p>Your order has been placed successfully.</p>
        <Link to="/shop">Continue Shopping</Link>
      </div>
    </main>
  );
}
