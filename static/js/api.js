/**
 * api.js - REST API Client for LocalFind
 */

const API_BASE = "";

const api = {
  async request(endpoint, options = {}) {
    const defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error ${response.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Auth
  register(userData) {
    return this.request("/api/auth/register", { method: "POST", body: userData });
  },

  login(credentials) {
    return this.request("/api/auth/login", { method: "POST", body: credentials });
  },

  getProfile(userId) {
    return this.request(`/api/auth/me?user_id=${userId}`);
  },

  updateProfile(profileData) {
    return this.request("/api/auth/profile", { method: "PUT", body: profileData });
  },

  // Shops
  getShops(params = {}) {
    const q = new URLSearchParams(params).toString();
    return this.request(`/api/shops?${q}`);
  },

  getShop(shopId) {
    return this.request(`/api/shops/${shopId}`);
  },

  updateShop(shopId, shopData) {
    return this.request(`/api/shops/${shopId}`, { method: "PUT", body: shopData });
  },

  // Products
  getProducts(params = {}) {
    const q = new URLSearchParams(params).toString();
    return this.request(`/api/products?${q}`);
  },

  getProduct(productId) {
    return this.request(`/api/products/${productId}`);
  },

  addProduct(productData) {
    return this.request("/api/products", { method: "POST", body: productData });
  },

  updateProduct(productId, productData) {
    return this.request(`/api/products/${productId}`, { method: "PUT", body: productData });
  },

  deleteProduct(productId) {
    return this.request(`/api/products/${productId}`, { method: "DELETE" });
  },

  // Requests
  createRequest(requestData) {
    return this.request("/api/requests", { method: "POST", body: requestData });
  },

  getRequests(params = {}) {
    const q = new URLSearchParams(params).toString();
    return this.request(`/api/requests?${q}`);
  },

  getRequest(requestId) {
    return this.request(`/api/requests/${requestId}`);
  },

  respondToRequest(requestId, responseData) {
    return this.request(`/api/requests/${requestId}/respond`, { method: "POST", body: responseData });
  },

  selectRequestResponse(requestId, selectionData) {
    return this.request(`/api/requests/${requestId}/select`, { method: "PUT", body: selectionData });
  },

  // Cart
  getCart(customerId) {
    return this.request(`/api/cart?customer_id=${customerId}`);
  },

  addToCart(cartItem) {
    return this.request("/api/cart/add", { method: "POST", body: cartItem });
  },

  updateCartQty(itemId, quantity) {
    return this.request("/api/cart/update", { method: "PUT", body: { item_id: itemId, quantity } });
  },

  removeFromCart(itemId) {
    return this.request(`/api/cart/remove?item_id=${itemId}`, { method: "DELETE" });
  },

  clearCart(customerId) {
    return this.request(`/api/cart/clear?customer_id=${customerId}`, { method: "DELETE" });
  },

  // Orders
  createOrder(orderData) {
    return this.request("/api/orders", { method: "POST", body: orderData });
  },

  getOrders(params = {}) {
    const q = new URLSearchParams(params).toString();
    return this.request(`/api/orders?${q}`);
  },

  getOrder(orderId) {
    return this.request(`/api/orders/${orderId}`);
  },

  updateOrderStatus(orderId, status) {
    return this.request(`/api/orders/${orderId}/status`, { method: "PUT", body: { status } });
  },

  getEarnings(shopId) {
    return this.request(`/api/earnings?shop_id=${shopId}`);
  },

  // Reviews
  submitReview(reviewData) {
    return this.request("/api/reviews", { method: "POST", body: reviewData });
  },

  // Notifications
  getNotifications(userId) {
    return this.request(`/api/notifications?user_id=${userId}`);
  },

  markNotificationRead(id) {
    return this.request(`/api/notifications/read?id=${id}`, { method: "PUT" });
  },

  // Admin
  getAdminOverview() {
    return this.request("/api/admin/overview");
  },

  updateShopStatus(shopId, status) {
    return this.request(`/api/admin/shops/${shopId}/status`, { method: "PUT", body: { status } });
  },

  deleteShop(shopId) {
    return this.request(`/api/admin/shops/${shopId}`, { method: "DELETE" });
  }
};

window.api = api;
