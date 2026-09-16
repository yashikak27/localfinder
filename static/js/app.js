/**
 * app.js - Main Application Orchestrator, Router, Modals & Toast Manager for Nearby
 */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // 1. Setup Top Bar, Header, Navigation & Events
  setupNavigation();
  setupModals();

  // 2. Listen to State Events
  window.addEventListener("viewChanged", (e) => {
    renderCurrentView(e.detail.view, e.detail.params);
  });

  window.addEventListener("userChanged", () => {
    updateHeader();
    refreshNotifications();
    loadCartState();
  });

  window.addEventListener("roleChanged", (e) => {
    updateHeader();
    if (e.detail.role === "shopkeeper") {
      appState.navigate("shopkeeper");
    } else if (e.detail.role === "customer") {
      appState.navigate("home");
    } else if (appState.currentUser) {
      appState.navigate("role-select");
    } else {
      appState.navigate("login");
    }
  });

  window.addEventListener("languageChanged", () => {
    i18n.applyTranslations(document);
    updateHeader();
    renderCurrentView(appState.currentView, appState.viewParams);
  });

  window.addEventListener("cartUpdated", (e) => {
    updateCartBadge(e.detail.cart.item_count);
  });

  // 3. Initial Render
  updateHeader();
  loadCartState();
  refreshNotifications();
  renderCurrentView(appState.currentView, appState.viewParams);
}

// Global Toast System
window.showToast = function(title, message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div style="font-size: 1.25rem;">${type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️')}</div>
    <div>
      <h5 style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.1rem;">${title}</h5>
      <p style="font-size: 0.8rem; color: var(--text-muted);">${message}</p>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Dynamic Header according to selected role
function updateHeader() {
  const navContainer = document.getElementById("nav-container");
  const navLinks = document.getElementById("nav-links");
  const roleSlot = document.getElementById("nav-role-slot");
  const roleActions = document.getElementById("nav-role-actions");
  const userSlot = document.getElementById("nav-user-slot");
  const cartBtn = document.getElementById("nav-cart-btn");

  const user = appState.currentUser;
  const role = appState.currentRole;
  const view = appState.currentView;

  // Before login OR on role-selection screen: Hide dashboard navigation
  if (!user || !role || view === "login" || view === "role-select") {
    if (navContainer) navContainer.style.display = "none";
    if (roleSlot) roleSlot.innerHTML = "";
    if (roleActions) roleActions.style.display = "none";
    if (userSlot) {
      if (user && view === "role-select") {
        userSlot.innerHTML = `
          <button class="btn btn-sm btn-outline-danger" id="nav-btn-logout" title="Sign out / change details">
            🚪 Sign Out
          </button>
        `;
        document.getElementById("nav-btn-logout")?.addEventListener("click", () => appState.logout());
      } else {
        userSlot.innerHTML = "";
      }
    }
    return;
  }

  // Customer Role: Customer-specific Header (Decluttered: no Cart, no Shops, no Find an item)
  if (role === "customer") {
    if (navContainer) navContainer.style.display = "block";
    if (roleActions) {
      roleActions.style.display = "flex";
      if (cartBtn) cartBtn.style.display = "none"; // Decluttered: removed cart from top nav
    }

    if (roleSlot) {
      roleSlot.innerHTML = "";
    }

    if (navLinks) {
      navLinks.innerHTML = `
        <li><a class="nav-item ${view === 'home' ? 'active' : ''}" href="#" data-nav="home">Nearby Wizard</a></li>
        <li><a class="nav-item ${view === 'orders' ? 'active' : ''}" href="#" data-nav="orders">My Orders</a></li>
      `;
    }

    if (userSlot) {
      userSlot.innerHTML = `
        <button type="button" class="nearby-nav-profile-btn" id="nav-single-profile-trigger" title="View Registration Profile Details">
          <div class="nearby-avatar-circle">${user.full_name ? user.full_name.charAt(0).toUpperCase() : 'C'}</div>
          <span>${user.full_name || 'Customer'}</span>
          <span style="font-size: 0.7rem; opacity: 0.7;">▼</span>
        </button>
      `;
      document.getElementById("nav-single-profile-trigger")?.addEventListener("click", () => appState.openProfileDrawer());
    }
  } else if (role === "shopkeeper") {
    // Shopkeeper Role: Shopkeeper-specific Header
    if (navContainer) navContainer.style.display = "block";
    if (roleActions) {
      roleActions.style.display = "flex";
      if (cartBtn) cartBtn.style.display = "none";
    }

    if (roleSlot) {
      roleSlot.innerHTML = "";
    }

    if (navLinks) {
      navLinks.innerHTML = `
        <li><a class="nav-item ${view === 'shopkeeper' && shopkeeperView.currentTab === 'requests' ? 'active' : ''}" href="#" data-nav="shopkeeper">Seller Hub</a></li>
        <li><a class="nav-item ${view === 'orders' ? 'active' : ''}" href="#" data-nav="orders">Orders</a></li>
      `;
    }

    if (userSlot) {
      userSlot.innerHTML = `
        <button type="button" class="nearby-nav-profile-btn" id="nav-single-profile-trigger" title="View Registration Profile Details">
          <div class="nearby-avatar-circle" style="background: var(--pastel-blush);">${user.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}</div>
          <span>${user.full_name || 'Merchant'}</span>
          <span style="font-size: 0.7rem; opacity: 0.7;">▼</span>
        </button>
      `;
      document.getElementById("nav-single-profile-trigger")?.addEventListener("click", () => appState.openProfileDrawer());
    }
  }

  // Attach nav listeners
  if (navLinks) {
    navLinks.querySelectorAll("[data-nav]").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.dataset.nav;
        appState.navigate(target);
        navLinks.classList.remove("mobile-open");
      });
    });
  }

  i18n.applyTranslations(document.getElementById("main-navbar"));
}

// Navigation & Header Setup
function setupNavigation() {
  const brandLink = document.getElementById("brand-link");
  if (brandLink) {
    brandLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (!appState.currentUser) {
        appState.navigate("login");
      } else if (!appState.currentRole) {
        appState.navigate("role-select");
      } else if (appState.currentRole === "shopkeeper") {
        appState.navigate("shopkeeper");
      } else {
        appState.navigate("home");
      }
    });
  }

  // Language switch buttons
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
    });
  });

  // Cart button
  const cartBtn = document.getElementById("nav-cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => appState.navigate("cart"));
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");
    });
  }

  // Notifications bell
  const bell = document.getElementById("notif-bell");
  const dropdown = document.getElementById("notif-dropdown");
  if (bell && dropdown) {
    bell.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    });
    document.addEventListener("click", () => {
      dropdown.style.display = "none";
    });
  }

  // Profile Drawer controls
  document.getElementById("profile-drawer-close-btn")?.addEventListener("click", () => appState.closeProfileDrawer());
  document.getElementById("profile-drawer-overlay")?.addEventListener("click", () => appState.closeProfileDrawer());
  document.getElementById("drawer-btn-switch-role")?.addEventListener("click", () => {
    appState.closeProfileDrawer();
    appState.navigate("role-select");
  });
  document.getElementById("drawer-btn-logout")?.addEventListener("click", () => {
    appState.closeProfileDrawer();
    appState.logout();
  });
}

function updateCartBadge(count) {
  const badge = document.getElementById("cart-count-badge");
  if (badge) {
    badge.textContent = count || 0;
  }
}

async function loadCartState() {
  if (appState.currentUser) {
    try {
      const res = await api.getCart(appState.currentUser.id);
      appState.updateCart(res);
    } catch (e) {}
  } else {
    updateCartBadge(0);
  }
}

async function refreshNotifications() {
  if (!appState.currentUser) return;
  try {
    const res = await api.getNotifications(appState.currentUser.id);
    const unread = res.unread_count || 0;
    const badge = document.getElementById("notif-badge");
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? "inline-block" : "none";
    }
    const list = document.getElementById("notif-list");
    if (list && res.notifications) {
      list.innerHTML = res.notifications.length > 0 ? res.notifications.slice(0, 5).map(n => `
        <div style="padding: 0.6rem 0.8rem; border-bottom: 1px solid var(--border-color); font-size: 0.82rem; background: ${n.is_read ? '#fff' : '#f0fdf4'};">
          <strong>${i18n.lang === 'hi' && n.title_hi ? n.title_hi : n.title}</strong>
          <p style="color: var(--text-muted); margin-top: 0.1rem;">${i18n.lang === 'hi' && n.message_hi ? n.message_hi : n.message}</p>
        </div>
      `).join("") + `
        <div style="padding: 0.5rem; text-align: center; border-top: 1px solid var(--border-color);">
          <a href="#" onclick="appState.navigate('notifications')" style="font-size: 0.8rem; font-weight: 700; color: var(--primary);">View All Notifications →</a>
        </div>
      ` : `<p style="padding: 0.75rem; color: var(--text-muted); font-size: 0.85rem;">No notifications</p>`;
    }
  } catch (e) {}
}

// Router strictly enforcing sequential flow:
// 1. Login/Onboarding Form -> 2. Role Selection -> 3. Role-specific Dashboard
function renderCurrentView(view, params = {}) {
  const root = document.getElementById("app-root");
  if (!root) return;

  // Enforce sequential flow
  if (!appState.currentUser) {
    view = "login";
  } else if (!appState.currentRole) {
    view = "role-select";
  } else if (appState.currentRole === "customer") {
    if (view === "login" || view === "role-select" || view === "shopkeeper" || view === "welcome-flow") {
      view = "home";
    }
  } else if (appState.currentRole === "shopkeeper") {
    if (view === "login" || view === "role-select" || view === "home" || view === "welcome-flow") {
      view = "shopkeeper";
    }
  }

  appState.currentView = view;
  updateHeader();

  switch (view) {
    case "login":
    case "welcome-flow":
      authView.renderLogin(root);
      break;
    case "role-select":
      authView.renderRoleSelect(root);
      break;
    case "home":
      customerView.renderHome(root);
      break;
    case "find-item":
      customerView.renderFindItemWizard(root);
      break;
    case "shops":
      customerView.renderShopsList(root);
      break;
    case "shop-detail":
      customerView.renderShopDetail(root, params.shop_id);
      break;
    case "fulfillment":
      ordersView.renderFulfillment(root);
      break;
    case "payment":
      paymentView.render(root);
      break;
    case "notifications":
      notificationsView.render(root);
      break;
    case "orders":
      if (appState.currentRole === "shopkeeper") {
        shopkeeperView.currentTab = "orders";
        shopkeeperView.renderDashboard(root);
      } else {
        ordersView.renderOrders(root);
      }
      break;
    case "confirmed-orders":
      shopkeeperView.renderConfirmedOrders(root);
      break;
    case "earnings":
      shopkeeperView.renderEarnings(root);
      break;
    case "shop-profile":
      shopkeeperView.currentTab = "profile";
      shopkeeperView.renderDashboard(root);
      break;
    case "products":
      shopkeeperView.currentTab = "products";
      shopkeeperView.renderDashboard(root);
      break;
    case "add-product":
      shopkeeperView.currentTab = "add_product";
      shopkeeperView.renderDashboard(root);
      break;
    case "requests":
      shopkeeperView.currentTab = "requests";
      shopkeeperView.renderDashboard(root);
      break;
    case "cart":
      cartView.renderCart(root);
      break;
    case "profile":
      profileView.renderProfile(root);
      break;
    case "shopkeeper":
      shopkeeperView.renderDashboard(root);
      break;
    case "admin":
      adminView.renderAdmin(root);
      break;
    default:
      if (!appState.currentUser) {
        authView.renderLogin(root);
      } else if (!appState.currentRole) {
        authView.renderRoleSelect(root);
      } else if (appState.currentRole === "shopkeeper") {
        shopkeeperView.renderDashboard(root);
      } else {
        customerView.renderHome(root);
      }
  }

  i18n.applyTranslations(root);
}

// Modals Setup
function setupModals() {
  // Wire Slide-out Profile Details Drawer
  document.getElementById("profile-drawer-close-btn")?.addEventListener("click", () => appState.closeProfileDrawer());
  document.getElementById("profile-drawer-overlay")?.addEventListener("click", () => appState.closeProfileDrawer());
  document.getElementById("drawer-btn-switch-role")?.addEventListener("click", () => appState.switchRole());
  document.getElementById("drawer-btn-logout")?.addEventListener("click", () => appState.logout());

  // First-time language selector modal
  window.showLanguageModal = function() {
    const modal = document.getElementById("lang-select-modal");
    if (modal) modal.classList.add("open");
  };

  const btnEnChoice = document.getElementById("modal-lang-en");
  const btnHiChoice = document.getElementById("modal-lang-hi");
  const btnLangContinue = document.getElementById("modal-lang-continue");
  const langModal = document.getElementById("lang-select-modal");

  let pickedLang = i18n.lang;
  if (btnEnChoice && btnHiChoice) {
    btnEnChoice.addEventListener("click", () => {
      pickedLang = "en";
      btnEnChoice.classList.add("btn-primary");
      btnEnChoice.classList.remove("btn-outline");
      btnHiChoice.classList.remove("btn-primary");
      btnHiChoice.classList.add("btn-outline");
    });
    btnHiChoice.addEventListener("click", () => {
      pickedLang = "hi";
      btnHiChoice.classList.add("btn-primary");
      btnHiChoice.classList.remove("btn-outline");
      btnEnChoice.classList.remove("btn-primary");
      btnEnChoice.classList.add("btn-outline");
    });
  }

  if (btnLangContinue && langModal) {
    btnLangContinue.addEventListener("click", () => {
      i18n.setLang(pickedLang);
      localStorage.setItem("localfind_lang_chosen", "true");
      langModal.classList.remove("open");
    });
  }

  // Directions map modal (Step 15)
  window.showDirectionsModal = function(shopInfo) {
    const modal = document.getElementById("directions-modal");
    if (!modal) return;
    document.getElementById("dir-shop-name").textContent = shopInfo.name;
    document.getElementById("dir-shop-addr").textContent = `${shopInfo.address}, ${shopInfo.area || 'Jagadhri'}, ${shopInfo.city || 'Yamunanagar'}`;
    modal.classList.add("open");
  };

  // Single-Shop Limitation Modal (Step 20)
  window.showSingleShopModal = function(message) {
    const modal = document.getElementById("single-shop-modal");
    if (!modal) return;
    document.getElementById("single-shop-msg").textContent = message;
    modal.classList.add("open");
  };

  // Suggestion Modal (Shopkeeper reply to request)
  window.showSuggestionModal = function(reqData) {
    const modal = document.getElementById("suggestion-modal");
    if (!modal) return;
    document.getElementById("sug-req-id").value = reqData.request_id;
    document.getElementById("sug-shop-id").value = reqData.shop_id;
    modal.classList.add("open");
  };

  // Rating Modal (Step 21 - Shop, Delivery, Product satisfaction)
  window.showRatingModal = function(orderData) {
    const modal = document.getElementById("rating-modal");
    if (!modal) return;
    document.getElementById("rate-order-id").value = orderData.order_id;
    document.getElementById("rate-shop-id").value = orderData.shop_id;
    document.getElementById("rate-shop-title").textContent = orderData.shop_name;
    
    // Hide delivery rating if self pickup!
    const deliveryGroup = document.getElementById("delivery-rating-group");
    if (deliveryGroup) {
      deliveryGroup.style.display = orderData.is_delivery ? "block" : "none";
    }

    modal.classList.add("open");
  };

  // Close modals on close buttons
  document.querySelectorAll(".modal-close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("open"));
    });
  });

  // Suggestion Form Submit
  const sugForm = document.getElementById("suggestion-form");
  if (sugForm) {
    sugForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const reqId = document.getElementById("sug-req-id").value;
      const payload = {
        shop_id: parseInt(document.getElementById("sug-shop-id").value),
        product_name: document.getElementById("sug-prod-name").value.trim(),
        price: parseFloat(document.getElementById("sug-prod-price").value),
        description: document.getElementById("sug-prod-desc").value.trim(),
        image_url: document.getElementById("sug-prod-img").value.trim(),
        note: document.getElementById("sug-note").value.trim()
      };

      try {
        const res = await api.respondToRequest(reqId, payload);
        window.showToast(t("success"), res.message, "success");
        document.getElementById("suggestion-modal").classList.remove("open");
        // Re-render shopkeeper tab
        shopkeeperView.renderRequestsTab(document.getElementById("shopkeeper-tab-content"), { id: payload.shop_id });
      } catch (err) {
        window.showToast(t("error"), err.message, "error");
      }
    });
  }

  // Star Rating Click Handlers
  setupStarRating("shop-stars-picker", "rate-shop-val");
  setupStarRating("delivery-stars-picker", "rate-delivery-val");

  // Rating Form Submit
  const rateForm = document.getElementById("rating-form");
  if (rateForm) {
    rateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        order_id: parseInt(document.getElementById("rate-order-id").value),
        shop_id: parseInt(document.getElementById("rate-shop-id").value),
        customer_id: appState.currentUser.id,
        customer_name: appState.currentUser.full_name,
        shop_rating: parseInt(document.getElementById("rate-shop-val").value),
        shop_review: document.getElementById("rate-shop-review").value.trim(),
        delivery_rating: parseInt(document.getElementById("rate-delivery-val").value),
        delivery_review: document.getElementById("rate-delivery-review").value.trim(),
        product_satisfied: document.querySelector("input[name='rate-prod-sat']:checked") ? document.querySelector("input[name='rate-prod-sat']:checked").value : "Yes",
        product_feedback: document.getElementById("rate-prod-feedback").value.trim()
      };

      try {
        const res = await api.submitReview(payload);
        window.showToast(t("success"), res.message, "success");
        document.getElementById("rating-modal").classList.remove("open");
        ordersView.renderOrders(document.getElementById("app-root"));
      } catch (err) {
        window.showToast(t("error"), err.message, "error");
      }
    });
  }
}

function setupStarRating(containerId, hiddenInputId) {
  const container = document.getElementById(containerId);
  const input = document.getElementById(hiddenInputId);
  if (!container || !input) return;

  const stars = container.querySelectorAll(".star");
  stars.forEach((star, idx) => {
    star.addEventListener("click", () => {
      const val = idx + 1;
      input.value = val;
      stars.forEach((s, i) => {
        if (i < val) s.classList.add("filled");
        else s.classList.remove("filled");
      });
    });
  });
}
