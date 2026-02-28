const API_URL = "http://localhost:5000/api";

// Get token from localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Helper to make authenticated requests
async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// Auth API
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

// Get current user (protected)
export async function getCurrentUser() {
  return authFetch(`${API_URL}/auth/me`);
}

// Product API
export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load products");
  return data;
}

export async function getProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load product");
  return data;
}

// Create product (protected - requires auth)
export async function createProduct(productData) {
  return authFetch(`${API_URL}/products`, {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

// Order API (all protected)
export async function createOrder(orderData) {
  return authFetch(`${API_URL}/orders`, {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function getOrders() {
  return authFetch(`${API_URL}/orders`);
}

export async function getOrderById(id) {
  return authFetch(`${API_URL}/orders/${id}`);
}

// Cart API (all protected)
export async function getCart() {
  return authFetch(`${API_URL}/cart`);
}

export async function addToCart(productId, quantity = 1) {
  return authFetch(`${API_URL}/cart`, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItem(productId, quantity) {
  return authFetch(`${API_URL}/cart`, {
    method: "PUT",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function removeFromCart(productId) {
  return authFetch(`${API_URL}/cart/item/${productId}`, {
    method: "DELETE",
  });
}

export async function clearCart() {
  return authFetch(`${API_URL}/cart`, {
    method: "DELETE",
  });
}

// Admin API (all protected - requires admin)
// Products
export async function adminGetProducts() {
  return authFetch(`${API_URL}/admin/products`);
}

export async function adminCreateProduct(productData) {
  return authFetch(`${API_URL}/admin/products`, {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

export async function adminUpdateProduct(id, productData) {
  return authFetch(`${API_URL}/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
}

export async function adminDeleteProduct(id) {
  return authFetch(`${API_URL}/admin/products/${id}`, {
    method: "DELETE",
  });
}

// Orders
export async function adminGetOrders() {
  return authFetch(`${API_URL}/admin/orders`);
}

export async function adminGetOrderById(id) {
  return authFetch(`${API_URL}/admin/orders/${id}`);
}

export async function adminUpdateOrderStatus(id, status) {
  return authFetch(`${API_URL}/admin/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// Users
export async function adminGetUsers() {
  return authFetch(`${API_URL}/admin/users`);
}

export async function adminUpdateUserAdminStatus(id, isAdmin) {
  return authFetch(`${API_URL}/admin/users/${id}/admin`, {
    method: "PUT",
    body: JSON.stringify({ isAdmin }),
  });
}

// Stats
export async function adminGetStats() {
  return authFetch(`${API_URL}/admin/stats`);
}
