/**
 * cart.js - Shopping Cart View & Single-Shop Enforcement for LocalFind
 */

const cartView = {
  async renderCart(container) {
    if (!appState.currentUser) {
      container.innerHTML = `
        <div class="container" style="max-width: 500px; margin: 3rem auto; text-align: center;">
          <div class="card">
            <div style="font-size: 3rem; margin-bottom: 0.75rem;">🛒</div>
            <h2 class="card-title" data-i18n="cart_title">${t("cart_title")}</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Please log in to view and manage your shopping cart.</p>
            <button class="btn btn-primary" onclick="appState.navigate('login')" data-i18n="btn_login">${t("btn_login")}</button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `<div class="container" style="margin: 2rem auto;"><p>${t("loading")}</p></div>`;

    try {
      const res = await api.getCart(appState.currentUser.id);
      appState.updateCart(res);

      if (!res.items || res.items.length === 0) {
        container.innerHTML = `
          <div class="container" style="max-width: 520px; margin: 3rem auto; text-align: center;">
            <div class="card" style="padding: 3rem 1.5rem;">
              <div style="font-size: 3.5rem; margin-bottom: 0.75rem; color: var(--text-muted);">🛍️</div>
              <h2 class="card-title" data-i18n="cart_empty">${t("cart_empty")}</h2>
              <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Explore nearby shops and discover what's available before stepping out.</p>
              <button class="btn btn-primary" onclick="appState.navigate('shops')" data-i18n="btn_explore_shops">${t("btn_explore_shops")}</button>
            </div>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="container" style="max-width: 860px; margin: 2rem auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <div>
              <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--dark);" data-i18n="cart_title">${t("cart_title")}</h1>
              <p style="font-size: 0.9rem; color: var(--primary); font-weight: 600;">🏪 Order from: <strong>${res.shop_name}</strong></p>
            </div>
            <button class="btn btn-sm btn-outline btn-danger" id="btn-clear-cart" data-i18n="btn_clear_cart">🗑️ ${t("btn_clear_cart")}</button>
          </div>

          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
            <!-- Cart Items List -->
            <div>
              ${res.items.map(item => `
                <div class="card" style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; padding: 1rem;">
                  <img src="${item.image_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200'}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-md);" />
                  <div style="flex: 1;">
                    <h4 style="font-size: 1rem; font-weight: 700; color: var(--dark);">${item.product_name}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">Size: ${item.size || 'N/A'} | Color: ${item.color || 'Standard'}</p>
                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--dark); margin-top: 0.2rem;">₹${item.price}</div>
                  </div>
                  <!-- Quantity adjuster -->
                  <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-subtle); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm);">
                    <button class="btn-qty-minus" data-id="${item.id}" data-qty="${item.quantity}" style="border: none; background: none; font-weight: 800; cursor: pointer; padding: 0.2rem 0.4rem;">−</button>
                    <span style="font-weight: 700; min-width: 20px; text-align: center;">${item.quantity}</span>
                    <button class="btn-qty-plus" data-id="${item.id}" data-qty="${item.quantity}" style="border: none; background: none; font-weight: 800; cursor: pointer; padding: 0.2rem 0.4rem;">+</button>
                  </div>
                  <!-- Remove button -->
                  <button class="btn btn-sm btn-outline btn-remove-item" data-id="${item.id}" title="Remove item" style="color: var(--danger); border-color: var(--border-color);">✕</button>
                </div>
              `).join("")}
            </div>

            <!-- Bill Summary -->
            <div>
              <div class="card">
                <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;" data-i18n="order_bill_details">${t("order_bill_details")}</h3>
                <div style="font-size: 0.92rem; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.25rem;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);" data-i18n="bill_subtotal">${t("bill_subtotal")}</span>
                    <span>₹${res.subtotal}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--text-muted);" data-i18n="bill_delivery_fee">${t("bill_delivery_fee")}</span>
                    <span>₹${res.delivery_fee} <small style="color: var(--text-muted);">(free for self pickup)</small></span>
                  </div>
                  <div style="border-top: 1px solid var(--border-color); padding-top: 0.6rem; display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: var(--dark);">
                    <span data-i18n="bill_total">${t("bill_total")}</span>
                    <span>₹${res.total}</span>
                  </div>
                </div>

                <button class="btn btn-primary btn-block btn-lg" id="btn-cart-checkout" data-i18n="btn_checkout">
                  ${t("btn_checkout")} →
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Clear cart
      document.getElementById("btn-clear-cart").addEventListener("click", async () => {
        if (confirm("Are you sure you want to clear your cart?")) {
          await api.clearCart(appState.currentUser.id);
          cartView.renderCart(container);
        }
      });

      // Qty plus
      container.querySelectorAll(".btn-qty-plus").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          const newQty = parseInt(btn.dataset.qty) + 1;
          await api.updateCartQty(id, newQty);
          cartView.renderCart(container);
        });
      });

      // Qty minus
      container.querySelectorAll(".btn-qty-minus").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          const newQty = parseInt(btn.dataset.qty) - 1;
          await api.updateCartQty(id, newQty);
          cartView.renderCart(container);
        });
      });

      // Remove item
      container.querySelectorAll(".btn-remove-item").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          await api.removeFromCart(id);
          cartView.renderCart(container);
        });
      });

      // Checkout
      document.getElementById("btn-cart-checkout").addEventListener("click", () => {
        // Set selected product or cart items for fulfillment
        appState.selectedProductForOrder = {
          fromCart: true,
          shop_id: res.shop_id,
          shop_name: res.shop_name,
          items: res.items,
          subtotal: res.subtotal,
          delivery_fee: res.delivery_fee,
          total: res.total
        };
        appState.navigate("fulfillment");
      });

    } catch (err) {
      container.innerHTML = `<div class="container" style="margin: 2rem auto;"><p style="color: var(--danger);">${err.message}</p></div>`;
    }
  }
};

window.cartView = cartView;
