/**
 * notifications.js - Dedicated Notifications page for Customer & Shopkeeper
 */

const notificationsView = {
  async render(container) {
    const user = appState.currentUser;
    if (!user) {
      appState.navigate("welcome-flow");
      return;
    }

    container.innerHTML = `
      <div class="container" style="padding-top: 1.5rem; padding-bottom: 2.5rem; max-width: 800px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 1.75rem; font-weight: 800; color: var(--dark);">${t("nav_notifications")}</h1>
            <p style="color: var(--text-muted);">Stay updated on item queries, shopkeeper suggestions, and order status updates.</p>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-mark-all-read">
            ✓ Mark all as read
          </button>
        </div>

        <div id="notifications-container">
          <div class="text-center" style="padding: 2.5rem; color: var(--text-muted);">
            Loading notifications...
          </div>
        </div>
      </div>
    `;

    const containerEl = document.getElementById("notifications-container");

    try {
      const notifs = await api.getNotifications(user.id);

      if (!notifs || notifs.length === 0) {
        containerEl.innerHTML = `
          <div class="card text-center" style="padding: 3rem 1.5rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔔</div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--dark); margin-bottom: 0.5rem;">No notifications yet</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">
              You will receive updates here as soon as local shops respond to your requests or update your order status.
            </p>
          </div>
        `;
        return;
      }

      containerEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${notifs.map(n => `
            <div class="card" style="padding: 1.25rem; display: flex; align-items: flex-start; gap: 1rem; border-left: 4px solid ${n.is_read ? 'var(--border-color)' : 'var(--primary)'}; background: ${n.is_read ? '#ffffff' : '#f0fdf4'};">
              <div style="font-size: 1.6rem; background: var(--bg-subtle); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${n.type === 'order' ? '📦' : n.type === 'suggestion' ? '💡' : n.type === 'status' ? '🚚' : '🔔'}
              </div>
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                  <h4 style="font-size: 1rem; font-weight: 700; color: var(--dark); margin: 0;">${n.title}</h4>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${new Date(n.created_at).toLocaleDateString()}</span>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 0.5rem; line-height: 1.5;">${n.message}</p>
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                  ${!n.is_read ? `
                    <button class="btn btn-outline btn-sm btn-read-item" data-id="${n.id}" style="padding: 0.2rem 0.55rem; font-size: 0.78rem;">
                      Mark read
                    </button>
                  ` : `
                    <span style="font-size: 0.78rem; color: var(--text-light);">Read</span>
                  `}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Event listener for individual mark read
      containerEl.querySelectorAll(".btn-read-item").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const notifId = e.currentTarget.dataset.id;
          try {
            await api.markNotificationRead(notifId);
            notificationsView.render(container);
          } catch (err) {
            console.error(err);
          }
        });
      });

      // Event listener for mark all as read
      document.getElementById("btn-mark-all-read").addEventListener("click", async () => {
        const unread = notifs.filter(n => !n.is_read);
        for (const item of unread) {
          try {
            await api.markNotificationRead(item.id);
          } catch (e) {}
        }
        window.showToast(t("success"), "All notifications marked as read", "info");
        notificationsView.render(container);
      });

    } catch (err) {
      console.error(err);
      containerEl.innerHTML = `<div class="card" style="color: var(--danger); padding: 1.5rem;">Failed to load notifications.</div>`;
    }
  }
};

window.notificationsView = notificationsView;
