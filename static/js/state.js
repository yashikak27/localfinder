/**
 * state.js - Central Application State Management for LocalFind
 */

class AppState {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("localfind_user") || "null");
    this.currentRole = localStorage.getItem("localfind_role") || (this.currentUser ? this.currentUser.role : null);
    this.currentView = (this.currentUser && this.currentRole) ? (this.currentRole === "shopkeeper" ? "shopkeeper" : "home") : "welcome-flow";
    this.viewParams = {};
    
    // Find an Item Wizard State
    this.wizard = {
      step: 1, // 1: preference, 2: area, 3: needs, 4: summary, 5: responses
      shop_preference: "specific", // "specific" or "nearby"
      selected_shop: null,
      selected_category: "Clothes",
      state: "Haryana",
      city: "Yamunanagar",
      area: "Jagadhri",
      pincode: "135003",
      request_mode: "manual", // "image" or "manual"
      image_data: null,
      form_data: {
        clothing_type: "Upper / Top",
        clothing_item: "",
        brand_pref: "Any brand",
        sleeves: "Full",
        color_pref: "Any color",
        specific_color: "",
        size_pref: "L",
        skin_product_type: "",
        skin_concern: "",
        budget: "",
        shoe_type: "",
        description: ""
      },
      submitted_request_id: null
    };

    // Selected product for fulfillment
    this.selectedProductForOrder = null;
    
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
      localStorage.setItem("localfind_user", JSON.stringify(user));
      this.currentRole = user.role;
      localStorage.setItem("localfind_role", user.role);
    } else {
      localStorage.removeItem("localfind_user");
    }
    window.dispatchEvent(new CustomEvent("userChanged", { detail: { user } }));
  }

  setRole(role) {
    this.currentRole = role;
    localStorage.setItem("localfind_role", role);
    window.dispatchEvent(new CustomEvent("roleChanged", { detail: { role } }));
  }

  logout() {
    this.currentUser = null;
    this.currentRole = null;
    localStorage.removeItem("localfind_user");
    localStorage.removeItem("localfind_role");
    this.cart = { items: [], subtotal: 0, delivery_fee: 0, total: 0, shop_id: null, shop_name: null, item_count: 0 };
    window.dispatchEvent(new CustomEvent("userChanged", { detail: { user: null } }));
    window.dispatchEvent(new CustomEvent("roleChanged", { detail: { role: null } }));
    if (window.authView) {
      window.authView.welcomeStep = 1;
    }
    this.navigate("welcome-flow");
  }

  navigate(view, params = {}) {
    this.currentView = view;
    this.viewParams = params;
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("viewChanged", { detail: { view, params } }));
  }

  resetWizard() {
    this.wizard = {
      step: 1,
      shop_preference: "specific",
      selected_shop: null,
      selected_category: "Clothes",
      state: "Haryana",
      city: "Yamunanagar",
      area: "Jagadhri",
      pincode: "135003",
      request_mode: "manual",
      image_data: null,
      form_data: {
        clothing_type: "Upper / Top",
        clothing_item: "",
        brand_pref: "Any brand",
        sleeves: "Full",
        color_pref: "Any color",
        specific_color: "",
        size_pref: "L",
        skin_product_type: "",
        skin_concern: "",
        budget: "",
        shoe_type: "",
        description: ""
      },
      submitted_request_id: null
    };
  }

  updateCart(cartData) {
    this.cart = cartData;
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { cart: cartData } }));
  }
}

window.appState = new AppState();
