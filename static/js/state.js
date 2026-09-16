/**
 * state.js - Central Application State Management for Nearby
 */

class AppState {
  constructor() {
    const hasActiveSession = sessionStorage.getItem("nearby_active_tab_session") === "true";
    this.currentUser = JSON.parse(localStorage.getItem("nearby_user") || "null");
    this.currentRole = localStorage.getItem("nearby_role") || null;
    // As required: Website opening must start with the Login/Onboarding screen first
    this.currentView = (hasActiveSession && this.currentUser && this.currentRole) 
      ? (this.currentRole === "shopkeeper" ? "shopkeeper" : "home") 
      : "login";
    this.viewParams = {};
    
    // Nearby 6-Step Customer Flow Wizard State
    this.wizard = {
      step: 1, // 1: Category, 2: Range/Shop, 3: Inquiry, 4: Seller Approval, 5: Fulfillment, 6: Review
      selected_category: "Clothes", // "Clothes", "Skin Care", "Beauty & Makeup", "Shoes"
      shop_preference: "nearby",    // "nearby" (Relevant shops at min distance) or "specific" (Specific shop selection)
      selected_shop: null,
      
      // Step 3 Inquiry Data
      inquiry_mode: "image", // "image" (Option A) or "manual" (Option B)
      
      // Option A: Image Upload & Visual Search
      ref_image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60",
      image_data: null,
      color_mode: "Same as image", // "Same as image" | "Vary / Any" | "Mention specific color"
      color_custom: "",
      brand_mode: "Same as image", // "Same as image" | "Specific brand" | "Any brand"
      brand_custom: "",
      size_chip: "M",              // "XS", "S", "M", "L", "XL", "XXL"
      alteration_notes: "",
      
      // Option B: Manual Category Dynamic Specification Form
      manual: {
        // Clothes
        upperwear: "Pure Cotton Slim Shirt",
        bottomwear: "Denim Straight Pants",
        sleeves: "Full Sleeves",
        clothes_brand: "Any brand",
        clothes_size: "M",
        clothes_color: "Sky Blue",
        clothes_description: "",
        
        // Skin Care
        skincare_volume: "30ml",
        skin_type: "Combination", // Combination, Normal, Oily, Sensitive, Dry
        skincare_items_count: 1,
        skincare_notes: "",
        
        // Beauty & Makeup
        makeup_type: "Matte Liquid Lipstick",
        makeup_shade: "Chili Red / Warm Nude",
        makeup_quantity: 1,
        makeup_brand: "Any brand",
        makeup_notes: "",
        
        // Shoes
        shoe_type: "Running Sports Sneakers",
        shoe_size: "UK 8",
        shoe_color: "All Black",
        shoe_brand: "Any brand",
        shoe_notes: ""
      },
      
      // Step 4: Seller Matching & Product Approval
      submitted_request_id: null,
      is_broadcasted: false,
      selected_response: null,
      
      // Step 5: Fulfillment Selection
      fulfillment_mode: "pickup", // "pickup" (Self Pick-Up) or "delivery" (Home Delivery)
      route_requested: true,      // true: interactive route navigation, false: "I know the route"
      device_lat: 30.1345,
      device_lng: 77.2882,
      delivery_address: "",
      submitted_order_id: null
    };

    // Cart state
    this.cart = {
      items: [],
      subtotal: 0,
      delivery_fee: 0,
      total: 0,
      shop_id: null,
      shop_name: null,
      item_count: 0
    };

    this.notifications = [];
    this.unreadNotifsCount = 0;
  }

  setUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem("nearby_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("nearby_user");
    }
    window.dispatchEvent(new CustomEvent("userChanged", { detail: { user } }));
  }

  setRole(role) {
    this.currentRole = role;
    if (role) {
      localStorage.setItem("nearby_role", role);
      sessionStorage.setItem("nearby_active_tab_session", "true");
    } else {
      localStorage.removeItem("nearby_role");
      sessionStorage.removeItem("nearby_active_tab_session");
    }
    window.dispatchEvent(new CustomEvent("roleChanged", { detail: { role } }));
  }

  switchRole() {
    this.currentRole = null;
    localStorage.removeItem("nearby_role");
    this.closeProfileDrawer();
    window.dispatchEvent(new CustomEvent("roleChanged", { detail: { role: null } }));
    this.navigate("role-select");
  }

  logout() {
    this.currentUser = null;
    this.currentRole = null;
    localStorage.removeItem("nearby_user");
    localStorage.removeItem("nearby_role");
    sessionStorage.removeItem("nearby_active_tab_session");
    this.closeProfileDrawer();
    this.cart = { items: [], subtotal: 0, delivery_fee: 0, total: 0, shop_id: null, shop_name: null, item_count: 0 };
    window.dispatchEvent(new CustomEvent("userChanged", { detail: { user: null } }));
    window.dispatchEvent(new CustomEvent("roleChanged", { detail: { role: null } }));
    this.navigate("login");
  }

  navigate(view, params = {}) {
    this.currentView = view;
    this.viewParams = params;
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("routeChanged", { detail: { view, params } }));
  }

  resetWizard() {
    this.wizard.step = 1;
    this.wizard.selected_category = "Clothes";
    this.wizard.shop_preference = "nearby";
    this.wizard.selected_shop = null;
    this.wizard.inquiry_mode = "image";
    this.wizard.submitted_request_id = null;
    this.wizard.is_broadcasted = false;
    this.wizard.selected_response = null;
    this.wizard.submitted_order_id = null;
  }

  async openProfileDrawer() {
    const drawer = document.getElementById("profile-drawer");
    const overlay = document.getElementById("profile-drawer-overlay");
    if (!drawer || !overlay) return;

    const u = this.currentUser || {};
    document.getElementById("drawer-user-name").textContent = u.full_name || "Valued User";
    document.getElementById("drawer-avatar-circle").textContent = (u.full_name ? u.full_name.charAt(0) : "U").toUpperCase();
    document.getElementById("drawer-user-role-badge").textContent = this.currentRole === "shopkeeper" ? "Shopkeeper / Seller" : "Customer";
    
    document.getElementById("drawer-detail-name").textContent = u.full_name || "Not provided";
    document.getElementById("drawer-detail-phone").textContent = u.phone || "Not provided";
    document.getElementById("drawer-detail-email").textContent = u.email || "Not provided";
    document.getElementById("drawer-detail-address").textContent = u.address || `${u.local_area || 'Civil Lines'}, ${u.city || 'Yamunanagar'}`;
    document.getElementById("drawer-detail-pincode").textContent = u.pincode || "135001";
    document.getElementById("drawer-detail-district").textContent = u.district || u.city || "Yamunanagar";
    document.getElementById("drawer-detail-postoffice").textContent = u.post_office || `${u.city || 'Yamunanagar'} H.O.`;
    document.getElementById("drawer-detail-city-state").textContent = `${u.city || 'Yamunanagar'}, ${u.state || 'Haryana'}`;

    const specialtyCard = document.getElementById("drawer-specialty-card");
    if (this.currentRole === "shopkeeper" && u.store_specialty) {
      specialtyCard.style.display = "block";
      document.getElementById("drawer-detail-specialty").textContent = u.store_specialty;
    } else {
      specialtyCard.style.display = "none";
    }

    drawer.classList.add("open");
    overlay.classList.add("open");

    // Fetch live customer metrics: Shop Interaction Counter & Recent Orders
    if (u.id) {
      try {
        const res = await api.get(`/api/customer/metrics?user_id=${u.id}`);
        if (res && res.success) {
          const count = res.shops_contacted_count || 0;
          const shopsEl = document.getElementById("drawer-shops-counter");
          if (shopsEl) {
            shopsEl.textContent = `${count} Nearby ${count === 1 ? 'Shop' : 'Shops'}`;
          }

          const activeEl = document.getElementById("drawer-active-orders-badge");
          if (activeEl) {
            activeEl.textContent = `${res.active_orders_count || 0} Active`;
          }

          const listEl = document.getElementById("drawer-orders-list");
          if (listEl) {
            const orders = res.recent_orders || [];
            if (orders.length === 0) {
              listEl.innerHTML = `
                <div style="text-align: center; padding: 1rem; color: var(--text-muted); font-size: 0.82rem; background: var(--bg-app); border-radius: var(--radius-md);">
                  No orders placed yet. Start your first product inquiry!
                </div>
              `;
            } else {
              listEl.innerHTML = orders.map(ord => {
                const itemsSummary = (ord.items || []).map(it => `${it.quantity}x ${it.product_name}`).join(", ") || "Custom Item";
                const isPickup = ord.fulfillment_mode === "pickup" || ord.delivery_method === "pickup";
                return `
                  <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem; font-size: 0.84rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <strong style="color: var(--dark);">#${ord.id} • ${ord.shop_name || 'Store'}</strong>
                      <span style="font-weight: 700; color: var(--pastel-sage-dark);">₹${ord.total_amount}</span>
                    </div>
                    <div style="color: var(--text-muted); font-size: 0.78rem; margin-bottom: 0.35rem; line-height: 1.3;">
                      ${itemsSummary}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem;">
                      <span class="badge" style="background: ${isPickup ? 'var(--pastel-lavender-light)' : 'var(--pastel-sage-light)'}; color: ${isPickup ? 'var(--pastel-lavender-dark)' : 'var(--pastel-sage-dark)'};">
                        ${isPickup ? '📍 Self Pick-Up' : '🚚 Home Delivery'}
                      </span>
                      <span style="font-weight: 600; color: var(--dark);">
                        ${ord.delivery_status || ord.status || 'Confirmed'}
                      </span>
                    </div>
                  </div>
                `;
              }).join("");
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch customer metrics for drawer:", err);
      }
    }
  }

  closeProfileDrawer() {
    const drawer = document.getElementById("profile-drawer");
    const overlay = document.getElementById("profile-drawer-overlay");
    if (drawer) drawer.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  }
}

const appState = new AppState();
window.appState = appState;
