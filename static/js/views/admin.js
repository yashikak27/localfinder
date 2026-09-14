/**
 * admin.js - Basic Admin Control Panel for LocalFind (Section 28)
 */

const adminView = {
  activeTab: "overview",

  async renderAdmin(container) {
    const user = appState.currentUser;
    if (!user || user.role !== "admin") {
      container.innerHTML = `
        <div class="container" style="max-width: 480px; margin: 3rem auto; text-align: center;">
          <div class="card">
            <h2 class="card-title">Admin Access Required</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Please log in with the platform administrator account.</p>
            <button class="btn btn-primary" onclick="appState.navigate('login')">${t("btn_login")}</button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="container" style="margin: 2rem auto;">
        <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
          <span class="shop-badge" style="background: #e0e7ff; color: #3730a3; font-weight: 700;">🛡️ PLATFORM ADMINISTRATION</span>
          <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--dark); margin-top: 0.2rem;" data-i18n="admin_title">${t("admin_title")}</h1>
          <p style="color: var(--text-muted);" data-i18n="admin_sub">${t("admin_sub")}</p>
        </div>

        <div class="tabs-nav">
          <button class="tab-btn ${this.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">Overview & Shops</button>
          <button class="tab-btn ${this.activeTab === 'products' ? 'active' : ''}" data-tab="products" data-i18n="admin_tab_products">${t("admin_tab_products")}</button>
          <button class="tab-btn ${this.activeTab === 'orders' ? 'active' : ''}" data-tab="orders" data-i18n="admin_tab_orders">${t("admin_tab_orders")}</button>
        </div>

        <div id="admin-tab-content"><p>${t("loading")}</p></div>
      </div>
    `;

    container.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.dataset.tab;
        this.renderAdmin(container);
      });
    });

    try {
      const data = await api.getAdminOverview();
      const content = document.getElementById("admin-tab-content");

      if (this.activeTab === "overview") {
        content.innerHTML = `
          <!-- Stats Grid -->
          <div class="grid-4" style="margin-bottom: 2rem;">
            <div class="stat-box">
              <div class="stat-icon green">👥</div>
              <div>
                <div class="stat-number">${data.stats.customers}</div>
                <div class="stat-label">Total Customers</div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon amber">🏪</div>
              <div>
                <div class="stat-number">${data.stats.shops}</div>
                <div class="stat-label">Registered Shops</div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon blue">🏷️</div>
              <div>
                <div class="stat-number">${data.stats.products}</div>
                <div class="stat-label">Total Products</div>
              </div>
            </div>
            <div class="stat-box">
              <div class="stat-icon green">📦</div>
              <div>
                <div class="stat-number">${data.stats.orders}</div>
                <div class="stat-label">Total Orders</div>
              </div>
            </div>
          </div>

          <!-- Shops Moderation Table -->
          <div class="card">
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Shop Verification & Moderation</h3>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                <thead>
                  <tr style="background: var(--bg-subtle); text-align: left; height: 40px;">
                    <th style="padding: 0.5rem 1rem;">ID</th>
                    <th style="padding: 0.5rem 1rem;">Shop Name</th>
                    <th style="padding: 0.5rem 1rem;">Category</th>
                    <th style="padding: 0.5rem 1rem;">Location</th>
                    <th style="padding: 0.5rem 1rem;">Contact</th>
                    <th style="padding: 0.5rem 1rem;">Status</th>
                    <th style="padding: 0.5rem 1rem;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.shops.map(s => `
                    <tr style="border-bottom: 1px solid var(--border-color); height: 50px;">
                      <td style="padding: 0.5rem 1rem;">#${s.id}</td>
                      <td style="padding: 0.5rem 1rem;"><strong>${s.name}</strong></td>
                      <td style="padding: 0.5rem 1rem;">${s.category}</td>
                      <td style="padding: 0.5rem 1rem;">${s.area}, ${s.city}</td>
                      <td style="padding: 0.5rem 1rem;">${s.contact_number}</td>
                      <td style="padding: 0.5rem 1rem;">
                        <span style="font-weight: 700; color: ${s.status === 'approved' ? 'var(--primary)' : 'var(--danger)'};">
                          ${s.status.toUpperCase()}
                        </span>
                      </td>
                      <td style="padding: 0.5rem 1rem;">
                        <div style="display: flex; gap: 0.3rem;">
                          ${s.status !== 'approved' ? `
                            <button class="btn btn-sm btn-primary btn-app-shop" data-id="${s.id}">Approve</button>
                          ` : `
                            <button class="btn btn-sm btn-outline btn-rej-shop" data-id="${s.id}">Suspend</button>
                          `}
                          <button class="btn btn-sm btn-danger btn-del-shop" data-id="${s.id}">Delete</button>
                        </div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;

        content.querySelectorAll(".btn-app-shop").forEach(btn => {
          btn.addEventListener("click", async () => {
            await api.updateShopStatus(btn.dataset.id, "approved");
            window.showToast(t("success"), "Shop approved.", "success");
            adminView.renderAdmin(container);
          });
        });

        content.querySelectorAll(".btn-rej-shop").forEach(btn => {
          btn.addEventListener("click", async () => {
            await api.updateShopStatus(btn.dataset.id, "rejected");
            window.showToast("Notice", "Shop suspended.", "info");
            adminView.renderAdmin(container);
          });
        });

        content.querySelectorAll(".btn-del-shop").forEach(btn => {
          btn.addEventListener("click", async () => {
            if (confirm("Permanently remove this shop?")) {
              await api.deleteShop(btn.dataset.id);
              window.showToast("Removed", "Shop deleted by admin.", "success");
              adminView.renderAdmin(container);
            }
          });
        });

      } else if (this.activeTab === "products") {
        content.innerHTML = `
          <div class="card">
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Moderate Inappropriate Products</h3>
            <div class="grid-3">
              ${data.products.map(p => `
                <div class="card" style="padding: 1rem; border: 1px solid var(--border-color);">
                  <img src="${p.image_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300'}" style="width: 100%; height: 140px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 0.5rem;" />
                  <h4 style="font-weight: 700; font-size: 0.95rem;">${p.name}</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">Shop: ${p.shop_name} | ₹${p.price}</p>
                  <button class="btn btn-sm btn-danger btn-block btn-del-admin-prod" data-id="${p.id}" style="margin-top: 0.6rem;">
                    🗑️ Remove Product
                  </button>
                </div>
              `).join("")}
            </div>
          </div>
        `;

        content.querySelectorAll(".btn-del-admin-prod").forEach(btn => {
          btn.addEventListener("click", async () => {
            if (confirm("Are you sure you want to remove this product?")) {
              await api.deleteProduct(btn.dataset.id);
              window.showToast(t("success"), "Product removed.", "success");
              adminView.renderAdmin(container);
            }
          });
        });

      } else if (this.activeTab === "orders") {
        content.innerHTML = `
          <div class="card">
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">Platform Orders Monitor</h3>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                <thead>
                  <tr style="background: var(--bg-subtle); height: 40px; text-align: left;">
                    <th style="padding: 0.5rem 1rem;">Order</th>
                    <th style="padding: 0.5rem 1rem;">Shop</th>
                    <th style="padding: 0.5rem 1rem;">Method</th>
                    <th style="padding: 0.5rem 1rem;">Amount</th>
                    <th style="padding: 0.5rem 1rem;">Payment</th>
                    <th style="padding: 0.5rem 1rem;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.orders.map(o => `
                    <tr style="border-bottom: 1px solid var(--border-color); height: 45px;">
                      <td style="padding: 0.5rem 1rem;">#${o.id}</td>
                      <td style="padding: 0.5rem 1rem;">${o.shop_name}</td>
                      <td style="padding: 0.5rem 1rem;">${o.delivery_method}</td>
                      <td style="padding: 0.5rem 1rem;">₹${o.total_amount}</td>
                      <td style="padding: 0.5rem 1rem;">${o.payment_method}</td>
                      <td style="padding: 0.5rem 1rem;"><strong>${o.status}</strong></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }

    } catch (err) {
      document.getElementById("admin-tab-content").innerHTML = `<p style="color: var(--danger);">${err.message}</p>`;
    }
  }
};

window.adminView = adminView;
