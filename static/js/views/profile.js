/**
 * profile.js - Customer Profile View & Details Editor for LocalFind
 */

const profileView = {
  async renderProfile(container) {
    const user = appState.currentUser;
    if (!user) {
      appState.navigate("login");
      return;
    }

    container.innerHTML = `
      <div class="container" style="max-width: 640px; margin: 2rem auto;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
            <div>
              <h2 class="card-title" data-i18n="profile_title">${t("profile_title")}</h2>
              <p class="card-subtitle" data-i18n="profile_sub">${t("profile_sub")}</p>
            </div>
            <button class="btn btn-outline btn-sm btn-danger" id="btn-profile-logout" data-i18n="nav_logout">
              🚪 ${t("nav_logout")}
            </button>
          </div>

          <form id="profile-edit-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" data-i18n="full_name">${t("full_name")}</label>
                <input type="text" id="prof-name" class="form-control" value="${user.full_name || ''}" required />
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="phone_number">${t("phone_number")}</label>
                <input type="tel" id="prof-phone" class="form-control" value="${user.phone || ''}" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="address">${t("address")}</label>
              <input type="text" id="prof-address" class="form-control" value="${user.address || ''}" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" data-i18n="city">${t("city")}</label>
                <input type="text" id="prof-city" class="form-control" value="${user.city || 'Yamunanagar'}" required />
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="state">${t("state")}</label>
                <input type="text" id="prof-state" class="form-control" value="${user.state || 'Haryana'}" required />
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="pincode">${t("pincode")}</label>
                <input type="text" id="prof-pincode" class="form-control" value="${user.pincode || '135001'}" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="preferred_language">${t("preferred_language")}</label>
              <select id="prof-lang" class="form-control">
                <option value="en" ${i18n.lang === 'en' ? 'selected' : ''}>English</option>
                <option value="hi" ${i18n.lang === 'hi' ? 'selected' : ''}>हिंदी (Hindi)</option>
              </select>
            </div>

            <div style="margin-top: 1.5rem;">
              <button type="submit" class="btn btn-primary btn-lg btn-block" data-i18n="btn_save_profile">
                💾 ${t("btn_save_profile")}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById("profile-edit-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const updated = {
        id: user.id,
        full_name: document.getElementById("prof-name").value.trim(),
        phone: document.getElementById("prof-phone").value.trim(),
        address: document.getElementById("prof-address").value.trim(),
        city: document.getElementById("prof-city").value.trim(),
        state: document.getElementById("prof-state").value.trim(),
        pincode: document.getElementById("prof-pincode").value.trim(),
        preferred_lang: document.getElementById("prof-lang").value
      };

      try {
        const res = await api.updateProfile(updated);
        window.showToast(t("success"), res.message, "success");
        // Update user state & language
        const refreshed = { ...user, ...updated };
        appState.setUser(refreshed);
        i18n.setLang(updated.preferred_lang);
      } catch (err) {
        window.showToast(t("error"), err.message, "error");
      }
    });

    document.getElementById("btn-profile-logout").addEventListener("click", () => {
      appState.logout();
    });
  }
};

window.profileView = profileView;
