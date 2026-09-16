/**
 * shopkeeper.js - Dedicated 4-Section Shopkeeper Dashboard for Nearby
 * 4 Primary Sections:
 * 1. Order Confirmation & Incoming Requests (Feed of live buyer requests + instant photo-upload tool)
 * 2. Payments (Cash on Delivery vs. Digital receipts)
 * 3. Revenue / Earnings ("Make Money") (Turnover overview, settled payouts, completed orders)
 * 4. Account & Log Out (Profile management & dedicated log out)
 */

const shopkeeperView = {
  currentTab: "requests", // Default to incoming requests

  async renderDashboard(container) {
    const user = appState.currentUser;
    if (!user || user.role !== "shopkeeper") {
      container.innerHTML = `
        <div class="container" style="max-width: 520px; margin: 3rem auto; text-align: center;">
          <div class="card" style="box-shadow: var(--shadow-md); border-radius: var(--radius-lg); padding: 2.5rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🏪</div>
            <h2 class="card-title">Nearby Seller Portal</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">You need a registered shopkeeper account to access this hub.</p>
            <button class="btn btn-primary btn-lg btn-block" onclick="appState.navigate('login')">
              Sign In as Shopkeeper
            </button>
          </div>
        </div>
      `;
      return;
    }

    const specialty = user.store_specialty || (user.shop ? user.shop.specialty : "Clothes & Apparel");
    const shop = user.shop || {
      id: 1,
      name: `${user.full_name}'s Store`,
      category: specialty.includes("Shoes") ? "Shoes" : specialty.includes("Beauty") ? "Beauty / Makeup" : "Clothes",
      specialty: specialty,
      is_open: 1,
      address: user.address || "Main Market, Yamunanagar"
    };

    container.innerHTML = `
      <div class="container" style="margin: 2rem auto; max-width: 1060px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge" style="background: var(--pastel-blush-light); color: var(--pastel-blush-dark); font-weight: 700;">
                🏪 ${specialty} Domain
              </span>
              <span class="badge" style="background: var(--pastel-sage-light); color: var(--pastel-sage-dark);">
                PIN: ${user.pincode || '135001'}
              </span>
            </div>
            <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--dark); margin-top: 0.35rem;">
              ${shop.name}
            </h1>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">📍 ${shop.address}</p>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: 700; padding: 0.35rem 0.75rem; border-radius: 9999px; background: ${shop.is_open ? 'var(--pastel-sage-light)' : '#fee2e2'}; color: ${shop.is_open ? 'var(--pastel-sage-dark)' : 'var(--danger)'};">
              ${shop.is_open ? '● Store Open' : '○ Store Closed'}
            </span>
            <button class="btn btn-sm btn-outline" id="btn-toggle-shop-status" style="border-radius: 9999px;">
              🔄 Toggle Status
            </button>
          </div>
        </div>

        <!-- 4 Primary Dashboard Tabs -->
        <div class="tabs-nav">
          <button class="tab-btn ${this.currentTab === 'requests' ? 'active' : ''}" data-tab="requests">
            💬 1. Order Confirmation & Incoming Requests
          </button>
          <button class="tab-btn ${this.currentTab === 'payments' ? 'active' : ''}" data-tab="payments">
            💳 2. Payments (COD vs Digital)
          </button>
          <button class="tab-btn ${this.currentTab === 'revenue' ? 'active' : ''}" data-tab="revenue">
            💰 3. Revenue & Earnings ("Make Money")
          </button>
          <button class="tab-btn ${this.currentTab === 'account' ? 'active' : ''}" data-tab="account">
            ⚙️ 4. Account & Log Out
          </button>
        </div>

        <!-- Dynamic Section Content -->
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

    // Store Status Toggle
    document.getElementById("btn-toggle-shop-status").addEventListener("click", async () => {
      const newStatus = shop.is_open ? 0 : 1;
      shop.is_open = newStatus;
      if (user.shop) user.shop.is_open = newStatus;
      appState.setUser(user);
      try {
        await api.updateShop(shop.id, { is_open: newStatus });
      } catch (e) {}
      window.showToast("Store Updated", `Status is now: ${newStatus ? 'OPEN' : 'CLOSED'}`, "info");
      this.renderDashboard(container);
    });

    const contentArea = document.getElementById("shopkeeper-tab-content");
    if (this.currentTab === "requests") this.renderRequestsSection(contentArea, shop);
    else if (this.currentTab === "payments") this.renderPaymentsSection(contentArea, shop);
    else if (this.currentTab === "revenue") this.renderRevenueSection(contentArea, shop);
    else if (this.currentTab === "account") this.renderAccountSection(contentArea, shop);
  },

  // =========================================================================
  // SECTION 1: ORDER CONFIRMATION & INCOMING REQUESTS + PHOTO-UPLOAD TOOL
  // =========================================================================
  async renderRequestsSection(container, shop) {
    container.innerHTML = `<p style="padding: 2rem; text-align: center; color: var(--text-muted);">Loading incoming buyer inquiries...</p>`;

    try {
      const res = await api.getRequests({ shop_id: shop.id });
      const requests = res.requests || [];

      container.innerHTML = `
        <div class="shopkeeper-section-header">
          <div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--dark);">
              Order Confirmation & Live Buyer Inquiries
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.15rem;">
              Showing buyer requests routed exclusively to your specialty (${shop.specialty || shop.category}).
            </p>
          </div>
          <span class="badge badge-primary" style="font-size: 0.82rem;">
            ${requests.length} Live Request(s)
          </span>
        </div>

        ${requests.length === 0 ? `
          <div style="background: white; border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 3rem; text-align: center;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📫</div>
            <h4 style="font-weight: 700; color: var(--dark);">No pending inquiries right now</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 0.3rem;">
              When nearby residents in your neighborhood submit product inquiries in ${shop.specialty || shop.category}, they will appear here instantly.
            </p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${requests.map(req => {
              const isSelected = req.status === "Product Selected";
              return `
                <div class="card" style="border: 2px solid ${isSelected ? 'var(--pastel-sage)' : 'var(--border-color)'}; box-shadow: var(--shadow-sm); border-radius: var(--radius-lg); padding: 1.5rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="badge" style="background: var(--pastel-sage-light); color: var(--pastel-sage-dark); font-weight: 700;">
                          Inquiry #${req.id} • ${req.category}
                        </span>
                        ${req.is_broadcasted ? `
                          <span class="badge" style="background: var(--pastel-blush-light); color: var(--pastel-blush-dark);">
                            📢 Broadcasted
                          </span>
                        ` : ''}
                      </div>
                      <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--dark); margin-top: 0.35rem;">
                        Buyer: ${req.customer_name || 'Neighborhood Resident'} (${req.area || 'Civil Lines'}, ${req.city || 'Yamunanagar'})
                      </h4>
                    </div>

                    <span class="badge ${isSelected ? 'badge-success' : 'badge-warning'}" style="font-size: 0.82rem; padding: 0.3rem 0.75rem;">
                      ${isSelected ? '✅ Product Verified & Accepted by Buyer' : req.status}
                    </span>
                  </div>

                  <!-- Inquiry Specifications -->
                  <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; display: flex; gap: 1.25rem; flex-wrap: wrap; align-items: center;">
                    ${req.ref_image_url || req.image_data ? `
                      <div style="width: 90px; height: 90px; border-radius: var(--radius-sm); overflow: hidden; background: white; border: 1px solid var(--border-color); flex-shrink: 0;">
                        <img src="${req.ref_image_url || req.image_data}" alt="Buyer Look" style="width: 100%; height: 100%; object-fit: cover;" />
                      </div>
                    ` : ''}
                    <div style="flex: 1; min-width: 200px;">
                      <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.5; margin: 0;">
                        <strong>Buyer Request Details:</strong> ${req.description || 'Customer looking for matching inventory in your category.'}
                      </p>
                      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.4rem; font-size: 0.78rem;">
                        ${req.size_chip ? `<span class="badge" style="background: white; border: 1px solid var(--border-color);">Size: ${req.size_chip}</span>` : ''}
                        ${req.color_mode ? `<span class="badge" style="background: white; border: 1px solid var(--border-color);">Color: ${req.color_mode}</span>` : ''}
                        ${req.brand_mode ? `<span class="badge" style="background: white; border: 1px solid var(--border-color);">Brand: ${req.brand_mode}</span>` : ''}
                        ${req.skin_type ? `<span class="badge" style="background: white; border: 1px solid var(--border-color);">Skin: ${req.skin_type}</span>` : ''}
                        ${req.shoe_size ? `<span class="badge" style="background: white; border: 1px solid var(--border-color);">Shoe: ${req.shoe_size}</span>` : ''}
                      </div>
                    </div>
                  </div>

                  <!-- Instant Stock Photo-Upload Tool & Response Form -->
                  <div style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <h5 style="font-weight: 700; font-size: 0.95rem; color: var(--dark); margin-bottom: 0.5rem;">
                      Instant Stock Option & Photo Tool:
                    </h5>

                    <form class="seller-reply-form" data-req-id="${req.id}">
                      <div class="form-row">
                        <div class="form-group" style="margin-bottom: 0.6rem;">
                          <label class="form-label" style="font-size: 0.82rem;">Product Title *</label>
                          <input type="text" class="form-control form-control-sm sug-title" placeholder="e.g. Pure Cotton Slim Shirt (Ready Stock)" required />
                        </div>
                        <div class="form-group" style="margin-bottom: 0.6rem;">
                          <label class="form-label" style="font-size: 0.82rem;">Quoted Price (₹) *</label>
                          <input type="number" class="form-control form-control-sm sug-price" placeholder="899" required />
                        </div>
                      </div>

                      <div class="form-group" style="margin-bottom: 0.6rem;">
                        <label class="form-label" style="font-size: 0.82rem;">Upload Stock Photo / Photo URL</label>
                        <div style="display: flex; gap: 0.5rem;">
                          <input type="url" class="form-control form-control-sm sug-img" placeholder="https://images.unsplash.com/..." value="${req.ref_image_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'}" />
                          <label class="btn btn-outline-secondary btn-sm" style="white-space: nowrap; cursor: pointer;">
                            📷 Upload File
                            <input type="file" class="sug-file" accept="image/*" style="display: none;" />
                          </label>
                        </div>
                      </div>

                      <div class="form-group" style="margin-bottom: 0.75rem;">
                        <label class="form-label" style="font-size: 0.82rem;">Availability Note</label>
                        <input type="text" class="form-control form-control-sm sug-note" placeholder="e.g. Size M in Navy Blue ready for immediate pickup or 25-min delivery." />
                      </div>

                      <button type="submit" class="btn btn-primary btn-sm" style="border-radius: 9999px;">
                        🚀 Send Matching Stock Option to Buyer
                      </button>
                    </form>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `}
      `;

      // Wire reply forms
      container.querySelectorAll(".seller-reply-form").forEach(form => {
        const fileInput = form.querySelector(".sug-file");
        const urlInput = form.querySelector(".sug-img");

        fileInput?.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              urlInput.value = evt.target.result;
              window.showToast("Photo Loaded", "Local stock photo attached.", "info");
            };
            reader.readAsDataURL(file);
          }
        });

        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const reqId = form.dataset.reqId;
          const title = form.querySelector(".sug-title").value.trim();
          const price = parseFloat(form.querySelector(".sug-price").value);
          const imgUrl = urlInput.value.trim();
          const note = form.querySelector(".sug-note").value.trim();

          const btn = form.querySelector("button[type='submit']");
          btn.disabled = true;
          btn.textContent = "Sending...";

          try {
            await api.respondToRequest(reqId, {
              shop_id: shop.id,
              product_name: title,
              price: price,
              image_url: imgUrl,
              description: title,
              note: note || "Ready in stock at store."
            });
            window.showToast("Stock Sent", `Matching stock quote sent to buyer!`, "success");
            this.renderRequestsSection(container, shop);
          } catch (err) {
            window.showToast("Error", err.message, "error");
            btn.disabled = false;
            btn.textContent = "🚀 Send Matching Stock Option to Buyer";
          }
        });
      });

    } catch (err) {
      container.innerHTML = `<p style="color: var(--danger); text-align: center;">${err.message}</p>`;
    }
  },

  // =========================================================================
  // SECTION 2: PAYMENTS (CASH ON DELIVERY VS. DIGITAL RECEIPTS)
  // =========================================================================
  async renderPaymentsSection(container, shop) {
    container.innerHTML = `<p style="padding: 2rem; text-align: center; color: var(--text-muted);">Loading payment analytics...</p>`;

    try {
      const statsRes = await api.getShopkeeperStats(shop.id);
      const payments = statsRes.payments || { cod_total: 829.0, cod_count: 1, digital_total: 1299.0, digital_count: 1 };

      container.innerHTML = `
        <div class="shopkeeper-section-header">
          <div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--dark);">
              Payments Tracking
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.15rem;">
              Real-time payment reconciliations: Cash on Delivery counter collections vs. Verified Digital Receipts.
            </p>
          </div>
        </div>

        <div class="pref-switch-grid" style="margin-bottom: 1.75rem;">
          <!-- 1. Cash on Delivery Card -->
          <div class="card" style="background: var(--pastel-blush-subtle); border: 2px solid var(--pastel-blush-border); border-radius: var(--radius-lg); padding: 1.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="badge" style="background: var(--pastel-blush-light); color: var(--pastel-blush-dark); font-weight: 700;">
                  💵 Cash on Delivery
                </span>
                <div style="font-size: 2.1rem; font-weight: 800; color: var(--dark); margin-top: 0.5rem;">
                  ₹${payments.cod_total}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
                  ${payments.cod_count} order(s) via Cash on Delivery / Counter Cash
                </div>
              </div>
              <div style="font-size: 2.8rem;">💵</div>
            </div>
            <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--pastel-blush-border); font-size: 0.8rem; color: var(--text-muted);">
              ✓ Verified upon delivery handover or store counter collection.
            </div>
          </div>

          <!-- 2. Digital Receipts Card -->
          <div class="card" style="background: var(--pastel-sage-subtle); border: 2px solid var(--pastel-sage-border); border-radius: var(--radius-lg); padding: 1.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="badge" style="background: var(--pastel-sage-light); color: var(--pastel-sage-dark); font-weight: 700;">
                  📱 Digital Receipts (UPI / Card)
                </span>
                <div style="font-size: 2.1rem; font-weight: 800; color: var(--dark); margin-top: 0.5rem;">
                  ₹${payments.digital_total}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
                  ${payments.digital_count} order(s) via Instant UPI / Cards
                </div>
              </div>
              <div style="font-size: 2.8rem;">📲</div>
            </div>
            <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--pastel-sage-border); font-size: 0.8rem; color: var(--text-muted);">
              ✓ Instantly settled to your registered store merchant UPI ID.
            </div>
          </div>
        </div>

        <!-- Payment Settlement Method Settings -->
        <div class="card" style="border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem;">
          <h4 style="font-weight: 700; color: var(--dark); margin-bottom: 0.4rem;">Store Payment Settlement Mode:</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Configure how nearby customers pay when shopping with ${shop.name}:</p>
          <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="checkbox" checked disabled />
              <span style="font-weight: 600;">Accept Cash on Delivery & Counter Cash</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="checkbox" checked disabled />
              <span style="font-weight: 600;">Accept Direct QR / Digital UPI Receipts</span>
            </label>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<p style="color: var(--danger); text-align: center;">${err.message}</p>`;
    }
  },

  // =========================================================================
  // SECTION 3: REVENUE / EARNINGS ("MAKE MONEY")
  // =========================================================================
  async renderRevenueSection(container, shop) {
    container.innerHTML = `<p style="padding: 2rem; text-align: center; color: var(--text-muted);">Loading revenue overview...</p>`;

    try {
      const statsRes = await api.getShopkeeperStats(shop.id);
      const rev = statsRes.revenue || {
        daily_turnover: 320.0,
        monthly_turnover: 829.0,
        settled_payouts: 829.0,
        completed_orders: 1
      };

      container.innerHTML = `
        <div class="shopkeeper-section-header">
          <div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--dark);">
              Revenue & Earnings Overview ("Make Money")
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.15rem;">
              Daily and monthly turnover generated from local neighborhood buyer orders.
            </p>
          </div>
        </div>

        <!-- 4 Metric Cards Grid -->
        <div class="grid-2" style="margin-bottom: 1.75rem;">
          <!-- 1. Daily Turnover -->
          <div class="stat-box" style="border: 2px solid var(--pastel-sage-border); background: var(--pastel-sage-subtle);">
            <div class="stat-icon green">📅</div>
            <div>
              <div class="stat-number">₹${rev.daily_turnover}</div>
              <div class="stat-label" style="font-weight: 750; color: var(--pastel-sage-dark);">Daily Turnover</div>
            </div>
          </div>

          <!-- 2. Monthly Turnover -->
          <div class="stat-box" style="border: 2px solid var(--pastel-blush-border); background: var(--pastel-blush-subtle);">
            <div class="stat-icon amber">📈</div>
            <div>
              <div class="stat-number">₹${rev.monthly_turnover}</div>
              <div class="stat-label" style="font-weight: 750; color: var(--pastel-blush-dark);">Monthly Turnover</div>
            </div>
          </div>

          <!-- 3. Settled Payouts -->
          <div class="stat-box" style="border: 1px solid var(--border-color); background: white;">
            <div class="stat-icon blue">💰</div>
            <div>
              <div class="stat-number">₹${rev.settled_payouts}</div>
              <div class="stat-label" style="font-weight: 600;">Settled Store Payouts</div>
            </div>
          </div>

          <!-- 4. Completed Orders -->
          <div class="stat-box" style="border: 1px solid var(--border-color); background: white;">
            <div class="stat-icon green">📦</div>
            <div>
              <div class="stat-number">${rev.completed_orders}</div>
              <div class="stat-label" style="font-weight: 600;">Total Completed Orders</div>
            </div>
          </div>
        </div>

        <!-- Turnover History Note -->
        <div class="card" style="border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem;">
          <h4 style="font-weight: 700; color: var(--dark); margin-bottom: 0.35rem;">Earnings Settlement Policy:</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
            Nearby charges <strong>0% commission</strong> on neighborhood counter pickups. For home delivery dispatches, payments are reconciled and settled directly to your bank account daily at 9:00 PM.
          </p>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<p style="color: var(--danger); text-align: center;">${err.message}</p>`;
    }
  },

  // =========================================================================
  // SECTION 4: ACCOUNT & LOG OUT
  // =========================================================================
  renderAccountSection(container, shop) {
    const user = appState.currentUser || {};

    container.innerHTML = `
      <div class="shopkeeper-section-header">
        <div>
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--dark);">
            Store Account & Session Management
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.15rem;">
            Manage your registered merchant credentials, inventory specialty, or sign out.
          </p>
        </div>
      </div>

      <div class="card" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; max-width: 650px;">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-color);">
          <div class="nearby-avatar-circle" style="width: 52px; height: 52px; font-size: 1.4rem; background: var(--pastel-blush);">
            ${user.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--dark); margin: 0;">${shop.name}</h3>
            <span style="font-size: 0.82rem; color: var(--text-muted);">Owner: ${user.full_name} • Phone: ${user.phone}</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div class="profile-detail-card">
            <div class="profile-detail-label">Store Specialty Tag</div>
            <div class="profile-detail-value" style="color: var(--pastel-blush-dark); font-weight: 700;">
              ${user.store_specialty || shop.specialty || 'Clothes & Apparel'}
            </div>
          </div>
          <div class="profile-detail-card">
            <div class="profile-detail-label">PIN Code <span class="pincode-mandatory-badge">Mandatory</span></div>
            <div class="profile-detail-value">${user.pincode || '135001'}</div>
          </div>
          <div class="profile-detail-card">
            <div class="profile-detail-label">City & State</div>
            <div class="profile-detail-value">${user.city || 'Yamunanagar'}, ${user.state || 'Haryana'}</div>
          </div>
          <div class="profile-detail-card">
            <div class="profile-detail-label">Store Address</div>
            <div class="profile-detail-value">${shop.address || user.address}</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button class="btn btn-outline-primary" id="btn-view-profile-drawer" style="flex: 1; border-radius: 9999px;">
            👤 View Full Registration Drawer
          </button>
          <button class="btn btn-outline-danger" id="btn-shopkeeper-logout" style="flex: 1; border-radius: 9999px;">
            🚪 Log Out of Nearby
          </button>
        </div>
      </div>
    `;

    document.getElementById("btn-view-profile-drawer")?.addEventListener("click", () => {
      appState.openProfileDrawer();
    });

    document.getElementById("btn-shopkeeper-logout")?.addEventListener("click", () => {
      appState.logout();
    });
  }
};

window.shopkeeperView = shopkeeperView;
