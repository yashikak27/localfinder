/**
 * customer.js - Customer Home, Find an Item Wizard (Steps 8A, 8B, 8C, Summary, Responses),
 * Shop Explorer & Shop Details Views
 */

const customerView = {
  // 1. Customer Home Page
  async renderHome(container) {
    container.innerHTML = `
      <!-- Hero Banner -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title" data-i18n="hero_title">${t("hero_title")}</h1>
            <p class="hero-desc" data-i18n="hero_desc">${t("hero_desc")}</p>
            <div class="hero-buttons">
              <button class="btn btn-secondary btn-lg" id="hero-find-btn" data-i18n="btn_find_item_now">
                🔍 ${t("btn_find_item_now")}
              </button>
              <button class="btn btn-outline" style="background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.3);" id="hero-shops-btn" data-i18n="btn_explore_shops">
                🏪 ${t("btn_explore_shops")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div class="container" style="margin-bottom: 3rem;">
        <!-- Featured Categories (Section 6) -->
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--dark);" data-i18n="featured_categories">${t("featured_categories")}</h2>
          <p style="color: var(--text-muted);" data-i18n="featured_categories_sub">${t("featured_categories_sub")}</p>
        </div>

        <div class="grid-categories">
          <!-- 1. Clothes -->
          <div class="cat-card" data-category="Clothes">
            <div class="cat-image-wrapper">
              <img class="cat-image" src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=60" alt="Clothes" />
            </div>
            <div class="cat-body">
              <h3 class="cat-title" data-i18n="cat_clothes">${t("cat_clothes")}</h3>
              <p class="cat-desc" data-i18n="cat_clothes_desc">${t("cat_clothes_desc")}</p>
              <button class="btn btn-outline-primary btn-block" data-i18n="explore_category">${t("explore_category")}</button>
            </div>
          </div>

          <!-- 2. Skincare -->
          <div class="cat-card" data-category="Skincare">
            <div class="cat-image-wrapper">
              <img class="cat-image" src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=60" alt="Skincare" />
            </div>
            <div class="cat-body">
              <h3 class="cat-title" data-i18n="cat_skincare">${t("cat_skincare")}</h3>
              <p class="cat-desc" data-i18n="cat_skincare_desc">${t("cat_skincare_desc")}</p>
              <button class="btn btn-outline-primary btn-block" data-i18n="explore_category">${t("explore_category")}</button>
            </div>
          </div>

          <!-- 3. Beauty / Makeup -->
          <div class="cat-card" data-category="Beauty / Makeup">
            <div class="cat-image-wrapper">
              <img class="cat-image" src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=60" alt="Beauty / Makeup" />
            </div>
            <div class="cat-body">
              <h3 class="cat-title" data-i18n="cat_beauty">${t("cat_beauty")}</h3>
              <p class="cat-desc" data-i18n="cat_beauty_desc">${t("cat_beauty_desc")}</p>
              <button class="btn btn-outline-primary btn-block" data-i18n="explore_category">${t("explore_category")}</button>
            </div>
          </div>

          <!-- 4. Shoes -->
          <div class="cat-card" data-category="Shoes">
            <div class="cat-image-wrapper">
              <img class="cat-image" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60" alt="Shoes" />
            </div>
            <div class="cat-body">
              <h3 class="cat-title" data-i18n="cat_shoes">${t("cat_shoes")}</h3>
              <p class="cat-desc" data-i18n="cat_shoes_desc">${t("cat_shoes_desc")}</p>
              <button class="btn btn-outline-primary btn-block" data-i18n="explore_category">${t("explore_category")}</button>
            </div>
          </div>
        </div>

        <!-- How It Works Flow -->
        <div style="margin-top: 4rem; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-xl); padding: 2.5rem 2rem;">
          <h2 style="text-align: center; font-size: 1.6rem; font-weight: 800; margin-bottom: 2rem;" data-i18n="how_it_works">${t("how_it_works")}</h2>
          <div class="grid-3">
            <div style="text-align: center; padding: 1rem;">
              <div style="width: 56px; height: 56px; background: var(--primary-light); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin: 0 auto 1rem;">📸</div>
              <h4 style="font-weight: 700; margin-bottom: 0.5rem;" data-i18n="step1_title">${t("step1_title")}</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted);" data-i18n="step1_desc">${t("step1_desc")}</p>
            </div>

            <div style="text-align: center; padding: 1rem;">
              <div style="width: 56px; height: 56px; background: var(--secondary-light); color: var(--secondary-hover); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin: 0 auto 1rem;">🏪</div>
              <h4 style="font-weight: 700; margin-bottom: 0.5rem;" data-i18n="step2_title">${t("step2_title")}</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted);" data-i18n="step2_desc">${t("step2_desc")}</p>
            </div>

            <div style="text-align: center; padding: 1rem;">
              <div style="width: 56px; height: 56px; background: #dbeafe; color: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin: 0 auto 1rem;">🛵</div>
              <h4 style="font-weight: 700; margin-bottom: 0.5rem;" data-i18n="step3_title">${t("step3_title")}</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted);" data-i18n="step3_desc">${t("step3_desc")}</p>
            </div>
          </div>
        </div>

        <!-- Featured Nearby Shops Preview -->
        <div style="margin-top: 4rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <div>
              <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--dark);">Shops in Yamunanagar & Jagadhri</h2>
              <p style="font-size: 0.9rem; color: var(--text-muted);">Verified local merchants ready to assist</p>
            </div>
            <button class="btn btn-outline" id="btn-view-all-shops">View All Shops →</button>
          </div>
          <div id="home-shops-grid" class="grid-4">
            <p>${t("loading")}</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById("hero-find-btn").addEventListener("click", () => {
      appState.resetWizard();
      appState.navigate("find-item");
    });
    document.getElementById("hero-shops-btn").addEventListener("click", () => appState.navigate("shops"));
    document.getElementById("btn-view-all-shops").addEventListener("click", () => appState.navigate("shops"));

    container.querySelectorAll(".cat-card").forEach(card => {
      card.addEventListener("click", () => {
        const cat = card.dataset.category;
        appState.resetWizard();
        appState.wizard.selected_category = cat;
        appState.navigate("find-item");
      });
    });

    // Load initial sample shops
    try {
      const res = await api.getShops({ city: "Yamunanagar" });
      const grid = document.getElementById("home-shops-grid");
      if (res.shops && res.shops.length > 0) {
        grid.innerHTML = res.shops.slice(0, 4).map(s => `
          <div class="shop-card">
            <img class="shop-img" src="${s.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'}" alt="${s.name}" />
            <div class="shop-card-body">
              <div class="shop-header">
                <h4 class="shop-name">${s.name}</h4>
                <span class="shop-badge">${s.category}</span>
              </div>
              <p class="shop-address">📍 ${s.area}, ${s.city}</p>
              <div class="shop-footer">
                <span style="font-size: 0.85rem; font-weight: 600; color: var(--secondary);">★ ${s.avg_rating}</span>
                <button class="btn btn-sm btn-outline-primary btn-goto-shop" data-id="${s.id}">View Store</button>
              </div>
            </div>
          </div>
        `).join("");

        grid.querySelectorAll(".btn-goto-shop").forEach(btn => {
          btn.addEventListener("click", () => {
            appState.navigate("shop-detail", { shop_id: btn.dataset.id });
          });
        });
      }
    } catch (e) {
      console.error(e);
    }
  },

  // 2. Main Feature - "Find an Item" Wizard
  async renderFindItemWizard(container) {
    const w = appState.wizard;

    container.innerHTML = `
      <div class="container" style="max-width: 860px; margin: 2rem auto;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <h1 style="font-size: 2rem; font-weight: 800; color: var(--dark);" data-i18n="find_item_title">${t("find_item_title")}</h1>
          <p style="color: var(--text-muted);" data-i18n="find_item_sub">${t("find_item_sub")}</p>
        </div>

        <!-- Stepper (Steps 1 to 5) -->
        <div class="stepper-container">
          <div class="stepper">
            <div class="step-item ${w.step === 1 ? 'active' : ''} ${w.step > 1 ? 'completed' : ''}">
              <div class="step-circle">${w.step > 1 ? '✓' : '1'}</div>
              <div class="step-label" data-i18n="wizard_step_pref">${t("wizard_step_pref")}</div>
            </div>
            <div class="step-item ${w.step === 2 ? 'active' : ''} ${w.step > 2 ? 'completed' : ''}">
              <div class="step-circle">${w.step > 2 ? '✓' : '2'}</div>
              <div class="step-label" data-i18n="wizard_step_area">${t("wizard_step_area")}</div>
            </div>
            <div class="step-item ${w.step === 3 ? 'active' : ''} ${w.step > 3 ? 'completed' : ''}">
              <div class="step-circle">${w.step > 3 ? '✓' : '3'}</div>
              <div class="step-label" data-i18n="wizard_step_needs">${t("wizard_step_needs")}</div>
            </div>
            <div class="step-item ${w.step === 4 ? 'active' : ''} ${w.step > 4 ? 'completed' : ''}">
              <div class="step-circle">${w.step > 4 ? '✓' : '4'}</div>
              <div class="step-label" data-i18n="wizard_step_summary">${t("wizard_step_summary")}</div>
            </div>
            <div class="step-item ${w.step === 5 ? 'active' : ''}">
              <div class="step-circle">5</div>
              <div class="step-label" data-i18n="wizard_step_responses">${t("wizard_step_responses")}</div>
            </div>
          </div>
        </div>

        <!-- Step Dynamic Container -->
        <div id="wizard-step-content"></div>
      </div>
    `;

    const stepContent = document.getElementById("wizard-step-content");
    if (w.step === 1) this.renderWizardStep1(stepContent);
    else if (w.step === 2) this.renderWizardStep2(stepContent);
    else if (w.step === 3) this.renderWizardStep3(stepContent);
    else if (w.step === 4) this.renderWizardStep4(stepContent);
    else if (w.step === 5) this.renderWizardStep5(stepContent);
  },

  // Step 8A: Shop Preference
  renderWizardStep1(container) {
    const w = appState.wizard;
    container.innerHTML = `
      <div class="card">
        <h3 class="card-title" style="margin-bottom: 1.25rem;" data-i18n="pref_question">${t("pref_question")}</h3>
        
        <div class="choice-grid">
          <!-- Option 1: Select Specific Shop -->
          <div class="choice-card ${w.shop_preference === 'specific' ? 'selected' : ''}" id="choice-pref-specific">
            <div class="choice-indicator"></div>
            <div class="choice-icon">🏪</div>
            <h4 class="choice-title" data-i18n="opt_specific_shop">${t("opt_specific_shop")}</h4>
            <p class="choice-desc" data-i18n="opt_specific_shop_desc">${t("opt_specific_shop_desc")}</p>
          </div>

          <!-- Option 2: Find Relevant Nearby Shops -->
          <div class="choice-card ${w.shop_preference === 'nearby' ? 'selected' : ''}" id="choice-pref-nearby">
            <div class="choice-indicator"></div>
            <div class="choice-icon">🔍</div>
            <h4 class="choice-title" data-i18n="opt_nearby_shops">${t("opt_nearby_shops")}</h4>
            <p class="choice-desc" data-i18n="opt_nearby_shops_desc">${t("opt_nearby_shops_desc")}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
          <button class="btn btn-primary btn-lg" id="btn-step1-next" data-i18n="btn_next">
            ${t("btn_next")} →
          </button>
        </div>
      </div>
    `;

    document.getElementById("choice-pref-specific").addEventListener("click", () => {
      w.shop_preference = "specific";
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });

    document.getElementById("choice-pref-nearby").addEventListener("click", () => {
      w.shop_preference = "nearby";
      w.selected_shop = null; // Broadcast to nearby matching
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });

    document.getElementById("btn-step1-next").addEventListener("click", () => {
      w.step = 2;
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });
  },

  // Step 8B: Select Area & Available Shops
  async renderWizardStep2(container) {
    const w = appState.wizard;
    container.innerHTML = `
      <div class="card">
        <h3 class="card-title" data-i18n="area_title">${t("area_title")}</h3>
        <p class="card-subtitle" data-i18n="area_sub">${t("area_sub")}</p>

        <div class="form-row" style="margin-bottom: 1.5rem;">
          <div class="form-group">
            <label class="form-label" data-i18n="select_state">${t("select_state")}</label>
            <select id="wizard-state" class="form-control">
              <option value="Haryana" selected>Haryana (हरियाणा)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="select_city">${t("select_city")}</label>
            <select id="wizard-city" class="form-control">
              <option value="Yamunanagar" selected>Yamunanagar (यमुनानगर)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="select_locality">${t("select_locality")}</label>
            <select id="wizard-area" class="form-control">
              <option value="Jagadhri" ${w.area === 'Jagadhri' ? 'selected' : ''}>Jagadhri (जगाधरी)</option>
              <option value="Model Town" ${w.area === 'Model Town' ? 'selected' : ''}>Model Town (मॉडल टाउन)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="select_pincode">${t("select_pincode")}</label>
            <input type="text" id="wizard-pincode" class="form-control" value="${w.pincode || '135003'}" />
          </div>
        </div>

        <!-- Shops List based on preference -->
        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;" data-i18n="available_shops_in_area">${t("available_shops_in_area")}</h4>
        <div id="step2-shops-container" class="grid-2" style="margin-bottom: 1.5rem;">
          <p>${t("loading")}</p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
          <button class="btn btn-outline" id="btn-step2-back" data-i18n="btn_back">← ${t("btn_back")}</button>
          <button class="btn btn-primary btn-lg" id="btn-step2-next" ${w.shop_preference === 'specific' && !w.selected_shop ? 'disabled' : ''} data-i18n="btn_next">
            ${t("btn_next")} →
          </button>
        </div>
      </div>
    `;

    // Load shops for selected area
    const loadShops = async () => {
      const selectedArea = document.getElementById("wizard-area").value;
      const shopsDiv = document.getElementById("step2-shops-container");
      try {
        const res = await api.getShops({ area: selectedArea });
        if (res.shops && res.shops.length > 0) {
          shopsDiv.innerHTML = res.shops.map(s => {
            const isSelected = w.selected_shop && w.selected_shop.id === s.id;
            return `
              <div class="card ${isSelected ? 'selected' : ''}" style="padding: 1rem; border: 2px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}; background: ${isSelected ? '#f0fdf4' : '#fff'};">
                <div style="display: flex; gap: 0.8rem;">
                  <img src="${s.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200'}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-md);" />
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                      <h4 style="font-weight: 700; font-size: 1rem;">${s.name}</h4>
                      <span class="shop-badge">${s.category}</span>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.2rem 0;">📍 ${s.address}</p>
                    <div style="margin-top: 0.5rem;">
                      ${w.shop_preference === 'specific' ? `
                        <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-primary'} btn-pick-shop" data-id="${s.id}" data-name="${s.name}" data-category="${s.category}" data-address="${s.address}">
                          ${isSelected ? '✓ Selected' : t("btn_select_this_shop")}
                        </button>
                      ` : `
                        <span style="font-size: 0.8rem; color: var(--primary); font-weight: 600;">✓ Relevant in Area</span>
                      `}
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join("");

          shopsDiv.querySelectorAll(".btn-pick-shop").forEach(btn => {
            btn.addEventListener("click", () => {
              w.selected_shop = {
                id: parseInt(btn.dataset.id),
                name: btn.dataset.name,
                category: btn.dataset.category,
                address: btn.dataset.address
              };
              w.selected_category = btn.dataset.category;
              document.getElementById("btn-step2-next").disabled = false;
              loadShops();
            });
          });
        } else {
          shopsDiv.innerHTML = `<p style="color: var(--text-muted);">${t("no_data")}</p>`;
        }
      } catch (err) {
        shopsDiv.innerHTML = `<p style="color: var(--danger);">${err.message}</p>`;
      }
    };

    document.getElementById("wizard-area").addEventListener("change", (e) => {
      w.area = e.target.value;
      loadShops();
    });

    document.getElementById("btn-step2-back").addEventListener("click", () => {
      w.step = 1;
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });

    document.getElementById("btn-step2-next").addEventListener("click", () => {
      w.area = document.getElementById("wizard-area").value;
      w.pincode = document.getElementById("wizard-pincode").value;
      w.step = 3;
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });

    loadShops();
  },

  // Step 8C: Tell Us What You Need (Image vs Manual with Category-Adaptive fields)
  renderWizardStep3(container) {
    const w = appState.wizard;
    container.innerHTML = `
      <div class="card">
        <h3 class="card-title" data-i18n="needs_title">${t("needs_title")}</h3>
        <p class="card-subtitle" data-i18n="needs_sub">${t("needs_sub")}</p>

        <!-- Category Selector -->
        <div class="form-group" style="margin-bottom: 1.5rem;">
          <label class="form-label" data-i18n="select_item_cat">${t("select_item_cat")}</label>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" class="btn ${w.selected_category === 'Clothes' ? 'btn-primary' : 'btn-outline'} btn-cat-pick" data-cat="Clothes" data-i18n="cat_clothes">${t("cat_clothes")}</button>
            <button type="button" class="btn ${w.selected_category === 'Skincare' ? 'btn-primary' : 'btn-outline'} btn-cat-pick" data-cat="Skincare" data-i18n="cat_skincare">${t("cat_skincare")}</button>
            <button type="button" class="btn ${w.selected_category === 'Beauty / Makeup' ? 'btn-primary' : 'btn-outline'} btn-cat-pick" data-cat="Beauty / Makeup" data-i18n="cat_beauty">${t("cat_beauty")}</button>
            <button type="button" class="btn ${w.selected_category === 'Shoes' ? 'btn-primary' : 'btn-outline'} btn-cat-pick" data-cat="Shoes" data-i18n="cat_shoes">${t("cat_shoes")}</button>
          </div>
        </div>

        <!-- Mode Toggle: Image vs Manual -->
        <div class="choice-grid" style="margin-bottom: 1.5rem;">
          <div class="choice-card ${w.request_mode === 'image' ? 'selected' : ''}" id="mode-image-card">
            <div class="choice-indicator"></div>
            <div class="choice-icon">📷</div>
            <h4 class="choice-title" data-i18n="opt_upload_img">${t("opt_upload_img")}</h4>
            <p class="choice-desc" data-i18n="opt_upload_img_desc">${t("opt_upload_img_desc")}</p>
          </div>

          <div class="choice-card ${w.request_mode === 'manual' ? 'selected' : ''}" id="mode-manual-card">
            <div class="choice-indicator"></div>
            <div class="choice-icon">✍️</div>
            <h4 class="choice-title" data-i18n="opt_enter_manual">${t("opt_enter_manual")}</h4>
            <p class="choice-desc" data-i18n="opt_enter_manual_desc">${t("opt_enter_manual_desc")}</p>
          </div>
        </div>

        <!-- Dynamic Form Fields Area -->
        <div id="step3-form-container"></div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1.25rem; margin-top: 1.5rem;">
          <button class="btn btn-outline" id="btn-step3-back" data-i18n="btn_back">← ${t("btn_back")}</button>
          <button class="btn btn-primary btn-lg" id="btn-step3-next" data-i18n="btn_next">${t("btn_next")} →</button>
        </div>
      </div>
    `;

    container.querySelectorAll(".btn-cat-pick").forEach(btn => {
      btn.addEventListener("click", () => {
        w.selected_category = btn.dataset.cat;
        customerView.renderFindItemWizard(document.getElementById("app-root"));
      });
    });

    document.getElementById("mode-image-card").addEventListener("click", () => {
      w.request_mode = "image";
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });

    document.getElementById("mode-manual-card").addEventListener("click", () => {
      w.request_mode = "manual";
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });

    document.getElementById("btn-step3-back").addEventListener("click", () => {
      w.step = 2;
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });

    document.getElementById("btn-step3-next").addEventListener("click", () => {
      customerView.saveStep3Data();
      w.step = 4;
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });

    // Render Sub-Form according to Mode and Category
    this.renderStep3Form(document.getElementById("step3-form-container"));
  },

  renderStep3Form(container) {
    const w = appState.wizard;
    const cat = w.selected_category;

    if (w.request_mode === "image") {
      // Option 1: Image Upload + Optional refinement specs
      container.innerHTML = `
        <div style="background: var(--bg-subtle); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
          <div class="image-dropzone" id="img-dropzone">
            <input type="file" id="img-file-input" accept="image/*" style="display: none;" />
            ${w.image_data ? `
              <div class="image-preview-container">
                <img class="image-preview" src="${w.image_data}" alt="Item Preview" />
                <div style="display: flex; gap: 0.5rem;">
                  <button type="button" class="btn btn-sm btn-outline" id="btn-replace-img" data-i18n="change_photo">${t("change_photo")}</button>
                  <button type="button" class="btn btn-sm btn-danger" id="btn-remove-img" data-i18n="remove_photo">${t("remove_photo")}</button>
                </div>
              </div>
            ` : `
              <div class="dropzone-icon">📷</div>
              <h4 style="font-weight: 700; margin-bottom: 0.3rem;" data-i18n="click_to_upload">${t("click_to_upload")}</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted);" data-i18n="supported_formats">${t("supported_formats")}</p>
            `}
          </div>

          <div style="margin-top: 1.5rem;">
            <h4 style="font-weight: 700; margin-bottom: 1rem;">Refine Requirements (Optional)</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" data-i18n="field_color">${t("field_color")}</label>
                <select id="req-color" class="form-control">
                  <option value="Same as image" data-i18n="color_same_as_img">${t("color_same_as_img")}</option>
                  <option value="Any color" data-i18n="color_any">${t("color_any")}</option>
                  <option value="Specific color" data-i18n="color_specific">${t("color_specific")}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" data-i18n="field_brand">${t("field_brand")}</label>
                <select id="req-brand" class="form-control">
                  <option value="Any brand" data-i18n="brand_any">${t("brand_any")}</option>
                  <option value="Specific brand" data-i18n="brand_specific">${t("brand_specific")}</option>
                </select>
              </div>

              ${cat !== 'Skincare' ? `
                <div class="form-group">
                  <label class="form-label" data-i18n="field_size">${t("field_size")}</label>
                  <select id="req-size" class="form-control">
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L" selected>L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="Not applicable" data-i18n="size_na">${t("size_na")}</option>
                  </select>
                </div>
              ` : ''}
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="field_additional">${t("field_additional")}</label>
              <textarea id="req-desc" class="form-control" rows="3" data-i18n-placeholder="field_additional_placeholder" placeholder="${t("field_additional_placeholder")}">${w.form_data.description || ''}</textarea>
            </div>
          </div>
        </div>
      `;

      const fileInput = document.getElementById("img-file-input");
      const dropzone = document.getElementById("img-dropzone");
      if (dropzone && !w.image_data) {
        dropzone.addEventListener("click", () => fileInput.click());
      }
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            w.image_data = ev.target.result;
            customerView.renderFindItemWizard(document.getElementById("app-root"));
          };
          reader.readAsDataURL(file);
        }
      });

      const btnReplace = document.getElementById("btn-replace-img");
      if (btnReplace) btnReplace.addEventListener("click", () => fileInput.click());

      const btnRemove = document.getElementById("btn-remove-img");
      if (btnRemove) {
        btnRemove.addEventListener("click", (e) => {
          e.stopPropagation();
          w.image_data = null;
          customerView.renderFindItemWizard(document.getElementById("app-root"));
        });
      }
    } else {
      // Option 2: Enter Details Manually - Dynamic by Category
      if (cat === "Clothes") {
        container.innerHTML = `
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="field_clothing_type">${t("field_clothing_type")}</label>
              <select id="req-clothing-type" class="form-control">
                <option value="Upper / Top" data-i18n="field_upper">${t("field_upper")}</option>
                <option value="Bottom" data-i18n="field_bottom">${t("field_bottom")}</option>
                <option value="Dress" data-i18n="field_dress">${t("field_dress")}</option>
                <option value="Other" data-i18n="field_other">${t("field_other")}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="field_item_name">${t("field_item_name")} *</label>
              <input type="text" id="req-clothing-item" class="form-control" data-i18n-placeholder="field_item_name_placeholder" placeholder="${t("field_item_name_placeholder")}" value="${w.form_data.clothing_item || ''}" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="field_brand">${t("field_brand")}</label>
              <input type="text" id="req-brand" class="form-control" placeholder="e.g. Levi's, Raymond, Any" value="${w.form_data.brand_pref || 'Any brand'}" />
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="field_sleeves">${t("field_sleeves")}</label>
              <select id="req-sleeves" class="form-control">
                <option value="Full" data-i18n="sleeves_full">${t("sleeves_full")}</option>
                <option value="Half" data-i18n="sleeves_half">${t("sleeves_half")}</option>
                <option value="Sleeveless" data-i18n="sleeves_sleeveless">${t("sleeves_sleeveless")}</option>
                <option value="Not Applicable" data-i18n="sleeves_na">${t("sleeves_na")}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="field_color">${t("field_color")}</label>
              <input type="text" id="req-color" class="form-control" data-i18n-placeholder="color_placeholder" placeholder="${t("color_placeholder")}" value="${w.form_data.specific_color || 'Navy Blue'}" />
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="field_size">${t("field_size")}</label>
              <select id="req-size" class="form-control">
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L" selected>L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="field_additional">${t("field_additional")}</label>
            <textarea id="req-desc" class="form-control" rows="3" data-i18n-placeholder="field_additional_placeholder" placeholder="${t("field_additional_placeholder")}">${w.form_data.description || ''}</textarea>
          </div>
        `;
      } else if (cat === "Skincare") {
        container.innerHTML = `
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="field_skin_product_type">${t("field_skin_product_type")} *</label>
              <input type="text" id="req-skin-type" class="form-control" data-i18n-placeholder="skin_type_placeholder" placeholder="${t("skin_type_placeholder")}" value="${w.form_data.skin_product_type || 'Vitamin C Serum'}" required />
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="field_brand">${t("field_brand")}</label>
              <input type="text" id="req-brand" class="form-control" placeholder="e.g. Minimalist, DermaCo, Any" value="${w.form_data.brand_pref || 'Any brand'}" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="field_skin_concern">${t("field_skin_concern")}</label>
              <input type="text" id="req-skin-concern" class="form-control" data-i18n-placeholder="skin_concern_placeholder" placeholder="${t("skin_concern_placeholder")}" value="${w.form_data.skin_concern || ''}" />
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="field_budget">${t("field_budget")}</label>
              <input type="number" id="req-budget" class="form-control" data-i18n-placeholder="budget_placeholder" placeholder="${t("budget_placeholder")}" value="${w.form_data.budget || ''}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="field_additional">${t("field_additional")}</label>
            <textarea id="req-desc" class="form-control" rows="3" data-i18n-placeholder="field_additional_placeholder" placeholder="${t("field_additional_placeholder")}">${w.form_data.description || ''}</textarea>
          </div>
        `;
      } else if (cat === "Beauty / Makeup") {
        container.innerHTML = `
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Beauty / Makeup Product *</label>
              <input type="text" id="req-beauty-type" class="form-control" placeholder="e.g. Matte Lipstick, Foundation, Waterproof Eyeliner" value="${w.form_data.beauty_product_type || 'Matte Lipstick'}" required />
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="field_brand">${t("field_brand")}</label>
              <input type="text" id="req-brand" class="form-control" placeholder="e.g. Maybelline, Lakmé, Sugar, Any" value="${w.form_data.brand_pref || 'Any brand'}" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Shade / Color Preference</label>
              <input type="text" id="req-color" class="form-control" placeholder="e.g. Nude Pink, Ruby Red, Warm Honey" value="${w.form_data.specific_color || ''}" />
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="field_budget">${t("field_budget")}</label>
              <input type="number" id="req-budget" class="form-control" data-i18n-placeholder="budget_placeholder" placeholder="${t("budget_placeholder")}" value="${w.form_data.budget || ''}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="field_additional">${t("field_additional")}</label>
            <textarea id="req-desc" class="form-control" rows="3" data-i18n-placeholder="field_additional_placeholder" placeholder="${t("field_additional_placeholder")}">${w.form_data.description || ''}</textarea>
          </div>
        `;
      } else {
        // Shoes
        container.innerHTML = `
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="field_shoe_type">${t("field_shoe_type")} *</label>
              <input type="text" id="req-shoe-type" class="form-control" data-i18n-placeholder="shoe_type_placeholder" placeholder="${t("shoe_type_placeholder")}" value="${w.form_data.shoe_type || 'Running Shoes'}" required />
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="field_brand">${t("field_brand")}</label>
              <input type="text" id="req-brand" class="form-control" placeholder="e.g. Nike, Sparx, Campus, Any" value="${w.form_data.brand_pref || 'Any brand'}" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" data-i18n="field_color">${t("field_color")}</label>
              <input type="text" id="req-color" class="form-control" data-i18n-placeholder="color_placeholder" placeholder="${t("color_placeholder")}" value="${w.form_data.specific_color || 'Black'}" />
            </div>

            <div class="form-group">
              <label class="form-label" data-i18n="field_size">${t("field_size")}</label>
              <select id="req-size" class="form-control">
                <option value="6">UK 6</option>
                <option value="7">UK 7</option>
                <option value="8" selected>UK 8</option>
                <option value="9">UK 9</option>
                <option value="10">UK 10</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="field_additional">${t("field_additional")}</label>
            <textarea id="req-desc" class="form-control" rows="3" data-i18n-placeholder="field_additional_placeholder" placeholder="${t("field_additional_placeholder")}">${w.form_data.description || ''}</textarea>
          </div>
        `;
      }
    }
  },

  saveStep3Data() {
    const w = appState.wizard;
    const cat = w.selected_category;

    if (w.request_mode === "image") {
      w.form_data.color_pref = document.getElementById("req-color") ? document.getElementById("req-color").value : "Any color";
      w.form_data.brand_pref = document.getElementById("req-brand") ? document.getElementById("req-brand").value : "Any brand";
      w.form_data.size_pref = document.getElementById("req-size") ? document.getElementById("req-size").value : "L";
      w.form_data.description = document.getElementById("req-desc") ? document.getElementById("req-desc").value : "";
    } else {
      if (cat === "Clothes") {
        w.form_data.clothing_type = document.getElementById("req-clothing-type").value;
        w.form_data.clothing_item = document.getElementById("req-clothing-item").value;
        w.form_data.brand_pref = document.getElementById("req-brand").value;
        w.form_data.sleeves = document.getElementById("req-sleeves").value;
        w.form_data.specific_color = document.getElementById("req-color").value;
        w.form_data.size_pref = document.getElementById("req-size").value;
        w.form_data.description = document.getElementById("req-desc").value;
      } else if (cat === "Skincare") {
        w.form_data.skin_product_type = document.getElementById("req-skin-type").value;
        w.form_data.brand_pref = document.getElementById("req-brand").value;
        w.form_data.skin_concern = document.getElementById("req-skin-concern").value;
        w.form_data.budget = document.getElementById("req-budget").value;
        w.form_data.description = document.getElementById("req-desc").value;
      } else if (cat === "Beauty / Makeup") {
        w.form_data.beauty_product_type = document.getElementById("req-beauty-type") ? document.getElementById("req-beauty-type").value : "";
        w.form_data.brand_pref = document.getElementById("req-brand") ? document.getElementById("req-brand").value : "";
        w.form_data.specific_color = document.getElementById("req-color") ? document.getElementById("req-color").value : "";
        w.form_data.budget = document.getElementById("req-budget") ? document.getElementById("req-budget").value : "";
        w.form_data.description = document.getElementById("req-desc") ? document.getElementById("req-desc").value : "";
      } else {
        w.form_data.shoe_type = document.getElementById("req-shoe-type").value;
        w.form_data.brand_pref = document.getElementById("req-brand").value;
        w.form_data.specific_color = document.getElementById("req-color").value;
        w.form_data.size_pref = document.getElementById("req-size").value;
        w.form_data.description = document.getElementById("req-desc").value;
      }
    }
  },

  // Step 10: Summary & Submit Request
  renderWizardStep4(container) {
    const w = appState.wizard;
    const cat = w.selected_category;

    container.innerHTML = `
      <div class="card">
        <h3 class="card-title" data-i18n="summary_title">${t("summary_title")}</h3>
        <p class="card-subtitle" data-i18n="summary_sub">${t("summary_sub")}</p>

        <div style="background: var(--bg-subtle); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
            <tr style="border-bottom: 1px solid var(--border-color); height: 40px;">
              <td style="width: 35%; font-weight: 600; color: var(--text-muted);" data-i18n="summary_category">${t("summary_category")}</td>
              <td><strong>${cat}</strong></td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color); height: 40px;">
              <td style="font-weight: 600; color: var(--text-muted);" data-i18n="summary_pref">${t("summary_pref")}</td>
              <td>${w.shop_preference === 'specific' ? t("opt_specific_shop") : t("opt_nearby_shops")}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color); height: 40px;">
              <td style="font-weight: 600; color: var(--text-muted);" data-i18n="summary_target_shop">${t("summary_target_shop")}</td>
              <td>${w.selected_shop ? `<strong>${w.selected_shop.name}</strong> (${w.selected_shop.address})` : 'Broadcasting to relevant shops in area'}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color); height: 40px;">
              <td style="font-weight: 600; color: var(--text-muted);" data-i18n="summary_area">${t("summary_area")}</td>
              <td>${w.area}, ${w.city}, ${w.state} (${w.pincode})</td>
            </tr>
            ${w.image_data ? `
              <tr style="border-bottom: 1px solid var(--border-color); height: 90px;">
                <td style="font-weight: 600; color: var(--text-muted);" data-i18n="summary_uploaded_image">${t("summary_uploaded_image")}</td>
                <td><img src="${w.image_data}" style="width: 70px; height: 70px; object-fit: cover; border-radius: var(--radius-md);" /></td>
              </tr>
            ` : `
              <tr style="border-bottom: 1px solid var(--border-color); height: 40px;">
                <td style="font-weight: 600; color: var(--text-muted);">Item Requested</td>
                <td><strong>${w.form_data.clothing_item || w.form_data.skin_product_type || w.form_data.beauty_product_type || w.form_data.shoe_type || 'Item details entered'}</strong></td>
              </tr>
            `}
            <tr style="border-bottom: 1px solid var(--border-color); height: 40px;">
              <td style="font-weight: 600; color: var(--text-muted);" data-i18n="summary_color">${t("summary_color")}</td>
              <td>${w.form_data.specific_color || w.form_data.color_pref || 'Any'}</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-color); height: 40px;">
              <td style="font-weight: 600; color: var(--text-muted);" data-i18n="summary_size">${t("summary_size")}</td>
              <td>${w.form_data.size_pref || 'N/A'}</td>
            </tr>
            ${w.form_data.description ? `
              <tr style="height: 40px;">
                <td style="font-weight: 600; color: var(--text-muted);" data-i18n="summary_notes">${t("summary_notes")}</td>
                <td>${w.form_data.description}</td>
              </tr>
            ` : ''}
          </table>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
          <button class="btn btn-outline" id="btn-step4-back" data-i18n="btn_edit_request">✏️ ${t("btn_edit_request")}</button>
          <button class="btn btn-primary btn-lg" id="btn-step4-submit" data-i18n="btn_submit_request">🚀 ${t("btn_submit_request")}</button>
        </div>
      </div>
    `;

    document.getElementById("btn-step4-back").addEventListener("click", () => {
      w.step = 3;
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });

    document.getElementById("btn-step4-submit").addEventListener("click", async () => {
      if (!appState.currentUser) {
        window.showToast("Authentication Required", "Please log in or sign up to submit your request to local shops.", "info");
        appState.navigate("login");
        return;
      }

      const payload = {
        customer_id: appState.currentUser.id,
        shop_preference: w.shop_preference,
        selected_shop_id: w.selected_shop ? w.selected_shop.id : null,
        state: w.state,
        city: w.city,
        area: w.area,
        pincode: w.pincode,
        category: w.selected_category,
        request_mode: w.request_mode,
        image_data: w.image_data,
        color_pref: w.form_data.specific_color || w.form_data.color_pref,
        brand_pref: w.form_data.brand_pref,
        size_pref: w.form_data.size_pref,
        clothing_type: w.form_data.clothing_type,
        sleeves: w.form_data.sleeves,
        skincare_concern: w.form_data.skin_concern,
        budget: w.form_data.budget ? parseFloat(w.form_data.budget) : null,
        shoe_type: w.form_data.shoe_type,
        description: w.form_data.description || w.form_data.clothing_item || w.form_data.beauty_product_type || w.form_data.skin_product_type || w.form_data.shoe_type || ""
      };

      try {
        const res = await api.createRequest(payload);
        w.submitted_request_id = res.request_id;
        window.showToast(t("success"), res.message, "success");
        w.step = 5;
        customerView.renderFindItemWizard(document.getElementById("app-root"));
      } catch (err) {
        window.showToast(t("error"), err.message, "error");
      }
    });
  },

  // Step 11 & 12: Shopkeeper Responses & Suggestions
  async renderWizardStep5(container) {
    const w = appState.wizard;
    const reqId = w.submitted_request_id || 1; // Fallback to demo request #1

    container.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
          <div>
            <h3 class="card-title" data-i18n="responses_title">${t("responses_title")}</h3>
            <p class="card-subtitle" data-i18n="responses_sub">${t("responses_sub")}</p>
          </div>
          <button class="btn btn-sm btn-outline" id="btn-refresh-responses">🔄 Refresh</button>
        </div>

        <div id="responses-list-container">
          <p>${t("loading")}</p>
        </div>

        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <button class="btn btn-outline" id="btn-find-other-shops" data-i18n="btn_find_from_other_shops">
            🔍 ${t("btn_find_from_other_shops")}
          </button>
          <button class="btn btn-outline" id="btn-goto-my-orders">
            📦 View in My Orders
          </button>
        </div>
      </div>
    `;

    const loadResponses = async () => {
      const respDiv = document.getElementById("responses-list-container");
      try {
        const res = await api.getRequest(reqId);
        const req = res.request;
        if (req && req.responses && req.responses.length > 0) {
          respDiv.innerHTML = `
            <div style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-muted);">
              Request Status: <strong style="color: var(--primary);">${req.status}</strong>
            </div>
            <div class="grid-2">
              ${req.responses.map(resp => `
                <div class="card" style="border: 2px solid ${resp.status === 'selected' ? 'var(--primary)' : 'var(--border-color)'};">
                  <img src="${resp.image_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'}" style="width: 100%; height: 180px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 0.75rem;" />
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem;">
                    <h4 style="font-weight: 700; font-size: 1.1rem;">${resp.product_name}</h4>
                    <span style="font-size: 1.25rem; font-weight: 800; color: var(--dark);">₹${resp.price}</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-bottom: 0.4rem;">🏪 ${resp.shop_name}</p>
                  <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.6rem;">${resp.description || ''}</p>
                  ${resp.note ? `<p style="font-size: 0.8rem; background: #fffbeb; padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); color: #92400e; margin-bottom: 0.8rem;">💬 "${resp.note}"</p>` : ''}
                  
                  <div style="display: flex; gap: 0.5rem; margin-top: auto;">
                    ${resp.status === 'selected' ? `
                      <button class="btn btn-primary btn-block" disabled>✓ Product Selected</button>
                    ` : `
                      <button class="btn btn-primary btn-block btn-select-suggestion" data-id="${resp.id}" data-name="${resp.product_name}" data-price="${resp.price}" data-shop-id="${resp.shop_id}" data-shop-name="${resp.shop_name}" data-img="${resp.image_url}" data-i18n="btn_select_product">
                        ${t("btn_select_product")}
                      </button>
                      <button class="btn btn-outline btn-reject-suggestion" data-id="${resp.id}" data-i18n="btn_reject_product">
                        ${t("btn_reject_product")}
                      </button>
                    `}
                  </div>
                </div>
              `).join("")}
            </div>
          `;

          respDiv.querySelectorAll(".btn-select-suggestion").forEach(btn => {
            btn.addEventListener("click", async () => {
              const respId = btn.dataset.id;
              try {
                await api.selectRequestResponse(reqId, { response_id: respId, action: "select" });
                window.showToast(t("success"), "Product selected! Proceeding to confirmation.", "success");
                
                // Store in state for Step 13 / fulfillment
                appState.selectedProductForOrder = {
                  product_id: null,
                  product_name: btn.dataset.name,
                  price: parseFloat(btn.dataset.price),
                  shop_id: parseInt(btn.dataset.shopId),
                  shop_name: btn.dataset.shopName,
                  image_url: btn.dataset.img,
                  quantity: 1,
                  size: w.form_data.size_pref || "Standard",
                  color: w.form_data.specific_color || w.form_data.color_pref || "Standard"
                };

                // Open Step 13 Confirmation
                customerView.renderProductConfirmation(document.getElementById("app-root"));
              } catch (err) {
                window.showToast(t("error"), err.message, "error");
              }
            });
          });

          respDiv.querySelectorAll(".btn-reject-suggestion").forEach(btn => {
            btn.addEventListener("click", async () => {
              const respId = btn.dataset.id;
              try {
                await api.selectRequestResponse(reqId, { response_id: respId, action: "reject" });
                window.showToast("Response Rejected", "You can wait for other shops or browse nearby.", "info");
                loadResponses();
              } catch (err) {
                window.showToast(t("error"), err.message, "error");
              }
            });
          });
        } else {
          respDiv.innerHTML = `
            <div style="text-align: center; padding: 2.5rem 1rem; background: var(--bg-subtle); border-radius: var(--radius-lg);">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⏳</div>
              <h4 style="font-weight: 700; margin-bottom: 0.5rem;" data-i18n="no_responses_yet">${t("no_responses_yet")}</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 1.5rem;">
                The shopkeeper has received your request and will upload product photos and prices shortly. You can also switch to shopkeeper view to reply as the merchant!
              </p>
            </div>
          `;
        }
      } catch (err) {
        respDiv.innerHTML = `<p style="color: var(--danger);">${err.message}</p>`;
      }
    };

    document.getElementById("btn-refresh-responses").addEventListener("click", loadResponses);
    document.getElementById("btn-goto-my-orders").addEventListener("click", () => appState.navigate("orders"));
    document.getElementById("btn-find-other-shops").addEventListener("click", () => {
      w.shop_preference = "nearby";
      w.step = 2;
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });

    loadResponses();
  },

  // Step 13: Product Selection and Order Confirmation
  renderProductConfirmation(container) {
    const item = appState.selectedProductForOrder;
    if (!item) {
      appState.navigate("home");
      return;
    }

    container.innerHTML = `
      <div class="container" style="max-width: 640px; margin: 2rem auto;">
        <div class="card">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="width: 50px; height: 50px; background: var(--primary-light); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 0.75rem;">✓</div>
            <h2 class="card-title" data-i18n="confirm_product_title">${t("confirm_product_title")}</h2>
            <p class="card-subtitle" data-i18n="confirm_product_sub">${t("confirm_product_sub")}</p>
          </div>

          <div style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.5rem;">
            <img src="${item.image_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300'}" style="width: 110px; height: 110px; object-fit: cover; border-radius: var(--radius-md);" />
            <div style="flex: 1;">
              <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--dark);">${item.product_name}</h3>
              <p style="font-size: 0.9rem; color: var(--primary); font-weight: 600;">🏪 ${item.shop_name}</p>
              <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-muted); margin: 0.3rem 0;">
                <span>Size: <strong>${item.size}</strong></span>
                <span>Color: <strong>${item.color}</strong></span>
                <span>Qty: <strong>${item.quantity}</strong></span>
              </div>
              <div style="font-size: 1.35rem; font-weight: 800; color: var(--dark); margin-top: 0.4rem;">
                ₹${item.price}
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button class="btn btn-primary btn-lg btn-block" id="btn-confirm-product-choice" data-i18n="btn_confirm_proceed">
              ${t("btn_confirm_proceed")} →
            </button>
            <button class="btn btn-outline btn-block" id="btn-choose-another" data-i18n="btn_choose_another">
              ${t("btn_choose_another")}
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-confirm-product-choice").addEventListener("click", () => {
      // Proceed to Step 14: Fulfillment choice
      appState.navigate("fulfillment");
    });

    document.getElementById("btn-choose-another").addEventListener("click", () => {
      appState.wizard.step = 5;
      customerView.renderFindItemWizard(document.getElementById("app-root"));
    });
  },

  // 3. Shops Explorer View
  async renderShopsList(container) {
    container.innerHTML = `
      <div class="container" style="margin: 2rem auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <div>
            <h1 style="font-size: 1.85rem; font-weight: 800; color: var(--dark);" data-i18n="nav_shops">${t("nav_shops")}</h1>
            <p style="color: var(--text-muted);">Verified local merchants in Yamunanagar & Jagadhri</p>
          </div>

          <!-- Filters -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <select id="filter-shop-cat" class="form-control" style="width: auto;">
              <option value="All">All Categories</option>
              <option value="Clothes">Clothes</option>
              <option value="Skincare">Skincare</option>
              <option value="Shoes">Shoes</option>
            </select>
            <select id="filter-shop-area" class="form-control" style="width: auto;">
              <option value="All">All Areas</option>
              <option value="Jagadhri">Jagadhri</option>
              <option value="Model Town">Model Town</option>
            </select>
          </div>
        </div>

        <div id="all-shops-grid" class="grid-3">
          <p>${t("loading")}</p>
        </div>
      </div>
    `;

    const loadShops = async () => {
      const cat = document.getElementById("filter-shop-cat").value;
      const area = document.getElementById("filter-shop-area").value;
      const grid = document.getElementById("all-shops-grid");

      try {
        const res = await api.getShops({ category: cat, area: area });
        if (res.shops && res.shops.length > 0) {
          grid.innerHTML = res.shops.map(s => `
            <div class="shop-card">
              <img class="shop-img" src="${s.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'}" alt="${s.name}" />
              <div class="shop-card-body">
                <div class="shop-header">
                  <h3 class="shop-name">${s.name}</h3>
                  <span class="shop-badge">${s.category}</span>
                </div>
                <p class="shop-address">📍 ${s.address}, ${s.area}</p>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.6rem;">📞 ${s.contact_number}</p>
                <div class="shop-footer">
                  <span style="font-size: 0.85rem; font-weight: 600; color: var(--secondary);">★ ${s.avg_rating} (${s.product_count} items)</span>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-sm btn-outline btn-ask-shop" data-id="${s.id}" data-name="${s.name}" data-cat="${s.category}" data-addr="${s.address}">Ask for Item</button>
                    <button class="btn btn-sm btn-primary btn-view-store" data-id="${s.id}">View Store</button>
                  </div>
                </div>
              </div>
            </div>
          `).join("");

          grid.querySelectorAll(".btn-view-store").forEach(btn => {
            btn.addEventListener("click", () => appState.navigate("shop-detail", { shop_id: btn.dataset.id }));
          });

          grid.querySelectorAll(".btn-ask-shop").forEach(btn => {
            btn.addEventListener("click", () => {
              appState.resetWizard();
              appState.wizard.shop_preference = "specific";
              appState.wizard.selected_shop = {
                id: parseInt(btn.dataset.id),
                name: btn.dataset.name,
                category: btn.dataset.cat,
                address: btn.dataset.addr
              };
              appState.wizard.selected_category = btn.dataset.cat;
              appState.wizard.step = 3;
              appState.navigate("find-item");
            });
          });
        } else {
          grid.innerHTML = `<p style="color: var(--text-muted);">${t("no_data")}</p>`;
        }
      } catch (err) {
        grid.innerHTML = `<p style="color: var(--danger);">${err.message}</p>`;
      }
    };

    document.getElementById("filter-shop-cat").addEventListener("change", loadShops);
    document.getElementById("filter-shop-area").addEventListener("change", loadShops);
    loadShops();
  },

  // 4. Shop Details View
  async renderShopDetail(container, shopId) {
    container.innerHTML = `<div class="container" style="margin: 2rem auto;"><p>${t("loading")}</p></div>`;

    try {
      const res = await api.getShop(shopId);
      const s = res.shop;

      container.innerHTML = `
        <div class="container" style="margin: 2rem auto;">
          <button class="btn btn-outline btn-sm" id="btn-back-shops" style="margin-bottom: 1.25rem;">← Back to Shops</button>

          <!-- Shop Banner Card -->
          <div class="card" style="margin-bottom: 2rem; padding: 2rem;">
            <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center;">
              <img src="${s.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'}" style="width: 140px; height: 140px; object-fit: cover; border-radius: var(--radius-lg);" />
              <div style="flex: 1;">
                <div style="display: flex; gap: 0.6rem; align-items: center; margin-bottom: 0.3rem;">
                  <h1 style="font-size: 1.8rem; font-weight: 800; color: var(--dark);">${s.name}</h1>
                  <span class="shop-badge">${s.category}</span>
                  <span style="background: ${s.is_open ? 'var(--primary-light)' : '#fee2e2'}; color: ${s.is_open ? 'var(--primary-dark)' : 'var(--danger)'}; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: var(--radius-sm);">
                    ${s.is_open ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>
                <p style="color: var(--text-muted); margin-bottom: 0.5rem;">📍 ${s.address}, ${s.area}, ${s.city} - ${s.pincode}</p>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">📞 Contact: <strong>${s.contact_number}</strong> | Rating: <strong style="color: var(--secondary);">★ ${s.avg_rating}</strong></p>
                <div style="display: flex; gap: 0.75rem;">
                  <button class="btn btn-secondary" id="btn-shop-inquire">🔍 Ask This Shop For An Item</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Section -->
          <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 1.25rem;">Available In-Stock Products</h2>
          <div class="grid-4" id="shop-products-grid">
            ${s.products && s.products.length > 0 ? s.products.map(p => `
              <div class="product-card">
                <img class="product-img" src="${p.image_url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'}" alt="${p.name}" />
                <div class="product-body">
                  <h4 class="product-name">${p.name}</h4>
                  <p class="product-desc">${p.description || ''}</p>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">Sizes: <strong>${p.sizes || 'Free size'}</strong></p>
                  <div class="product-price-row">
                    <span class="product-price">₹${p.price}</span>
                    <button class="btn btn-sm btn-primary btn-add-cart" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.image_url}" data-size="${p.sizes ? p.sizes.split(',')[0].trim() : 'M'}">
                      + Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            `).join("") : '<p style="color: var(--text-muted);">No products currently listed for this shop.</p>'}
          </div>
        </div>
      `;

      document.getElementById("btn-back-shops").addEventListener("click", () => appState.navigate("shops"));
      document.getElementById("btn-shop-inquire").addEventListener("click", () => {
        appState.resetWizard();
        appState.wizard.shop_preference = "specific";
        appState.wizard.selected_shop = {
          id: s.id,
          name: s.name,
          category: s.category,
          address: s.address
        };
        appState.wizard.selected_category = s.category;
        appState.wizard.step = 3;
        appState.navigate("find-item");
      });

      container.querySelectorAll(".btn-add-cart").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (!appState.currentUser) {
            window.showToast("Authentication Required", "Please log in to add items to your cart.", "info");
            appState.navigate("login");
            return;
          }

          const itemData = {
            customer_id: appState.currentUser.id,
            shop_id: s.id,
            product_id: parseInt(btn.dataset.id),
            product_name: btn.dataset.name,
            price: parseFloat(btn.dataset.price),
            quantity: 1,
            size: btn.dataset.size,
            color: "Standard",
            image_url: btn.dataset.img
          };

          try {
            const addRes = await api.addToCart(itemData);
            window.showToast(t("success"), addRes.message, "success");
            // Refresh global cart state
            const cartRes = await api.getCart(appState.currentUser.id);
            appState.updateCart(cartRes);
          } catch (err) {
            if (err.message && err.message.includes("cart currently contains products from another shop")) {
              window.showSingleShopModal(err.message);
            } else {
              window.showToast(t("error"), err.message, "error");
            }
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="container" style="margin: 2rem auto;"><p style="color: var(--danger);">${err.message}</p></div>`;
    }
  }
};

window.customerView = customerView;
