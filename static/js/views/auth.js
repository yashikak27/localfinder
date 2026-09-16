/**
 * auth.js - Authentic Multi-Step Onboarding Architecture for Nearby
 * Step 1: Personal Credentials Screen (Full Name, Phone, Email, Password)
 * Step 2: Detailed Address Screen (State, City, District, PIN Code, Locality, Post Office)
 * Step 3: Role Selection Gateway (Customer vs. Seller / Shopkeeper)
 */

const authView = {
  // Temporary storage across onboarding steps
  pendingCredentials: {
    fullName: "",
    phone: "",
    email: "",
    password: ""
  },
  pendingAddress: {
    state: "Haryana",
    city: "Yamunanagar",
    district: "Yamunanagar",
    pincode: "135001",
    localArea: "Civil Lines",
    postOffice: "Yamunanagar H.O.",
    address: "House No. 42, Civil Lines"
  },

  renderLogin(container) {
    this.renderStep1Credentials(container);
  },

  // =========================================================================
  // STEP 1: PERSONAL CREDENTIALS SCREEN
  // =========================================================================
  renderStep1Credentials(container) {
    const creds = this.pendingCredentials;

    container.innerHTML = `
      <div class="auth-page-wrapper">
        <div class="auth-card">
          <!-- Brand Header -->
          <div class="auth-header">
            <div class="brand-icon auth-brand-icon" style="background: linear-gradient(135deg, var(--pastel-sage), var(--pastel-blush));">NB</div>
            <h1 class="auth-brand-name" style="color: var(--dark);">Nearby</h1>
            <p class="auth-tagline">Neighborhood Product Discovery & Local Inventory</p>
            <div class="auth-step-pill" style="background: var(--pastel-sage-light); color: var(--pastel-sage-dark);">
              Step 1 of 3: Personal Credentials
            </div>
          </div>

          <!-- Step 1 Form -->
          <form id="nearby-credentials-form" class="auth-form" novalidate>
            <div class="form-section-title">
              <span>👤</span> Personal Identification
            </div>

            <!-- Full Name -->
            <div class="form-group">
              <label class="form-label" for="login-fullname">Full Name <span class="required">*</span></label>
              <input type="text" id="login-fullname" class="form-control" placeholder="e.g. Aarav Mehra" value="${creds.fullName || ''}" required autofocus />
              <div class="form-hint">Enter your authentic legal name for orders and pickups</div>
            </div>

            <!-- Phone Number -->
            <div class="form-group">
              <label class="form-label" for="login-phone">Phone Number <span class="required">*</span></label>
              <input type="tel" id="login-phone" class="form-control" placeholder="10-digit mobile number" maxlength="10" value="${creds.phone || ''}" required />
              <div class="form-hint">Used for shopkeeper order verification & pickup PIN</div>
            </div>

            <!-- Email Address -->
            <div class="form-group">
              <label class="form-label" for="login-email">Email Address <span class="required">*</span></label>
              <input type="email" id="login-email" class="form-control" placeholder="e.g. aarav.mehra@example.com" value="${creds.email || ''}" required />
              <div class="form-hint">Used for order confirmations and digital receipts</div>
            </div>

            <!-- Password with Masking & Eye Toggle -->
            <div class="form-group">
              <label class="form-label" for="login-password">Password <span class="required">*</span></label>
              <div style="position: relative; display: flex; align-items: center;">
                <input type="password" id="login-password" class="form-control" placeholder="••••••••" value="${creds.password || ''}" style="padding-right: 2.75rem;" required />
                <button type="button" id="btn-toggle-password" style="position: absolute; right: 0.75rem; background: none; border: none; cursor: pointer; font-size: 1.1rem; opacity: 0.65; color: var(--text-muted);" title="Toggle password visibility">
                  👁️
                </button>
              </div>
              <div class="form-hint">Must be at least 4 characters</div>
            </div>

            <!-- Continue Button -->
            <button type="submit" class="btn btn-primary btn-lg btn-block auth-submit-btn" id="btn-credentials-continue" style="margin-top: 1.5rem;">
              Continue to Address Details (Step 2) →
            </button>
          </form>
        </div>
      </div>
    `;

    // Password visibility toggle
    const pwdInput = document.getElementById("login-password");
    const toggleBtn = document.getElementById("btn-toggle-password");
    if (toggleBtn && pwdInput) {
      toggleBtn.addEventListener("click", () => {
        if (pwdInput.type === "password") {
          pwdInput.type = "text";
          toggleBtn.textContent = "🙈";
        } else {
          pwdInput.type = "password";
          toggleBtn.textContent = "👁️";
        }
      });
    }

    // Credentials submission
    const form = document.getElementById("nearby-credentials-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = document.getElementById("login-fullname").value.trim();
      const phone = document.getElementById("login-phone").value.trim();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      if (!fullName) {
        window.showToast("Full Name Required", "Please enter your full name.", "warning");
        document.getElementById("login-fullname").focus();
        return;
      }
      if (!phone || phone.length < 10 || !/^\d{10}$/.test(phone)) {
        window.showToast("Invalid Phone", "Please enter a valid 10-digit mobile number.", "warning");
        document.getElementById("login-phone").focus();
        return;
      }
      if (!email || !email.includes("@") || !email.includes(".")) {
        window.showToast("Valid Email Required", "Please enter a valid email address.", "warning");
        document.getElementById("login-email").focus();
        return;
      }
      if (!password || password.length < 4) {
        window.showToast("Password Required", "Please enter a secure password (at least 4 characters).", "warning");
        document.getElementById("login-password").focus();
        return;
      }

      // Save credentials in state
      this.pendingCredentials = { fullName, phone, email, password };

      // Transition immediately to Step 2
      this.renderStep2Address(container);
    });

    i18n.applyTranslations(container);
  },

  // =========================================================================
  // STEP 2: DETAILED ADDRESS SCREEN
  // =========================================================================
  renderStep2Address(container) {
    const addr = this.pendingAddress;
    const creds = this.pendingCredentials;

    container.innerHTML = `
      <div class="auth-page-wrapper">
        <div class="auth-card">
          <!-- Brand Header -->
          <div class="auth-header">
            <div class="brand-icon auth-brand-icon" style="background: linear-gradient(135deg, var(--pastel-sage), var(--pastel-blush));">NB</div>
            <h1 class="auth-brand-name" style="color: var(--dark);">Nearby</h1>
            <p class="auth-tagline">Neighborhood Product Discovery & Local Inventory</p>
            <div class="auth-step-pill" style="background: var(--pastel-sage-light); color: var(--pastel-sage-dark);">
              Step 2 of 3: Detailed Address
            </div>
          </div>

          <!-- User Chip from Step 1 -->
          <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.65rem 0.9rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.85rem; color: var(--dark);">
              👤 <strong>${creds.fullName || 'User'}</strong> (${creds.phone || ''})
            </div>
            <button type="button" id="btn-back-to-step1" class="btn btn-link btn-sm" style="padding: 0; font-size: 0.8rem;">
              Edit Credentials
            </button>
          </div>

          <!-- Step 2 Form -->
          <form id="nearby-address-form" class="auth-form" novalidate>
            <div class="form-section-title">
              <span>📍</span> Neighborhood Address Details
            </div>

            <!-- Row 1: State & City -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="addr-state">State Name <span class="required">*</span></label>
                <input type="text" id="addr-state" class="form-control" placeholder="e.g. Haryana" value="${addr.state || 'Haryana'}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="addr-city">City Name <span class="required">*</span></label>
                <input type="text" id="addr-city" class="form-control" placeholder="e.g. Yamunanagar" value="${addr.city || 'Yamunanagar'}" required />
              </div>
            </div>

            <!-- Row 2: District & PIN Code (Strictly Validated) -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="addr-district">District <span class="required">*</span></label>
                <input type="text" id="addr-district" class="form-control" placeholder="e.g. Yamunanagar" value="${addr.district || addr.city || 'Yamunanagar'}" required />
                <div class="form-hint">Administrative district for shop clustering</div>
              </div>
              <div class="form-group">
                <label class="form-label" for="addr-pincode">
                  PIN Code <span class="required">*</span>
                  <span class="pincode-mandatory-badge">Strictly Validated</span>
                </label>
                <input type="text" id="addr-pincode" class="form-control" placeholder="e.g. 135001" maxlength="6" value="${addr.pincode || '135001'}" required />
                <div class="form-hint">Strict 6-digit postal code of your area</div>
              </div>
            </div>

            <!-- Row 3: Locality/Area & Post Office -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="addr-localarea">Locality / Area <span class="required">*</span></label>
                <input type="text" id="addr-localarea" class="form-control" placeholder="e.g. Civil Lines, Model Town" value="${addr.localArea || 'Civil Lines'}" required />
                <div class="form-hint">Sector, colony, or neighborhood name</div>
              </div>
              <div class="form-group">
                <label class="form-label" for="addr-postoffice">Post Office <span class="required">*</span></label>
                <input type="text" id="addr-postoffice" class="form-control" placeholder="e.g. Yamunanagar H.O." value="${addr.postOffice || 'Yamunanagar H.O.'}" required />
                <div class="form-hint">Serving post office branch</div>
              </div>
            </div>

            <!-- Full Street Address -->
            <div class="form-group">
              <label class="form-label" for="addr-fulladdress">Full Street Address <span class="required">*</span></label>
              <input type="text" id="addr-fulladdress" class="form-control" placeholder="House/Flat/Shop no., building name, road" value="${addr.address || ''}" required />
              <div class="form-hint">Accurate physical location for pickup directions and home delivery</div>
            </div>

            <!-- Navigation Buttons -->
            <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
              <button type="button" class="btn btn-outline" id="btn-back-step1" style="flex: 1;">
                ← Back
              </button>
              <button type="submit" class="btn btn-primary btn-lg auth-submit-btn" id="btn-address-continue" style="flex: 2;">
                Continue to Role Selection (Step 3) →
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Back to Step 1
    const handleBack = () => this.renderStep1Credentials(container);
    document.getElementById("btn-back-to-step1")?.addEventListener("click", handleBack);
    document.getElementById("btn-back-step1")?.addEventListener("click", handleBack);

    // Address submission & Persistence
    const form = document.getElementById("nearby-address-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const state = document.getElementById("addr-state").value.trim();
      const city = document.getElementById("addr-city").value.trim();
      const district = document.getElementById("addr-district").value.trim();
      const pincode = document.getElementById("addr-pincode").value.trim();
      const localArea = document.getElementById("addr-localarea").value.trim();
      const postOffice = document.getElementById("addr-postoffice").value.trim();
      const address = document.getElementById("addr-fulladdress").value.trim();

      if (!state) {
        window.showToast("State Required", "Please enter your State name.", "warning");
        document.getElementById("addr-state").focus();
        return;
      }
      if (!city) {
        window.showToast("City Required", "Please enter your City name.", "warning");
        document.getElementById("addr-city").focus();
        return;
      }
      if (!district) {
        window.showToast("District Required", "Please enter your District name.", "warning");
        document.getElementById("addr-district").focus();
        return;
      }
      if (!pincode || pincode.length < 5 || !/^\d{5,6}$/.test(pincode)) {
        window.showToast("PIN Code Strictly Validated", "Please enter a valid 5 or 6-digit postal PIN code.", "warning");
        document.getElementById("addr-pincode").focus();
        return;
      }
      if (!localArea) {
        window.showToast("Locality Required", "Please enter your local area or sector.", "warning");
        document.getElementById("addr-localarea").focus();
        return;
      }
      if (!postOffice) {
        window.showToast("Post Office Required", "Please enter your serving post office.", "warning");
        document.getElementById("addr-postoffice").focus();
        return;
      }
      if (!address) {
        window.showToast("Address Required", "Please enter your full street address.", "warning");
        document.getElementById("addr-fulladdress").focus();
        return;
      }

      this.pendingAddress = { state, city, district, pincode, localArea, postOffice, address };

      const submitBtn = document.getElementById("btn-address-continue");
      submitBtn.disabled = true;
      submitBtn.textContent = "Saving profile...";

      try {
        const payload = {
          full_name: creds.fullName,
          email: creds.email,
          phone: creds.phone,
          password: creds.password,
          state: state,
          city: city,
          district: district,
          pincode: pincode,
          local_area: localArea,
          post_office: postOffice,
          address: address,
          role: "customer"
        };

        const res = await api.onboard(payload);
        if (res && res.user) {
          appState.setUser(res.user);
          window.showToast("Profile Saved", `Welcome, ${res.user.full_name}!`, "success");
          this.renderRoleSelect(container);
        } else {
          throw new Error("Failed to save registration profile.");
        }
      } catch (err) {
        window.showToast("Error", err.message || "Failed to save profile.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Continue to Role Selection (Step 3) →";
      }
    });

    i18n.applyTranslations(container);
  },

  // =========================================================================
  // STEP 3: ROLE SELECTION GATEWAY
  // =========================================================================
  renderRoleSelect(container) {
    const user = appState.currentUser;
    const userName = user ? user.full_name : (this.pendingCredentials.fullName || "Valued User");
    const userPhone = user ? user.phone : (this.pendingCredentials.phone || "");

    container.innerHTML = `
      <div class="role-selection-wrapper">
        <div class="role-selection-card">
          <!-- Step indicator & Header -->
          <div class="role-header-box">
            <span class="auth-step-pill" style="background: var(--pastel-sage-light); color: var(--pastel-sage-dark);">
              Step 3 of 3: Role Selection Gateway
            </span>
            <h1 class="role-main-title">
              How will you use Nearby?
            </h1>
            <p class="role-sub-title">
              Choose your role to enter your customized interface
            </p>
            ${user ? `
              <div class="user-active-badge">
                Signed in as: <strong>${userName}</strong> ${userPhone ? `(${userPhone})` : ''} • PIN: <strong>${user.pincode || '135001'}</strong>
              </div>
            ` : ''}
          </div>

          <!-- Two Interactive Role Cards: Customer vs. Seller / Shopkeeper -->
          <div class="role-cards-grid">
            <!-- 1. Customer Card -->
            <div class="role-card ${appState.currentRole === 'customer' ? 'selected' : ''}" id="card-role-customer" tabindex="0">
              <div class="role-card-image-wrapper">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop" alt="Customer Experience" class="role-card-banner-img" />
                <div class="role-card-icon-bubble" style="background: var(--pastel-sage-light); color: var(--pastel-sage-dark);">🛍️</div>
              </div>
              <div class="role-card-content">
                <h2 class="role-card-heading">Customer</h2>
                <p class="role-card-description">
                  Discover product availability across local neighborhood shops before leaving your doorstep.
                </p>

                <ul class="role-card-features">
                  <li><span class="check-icon" style="color: var(--pastel-sage);">✓</span> Visual search or category inquiry for products</li>
                  <li><span class="check-icon" style="color: var(--pastel-sage);">✓</span> Compare real seller stock photos & instant quotes</li>
                  <li><span class="check-icon" style="color: var(--pastel-sage);">✓</span> Interactive route navigation or doorstep delivery</li>
                </ul>

                <button type="button" class="btn btn-primary btn-lg btn-block role-action-btn" id="btn-select-customer">
                  Enter as Customer →
                </button>
              </div>
            </div>

            <!-- 2. Seller / Shopkeeper Card -->
            <div class="role-card ${appState.currentRole === 'shopkeeper' ? 'selected' : ''}" id="card-role-shopkeeper" tabindex="0">
              <div class="role-card-image-wrapper">
                <img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&auto=format&fit=crop" alt="Shopkeeper Experience" class="role-card-banner-img" />
                <div class="role-card-icon-bubble" style="background: var(--pastel-blush-light); color: var(--pastel-blush-dark);">🏪</div>
              </div>
              <div class="role-card-content">
                <h2 class="role-card-heading">Seller / Shopkeeper</h2>
                <p class="role-card-description">
                  Receive live buyer inquiries from nearby residents matching your exact inventory domain.
                </p>

                <!-- Store Specialty Categorization Selector -->
                <div style="background: var(--bg-app); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 0.9rem; margin-bottom: 1rem; text-align: left;">
                  <label class="form-label" style="font-weight: 700; font-size: 0.82rem; margin-bottom: 0.35rem;">
                    Store Specialty Domain <span class="required">*</span>
                  </label>
                  <select id="seller-specialty-select" class="form-control" style="font-weight: 600; font-size: 0.9rem;">
                    <option value="Clothes & Apparel">Clothes & Apparel</option>
                    <option value="Beauty & Skincare">Beauty & Skincare</option>
                    <option value="Footwear / Shoes">Footwear / Shoes</option>
                  </select>
                  <div class="form-hint" style="font-size: 0.76rem; margin-top: 0.25rem;">
                    Ensures you only receive requests matching your store's inventory domain
                  </div>
                </div>

                <ul class="role-card-features">
                  <li><span class="check-icon" style="color: var(--pastel-blush-dark);">✓</span> Filtered requests feed strictly for your specialty</li>
                  <li><span class="check-icon" style="color: var(--pastel-blush-dark);">✓</span> Quick photo-upload tool to reply with stock options</li>
                  <li><span class="check-icon" style="color: var(--pastel-blush-dark);">✓</span> Daily turnover, COD vs Digital payments & earnings</li>
                </ul>

                <button type="button" class="btn btn-secondary btn-lg btn-block role-action-btn" id="btn-select-shopkeeper">
                  Enter as Seller / Shopkeeper →
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom bar -->
          <div class="role-bottom-bar">
            <button type="button" class="btn btn-link btn-sm text-muted" id="btn-restart-login">
              ← Change Account Details / Sign Out
            </button>
          </div>
        </div>
      </div>
    `;

    // Customer selection handler
    const chooseCustomer = async () => {
      appState.setRole("customer");
      window.showToast("Customer View", "Entering Nearby as Customer", "success");
      appState.navigate("home");
    };

    // Shopkeeper selection handler
    const chooseShopkeeper = async () => {
      const specialty = document.getElementById("seller-specialty-select").value;
      if (user) {
        user.store_specialty = specialty;
        user.role = "shopkeeper";
        appState.setUser(user);
        try {
          await api.onboard({ ...user, role: "shopkeeper", store_specialty: specialty });
        } catch (e) {
          console.warn("Could not sync specialty immediately:", e);
        }
      }
      appState.setRole("shopkeeper");
      window.showToast("Seller Hub", `Entered as Shopkeeper (${specialty})`, "success");
      appState.navigate("shopkeeper");
    };

    document.getElementById("card-role-customer").addEventListener("click", chooseCustomer);
    document.getElementById("btn-select-customer").addEventListener("click", (e) => {
      e.stopPropagation();
      chooseCustomer();
    });

    document.getElementById("btn-select-shopkeeper").addEventListener("click", (e) => {
      e.stopPropagation();
      chooseShopkeeper();
    });

    document.getElementById("btn-restart-login").addEventListener("click", () => {
      appState.logout();
    });

    i18n.applyTranslations(container);
  },

  renderWelcomeFlow(container) {
    this.renderStep1Credentials(container);
  }
};

window.authView = authView;
