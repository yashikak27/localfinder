/**
 * shopkeeper.js - Dedicated Shopkeeper Management Panel for LocalFind
 * Covers: Shop Profile, Product Catalog CRUD, Customer Requests & Suggestions, and Orders Progression
 */

const shopkeeperView = {
  currentTab: "overview",

  async renderDashboard(container) {
    const user = appState.currentUser;
    if (!user || user.role !== "shopkeeper") {
      container.innerHTML = `
        <div class="container" style="max-width: 520px; margin: 3rem auto; text-align: center;">
          <div class="card">
            <h2 class="card-title">Shopkeeper Portal</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">You need a registered shopkeeper account to access this panel.</p>
            <div style="display: flex; gap: 0.75rem; justify-content: center;">
              <button class="btn btn-primary" onclick="appState.navigate('login')">${t("btn_login")}</button>
              <button class="btn btn-outline" onclick="appState.navigate('register')">${t("btn_register")}</button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const shop = user.shop || { id: 1, name: "Gupta Garments & Fashion", category: "Clothes", is_open: 1 };

    container.innerHTML = `
      <div class="container" style="margin: 2rem auto;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
          <div>
            <span class="shop-badge" style="background: var(--secondary-light); color: var(--secondary-hover); font-weight: 700;">🏪 SHOPKEEPER DASHBOARD</span>
            <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--dark); margin-top: 0.2rem;">${shop.name}</h1>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: var(--radius-sm); background: ${shop.is_open ? 'var(--primary-light)' : '#fee2e2'}; color: ${shop.is_open ? 'var(--primary-dark)' : 'var(--danger)'};">
              ${shop.is_open ? t("shop_status_open") : t("shop_status_closed")}
            </span>
            <button class="btn btn-sm btn-outline" id="btn-toggle-shop-status" data-i18n="btn_toggle_status">
              🔄 ${t("btn_toggle_status")}
            </button>
          </div>
        </div>

        <!-- Dashboard Navigation Tabs -->
        <div class="tabs-nav">
          <button class="tab-btn ${this.currentTab === 'overview' ? 'active' : ''}" data-tab="overview" data-i18n="tab_overview">${t("tab_overview")}</button>
          <button class="tab-btn ${this.currentTab === 'requests' ? 'active' : ''}" data-tab="requests" data-i18n="tab_requests">💬 ${t("tab_requests")}</button>
          <button class="tab-btn ${this.currentTab === 'orders' ? 'active' : ''}" data-tab="orders" data-i18n="tab_orders">📦 ${t("tab_orders")}</button>
          <button class="tab-btn ${this.currentTab === 'confirmed_orders' ? 'active' : ''}" data-tab="confirmed_orders">✅ ${t("confirmed_orders_title")}</button>
          <button class="tab-btn ${this.currentTab === 'earnings' ? 'active' : ''}" data-tab="earnings">💰 ${t("earnings_title")}</button>
          <button class="tab-btn ${this.currentTab === 'products' ? 'active' : ''}" data-tab="products" data-i18n="tab_products">🏷️ ${t("tab_products")}</button>
          <button class="tab-btn ${this.currentTab === 'add_product' ? 'active' : ''}" data-tab="add_product" data-i18n="tab_add_product">➕ ${t("tab_add_product")}</button>
          <button class="tab-btn ${this.currentTab === 'profile' ? 'active' : ''}" data-tab="profile" data-i18n="tab_profile">⚙️ ${t("tab_profile")}</button>
        </div>

        <!-- Tab Content Area -->
        <div id="shopkeeper-tab-content"></div>
      </div>
    `;

    // Tab Switcher
    container.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.currentTab = btn.dataset.tab;
        this.renderDashboard(container);
      });
    });

    // Toggle store open/closed
    document.getElementById("btn-toggle-shop-status").addEventListener("click", async () => {
      const newStatus = shop.is_open ? 0 : 1;
      try {
        await api.updateShop(shop.id, { is_open: newStatus });
        shop.is_open = newStatus;
        user.shop = shop;
        appState.setUser(user);
        window.showToast(t("success"), `Store status set to: ${newStatus ? 'OPEN' : 'CLOSED'}`, "success");
        this.renderDashboard(container);
      } catch (err) {
        window.showToast(t("error"), err.message, "error");
      }
    });

    const tabContainer = document.getElementById("shopkeeper-tab-content");
    if (this.currentTab === "overview") this.renderOverviewTab(tabContainer, shop);
    else if (this.currentTab === "requests") this.renderRequestsTab(tabContainer, shop);
    else if (this.currentTab === "orders") this.renderOrdersTab(tabContainer, shop);
    else if (this.currentTab === "confirmed_orders") this.renderConfirmedOrdersTab(tabContainer, shop);
    else if (this.currentTab === "earnings") this.renderEarningsTab(tabContainer, shop);
    else if (this.currentTab === "products") this.renderProductsTab(tabContainer, shop);
    else if (this.currentTab === "add_product") this.renderAddProductTab(tabContainer, shop);
    else if (this.currentTab === "profile") this.renderShopProfileTab(tabContainer, shop);
  },

  // 1. Overview Tab
  async renderOverviewTab(container, shop) {
    container.innerHTML = `<p>${t("loading")}</p>`;
    try {
      const [reqRes, ordRes, prodRes] = await Promise.all([
        api.getRequests({ shop_id: shop.id }),
        api.getOrders({ shop_id: shop.id }),
        api.getProducts({ shop_id: shop.id })
      ]);

      const requests = reqRes.requests || [];
      const orders = ordRes.orders || [];
      const products = prodRes.products || [];

      container.innerHTML = `
        <!-- Metrics -->
        <div class="grid-3" style="margin-bottom: 2rem;">
          <div class="stat-box">
            <div class="stat-icon green">💬</div>
            <div>
              <div class="stat-number">${requests.length}</div>
              <div class="stat-label" data-i18n="stat_requests">${t("stat_requests")}</div>
            </div>
          </div>
          <div class="stat-box">
            <div class="stat-icon amber">📦</div>
            <div>
              <div class="stat-number">${orders.length}</div>
              <div class="stat-label" data-i18n="stat_orders">${t("stat_orders")}</div>
            </div>
          </div>
          <div class="stat-box">
            <div class="stat-icon blue">🏷️</div>
            <div>
              <div class="stat-number">${products.length}</div>
              <div class="stat-label" data-i18n="stat_products">${t("stat_products")}</div>
            </div>
          </div>
        </div>

        <!-- Recent Inquiries Section -->
        <div class="card" style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-size: 1.2rem; font-weight: 700;">Recent Customer Inquiries</h3>
            <button class="btn btn-sm btn-outline" id="btn-view-all-requests">View All Inquiries →</button>
          </div>
          ${requests.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${requests.slice(0, 3).map(r => `
                <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.9rem 1.2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                  <div>
                    <h5 style="font-weight: 700;">Inquiry #${r.id}: ${r.category} (${r.clothing_type || r.shoe_type || r.category})</h5>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">From: ${r.customer_name} (${r.area || 'Jagadhri'}) | Status: <strong>${r.status}</strong></p>
                  </div>
                  <button class="btn btn-sm btn-primary btn-reply-req" data-id="${r.id}">Reply with Suggestion</button>
                </div>
              `).join("")}
            </div>
          ` : `<p style="color: var(--text-muted);">No customer inquiries yet.</p>`}
        </div>
      `;

      document.getElementById("btn-view-all-requests").addEventListener("click", () => {
        this.currentTab = "requests";
        this.renderDashboard(document.getElementById("app-root"));
      });

      container.querySelectorAll(".btn-reply-req").forEach(btn => {
        btn.addEventListener("click", () => {
          this.currentTab = "requests";
          this.renderDashboard(document.getElementById("app-root"));
        });
      });
    } catch (err) {
      container.innerHTML = `<p style="color: var(--danger);">${err.message}</p>`;
    }
  },

  // 2. Customer Requests Tab (Inquiries & Suggestions)
  async renderRequestsTab(container, shop) {
    container.innerHTML = `<p>${t("loading")}</p>`;
    try {
      const res = await api.getRequests({ shop_id: shop.id });
      const requests = res.requests || [];

      container.innerHTML = `
        <div class="card">
          <h3 class="card-title" data-i18n="incoming_requests">${t("incoming_requests")}</h3>
          <p class="card-subtitle">Review items customers are searching for and offer matching products with prices & photos.</p>

          ${requests.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem;">
              ${requests.map(r => `
                <div class="card" style="border: 2px solid ${r.status === 'Product Suggested' ? 'var(--primary)' : 'var(--border-color)'};">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                    <div>
                      <span class="shop-badge" style="background: #e0e7ff; color: #3730a3;">REQUEST #${r.id}</span>
                      <h4 style="font-size: 1.15rem; font-weight: 700; margin-top: 0.2rem;">${r.category} Request</h4>
                      <p style="font-size: 0.85rem; color: var(--text-muted);">Customer: <strong>${r.customer_name}</strong> (📞 ${r.customer_phone || 'Protected'}) | Locality: ${r.area || 'Jagadhri'}</p>
                    </div>
                    <span style="font-weight: 700; font-size: 0.9rem; color: var(--primary);">Status: ${r.status}</span>
                  </div>

                  <div style="display: flex; gap: 1.25rem; flex-wrap: wrap; margin-bottom: 1.25rem; background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
                    ${r.image_data ? `
                      <img src="${r.image_data}" style="width: 100px; height: 100px; object-fit: cover; border-radius: var(--radius-md);" />
                    ` : ''}
                    <div style="flex: 1; font-size: 0.9rem;">
                      <p><strong>Color:</strong> ${r.color_pref || 'Any'} | <strong>Brand:</strong> ${r.brand_pref || 'Any'} | <strong>Size:</strong> ${r.size_pref || 'N/A'}</p>
                      ${r.sleeves ? `<p><strong>Sleeves:</strong> ${r.sleeves}</p>` : ''}
                      ${r.description ? `<p style="margin-top: 0.4rem; color: var(--text-main);"><strong>Customer Note:</strong> "${r.description}"</p>` : ''}
                    </div>
                  </div>

                  <!-- Previous responses sent by shopkeeper -->
                  ${r.responses && r.responses.length > 0 ? `
                    <div style="margin-bottom: 1rem; border-left: 3px solid var(--primary); padding-left: 0.75rem;">
                      <h5 style="font-weight: 700; font-size: 0.9rem; color: var(--primary);">Your Suggestions Sent:</h5>
                      ${r.responses.map(resp => `
                        <p style="font-size: 0.85rem; margin: 0.2rem 0;">
                          • <strong>${resp.product_name}</strong> - ₹${resp.price} (${resp.status})
                        </p>
                      `).join("")}
                    </div>
                  ` : ''}

                  <div>
                    <button class="btn btn-primary btn-open-suggest-modal" data-id="${r.id}" data-cat="${r.category}" data-name="${r.customer_name}" data-i18n="btn_reply_suggestion">
                      💡 ${t("btn_reply_suggestion")}
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          ` : `<p style="color: var(--text-muted); margin-top: 1rem;">No inquiries found for this store.</p>`}
        </div>
      `;

      container.querySelectorAll(".btn-open-suggest-modal").forEach(btn => {
        btn.addEventListener("click", () => {
          window.showSuggestionModal({
            request_id: btn.dataset.id,
            category: btn.dataset.cat,
            shop_id: shop.id
          });
        });
      });
    } catch (err) {
      container.innerHTML = `<p style="color: var(--danger);">${err.message}</p>`;
    }
  },

  // 3. Shopkeeper Orders Tab (Orders Progression Timeline)
  async renderOrdersTab(container, shop) {
    container.innerHTML = `<p>${t("loading")}</p>`;
    try {
      const res = await api.getOrders({ shop_id: shop.id });
      const orders = res.orders || [];

      container.innerHTML = `
        <div class="card">
          <h3 class="card-title" data-i18n="incoming_orders">${t("incoming_orders")}</h3>
          <p class="card-subtitle">Manage customer orders, view fulfillment addresses, and progress live order status.</p>

          ${orders.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem;">
              ${orders.map(o => {
                const isPickup = o.delivery_method === "Self Pickup";
                return `
                  <div class="card" style="border: 2px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                      <div>
                        <span class="shop-badge" style="background: ${isPickup ? 'var(--primary-light)' : 'var(--secondary-light)'}; color: ${isPickup ? 'var(--primary-dark)' : 'var(--secondary-hover)'}; font-weight: 700;">
                          ${isPickup ? '🚶 SELF PICKUP' : '🛵 HOME DELIVERY'}
                        </span>
                        <h4 style="font-size: 1.15rem; font-weight: 700; margin-top: 0.2rem;">Order #${o.id} - ₹${o.total_amount}</h4>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Customer: <strong>${o.customer_name}</strong> (📞 ${o.customer_phone})</p>
                        ${!isPickup ? `<p style="font-size: 0.85rem; color: var(--text-muted);">📍 Delivery Address: ${o.delivery_address}, ${o.customer_city}</p>` : ''}
                      </div>
                      <div style="text-align: right;">
                        <span style="font-weight: 800; font-size: 1rem; color: var(--primary);">${o.status}</span>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">Payment: ${o.payment_method}</p>
                      </div>
                    </div>

                    <!-- Items -->
                    <div style="background: var(--bg-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.88rem;">
                      <strong>Items:</strong>
                      ${o.items ? o.items.map(it => `
                        <div style="display: flex; justify-content: space-between; margin-top: 0.2rem;">
                          <span>${it.product_name} (${it.size || 'M'}, Qty: ${it.quantity})</span>
                          <span>₹${it.price * it.quantity}</span>
                        </div>
                      `).join("") : 'No items'}
                    </div>

                    <!-- Status progression buttons -->
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                      <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);" data-i18n="order_action">${t("order_action")}:</span>
                      
                      ${isPickup ? `
                        <button class="btn btn-sm btn-outline btn-status-upd" data-id="${o.id}" data-status="Order Confirmed">Confirmed</button>
                        <button class="btn btn-sm btn-outline-primary btn-status-upd" data-id="${o.id}" data-status="Ready for Pickup">Ready for Pickup</button>
                        <button class="btn btn-sm btn-primary btn-status-upd" data-id="${o.id}" data-status="Collected">Collected</button>
                      ` : `
                        <button class="btn btn-sm btn-outline btn-status-upd" data-id="${o.id}" data-status="Order Confirmed">Confirmed</button>
                        <button class="btn btn-sm btn-outline-primary btn-status-upd" data-id="${o.id}" data-status="Preparing">Preparing</button>
                        <button class="btn btn-sm btn-outline btn-status-upd" data-id="${o.id}" data-status="Out for Delivery">Out for Delivery</button>
                        <button class="btn btn-sm btn-primary btn-status-upd" data-id="${o.id}" data-status="Delivered">Delivered</button>
                      `}
                      <button class="btn btn-sm btn-danger btn-status-upd" data-id="${o.id}" data-status="Cancelled">Cancel</button>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          ` : `<p style="color: var(--text-muted); margin-top: 1rem;">No customer orders placed yet.</p>`}
        </div>
      `;

      container.querySelectorAll(".btn-status-upd").forEach(btn => {
        btn.addEventListener("click", async () => {
          const ordId = btn.dataset.id;
          const status = btn.dataset.status;
          try {
            await api.updateOrderStatus(ordId, status);
            window.showToast(t("success"), `Order #${ordId} status set to: ${status}`, "success");
            shopkeeperView.renderOrdersTab(container, shop);
          } catch (err) {
            window.showToast(t("error"), err.message, "error");
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<p style="color: var(--danger);">${err.message}</p>`;
    }
  },

  // 4. Products Catalog Management Tab
  async renderProductsTab(container, shop) {
    container.innerHTML = `<p>${t("loading")}</p>`;
    try {
      const res = await api.getProducts({ shop_id: shop.id });
      const products = res.products || [];

      container.innerHTML = `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <div>
              <h3 class="card-title" data-i18n="my_products">${t("my_products")}</h3>
              <p class="card-subtitle">Manage products listed in your digital storefront.</p>
            </div>
            <button class="btn btn-primary" id="btn-goto-add-prod" data-i18n="tab_add_product">
              ➕ ${t("tab_add_product")}
            </button>
          </div>

          <div class="grid-3">
            ${products.map(p => `
              <div class="product-card">
                <img class="product-img" src="${p.image_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'}" alt="${p.name}" />
                <div class="product-body">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem;">
                    <h4 class="product-name">${p.name}</h4>
                    <span style="font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); background: ${p.is_available ? 'var(--primary-light)' : '#fee2e2'}; color: ${p.is_available ? 'var(--primary-dark)' : 'var(--danger)'};">
                      ${p.is_available ? t("product_status_available") : t("product_status_unavailable")}
                    </span>
                  </div>
                  <p class="product-desc">${p.description || ''}</p>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Sizes: ${p.sizes || 'N/A'}</p>
                  <div class="product-price-row">
                    <span class="product-price">₹${p.price}</span>
                    <div style="display: flex; gap: 0.4rem;">
                      <button class="btn btn-sm btn-outline btn-toggle-avail" data-id="${p.id}" data-avail="${p.is_available}">
                        ${p.is_available ? 'Mark Unavailable' : 'Mark Available'}
                      </button>
                      <button class="btn btn-sm btn-danger btn-del-prod" data-id="${p.id}">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;

      document.getElementById("btn-goto-add-prod").addEventListener("click", () => {
        shopkeeperView.currentTab = "add_product";
        shopkeeperView.renderDashboard(document.getElementById("app-root"));
      });

      container.querySelectorAll(".btn-toggle-avail").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          const current = parseInt(btn.dataset.avail);
          await api.updateProduct(id, { is_available: current ? 0 : 1 });
          shopkeeperView.renderProductsTab(container, shop);
        });
      });

      container.querySelectorAll(".btn-del-prod").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (confirm("Delete this product from catalog?")) {
            await api.deleteProduct(btn.dataset.id);
            shopkeeperView.renderProductsTab(container, shop);
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<p style="color: var(--danger);">${err.message}</p>`;
    }
  },

  // 5. Add Product Tab
  renderAddProductTab(container, shop) {
    container.innerHTML = `
      <div class="card" style="max-width: 640px; margin: 0 auto;">
        <h3 class="card-title" data-i18n="add_product_title">${t("add_product_title")}</h3>
        <p class="card-subtitle">Upload a product with prices, sizes, and colors for customers in your locality.</p>

        <form id="add-product-form">
          <div class="form-group">
            <label class="form-label" data-i18n="product_name">${t("product_name")} *</label>
            <input type="text" id="add-pname" class="form-control" placeholder="e.g. Slim-Fit Cotton Shirt" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="product_category">${t("product_category")}</label>
              <select id="add-pcat" class="form-control">
                <option value="Clothes" ${shop.category === 'Clothes' ? 'selected' : ''}>Clothes (कपड़े)</option>
                <option value="Skincare" ${shop.category === 'Skincare' ? 'selected' : ''}>Skincare (स्किनकेयर)</option>
                <option value="Shoes" ${shop.category === 'Shoes' ? 'selected' : ''}>Shoes (जूते)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="product_price">${t("product_price")} *</label>
              <input type="number" id="add-pprice" class="form-control" placeholder="799" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="product_description">${t("product_description")}</label>
            <textarea id="add-pdesc" class="form-control" rows="2" placeholder="Brief material description, fit, etc."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="product_sizes">${t("product_sizes")}</label>
              <input type="text" id="add-psizes" class="form-control" placeholder="M, L, XL" value="M, L, XL" />
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="product_colors">${t("product_colors")}</label>
              <input type="text" id="add-pcolors" class="form-control" placeholder="Navy Blue, White" value="Navy Blue, White" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="product_image_url">${t("product_image_url")}</label>
            <input type="url" id="add-pimg" class="form-control" placeholder="https://images.unsplash.com/photo-..." value="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500" />
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" data-i18n="btn_save_product">
            💾 ${t("btn_save_product")}
          </button>
        </form>
      </div>
    `;

    document.getElementById("add-product-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        shop_id: shop.id,
        name: document.getElementById("add-pname").value.trim(),
        category: document.getElementById("add-pcat").value,
        price: parseFloat(document.getElementById("add-pprice").value),
        description: document.getElementById("add-pdesc").value.trim(),
        sizes: document.getElementById("add-psizes").value.trim(),
        colors: document.getElementById("add-pcolors").value.trim(),
        image_url: document.getElementById("add-pimg").value.trim()
      };

      try {
        const res = await api.addProduct(payload);
        window.showToast(t("success"), res.message, "success");
        shopkeeperView.currentTab = "products";
        shopkeeperView.renderDashboard(document.getElementById("app-root"));
      } catch (err) {
        window.showToast(t("error"), err.message, "error");
      }
    });
  },

  // 6. Shop Profile Tab
  renderShopProfileTab(container, shop) {
    container.innerHTML = `
      <div class="card" style="max-width: 640px; margin: 0 auto;">
        <h3 class="card-title" data-i18n="my_shop_profile">${t("my_shop_profile")}</h3>
        <p class="card-subtitle">Edit your store information, location, and contact numbers.</p>

        <form id="edit-shop-profile-form">
          <div class="form-group">
            <label class="form-label" data-i18n="shop_name">${t("shop_name")} *</label>
            <input type="text" id="sp-name" class="form-control" value="${shop.name}" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="shop_category">${t("shop_category")}</label>
              <select id="sp-cat" class="form-control">
                <option value="Clothes" ${shop.category === 'Clothes' ? 'selected' : ''}>Clothes (कपड़े)</option>
                <option value="Skincare" ${shop.category === 'Skincare' ? 'selected' : ''}>Skincare (स्किनकेयर)</option>
                <option value="Shoes" ${shop.category === 'Shoes' ? 'selected' : ''}>Shoes (जूते)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Phone / Contact</label>
              <input type="tel" id="sp-contact" class="form-control" value="${shop.contact_number || ''}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="shop_address">${t("shop_address")} *</label>
            <input type="text" id="sp-address" class="form-control" value="${shop.address || ''}" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="shop_area">${t("shop_area")}</label>
              <select id="sp-area" class="form-control">
                <option value="Jagadhri" ${shop.area === 'Jagadhri' ? 'selected' : ''}>Jagadhri (जगाधरी)</option>
                <option value="Model Town" ${shop.area === 'Model Town' ? 'selected' : ''}>Model Town (मॉडल टाउन)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">City</label>
              <input type="text" id="sp-city" class="form-control" value="${shop.city || 'Yamunanagar'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Pincode</label>
              <input type="text" id="sp-pincode" class="form-control" value="${shop.pincode || '135003'}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Shop Banner Photo URL</label>
            <input type="url" id="sp-img" class="form-control" value="${shop.image_url || ''}" />
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" data-i18n="btn_save_shop_profile">
            💾 ${t("btn_save_shop_profile")}
          </button>
        </form>
      </div>
    `;

    document.getElementById("edit-shop-profile-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const updated = {
        name: document.getElementById("sp-name").value.trim(),
        category: document.getElementById("sp-cat").value,
        contact_number: document.getElementById("sp-contact").value.trim(),
        address: document.getElementById("sp-address").value.trim(),
        area: document.getElementById("sp-area").value,
        city: document.getElementById("sp-city").value.trim(),
        pincode: document.getElementById("sp-pincode").value.trim(),
        image_url: document.getElementById("sp-img").value.trim()
      };

      try {
        const res = await api.updateShop(shop.id, updated);
        window.showToast(t("success"), res.message, "success");
        // Update user shop state
        const user = appState.currentUser;
        user.shop = { ...shop, ...updated };
        appState.setUser(user);
        shopkeeperView.renderDashboard(document.getElementById("app-root"));
      } catch (err) {
        window.showToast(t("error"), err.message, "error");
      }
    });
  },

  // 6. Confirmed Orders Tab
  async renderConfirmedOrdersTab(container, shop) {
    container.innerHTML = `<p>${t("loading")}</p>`;
    try {
      const res = await api.getOrders({ shop_id: shop.id, status_filter: "confirmed" });
      const orders = Array.isArray(res) ? res : (res.orders || []);

      container.innerHTML = `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 class="card-title" data-i18n="confirmed_orders_title">${t("confirmed_orders_title")}</h3>
              <p class="card-subtitle" data-i18n="confirmed_orders_sub">${t("confirmed_orders_sub")}</p>
            </div>
            <span class="badge badge-success" style="font-size: 0.9rem; padding: 0.4rem 0.8rem;">
              ${orders.length} Confirmed
            </span>
          </div>

          ${orders.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1rem;">
              ${orders.map(o => {
                const isPickup = o.delivery_method === "Self Pickup" || o.delivery_type === "self_pickup";
                return `
                  <div class="card" style="border: 2px solid var(--primary); background: #fafdfc;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                      <div>
                        <span class="shop-badge" style="background: ${isPickup ? 'var(--primary-light)' : 'var(--secondary-light)'}; color: ${isPickup ? 'var(--primary-dark)' : 'var(--secondary-hover)'}; font-weight: 700;">
                          ${isPickup ? '🚶 SELF PICKUP' : '🛵 HOME DELIVERY'}
                        </span>
                        <h4 style="font-size: 1.15rem; font-weight: 700; margin-top: 0.3rem;">Order #${o.id} - ₹${o.total_amount}</h4>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Customer: <strong>${o.customer_name}</strong> (📞 ${o.customer_phone})</p>
                        ${!isPickup ? `<p style="font-size: 0.85rem; color: var(--text-muted);">📍 Delivery Address: ${o.delivery_address || 'Yamunanagar'}</p>` : ''}
                      </div>
                      <div style="text-align: right;">
                        <span class="badge badge-success" style="font-size: 0.9rem;">${o.status}</span>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Payment: <strong>${o.payment_method || 'COD'}</strong> (${o.payment_status || 'Pending'})</p>
                      </div>
                    </div>

                    <!-- Items List -->
                    <div style="background: #ffffff; border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.88rem;">
                      <strong>Order Items:</strong>
                      ${o.items && o.items.length > 0 ? o.items.map(it => `
                        <div style="display: flex; justify-content: space-between; margin-top: 0.25rem;">
                          <span>${it.product_name} (${it.size || 'Standard'}, Qty: ${it.quantity})</span>
                          <strong>₹${it.price * it.quantity}</strong>
                        </div>
                      `).join("") : `<div style="margin-top: 0.2rem;">${o.category || 'Store item'} - ₹${o.total_amount}</div>`}
                    </div>

                    <!-- Action Progression -->
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                      <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">${t("order_action")}:</span>
                      ${isPickup ? `
                        <button class="btn btn-sm btn-outline-primary btn-status-upd" data-id="${o.id}" data-status="Ready for Pickup">Mark Ready for Pickup</button>
                        <button class="btn btn-sm btn-primary btn-status-upd" data-id="${o.id}" data-status="Collected">Mark Collected</button>
                      ` : `
                        <button class="btn btn-sm btn-outline-primary btn-status-upd" data-id="${o.id}" data-status="Preparing">Preparing</button>
                        <button class="btn btn-sm btn-outline btn-status-upd" data-id="${o.id}" data-status="Out for Delivery">Out for Delivery</button>
                        <button class="btn btn-sm btn-primary btn-status-upd" data-id="${o.id}" data-status="Delivered">Mark Delivered</button>
                      `}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          ` : `
            <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">📦</div>
              <p style="font-size: 1.05rem; font-weight: 600;">No confirmed orders at the moment.</p>
              <p style="font-size: 0.88rem; margin-top: 0.3rem;">New confirmed orders requiring preparation or dispatch will appear here.</p>
            </div>
          `}
        </div>
      `;

      container.querySelectorAll(".btn-status-upd").forEach(btn => {
        btn.addEventListener("click", async () => {
          const ordId = btn.dataset.id;
          const status = btn.dataset.status;
          try {
            await api.updateOrderStatus(ordId, status);
            window.showToast(t("success"), `Order #${ordId} status set to: ${status}`, "success");
            shopkeeperView.renderConfirmedOrdersTab(container, shop);
          } catch (err) {
            window.showToast(t("error"), err.message, "error");
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<p style="color: var(--danger);">${err.message}</p>`;
    }
  },

  // 7. Earnings Dashboard Tab
  async renderEarningsTab(container, shop) {
    container.innerHTML = `<p>${t("loading")}</p>`;
    try {
      const earnings = await api.getEarnings(shop.id);
      const ordersRes = await api.getOrders({ shop_id: shop.id });
      const orders = Array.isArray(ordersRes) ? ordersRes : (ordersRes.orders || []);

      container.innerHTML = `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 class="card-title" data-i18n="earnings_title">${t("earnings_title")}</h3>
              <p class="card-subtitle" data-i18n="earnings_sub">${t("earnings_sub")}</p>
            </div>
            <span class="badge badge-info" style="font-size: 0.85rem;">Live Settlement Sync</span>
          </div>

          <!-- 4 Summary Metric Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
            <div class="card" style="border-top: 4px solid var(--primary); background: #ffffff; padding: 1.25rem;">
              <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;" data-i18n="total_earnings">${t("total_earnings")}</div>
              <div style="font-size: 1.9rem; font-weight: 800; color: var(--primary); margin-top: 0.3rem;">₹${earnings.total_earnings.toLocaleString()}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">Cumulative revenue</div>
            </div>

            <div class="card" style="border-top: 4px solid var(--secondary); background: #ffffff; padding: 1.25rem;">
              <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;" data-i18n="pending_cod">${t("pending_cod")}</div>
              <div style="font-size: 1.9rem; font-weight: 800; color: var(--secondary); margin-top: 0.3rem;">₹${earnings.pending_cod.toLocaleString()}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">Cash on Delivery to collect</div>
            </div>

            <div class="card" style="border-top: 4px solid var(--info); background: #ffffff; padding: 1.25rem;">
              <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;" data-i18n="confirmed_orders_title">${t("confirmed_orders_title")}</div>
              <div style="font-size: 1.9rem; font-weight: 800; color: var(--info); margin-top: 0.3rem;">${earnings.confirmed_orders}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">Orders active / fulfilled</div>
            </div>

            <div class="card" style="border-top: 4px solid #8b5cf6; background: #ffffff; padding: 1.25rem;">
              <div style="font-size: 0.82rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Total Orders</div>
              <div style="font-size: 1.9rem; font-weight: 800; color: #8b5cf6; margin-top: 0.3rem;">${earnings.total_orders}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">Total order volume</div>
            </div>
          </div>

          <!-- Payout Notice -->
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #fff; padding: 1.25rem 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h4 style="font-weight: 800; font-size: 1.1rem; color: #fff; margin-bottom: 0.2rem;">Yamunanagar Merchant Settlement Guarantee</h4>
              <p style="font-size: 0.88rem; opacity: 0.95;">All UPI customer collections are settled directly to your State Bank of India account at 11:00 PM daily.</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="appState.navigate('payment')">
              View Bank & Settlement Details →
            </button>
          </div>

          <!-- Order Revenue History Table -->
          <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Order Revenue Log</h4>
          ${orders && orders.length > 0 ? `
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--border-color); text-align: left; color: var(--text-muted);">
                    <th style="padding: 0.75rem;">Order</th>
                    <th style="padding: 0.75rem;">Customer</th>
                    <th style="padding: 0.75rem;">Fulfillment</th>
                    <th style="padding: 0.75rem;">Payment</th>
                    <th style="padding: 0.75rem;">Status</th>
                    <th style="padding: 0.75rem; text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.map(o => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                      <td style="padding: 0.75rem; font-weight: 600;">#ORD-${o.id}</td>
                      <td style="padding: 0.75rem;">${o.customer_name}</td>
                      <td style="padding: 0.75rem;">${o.delivery_method || o.delivery_type || 'Pickup'}</td>
                      <td style="padding: 0.75rem;"><span class="badge badge-info">${o.payment_method || 'COD'}</span></td>
                      <td style="padding: 0.75rem;">
                        <span class="badge ${o.status === 'Delivered' || o.status === 'Collected' ? 'badge-success' : 'badge-warning'}">
                          ${o.status}
                        </span>
                      </td>
                      <td style="padding: 0.75rem; text-align: right; font-weight: 700; color: var(--dark);">₹${o.total_amount}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <p style="color: var(--text-muted);">No revenue orders recorded yet.</p>
          `}
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<p style="color: var(--danger);">${err.message}</p>`;
    }
  },

  renderConfirmedOrders(container) {
    this.currentTab = "confirmed_orders";
    this.renderDashboard(container);
  },

  renderEarnings(container) {
    this.currentTab = "earnings";
    this.renderDashboard(container);
  }
};

window.shopkeeperView = shopkeeperView;
