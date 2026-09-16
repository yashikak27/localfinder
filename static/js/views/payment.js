/**
 * payment.js - Dedicated Payment & Settlement views for Customer & Shopkeeper
 */

const paymentView = {
  async renderCustomerPayment(container) {
    const user = appState.currentUser;
    if (!user) {
      appState.navigate("welcome-flow");
      return;
    }

    container.innerHTML = `
      <div class="container" style="padding-top: 1.5rem; padding-bottom: 2rem;">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--dark);">${t("nav_payment")}</h1>
          <p style="color: var(--text-muted);">Manage your payment methods, UPI preferences, and transaction history.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Payment Options Card -->
          <div class="card">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Payment Options</h3>

            <!-- COD -->
            <div style="border: 2px solid var(--primary); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem; background: #f0fdf4; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.8rem;">💵</span>
                <div>
                  <strong style="display: block; color: var(--dark);">Cash on Delivery (COD)</strong>
                  <span style="font-size: 0.85rem; color: var(--primary-dark);">Recommended for neighborhood shops</span>
                </div>
              </div>
              <span class="badge badge-success">Active Default</span>
            </div>

            <!-- UPI / GPay -->
            <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem; background: #ffffff; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.8rem;">📱</span>
                <div>
                  <strong style="display: block; color: var(--dark);">UPI / Google Pay / PhonePe</strong>
                  <span style="font-size: 0.85rem; color: var(--text-muted);">${user.phone}@upi</span>
                </div>
              </div>
              <span class="badge" style="background: var(--bg-subtle); color: var(--text-main);">Linked</span>
            </div>

            <!-- Card / Netbanking -->
            <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; background: #ffffff; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.8rem;">💳</span>
                <div>
                  <strong style="display: block; color: var(--dark);">Debit / Credit Cards</strong>
                  <span style="font-size: 0.85rem; color: var(--text-muted);">Visa, Mastercard, RuPay</span>
                </div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="window.showToast('Payment Setup', 'Card gateway simulator ready for checkout', 'info')">Configure</button>
            </div>
          </div>

          <!-- Hyperlocal Payment Guarantee -->
          <div class="card" style="background: linear-gradient(135deg, #064e3b 0%, #059669 100%); color: white;">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🛡️</div>
            <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; color: white;">Nearby SafePay Guarantee</h3>
            <p style="font-size: 0.9rem; opacity: 0.92; line-height: 1.6; margin-bottom: 1.25rem;">
              With our hyperlocal network, you inspect your items first! Whether you choose self-pickup at the shop or doorstep delivery, pay cash or UPI with complete peace of mind.
            </p>
            <div style="background: rgba(255, 255, 255, 0.15); border-radius: var(--radius-md); padding: 0.75rem 1rem; font-size: 0.85rem;">
              ✔️ No advance payment required for in-stock store items<br/>
              ✔️ Direct shopkeeper contact on every order
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="card">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Payment & Order History</h3>
          <div id="payment-orders-list">
            <div class="text-center" style="padding: 2rem; color: var(--text-muted);">Loading payment transactions...</div>
          </div>
        </div>
      </div>
    `;

    try {
      const res = await api.getOrders({ customer_id: user.id });
      const orders = (res && res.orders) || (Array.isArray(res) ? res : []);
      const listEl = document.getElementById("payment-orders-list");
      if (!orders || orders.length === 0) {
        listEl.innerHTML = `
          <div class="text-center" style="padding: 2rem; color: var(--text-muted);">
            <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No payment transactions found yet.</p>
            <button class="btn btn-primary btn-sm" onclick="appState.navigate('find-item')">Start Shopping Nearby</button>
          </div>
        `;
        return;
      }

      listEl.innerHTML = `
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color); text-align: left; color: var(--text-muted);">
                <th style="padding: 0.75rem;">Order ID</th>
                <th style="padding: 0.75rem;">Shop</th>
                <th style="padding: 0.75rem;">Method</th>
                <th style="padding: 0.75rem;">Amount</th>
                <th style="padding: 0.75rem;">Status</th>
                <th style="padding: 0.75rem;">Date</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 0.75rem; font-weight: 600;">#ORD-${o.id}</td>
                  <td style="padding: 0.75rem;">${o.shop_name || 'Nearby Shop'}</td>
                  <td style="padding: 0.75rem;"><span class="badge badge-info">${o.payment_method || 'COD'}</span></td>
                  <td style="padding: 0.75rem; font-weight: 700; color: var(--dark);">₹${o.total_amount}</td>
                  <td style="padding: 0.75rem;">
                    <span class="badge ${o.payment_status === 'Paid' ? 'badge-success' : 'badge-warning'}">
                      ${o.payment_status || (o.payment_method === 'COD' ? 'Pending COD' : 'Completed')}
                    </span>
                  </td>
                  <td style="padding: 0.75rem; color: var(--text-muted); font-size: 0.85rem;">
                    ${new Date(o.created_at).toLocaleDateString()}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      console.error(err);
      const listEl = document.getElementById("payment-orders-list");
      if (listEl) listEl.innerHTML = `<div style="color: var(--danger); padding: 1rem;">Failed to load transactions.</div>`;
    }
  },

  async renderShopkeeperPayment(container) {
    const user = appState.currentUser;
    if (!user) {
      appState.navigate("welcome-flow");
      return;
    }

    let shop = null;
    try {
      const shops = await api.getShops();
      shop = shops.find(s => s.owner_id === user.id) || shops[0];
    } catch (e) {
      console.error(e);
    }

    const shopId = shop ? shop.id : 1;

    container.innerHTML = `
      <div class="container" style="padding-top: 1.5rem; padding-bottom: 2rem;">
        <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--dark);">${t("nav_payment")} & Settlements</h1>
            <p style="color: var(--text-muted);">${shop ? shop.name : 'Your Shop'} • Real-time Collections & Payout Account</p>
          </div>
          <button class="btn btn-primary" onclick="window.showToast('Settlement Requested', 'Payout initiated to registered bank account', 'success')">
            💸 Request Instant Settlement
          </button>
        </div>

        <div id="shopkeeper-payment-content">
          <div class="text-center" style="padding: 2rem;">Loading payment overview...</div>
        </div>
      </div>
    `;

    try {
      const earnings = await api.getEarnings(shopId);
      const ordRes = await api.getOrders({ shop_id: shopId });
      const orders = (ordRes && ordRes.orders) || (Array.isArray(ordRes) ? ordRes : []);

      const contentEl = document.getElementById("shopkeeper-payment-content");
      if (!contentEl) return;

      contentEl.innerHTML = `
        <!-- Metrics Row -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div class="card" style="border-top: 4px solid var(--primary);">
            <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Total Sales Revenue</div>
            <div style="font-size: 1.85rem; font-weight: 800; color: var(--primary); margin-top: 0.4rem;">₹${earnings.total_earnings.toLocaleString()}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">From ${earnings.confirmed_orders} confirmed orders</div>
          </div>

          <div class="card" style="border-top: 4px solid var(--secondary);">
            <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Cash on Delivery (Pending)</div>
            <div style="font-size: 1.85rem; font-weight: 800; color: var(--secondary); margin-top: 0.4rem;">₹${earnings.pending_cod.toLocaleString()}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">To be collected at delivery</div>
          </div>

          <div class="card" style="border-top: 4px solid var(--info);">
            <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">UPI & Digital Collections</div>
            <div style="font-size: 1.85rem; font-weight: 800; color: var(--info); margin-top: 0.4rem;">₹${(earnings.total_earnings - earnings.pending_cod).toLocaleString()}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">Auto-settled to registered VPA</div>
          </div>

          <div class="card" style="border-top: 4px solid #10b981;">
            <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Next Payout Schedule</div>
            <div style="font-size: 1.4rem; font-weight: 700; color: var(--dark); margin-top: 0.4rem;">Today, 11:00 PM</div>
            <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-top: 0.3rem;">Direct Bank IMPS</div>
          </div>
        </div>

        <!-- Bank Account & Payout Details -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div class="card">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Linked Settlement Account</h3>
            <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-subtle); border-radius: var(--radius-md);">
              <span style="font-size: 2rem;">🏦</span>
              <div style="flex: 1;">
                <strong style="color: var(--dark); font-size: 1.05rem;">State Bank of India</strong>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">A/C: •••••••• 8842 | IFSC: SBIN0001234</p>
                <p style="font-size: 0.82rem; color: var(--primary); font-weight: 600;">Branch: Jagadhri Main Road</p>
              </div>
              <span class="badge badge-success">Verified</span>
            </div>
            <div style="margin-top: 1rem; font-size: 0.88rem; color: var(--text-muted);">
              UPI Merchant VPA: <code style="color: var(--dark); font-weight: 600;">${shop ? shop.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'shop'}@okhdfcbank</code>
            </div>
          </div>

          <div class="card">
            <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem;">Payment Policy & Protection</h3>
            <ul style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.8; list-style: disc; padding-left: 1.25rem;">
              <li>0% gateway commission on direct neighborhood Cash-on-Delivery.</li>
              <li>Same-day payout settlement for digital UPI orders.</li>
              <li>Customer verification code requested upon doorstep delivery.</li>
              <li>Dispute resolution assistance from Nearby local support team.</li>
            </ul>
          </div>
        </div>

        <!-- Orders Breakdown -->
        <div class="card">
          <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">Recent Orders & Payment Breakdown</h3>
          ${orders && orders.length > 0 ? `
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--border-color); text-align: left; color: var(--text-muted);">
                    <th style="padding: 0.75rem;">Order</th>
                    <th style="padding: 0.75rem;">Customer</th>
                    <th style="padding: 0.75rem;">Fulfillment</th>
                    <th style="padding: 0.75rem;">Payment Mode</th>
                    <th style="padding: 0.75rem;">Amount</th>
                    <th style="padding: 0.75rem;">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.slice(0, 10).map(o => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                      <td style="padding: 0.75rem; font-weight: 600;">#ORD-${o.id}</td>
                      <td style="padding: 0.75rem;">${o.customer_name || 'Customer'}</td>
                      <td style="padding: 0.75rem;">${o.delivery_type === 'home_delivery' ? '🚚 Home Delivery' : '🏪 Self Pickup'}</td>
                      <td style="padding: 0.75rem;"><span class="badge badge-info">${o.payment_method || 'COD'}</span></td>
                      <td style="padding: 0.75rem; font-weight: 700; color: var(--dark);">₹${o.total_amount}</td>
                      <td style="padding: 0.75rem;">
                        <span class="badge ${o.payment_status === 'Paid' ? 'badge-success' : 'badge-warning'}">
                          ${o.payment_status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <div class="text-center" style="padding: 2rem; color: var(--text-muted);">No orders received yet.</div>
          `}
        </div>
      `;
    } catch (err) {
      console.error(err);
      const contentEl = document.getElementById("shopkeeper-payment-content");
      if (contentEl) contentEl.innerHTML = `<div style="color: var(--danger); padding: 1rem;">Failed to load payment data.</div>`;
    }
  },

  render(container) {
    if (appState.currentRole === "shopkeeper") {
      this.renderShopkeeperPayment(container);
    } else {
      this.renderCustomerPayment(container);
    }
  }
};

window.paymentView = paymentView;
