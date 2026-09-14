/**
 * orders.js - Fulfillment Selection (Self Pickup vs Delivery), Payment,
 * Order Tracking with Vertical Status Timeline, and 3-Part Ratings
 */

const ordersView = {
  // 1. Fulfillment Choice (Step 14, 15, 16)
  renderFulfillment(container) {
    const orderContext = appState.selectedProductForOrder;
    if (!orderContext) {
      appState.navigate("home");
      return;
    }

    container.innerHTML = `
      <div class="container" style="max-width: 760px; margin: 2rem auto;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.85rem; font-weight: 800; color: var(--dark);" data-i18n="fulfillment_title">${t("fulfillment_title")}</h2>
          <p style="color: var(--text-muted);" data-i18n="fulfillment_sub">${t("fulfillment_sub")}</p>
        </div>

        <!-- Choice 1 vs Choice 2 -->
        <div class="choice-grid" style="margin-bottom: 2rem;">
          <!-- Option 1: Let's Do It Myself -->
          <div class="choice-card" id="choice-pickup">
            <div class="choice-icon" style="background: var(--primary-light); color: var(--primary);">🚶</div>
            <h3 class="choice-title" data-i18n="opt_do_it_myself">${t("opt_do_it_myself")}</h3>
            <p class="choice-desc" data-i18n="opt_do_it_myself_desc">${t("opt_do_it_myself_desc")}</p>
            <div style="margin-top: 1rem; font-size: 0.85rem; color: var(--primary); font-weight: 700;">✓ ₹0 Delivery Fee</div>
          </div>

          <!-- Option 2: Let's Get It at Home -->
          <div class="choice-card" id="choice-delivery">
            <div class="choice-icon" style="background: var(--secondary-light); color: var(--secondary-hover);">🛵</div>
            <h3 class="choice-title" data-i18n="opt_get_at_home">${t("opt_get_at_home")}</h3>
            <p class="choice-desc" data-i18n="opt_get_at_home_desc">${t("opt_get_at_home_desc")}</p>
            <div style="margin-top: 1rem; font-size: 0.85rem; color: var(--secondary-hover); font-weight: 700;">Standard Delivery: ₹30</div>
          </div>
        </div>

        <div id="fulfillment-details-container"></div>
      </div>
    `;

    document.getElementById("choice-pickup").addEventListener("click", () => {
      document.getElementById("choice-pickup").classList.add("selected");
      document.getElementById("choice-delivery").classList.remove("selected");
      ordersView.renderSelfPickupDetails(document.getElementById("fulfillment-details-container"));
    });

    document.getElementById("choice-delivery").addEventListener("click", () => {
      document.getElementById("choice-delivery").classList.add("selected");
      document.getElementById("choice-pickup").classList.remove("selected");
      ordersView.renderHomeDeliveryDetails(document.getElementById("fulfillment-details-container"));
    });

    // Default select pickup
    document.getElementById("choice-pickup").click();
  },

  // Step 15: "Visit the Shop" (Self Pickup Details)
  async renderSelfPickupDetails(container) {
    const orderContext = appState.selectedProductForOrder;
    const shopId = orderContext.shop_id || 1;
    let shopInfo = { name: orderContext.shop_name || "Gupta Garments", address: "Shop 12, Main Bazar, Jagadhri", contact_number: "9876543211" };

    try {
      const res = await api.getShop(shopId);
      if (res.shop) shopInfo = res.shop;
    } catch (e) {}

    container.innerHTML = `
      <div class="card" style="margin-top: 1.5rem;">
        <h3 class="card-title" data-i18n="visit_shop_title">🏪 ${t("visit_shop_title")}</h3>
        
        <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
          <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--dark); margin-bottom: 0.4rem;">${shopInfo.name}</h4>
          <p style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 0.3rem;">📍 <strong>${t("shop_address_label")}:</strong> ${shopInfo.address}, ${shopInfo.area || 'Jagadhri'}, ${shopInfo.city || 'Yamunanagar'}</p>
          <p style="font-size: 0.9rem; color: var(--text-main);">📞 <strong>${t("shop_contact_label")}:</strong> ${shopInfo.contact_number}</p>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <button class="btn btn-outline-primary" id="btn-show-directions" data-i18n="btn_get_directions">
            🗺️ ${t("btn_get_directions")}
          </button>
          <button class="btn btn-primary" id="btn-know-route-confirm" data-i18n="btn_know_route">
            ✓ ${t("btn_know_route")}
          </button>
        </div>
      </div>
    `;

    document.getElementById("btn-show-directions").addEventListener("click", () => {
      window.showDirectionsModal(shopInfo);
    });

    document.getElementById("btn-know-route-confirm").addEventListener("click", () => {
      orderContext.delivery_method = "Self Pickup";
      orderContext.delivery_fee = 0.0;
      appState.navigate("payment");
    });
  },

  // Step 16: "Home Delivery Details" & Step 18 Safety Message
  renderHomeDeliveryDetails(container) {
    const user = appState.currentUser || {};
    const orderContext = appState.selectedProductForOrder;

    container.innerHTML = `
      <div class="card" style="margin-top: 1.5rem;">
        <h3 class="card-title" data-i18n="home_delivery_title">🛵 ${t("home_delivery_title")}</h3>
        <p class="card-subtitle" data-i18n="home_delivery_sub">${t("home_delivery_sub")}</p>

        <!-- Safety Message (Section 18) -->
        <div class="safety-banner">
          <div class="safety-icon">⚠️</div>
          <div>
            <div class="safety-heading" data-i18n="safety_banner_title">${t("safety_banner_title")}</div>
            <div class="safety-body" data-i18n="safety_banner_text">${t("safety_banner_text")}</div>
          </div>
        </div>

        <!-- Delivery Address Form -->
        <div style="margin-bottom: 1.5rem;">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="full_name">${t("full_name")} *</label>
              <input type="text" id="deliv-name" class="form-control" value="${user.full_name || ''}" required />
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="phone_number">${t("phone_number")} *</label>
              <input type="tel" id="deliv-phone" class="form-control" value="${user.phone || ''}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="address">${t("address")} *</label>
            <input type="text" id="deliv-address" class="form-control" value="${user.address || 'House No. 42, Civil Lines'}" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="city">${t("city")}</label>
              <input type="text" id="deliv-city" class="form-control" value="${user.city || 'Yamunanagar'}" />
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="state">${t("state")}</label>
              <input type="text" id="deliv-state" class="form-control" value="${user.state || 'Haryana'}" />
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="pincode">${t("pincode")}</label>
              <input type="text" id="deliv-pincode" class="form-control" value="${user.pincode || '135001'}" />
            </div>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;" data-i18n="estimated_delivery">
          ⏱️ ${t("estimated_delivery")}
        </p>

        <button class="btn btn-primary btn-lg btn-block" id="btn-confirm-delivery-address">
          Proceed to Payment →
        </button>
      </div>
    `;

    document.getElementById("btn-confirm-delivery-address").addEventListener("click", () => {
      orderContext.delivery_method = "Home Delivery";
      orderContext.delivery_fee = 30.0;
      orderContext.delivery_address = document.getElementById("deliv-address").value;
      orderContext.customer_name = document.getElementById("deliv-name").value;
      orderContext.customer_phone = document.getElementById("deliv-phone").value;
      orderContext.customer_city = document.getElementById("deliv-city").value;
      orderContext.customer_state = document.getElementById("deliv-state").value;
      orderContext.customer_pincode = document.getElementById("deliv-pincode").value;
      appState.navigate("payment");
    });
  },

  // 2. Payment Selection (Step 17)
  renderPayment(container) {
    const orderContext = appState.selectedProductForOrder;
    if (!orderContext) {
      appState.navigate("home");
      return;
    }

    const subtotal = orderContext.subtotal || (orderContext.price * orderContext.quantity);
    const deliveryFee = orderContext.delivery_fee || 0.0;
    const total = subtotal + deliveryFee;

    container.innerHTML = `
      <div class="container" style="max-width: 680px; margin: 2rem auto;">
        <div class="card">
          <h2 class="card-title" data-i18n="payment_title">${t("payment_title")}</h2>
          <p class="card-subtitle" data-i18n="payment_sub">${t("payment_sub")}</p>

          <!-- Choice 1: COD -->
          <div class="choice-card selected" id="choice-pay-cod" style="margin-bottom: 1rem;">
            <div class="choice-indicator"></div>
            <div style="display: flex; gap: 0.8rem; align-items: center;">
              <span style="font-size: 1.8rem;">💵</span>
              <div>
                <h4 class="choice-title" style="margin-bottom: 0.2rem;" data-i18n="pay_cod">${t("pay_cod")}</h4>
                <p class="choice-desc" data-i18n="pay_cod_desc">${t("pay_cod_desc")}</p>
              </div>
            </div>
          </div>

          <!-- Choice 2: Google Pay / UPI (Prototype Simulation) -->
          <div class="choice-card" id="choice-pay-upi" style="margin-bottom: 1.5rem;">
            <div class="choice-indicator"></div>
            <div style="display: flex; gap: 0.8rem; align-items: center;">
              <span style="font-size: 1.8rem;">📱</span>
              <div>
                <h4 class="choice-title" style="margin-bottom: 0.2rem;" data-i18n="pay_upi">${t("pay_upi")}</h4>
                <p class="choice-desc" data-i18n="pay_upi_desc">${t("pay_upi_desc")}</p>
              </div>
            </div>
            <!-- Mock UPI Container -->
            <div id="mock-upi-view" style="display: none;" class="mock-upi-box">
              <span class="demo-badge">PROTOTYPE DEMO PAYMENT</span>
              <p style="font-size: 0.85rem; color: #1e3a8a; margin-top: 0.5rem;">Scan with Google Pay / PhonePe / Paytm or pay directly:</p>
              <div class="mock-qr">📱</div>
              <p style="font-weight: 700; color: #1e40af;">UPI ID: localfind@okaxis (Mock)</p>
              <p style="font-size: 0.78rem; color: #64748b; margin-top: 0.4rem;">Note: No real money is deducted. Click below to simulate instant payment.</p>
            </div>
          </div>

          <!-- Bill Summary -->
          <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
            <h4 style="font-weight: 700; margin-bottom: 0.75rem;" data-i18n="order_bill_details">${t("order_bill_details")}</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.95rem;">
              <span data-i18n="bill_subtotal">${t("bill_subtotal")}</span>
              <span>₹${subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.95rem;">
              <span data-i18n="bill_delivery_fee">${t("bill_delivery_fee")}</span>
              <span>${deliveryFee > 0 ? `₹${deliveryFee}` : `<strong style="color: var(--primary);" data-i18n="bill_free">${t("bill_free")}</strong>`}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 0.6rem; font-size: 1.25rem; font-weight: 800; color: var(--dark);">
              <span data-i18n="bill_total">${t("bill_total")}</span>
              <span>₹${total}</span>
            </div>
          </div>

          <button class="btn btn-primary btn-lg btn-block" id="btn-submit-order" data-i18n="btn_place_order">
            ${t("btn_place_order")}
          </button>
        </div>
      </div>
    `;

    let selectedPayment = "Cash on Delivery";
    const upiBox = document.getElementById("mock-upi-view");

    document.getElementById("choice-pay-cod").addEventListener("click", () => {
      selectedPayment = "Cash on Delivery";
      document.getElementById("choice-pay-cod").classList.add("selected");
      document.getElementById("choice-pay-upi").classList.remove("selected");
      upiBox.style.display = "none";
    });

    document.getElementById("choice-pay-upi").addEventListener("click", () => {
      selectedPayment = "Google Pay / UPI";
      document.getElementById("choice-pay-upi").classList.add("selected");
      document.getElementById("choice-pay-cod").classList.remove("selected");
      upiBox.style.display = "block";
    });

    document.getElementById("btn-submit-order").addEventListener("click", async () => {
      const user = appState.currentUser;
      if (!user) {
        window.showToast("Login required", "Please log in to finalize your order.", "error");
        appState.navigate("login");
        return;
      }

      let orderItems = [];
      if (orderContext.items && orderContext.items.length > 0) {
        orderItems = orderContext.items;
      } else {
        orderItems = [{
          product_id: orderContext.product_id,
          product_name: orderContext.product_name,
          price: orderContext.price,
          quantity: orderContext.quantity || 1,
          size: orderContext.size || "M",
          color: orderContext.color || "Standard",
          image_url: orderContext.image_url || ""
        }];
      }

      const payload = {
        customer_id: user.id,
        shop_id: orderContext.shop_id || 1,
        delivery_method: orderContext.delivery_method || "Self Pickup",
        delivery_address: orderContext.delivery_address || user.address || "Main Bazar, Jagadhri",
        customer_name: orderContext.customer_name || user.full_name || "Valued Customer",
        customer_phone: orderContext.customer_phone || user.phone || "9876543210",
        customer_pincode: orderContext.customer_pincode || user.pincode || "135003",
        customer_city: orderContext.customer_city || user.city || "Yamunanagar",
        customer_state: orderContext.customer_state || user.state || "Haryana",
        payment_method: selectedPayment,
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        total_amount: total,
        items: orderItems
      };

      try {
        const res = await api.createOrder(payload);
        window.showToast(t("success"), res.message, "success");
        appState.selectedProductForOrder = null;
        appState.navigate("orders");
      } catch (err) {
        window.showToast(t("error"), err.message, "error");
      }
    });
  },

  // 3. Order Tracking (Step 19 - My Orders)
  async renderOrders(container) {
    if (!appState.currentUser) {
      container.innerHTML = `
        <div class="container" style="max-width: 500px; margin: 3rem auto; text-align: center;">
          <div class="card">
            <h2 class="card-title" data-i18n="my_orders_title">${t("my_orders_title")}</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Please log in to view your orders and track live status.</p>
            <button class="btn btn-primary" onclick="appState.navigate('login')" data-i18n="btn_login">${t("btn_login")}</button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `<div class="container" style="margin: 2rem auto;"><p>${t("loading")}</p></div>`;

    try {
      const res = await api.getOrders({ customer_id: appState.currentUser.id });
      const orders = res.orders || [];

      if (orders.length === 0) {
        container.innerHTML = `
          <div class="container" style="max-width: 520px; margin: 3rem auto; text-align: center;">
            <div class="card" style="padding: 3rem 1.5rem;">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">📦</div>
              <h2 class="card-title" data-i18n="no_orders">${t("no_orders")}</h2>
              <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Discover items in nearby shops and place your first inquiry!</p>
              <button class="btn btn-primary" onclick="appState.navigate('find-item')" data-i18n="btn_find_item_now">${t("btn_find_item_now")}</button>
            </div>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="container" style="max-width: 860px; margin: 2rem auto;">
          <div style="margin-bottom: 2rem;">
            <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--dark);" data-i18n="my_orders_title">${t("my_orders_title")}</h1>
            <p style="color: var(--text-muted);" data-i18n="my_orders_sub">${t("my_orders_sub")}</p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${orders.map(o => {
              const isPickup = o.delivery_method === "Self Pickup";
              return `
                <div class="card">
                  <!-- Order Header -->
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-color);">
                    <div>
                      <span style="font-size: 0.85rem; font-weight: 700; color: var(--primary);">ORDER #${o.id}</span>
                      <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--dark);">🏪 ${o.shop_name}</h3>
                      <p style="font-size: 0.8rem; color: var(--text-muted);">Placed on: ${new Date(o.created_at).toLocaleString()}</p>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 1.25rem; font-weight: 800; color: var(--dark);">₹${o.total_amount}</div>
                      <span class="shop-badge" style="background: ${isPickup ? 'var(--primary-light)' : 'var(--secondary-light)'}; color: ${isPickup ? 'var(--primary-dark)' : 'var(--secondary-hover)'};">
                        ${isPickup ? '🚶 Self Pickup' : '🛵 Home Delivery'}
                      </span>
                    </div>
                  </div>

                  <!-- Items in Order -->
                  <div style="margin-bottom: 1.25rem;">
                    ${o.items && o.items.map(it => `
                      <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.5rem;">
                        <img src="${it.image_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150'}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);" />
                        <div style="flex: 1;">
                          <h5 style="font-weight: 700; font-size: 0.95rem;">${it.product_name}</h5>
                          <span style="font-size: 0.8rem; color: var(--text-muted);">Size: ${it.size || 'M'} | Qty: ${it.quantity}</span>
                        </div>
                        <span style="font-weight: 700;">₹${it.price * it.quantity}</span>
                      </div>
                    `).join("")}
                  </div>

                  <!-- Vertical Status Timeline (Section 19) -->
                  <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1rem;">
                    <h4 style="font-size: 0.9rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Live Status Timeline</h4>
                    ${ordersView.renderTimelineHtml(o.status, isPickup)}
                  </div>

                  <!-- Feedback Section (Section 21) -->
                  <div style="display: flex; justify-content: flex-end; align-items: center; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
                    ${(o.status === 'Delivered' || o.status === 'Collected') ? `
                      ${o.review ? `
                        <span style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">✓ Feedback Submitted (Rating: ★ ${o.review.shop_rating}/5)</span>
                      ` : `
                        <button class="btn btn-sm btn-secondary btn-rate-order" data-id="${o.id}" data-shop-id="${o.shop_id}" data-method="${o.delivery_method}" data-shop-name="${o.shop_name}">
                          ⭐ Rate Shop & Delivery
                        </button>
                      `}
                    ` : `
                      <span style="font-size: 0.85rem; color: var(--text-muted);">Status updates in real-time as shop fulfills</span>
                    `}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;

      container.querySelectorAll(".btn-rate-order").forEach(btn => {
        btn.addEventListener("click", () => {
          window.showRatingModal({
            order_id: btn.dataset.id,
            shop_id: btn.dataset.shopId,
            shop_name: btn.dataset.shopName,
            is_delivery: btn.dataset.method === "Home Delivery"
          });
        });
      });

    } catch (err) {
      container.innerHTML = `<div class="container" style="margin: 2rem auto;"><p style="color: var(--danger);">${err.message}</p></div>`;
    }
  },

  // Timeline Generator based on Delivery Method
  renderTimelineHtml(currentStatus, isPickup) {
    const pickupSteps = ["Order Confirmed", "Ready for Pickup", "Collected"];
    const deliverySteps = ["Order Confirmed", "Preparing", "Out for Delivery", "Delivered"];
    const steps = isPickup ? pickupSteps : deliverySteps;

    const currentIndex = steps.indexOf(currentStatus);
    const isCompleted = (index) => currentIndex > index || currentStatus === (isPickup ? "Collected" : "Delivered");
    const isActive = (index) => steps[index] === currentStatus;

    return `
      <div class="timeline">
        ${steps.map((step, idx) => {
          const completed = isCompleted(idx);
          const active = isActive(idx);
          return `
            <div class="timeline-item ${completed ? 'completed' : ''} ${active ? 'active' : ''}">
              <div class="timeline-point">${completed ? '✓' : (idx + 1)}</div>
              <div class="timeline-title">${step}</div>
              <div class="timeline-desc">
                ${active ? 'Current stage' : (completed ? 'Completed' : 'Pending')}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }
};

window.ordersView = ordersView;
