/**
 * auth.js - Authentication, Registration, Welcome Flow, and Role Selection Views
 */

const authView = {
  welcomeStep: 1, // 1: Language, 2: Auth (Login/Register), 3: Role Selection
  authTab: "login", // "login" or "register"

  renderWelcomeFlow(container) {
    if (this.welcomeStep === 1) {
      this.renderWelcomeLanguage(container);
    } else if (this.welcomeStep === 2) {
      this.renderWelcomeAuth(container);
    } else if (this.welcomeStep === 3) {
      this.renderWelcomeRole(container);
    }
  },

  renderWelcomeLanguage(container) {
    const currentLang = appState.currentLang || localStorage.getItem("localfind_lang") || "en";
    container.innerHTML = `
      <div style="max-width: 640px; margin: 3rem auto; padding: 0 1rem; text-align: center;">
        <div style="margin-bottom: 2rem;">
          <div class="brand-icon" style="margin: 0 auto 1rem; width: 64px; height: 64px; font-size: 2rem; border-radius: 16px;">LF</div>
          <h1 style="font-size: 2.2rem; font-weight: 800; color: var(--dark); margin-bottom: 0.5rem;">Welcome to LocalFind</h1>
          <p style="font-size: 1.15rem; color: var(--primary); font-weight: 600; margin-bottom: 0.25rem;">लोकलफ़ाइंड में आपका स्वागत है</p>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Step 1 of 3: Choose your preferred language / अपनी पसंदीदा भाषा चुनें</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
          <!-- English Card -->
          <div class="card ${currentLang === 'en' ? 'selected' : ''}" id="welcome-lang-en" style="cursor: pointer; padding: 2rem 1.5rem; border: 2.5px solid ${currentLang === 'en' ? 'var(--primary)' : 'var(--border-color)'}; border-radius: 18px; transition: all 0.2s ease;">
            <div style="font-size: 3rem; margin-bottom: 0.75rem;">🌐</div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--dark); margin-bottom: 0.35rem;">English</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">Explore stores & products in English</p>
            <button class="btn ${currentLang === 'en' ? 'btn-primary' : 'btn-outline'} btn-block">
              Select English
            </button>
          </div>

          <!-- Hindi Card -->
          <div class="card ${currentLang === 'hi' ? 'selected' : ''}" id="welcome-lang-hi" style="cursor: pointer; padding: 2rem 1.5rem; border: 2.5px solid ${currentLang === 'hi' ? 'var(--primary)' : 'var(--border-color)'}; border-radius: 18px; transition: all 0.2s ease;">
            <div style="font-size: 3rem; margin-bottom: 0.75rem;">🇮🇳</div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--dark); margin-bottom: 0.35rem;">हिंदी (Hindi)</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">अपनी स्थानीय भाषा में खरीदारी करें</p>
            <button class="btn ${currentLang === 'hi' ? 'btn-primary' : 'btn-outline'} btn-block">
              हिंदी चुनें
            </button>
          </div>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-muted);">
          You can switch language anytime from the top bar.
        </div>
      </div>
    `;

    const selectLang = (lang) => {
      setLanguage(lang);
      this.welcomeStep = 2;
      this.renderWelcomeFlow(container);
    };

    document.getElementById("welcome-lang-en").addEventListener("click", () => selectLang("en"));
    document.getElementById("welcome-lang-hi").addEventListener("click", () => selectLang("hi"));
  },

  renderWelcomeAuth(container) {
    container.innerHTML = `
      <div style="max-width: 520px; margin: 2.5rem auto; padding: 0 1rem;">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div class="brand-icon" style="margin: 0 auto 0.75rem; width: 52px; height: 52px; font-size: 1.7rem;">LF</div>
          <span class="badge badge-info" style="margin-bottom: 0.5rem;">Step 2 of 3</span>
          <h2 style="font-size: 1.85rem; font-weight: 800; color: var(--dark); margin-top: 0.3rem;">
            ${this.authTab === 'login' ? t("login_title") : t("register_title")}
          </h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">
            ${this.authTab === 'login' ? t("login_sub") : t("register_sub")}
          </p>
        </div>

        <!-- Auth Tabs Toggle -->
        <div style="display: flex; background: var(--bg-subtle); border-radius: var(--radius-md); padding: 4px; margin-bottom: 1.5rem;">
          <button id="tab-login-btn" class="btn btn-block ${this.authTab === 'login' ? 'btn-primary' : ''}" style="border-radius: var(--radius-sm); font-weight: 600; padding: 0.6rem; border: none; background: ${this.authTab === 'login' ? 'var(--primary)' : 'transparent'}; color: ${this.authTab === 'login' ? '#fff' : 'var(--text-main)'};">
            ${t("nav_login")}
          </button>
          <button id="tab-register-btn" class="btn btn-block ${this.authTab === 'register' ? 'btn-primary' : ''}" style="border-radius: var(--radius-sm); font-weight: 600; padding: 0.6rem; border: none; background: ${this.authTab === 'register' ? 'var(--primary)' : 'transparent'}; color: ${this.authTab === 'register' ? '#fff' : 'var(--text-main)'};">
            ${t("btn_register")}
          </button>
        </div>

        <!-- Quick 1-Click Demo Buttons -->
        <div style="background: #ecfdf5; border: 1.5px dashed var(--primary); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem; text-align: center;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 0.5rem;">⚡ Quick 1-Click Demo Sign In</div>
          <div style="display: flex; gap: 0.6rem; justify-content: center;">
            <button class="btn btn-sm btn-primary" id="btn-quick-customer">
              👤 Customer (Priya)
            </button>
            <button class="btn btn-sm btn-secondary" id="btn-quick-shopkeeper">
              🏪 Shopkeeper (Rajesh)
            </button>
          </div>
        </div>

        <div class="card" style="box-shadow: var(--shadow-lg); border-radius: 16px;">
          ${this.authTab === 'login' ? `
            <form id="welcome-login-form">
              <div class="form-group">
                <label class="form-label" data-i18n="phone_number">${t("phone_number")}</label>
                <input type="tel" id="w-login-phone" class="form-control" placeholder="9876543210" required />
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="password">${t("password")}</label>
                <input type="password" id="w-login-password" class="form-control" placeholder="••••••••" required />
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 1.25rem;">
                ${t("btn_login")} →
              </button>
            </form>
          ` : `
            <form id="welcome-reg-form">
              <div class="form-group">
                <label class="form-label" data-i18n="full_name">${t("full_name")} *</label>
                <input type="text" id="w-reg-name" class="form-control" placeholder="${t("full_name_placeholder")}" required />
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="phone_number">${t("phone_number")} *</label>
                <input type="tel" id="w-reg-phone" class="form-control" placeholder="10-digit mobile" required />
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="address">${t("address")} *</label>
                <input type="text" id="w-reg-address" class="form-control" placeholder="${t("address_placeholder")}" required />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" data-i18n="city">${t("city")} *</label>
                  <input type="text" id="w-reg-city" class="form-control" value="Yamunanagar" required />
                </div>
                <div class="form-group">
                  <label class="form-label" data-i18n="pincode">${t("pincode")} *</label>
                  <input type="text" id="w-reg-pincode" class="form-control" value="135003" required />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="password">${t("password")} *</label>
                <input type="password" id="w-reg-password" class="form-control" placeholder="••••••••" required />
              </div>
              <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 1.25rem;">
                ${t("btn_register")} →
              </button>
            </form>
          `}
        </div>

        <div style="text-align: center; margin-top: 1.25rem;">
          <button class="btn btn-link btn-sm" id="btn-back-to-lang" style="color: var(--text-muted);">
            ← Back to Language Selection
          </button>
        </div>
      </div>
    `;

    // Tab buttons
    document.getElementById("tab-login-btn").addEventListener("click", () => {
      this.authTab = "login";
      this.renderWelcomeAuth(container);
    });
    document.getElementById("tab-register-btn").addEventListener("click", () => {
      this.authTab = "register";
      this.renderWelcomeAuth(container);
    });
    document.getElementById("btn-back-to-lang").addEventListener("click", () => {
      this.welcomeStep = 1;
      this.renderWelcomeFlow(container);
    });

    // Quick Login Demo Handlers
    document.getElementById("btn-quick-customer").addEventListener("click", async () => {
      try {
        const res = await api.login({ phone: "9876543210", password: "pass123" });
        appState.setUser(res.user);
        window.showToast(t("success"), "Signed in as Priya Sharma (Customer)", "success");
        this.welcomeStep = 3;
        this.renderWelcomeFlow(container);
      } catch (err) {
        window.showToast(t("error"), err.message, "error");
      }
    });

    document.getElementById("btn-quick-shopkeeper").addEventListener("click", async () => {
      try {
        const res = await api.login({ phone: "9876543211", password: "pass123" });
        appState.setUser(res.user);
        window.showToast(t("success"), "Signed in as Rajesh Gupta (Shopkeeper)", "success");
        this.welcomeStep = 3;
        this.renderWelcomeFlow(container);
      } catch (err) {
        window.showToast(t("error"), err.message, "error");
      }
    });

    // Login submit
    const loginForm = document.getElementById("welcome-login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const phone = document.getElementById("w-login-phone").value.trim();
        const password = document.getElementById("w-login-password").value.trim();
        try {
          const res = await api.login({ phone, password });
          window.showToast(t("success"), res.message, "success");
          appState.setUser(res.user);
          this.welcomeStep = 3;
          this.renderWelcomeFlow(container);
        } catch (err) {
          window.showToast(t("error"), err.message, "error");
        }
      });
    }

    // Register submit
    const regForm = document.getElementById("welcome-reg-form");
    if (regForm) {
      regForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const full_name = document.getElementById("w-reg-name").value.trim();
        const phone = document.getElementById("w-reg-phone").value.trim();
        const address = document.getElementById("w-reg-address").value.trim();
        const city = document.getElementById("w-reg-city").value.trim();
        const pincode = document.getElementById("w-reg-pincode").value.trim();
        const password = document.getElementById("w-reg-password").value.trim();

        try {
          const res = await api.register({
            full_name, phone, address, city, state: "Haryana", pincode, password, role: "customer"
          });
          window.showToast(t("success"), res.message, "success");
          appState.setUser(res.user);
          this.welcomeStep = 3;
          this.renderWelcomeFlow(container);
        } catch (err) {
          window.showToast(t("error"), err.message, "error");
        }
      });
    }
  },

  renderWelcomeRole(container) {
    const user = appState.currentUser;
    container.innerHTML = `
      <div style="max-width: 900px; margin: 2rem auto; padding: 0 1rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <span class="badge badge-info" style="margin-bottom: 0.5rem;">Step 3 of 3</span>
          <h1 style="font-size: 2.1rem; font-weight: 800; color: var(--dark); margin-bottom: 0.5rem;" data-i18n="role_select_title">
            ${t("role_select_title")}
          </h1>
          <p style="color: var(--text-muted); font-size: 1.05rem;" data-i18n="role_select_sub">
            ${t("role_select_sub")}
          </p>
          ${user ? `
            <div style="display: inline-block; background: var(--bg-subtle); padding: 0.35rem 0.9rem; border-radius: 9999px; margin-top: 0.5rem; font-size: 0.88rem;">
              Logged in as: <strong>${user.full_name}</strong> (${user.phone})
            </div>
          ` : ''}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          <!-- Customer Role Card -->
          <div class="role-card-large ${appState.currentRole === 'customer' ? 'selected' : ''}" id="welcome-role-customer">
            <img class="role-card-img" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop" alt="Customer Experience" />
            <div class="role-card-body">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.8rem;">🛍️</span>
                <h3 style="font-size: 1.45rem; font-weight: 800; color: var(--dark);" data-i18n="role_customer_title">
                  ${t("role_customer_title")}
                </h3>
              </div>
              <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.5; margin-bottom: 1.25rem;" data-i18n="role_customer_desc">
                ${t("role_customer_desc")}
              </p>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.75rem; font-size: 0.88rem; color: var(--text-main);">
                <li style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: var(--primary); font-weight: 700;">✓</span> Find item availability across Yamunanagar shops
                </li>
                <li style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: var(--primary); font-weight: 700;">✓</span> Inquire with photos or product specifications
                </li>
                <li style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: var(--primary); font-weight: 700;">✓</span> Select store self-pickup or doorstep home delivery
                </li>
              </ul>
              <button class="btn btn-primary btn-block btn-lg" data-i18n="btn_enter_customer" style="margin-top: auto;">
                ${t("btn_enter_customer")} →
              </button>
            </div>
          </div>

          <!-- Shopkeeper Role Card -->
          <div class="role-card-large ${appState.currentRole === 'shopkeeper' ? 'selected' : ''}" id="welcome-role-shopkeeper">
            <img class="role-card-img" src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&auto=format&fit=crop" alt="Shopkeeper Experience" />
            <div class="role-card-body">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.8rem;">🏪</span>
                <h3 style="font-size: 1.45rem; font-weight: 800; color: var(--dark);" data-i18n="role_shopkeeper_title">
                  ${t("role_shopkeeper_title")}
                </h3>
              </div>
              <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.5; margin-bottom: 1.25rem;" data-i18n="role_shopkeeper_desc">
                ${t("role_shopkeeper_desc")}
              </p>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.75rem; font-size: 0.88rem; color: var(--text-main);">
                <li style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: var(--secondary); font-weight: 700;">✓</span> Receive instant customer product inquiries
                </li>
                <li style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: var(--secondary); font-weight: 700;">✓</span> Suggest in-stock products with photos & price
                </li>
                <li style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="color: var(--secondary); font-weight: 700;">✓</span> Confirmed orders dashboard & revenue tracking
                </li>
              </ul>
              <button class="btn btn-secondary btn-block btn-lg" data-i18n="btn_enter_shopkeeper" style="margin-top: auto;">
                ${t("btn_enter_shopkeeper")} →
              </button>
            </div>
          </div>
        </div>

        ${user && user.role === 'admin' ? `
          <div style="text-align: center; margin-top: 1rem;">
            <button class="btn btn-outline" id="welcome-btn-admin">
              🛡️ Go to Admin Control Panel
            </button>
          </div>
        ` : ''}
      </div>
    `;

    document.getElementById("welcome-role-customer").addEventListener("click", () => {
      appState.setRole("customer");
      appState.navigate("home");
    });

    document.getElementById("welcome-role-shopkeeper").addEventListener("click", () => {
      appState.setRole("shopkeeper");
      appState.navigate("shopkeeper");
    });

    const adminBtn = document.getElementById("welcome-btn-admin");
    if (adminBtn) {
      adminBtn.addEventListener("click", () => {
        appState.setRole("admin");
        appState.navigate("admin");
      });
    }
  },

  renderLogin(container) {
    this.welcomeStep = 2;
    this.authTab = "login";
    this.renderWelcomeFlow(container);
  },

  renderRegister(container) {
    this.welcomeStep = 2;
    this.authTab = "register";
    this.renderWelcomeFlow(container);
  },

  renderRoleSelect(container) {
    this.welcomeStep = 3;
    this.renderWelcomeFlow(container);
  }
};

window.authView = authView;
