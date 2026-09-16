/**
 * i18n.js - Dual Language (English & Hindi) Translation System for Nearby
 * Instant translation toggle and persistent language storage.
 */

const translations = {
  en: {
    // App Branding & Navigation
    app_name: "Nearby",
    tagline: "Hyperlocal Product Discovery & Shopping",
    nav_home: "Home",
    nav_find_item: "Find an Item",
    nav_shops: "Shops",
    nav_cart: "Cart",
    nav_orders: "My Orders",
    nav_profile: "Profile",
    nav_payment: "Payment",
    nav_notifications: "Notifications",
    nav_admin: "Admin",
    nav_logout: "Logout",
    nav_login: "Login",
    nav_dashboard: "Dashboard",
    nav_my_shop: "My Shop / Profile",
    nav_products: "Products",
    nav_add_product: "Add Product",
    nav_requests: "Customer Requests",
    nav_confirmed_orders: "Confirmed Orders",
    nav_earnings: "Earnings",
    role_customer: "Customer",
    role_shopkeeper: "Shopkeeper",
    role_admin: "Admin",
    switch_role: "Switch Role",
    role_question: "How would you like to use Nearby?",

    // Language Selector Modal
    welcome_title: "Welcome to Nearby",
    choose_lang_title: "Choose Your Language / अपनी भाषा चुनें",
    choose_lang_desc: "You can change this anytime from the top navigation bar.",
    btn_english: "English",
    btn_hindi: "हिंदी (Hindi)",
    btn_continue: "Continue",

    // Hero & Home
    hero_title: "Check Local Shops Before You Step Out",
    hero_desc: "Don't wander shop to shop in the heat or traffic. Inquire directly with nearby shops, find your exact item, and choose self-pickup or doorstep delivery.",
    btn_find_item_now: "Find an Item Now",
    btn_explore_shops: "Explore Nearby Shops",
    featured_categories: "Browse by Category",
    featured_categories_sub: "Quickly browse or inquire for products in these major categories",
    cat_clothes: "Clothes",
    cat_skincare: "Skincare",
    cat_beauty: "Beauty / Makeup",
    cat_shoes: "Shoes",
    cat_clothes_desc: "Shirts, jeans, kurtis, dresses, pants and ethnic wear",
    cat_skincare_desc: "Face wash, serums, sunscreens, moisturizers and creams",
    cat_beauty_desc: "Lipsticks, eyeliners, compact powders and beauty kits",
    cat_shoes_desc: "Sports sneakers, casual slip-ons, formal shoes and sandals",
    explore_category: "Explore Items",
    how_it_works: "How Nearby Works",
    step1_title: "1. Tell Us What You Need",
    step1_desc: "Upload a picture or describe the item you are looking for.",
    step2_title: "2. Shopkeeper Checks Stock",
    step2_desc: "Nearby shopkeepers review and suggest matching products with price & photos.",
    step3_title: "3. Pick Up or Get Delivered",
    step3_desc: "Visit the shop yourself with easy directions, or get it delivered to your home.",

    // Auth
    login_title: "Welcome to Nearby",
    login_sub: "Enter your account & location details to continue",
    register_title: "Account Details",
    register_sub: "Enter your details to get started with Nearby",
    full_name: "Full Name",
    full_name_placeholder: "e.g. Priya Sharma",
    email: "Email Address",
    email_placeholder: "e.g. priya@example.com",
    phone_number: "Phone Number",
    phone_placeholder: "10-digit mobile number",
    password: "Password",
    password_placeholder: "Enter password",
    address: "Full Address",
    address_placeholder: "House/Flat no, building, street",
    post_office: "Post Office",
    post_office_placeholder: "e.g. Yamunanagar H.O.",
    local_area: "Local Area / Locality",
    local_area_placeholder: "e.g. Civil Lines, Model Town",
    pincode: "Pincode",
    pincode_placeholder: "e.g. 135001",
    state: "State",
    city: "City",
    city_placeholder: "e.g. Yamunanagar",
    select_role_prompt: "How would you like to use Nearby?",
    role_customer_title: "Customer",
    role_customer_desc: "Find products, discover relevant local shops, and choose how to get your item.",
    role_shopkeeper_title: "Shopkeeper",
    role_shopkeeper_desc: "Manage your shop, products, customer requests, and orders.",
    shop_details_section: "Shop Information",
    shop_name: "Shop Name",
    shop_name_placeholder: "e.g. Gupta Garments",
    shop_category: "Primary Shop Category",
    shop_area: "Area / Locality",
    shop_address: "Shop Physical Address",
    btn_login: "Continue",
    btn_register: "Continue",
    no_account: "",
    has_account: "",
    sign_up_now: "",
    sign_in_now: "",

    // Role Selection Screen
    role_select_title: "How would you like to use Nearby?",
    role_select_sub: "Choose your role to get started",
    btn_enter_customer: "Continue as Customer",
    btn_enter_shopkeeper: "Continue as Shopkeeper",

    // Find an Item Wizard
    find_item_title: "Find an Item",
    find_item_sub: "Find out if the item you want is available at local shops around you.",
    wizard_step_pref: "1. Shop Preference",
    wizard_step_area: "2. Select Area",
    wizard_step_needs: "3. What You Need",
    wizard_step_summary: "4. Summary & Send",
    wizard_step_responses: "5. Shop Responses",

    // Step 8A: Shop Preference
    pref_question: "How would you like to find your item?",
    opt_specific_shop: "Select a Specific Shop",
    opt_specific_shop_desc: "I already have a shop in mind and want to ask that shop for the item.",
    opt_nearby_shops: "Find Relevant Nearby Shops",
    opt_nearby_shops_desc: "I want to discover shops around my selected area that may have this item.",

    // Step 8B: Area Selection
    area_title: "Select Your Location & Area",
    area_sub: "We use this area to connect you with nearby shops.",
    select_state: "State",
    select_city: "City",
    select_locality: "Area / Locality",
    select_pincode: "Pincode",
    available_shops_in_area: "Available Shops in Selected Area",
    btn_select_this_shop: "Select Shop",
    btn_view_shop: "View Shop",
    btn_next: "Next Step",
    btn_back: "Go Back",

    // Step 8C: Tell Us What You Need
    needs_title: "What are you looking for?",
    needs_sub: "Choose your category and upload a photo or enter details manually.",
    select_item_cat: "Choose Item Category",
    opt_upload_img: "Option 1: Upload an Image",
    opt_upload_img_desc: "Upload a picture of the item you want.",
    click_to_upload: "Click to upload an image from your device",
    supported_formats: "PNG, JPG, WEBP up to 5MB",
    change_photo: "Change Photo",
    remove_photo: "Remove Photo",
    opt_enter_manual: "Option 2: Enter Details Manually",
    opt_enter_manual_desc: "Describe the item you are looking for.",

    // Form fields
    field_clothing_type: "Clothing Type",
    field_upper: "Upper / Top",
    field_bottom: "Bottom",
    field_dress: "Dress",
    field_other: "Other",
    field_item_name: "What do you need?",
    field_item_name_placeholder: "e.g. Cotton shirt, dark blue jeans, kurti, trousers",
    field_brand: "Brand Preference",
    brand_any: "Any Brand",
    brand_specific: "Specific Brand",
    field_sleeves: "Sleeves",
    sleeves_full: "Full Sleeves",
    sleeves_half: "Half Sleeves",
    sleeves_sleeveless: "Sleeveless",
    sleeves_na: "Not Applicable",
    field_color: "Color",
    color_same_as_img: "Same as in image",
    color_any: "Any Color",
    color_specific: "Specific Color",
    color_placeholder: "Enter color name (e.g. Navy Blue, Olive)",
    field_size: "Size",
    size_na: "Not Applicable",
    field_additional: "Additional Requirements / Notes",
    field_additional_placeholder: "e.g. I want a similar design, but with full sleeves and breathable fabric.",

    // Skincare
    field_skin_product_type: "Product Type",
    skin_type_placeholder: "e.g. Face Serum, Sunscreen, Foaming Cleanser",
    field_skin_concern: "Product Concern / Skin Goal",
    skin_concern_placeholder: "e.g. Brightening, Anti-acne, Dry skin hydration",
    field_budget: "Budget (Optional in ₹)",
    budget_placeholder: "e.g. 500",

    // Shoes
    field_shoe_type: "Shoe Type",
    shoe_type_placeholder: "e.g. Running Shoes, Formal Oxford, Canvas Sneakers",

    // Step 10: Request Summary
    summary_title: "Request Summary",
    summary_sub: "Please review your product request before sending it to local shops.",
    summary_category: "Category",
    summary_pref: "Search Method",
    summary_target_shop: "Target Shop",
    summary_area: "Location Area",
    summary_uploaded_image: "Uploaded Picture",
    summary_color: "Color",
    summary_brand: "Brand",
    summary_size: "Size",
    summary_notes: "Special Instructions",
    btn_edit_request: "Edit Request",
    btn_submit_request: "Submit Request",

    // Shop Responses & Suggestions
    responses_title: "Shopkeeper Suggestions",
    responses_sub: "Shops have reviewed your inquiry and replied with matching options.",
    no_responses_yet: "Waiting for shopkeeper response. Responses will appear here.",
    suggested_price: "Price",
    availability_status: "Availability",
    in_stock: "In Stock",
    out_of_stock: "Unavailable",
    btn_select_product: "Select Product",
    btn_reject_product: "Reject",
    btn_request_another: "Request Another Option",
    btn_find_from_other_shops: "Find this item from other shops",

    // Step 13: Product Selection Confirmation
    confirm_product_title: "Confirm Your Selected Product",
    confirm_product_sub: "Review the chosen item before picking your fulfillment method.",
    btn_confirm_proceed: "Confirm & Choose Pickup / Delivery",
    btn_choose_another: "Choose Another Option",

    // Step 14 & 15: Fulfillment Choice
    fulfillment_title: "How would you like to receive your item?",
    fulfillment_sub: "Choose whether to visit the store yourself or get it delivered.",
    opt_do_it_myself: "Let's Do It Myself",
    opt_do_it_myself_desc: "I want to visit the shop and collect the item myself.",
    opt_get_at_home: "Let's Get It at Home",
    opt_get_at_home_desc: "I want the item delivered to my home.",

    // Visit Shop Details
    visit_shop_title: "Visit the Shop",
    shop_address_label: "Shop Address",
    shop_contact_label: "Shop Contact",
    btn_get_directions: "Get Directions (Map)",
    btn_know_route: "I Know the Route (Self Pickup)",
    directions_modal_title: "Route & Directions to Shop",
    directions_modal_desc: "Route from your selected location to the shop:",
    btn_close: "Close",

    // Home Delivery
    home_delivery_title: "Home Delivery Address",
    home_delivery_sub: "Verify the address where your item should be delivered.",
    saved_address: "Saved Address",
    btn_use_saved_address: "Use Saved Address",
    btn_edit_address: "Edit Address",
    safety_banner_title: "Your safety matters.",
    safety_banner_text: "Please do not rush the delivery partner. Your safety and the delivery partner's safety are important. Delivery time may vary depending on shop preparation, traffic, weather, and other conditions.",
    estimated_delivery: "Estimated Delivery: 45 - 90 minutes (subject to weather & traffic)",

    // Payment Options
    payment_title: "Payment Selection",
    payment_sub: "Choose your preferred payment method",
    pay_cod: "Cash on Delivery (COD)",
    pay_cod_desc: "Pay in cash or UPI QR directly when your item arrives.",
    pay_upi: "Google Pay / UPI (Prototype Simulation)",
    pay_upi_desc: "Instant demo UPI simulation for testing prototype flow.",
    order_bill_details: "Bill Summary",
    bill_subtotal: "Item Subtotal",
    bill_delivery_fee: "Delivery Fee",
    bill_free: "FREE (Self Pickup)",
    bill_total: "Total Amount",
    btn_place_order: "Confirm & Place Order",

    // Order Tracking (My Orders)
    my_orders_title: "My Orders & Tracking",
    my_orders_sub: "Track your ongoing and past orders in real time.",
    order_id: "Order ID",
    order_date: "Date",
    delivery_type: "Fulfillment",
    payment_type: "Payment",
    no_orders: "You have not placed any orders yet.",

    // Status Timeline
    status_submitted: "Request Submitted",
    status_reviewing: "Seller Reviewing",
    status_suggested: "Product Suggested",
    status_selected: "Product Selected",
    status_confirmed: "Order Confirmed",
    status_preparing: "Preparing",
    status_ready_pickup: "Ready for Pickup",
    status_out_delivery: "Out for Delivery",
    status_delivered: "Delivered",
    status_collected: "Collected",
    status_cancelled: "Cancelled",

    // Cart
    cart_title: "Shopping Cart",
    cart_empty: "Your cart is currently empty.",
    cart_items_count: "Items in cart",
    btn_clear_cart: "Clear Cart",
    btn_checkout: "Proceed to Delivery & Payment",
    single_shop_alert_title: "Different Shop Notice",
    single_shop_alert_body: "Your cart currently contains products from another shop. Please place this order first or clear the cart to continue.",

    // Ratings & Feedback
    feedback_title: "Rate Your Experience",
    feedback_sub: "Your feedback helps local businesses and delivery partners improve.",
    rate_shop_label: "How would you rate the shop?",
    rate_delivery_label: "How would you rate the delivery partner?",
    satisfied_question: "Were you satisfied with the product?",
    btn_yes: "Yes, satisfied",
    btn_no: "Not satisfied",
    feedback_comments_placeholder: "Write a short review or suggestions (optional)...",
    btn_submit_feedback: "Submit Rating & Review",
    rating_submitted: "Thank you! Your feedback has been recorded.",

    // Customer Profile
    profile_title: "Customer Profile",
    profile_sub: "Manage your personal information and contact details.",
    preferred_language: "Preferred Language",
    btn_save_profile: "Save Profile Changes",

    // Shopkeeper Dashboard
    shopkeeper_title: "Shopkeeper Dashboard",
    shopkeeper_sub: "Manage your storefront, catalog, incoming customer requests, and orders.",
    stat_requests: "Active Requests",
    stat_orders: "Pending Orders",
    stat_products: "Products in Catalog",
    tab_overview: "Dashboard",
    tab_profile: "Shop Profile",
    tab_products: "My Products",
    tab_add_product: "Add Product",
    tab_requests: "Customer Inquiries",
    tab_orders: "Orders Management",
    tab_confirmed_orders: "Confirmed Orders",
    tab_earnings: "Earnings",
    tab_payment: "Payment & Settlements",
    shop_status_open: "Store is OPEN for business",
    shop_status_closed: "Store is currently CLOSED",
    btn_toggle_status: "Toggle Open / Closed",
    btn_save_shop_profile: "Save Shop Profile",

    // Confirmed Orders & Earnings
    confirmed_orders_title: "Confirmed Orders",
    confirmed_orders_sub: "Orders verified and being prepared or completed by your shop.",
    earnings_title: "Shop Earnings & Revenue",
    earnings_sub: "Track your sales, verified revenue, and pending payouts in Yamunanagar & Jagadhri.",
    stat_total_earnings: "Total Revenue",
    stat_confirmed_count: "Confirmed Orders",
    stat_pending_amount: "Pending Cash on Delivery",
    stat_digital_upi: "Digital UPI Collections",
    earnings_history: "Order Revenue Breakdown",
    payment_mgmt_title: "Payment Management",
    payment_mgmt_sub: "View payment methods, cash collected, and digital settlement history.",
    notifications_page_title: "Notifications",
    notifications_page_sub: "Real-time updates on customer orders, inquiries, and delivery statuses.",

    // Shopkeeper Products
    add_product_title: "Add New Product to Shop",
    product_name: "Product Name",
    product_price: "Price (₹)",
    product_category: "Category",
    product_description: "Description",
    product_sizes: "Available Sizes (comma separated)",
    product_colors: "Available Colors (comma separated)",
    product_image_url: "Product Image URL or Sample Photo",
    btn_save_product: "Save Product",
    product_status_available: "Available",
    product_status_unavailable: "Unavailable",
    btn_mark_unavailable: "Mark Unavailable",
    btn_mark_available: "Mark Available",
    btn_edit: "Edit",
    btn_delete: "Delete",

    // Shopkeeper Customer Requests
    incoming_requests: "Incoming Customer Inquiries",
    customer_name: "Customer",
    customer_area: "Area",
    inquiry_details: "Inquiry Details",
    btn_reply_suggestion: "Reply with Product Suggestion",
    suggestion_modal_title: "Suggest a Product to Customer",
    suggestion_product_name: "Suggested Product Name",
    suggestion_price: "Offered Price (₹)",
    suggestion_desc: "Product Details / Note",
    suggestion_image: "Product Photo URL",
    btn_send_suggestion: "Send Suggestion to Customer",

    // Shopkeeper Orders
    incoming_orders: "Orders to Fulfill",
    customer_contact: "Customer Phone",
    fulfillment_method: "Method",
    order_items: "Items Ordered",
    total_bill: "Total Bill",
    order_action: "Update Status",
    btn_accept: "Accept Order",
    btn_reject: "Reject Order",
    btn_mark_preparing: "Mark Preparing",
    btn_mark_ready_pickup: "Mark Ready for Pickup",
    btn_mark_out_delivery: "Mark Out for Delivery",
    btn_mark_delivered: "Mark Delivered",
    btn_mark_collected: "Mark Collected",

    // Admin Dashboard
    admin_title: "Nearby Admin Control Panel",
    admin_sub: "Platform moderation, shop verification, and oversight.",
    admin_stat_users: "Total Customers",
    admin_stat_shopkeepers: "Shopkeepers",
    admin_stat_shops: "Registered Shops",
    admin_stat_products: "Total Products",
    admin_stat_orders: "Total Orders",
    admin_tab_shops: "Verify Shops",
    admin_tab_products: "Moderate Products",
    admin_tab_orders: "All Orders",
    btn_approve_shop: "Approve Shop",
    btn_reject_shop: "Reject Shop",
    btn_remove: "Remove",

    // Common
    loading: "Loading...",
    success: "Success",
    error: "Error",
    actions: "Actions",
    no_data: "No records found.",
    sample_badge: "Prototype Demo",
    currency_symbol: "₹"
  },

  hi: {
    // App Branding & Navigation
    app_name: "Nearby (नियरबाई)",
    tagline: "आस-पास के सामान की खोज और खरीदारी",
    nav_home: "होम",
    nav_find_item: "सामान खोजें",
    nav_shops: "दुकानें",
    nav_cart: "कार्ट",
    nav_orders: "मेरे ऑर्डर",
    nav_profile: "प्रोफ़ाइल",
    nav_payment: "भुगतान",
    nav_notifications: "सूचनाएं",
    nav_admin: "व्यवस्थापक (Admin)",
    nav_logout: "लॉगआउट",
    nav_login: "लॉग इन",
    nav_dashboard: "डैशबोर्ड",
    nav_my_shop: "मेरी दुकान / प्रोफ़ाइल",
    nav_products: "उत्पाद",
    nav_add_product: "नया उत्पाद जोड़ें",
    nav_requests: "ग्राहकों की मांगें",
    nav_confirmed_orders: "कन्फ़र्म ऑर्डर",
    nav_earnings: "कमाई (Earnings)",
    role_customer: "ग्राहक",
    role_shopkeeper: "दुकानदार",
    role_admin: "व्यवस्थापक",
    switch_role: "भूमिका बदलें",
    role_question: "आप Nearby का उपयोग कैसे करना चाहेंगे?",

    // Language Selector Modal
    welcome_title: "Nearby में आपका स्वागत है",
    choose_lang_title: "अपनी पसंदीदा भाषा चुनें / Choose Language",
    choose_lang_desc: "आप इसे कभी भी ऊपर दिए गए मेनू से बदल सकते हैं।",
    btn_english: "English",
    btn_hindi: "हिंदी (Hindi)",
    btn_continue: "आगे बढ़ें",

    // Hero & Home
    hero_title: "घर से निकलने से पहले आस-पास की दुकान में पता करें",
    hero_desc: "धूप, भीड़ और ट्रैफ़िक में दुकान-दुकान भटकने की ज़रूरत नहीं। घर बैठे अपनी पसंद की चीज़ पूछें, फ़ोटो भेजें, और दुकान जाकर लें या घर मंगवाएं।",
    btn_find_item_now: "अभी सामान खोजें",
    btn_explore_shops: "आस-पास की दुकानें देखें",
    featured_categories: "प्रमुख श्रेणियां",
    featured_categories_sub: "इन प्रमुख श्रेणियों में सीधे उत्पाद देखें या दुकानदार से पूछें",
    cat_clothes: "कपड़े",
    cat_skincare: "स्किनकेयर",
    cat_beauty: "सौंदर्य और मेकअप",
    cat_shoes: "जूते",
    cat_clothes_desc: "शर्ट, जीन्स, कुर्ती, ड्रेस, ट्राउज़र्स और पारंपरिक परिधान",
    cat_skincare_desc: "फेस वॉश, सीरम, सनस्क्रीन, मॉइस्चराइज़र और क्रीम",
    cat_beauty_desc: "लिपस्टिक, आईलाइनर, कॉम्पैक्ट पाउडर और मेकअप का सामान",
    cat_shoes_desc: "स्पोर्ट्स स्नीकर्स, कैज़ुअल जूते, फ़ॉर्मल जूते और सैंडल",
    cat_skincare_desc: "फेस वॉश, सीरम, सनस्क्रीन, मॉइस्चराइज़र और क्रीम",
    cat_shoes_desc: "स्पोर्ट्स स्नीकर्स, कैज़ुअल जूते, फ़ॉर्मल जूते और सैंडल",
    explore_category: "सामान देखें",
    how_it_works: "नियरबाई कैसे काम करता है?",
    step1_title: "1. अपनी ज़रूरत बताएं",
    step1_desc: "मनपसंद सामान की तस्वीर अपलोड करें या साधारण शब्दों में बताएं।",
    step2_title: "2. दुकानदार सामान जांचेंगे",
    step2_desc: "आस-पास के दुकानदार अपनी दुकान का उपलब्ध सामान फ़ोटो और कीमत सहित सुझाएंगे।",
    step3_title: "3. खुद लें या घर मंगवाएं",
    step3_desc: "आसान रास्ते के साथ खुद दुकान जाकर लाएं, या सीधे घर पर डिलीवरी पाएं।",

    // Auth
    login_title: "अपने खाते में लॉग इन करें",
    login_sub: "अपना पंजीकृत मोबाइल नंबर और पासवर्ड दर्ज करें",
    register_title: "नया खाता बनाएं",
    register_sub: "दुकानें खोजने या अपनी दुकान जोड़ने के लिए नियरबाई से जुड़ें",
    full_name: "पूरा नाम",
    full_name_placeholder: "अपना पूरा नाम लिखें",
    phone_number: "फ़ोन नंबर",
    phone_placeholder: "10 अंकों का मोबाइल नंबर",
    password: "पासवर्ड",
    password_placeholder: "अपना पासवर्ड लिखें",
    address: "घर का पता",
    address_placeholder: "मकान नं, गली, मोहल्ला या कॉलोनी",
    pincode: "पिनकोड",
    pincode_placeholder: "जैसे 135001",
    state: "राज्य",
    city: "शहर",
    city_placeholder: "जैसे यमुनानगर",
    select_role_prompt: "अपनी खाता भूमिका चुनें",
    role_customer_title: "मैं एक ग्राहक हूँ",
    role_customer_desc: "उत्पाद खोजें, आस-पास की दुकानें देखें, और ऑर्डर करें या दुकान जाकर खरीदें।",
    role_shopkeeper_title: "मैं एक दुकानदार हूँ",
    role_shopkeeper_desc: "अपनी दुकान बनाएं, उत्पाद अपलोड करें, और ग्राहकों की मांग और ऑर्डर प्रबंधित करें।",
    shop_details_section: "दुकान की जानकारी (दुकानदारों के लिए)",
    shop_name: "दुकान का नाम",
    shop_name_placeholder: "जैसे गुप्ता गारमेंट्स",
    shop_category: "दुकान की मुख्य श्रेणी",
    shop_area: "इलाका / मोहल्ला",
    shop_address: "दुकान का पूरा पता",
    btn_login: "लॉग इन करें",
    btn_register: "पंजीकरण पूरा करें",
    no_account: "क्या आपका खाता नहीं है?",
    has_account: "पहले से खाता है?",
    sign_up_now: "अभी नया खाता बनाएं",
    sign_in_now: "लॉग इन करें",

    // Role Selection Screen
    role_select_title: "आप Nearby का उपयोग कैसे करना चाहेंगे?",
    role_select_sub: "शुरू करने के लिए अपनी भूमिका चुनें",
    role_customer_title: "Customer (ग्राहक)",
    role_customer_desc: "उत्पाद खोजें, प्रासंगिक स्थानीय दुकानों की जानकारी लें और सामान प्राप्त करने का तरीका चुनें।",
    role_shopkeeper_title: "Shopkeeper (दुकानदार)",
    role_shopkeeper_desc: "अपनी दुकान, उत्पाद, ग्राहकों की मांगें और ऑर्डर प्रबंधित करें।",
    btn_enter_customer: "ग्राहक के रूप में जारी रखें",
    btn_enter_shopkeeper: "दुकानदार के रूप में जारी रखें",

    // Find an Item Wizard
    find_item_title: "सामान खोजें",
    find_item_sub: "घर बैठे पता करें कि आपकी पसंद का सामान आस-पास की दुकानों में उपलब्ध है या नहीं।",
    wizard_step_pref: "1. दुकान की पसंद",
    wizard_step_area: "2. इलाका चुनें",
    wizard_step_needs: "3. ज़रूरत का विवरण",
    wizard_step_summary: "4. समीक्षा और भेजें",
    wizard_step_responses: "5. दुकानदार के सुझाव",

    // Step 8A: Shop Preference
    pref_question: "आप अपना सामान कैसे खोजना चाहते हैं?",
    opt_specific_shop: "एक खास दुकान चुनें",
    opt_specific_shop_desc: "मेरे मन में पहले से एक दुकान है और मैं उसी से पूछना चाहता हूँ।",
    opt_nearby_shops: "आस-पास की संबंधित दुकानें खोजें",
    opt_nearby_shops_desc: "मैं अपने चुने हुए इलाके में ऐसी दुकानें देखना चाहता हूँ जहाँ यह सामान मिल सकता है।",

    // Step 8B: Area Selection
    area_title: "अपना स्थान और इलाका चुनें",
    area_sub: "हम इस इलाके के आधार पर आपको नजदीकी दुकानों से जोड़ेंगे।",
    select_state: "राज्य",
    select_city: "शहर",
    select_locality: "इलाका / मोहल्ला",
    select_pincode: "पिनकोड",
    available_shops_in_area: "चुने हुए इलाके की दुकानें",
    btn_select_this_shop: "दुकान चुनें",
    btn_view_shop: "दुकान देखें",
    btn_next: "अगला कदम",
    btn_back: "वापस जाएं",

    // Step 8C: Tell Us What You Need
    needs_title: "आप क्या खोज रहे हैं?",
    needs_sub: "अपनी श्रेणी चुनें और तस्वीर अपलोड करें या विवरण दर्ज करें।",
    select_item_cat: "सामान की श्रेणी चुनें",
    opt_upload_img: "विकल्प 1: तस्वीर अपलोड करें",
    opt_upload_img_desc: "अपने मनपसंद सामान की तस्वीर अपलोड करें।",
    click_to_upload: "अपने डिवाइस से तस्वीर चुनने के लिए क्लिक करें",
    supported_formats: "PNG, JPG, WEBP (अधिकतम 5MB)",
    change_photo: "तस्वीर बदलें",
    remove_photo: "तस्वीर हटाएं",
    opt_enter_manual: "विकल्प 2: विवरण खुद दर्ज करें",
    opt_enter_manual_desc: "आप जो सामान खोज रहे हैं उसका विवरण लिखें।",

    // Form fields
    field_clothing_type: "कपड़े का प्रकार",
    field_upper: "ऊपरी वस्त्र (टॉप / शर्ट / टी-शर्ट)",
    field_bottom: "निचला वस्त्र (जीन्स / पैंट)",
    field_dress: "ड्रेस / गाउन",
    field_other: "अन्य परिधान",
    field_item_name: "आपको क्या चाहिए?",
    field_item_name_placeholder: "उदा: कॉटन शर्ट, डार्क ब्लू जीन्स, कुर्ती, ट्राउज़र्स",
    field_brand: "ब्रांड की पसंद",
    brand_any: "कोई भी अच्छा ब्रांड",
    brand_specific: "कोई खास ब्रांड",
    field_sleeves: "बाजू (स्लीव्स)",
    sleeves_full: "पूरी आस्तीन (Full Sleeves)",
    sleeves_half: "आधी आस्तीन (Half Sleeves)",
    sleeves_sleeveless: "बिना आस्तीन (Sleeveless)",
    sleeves_na: "लागू नहीं",
    field_color: "रंग की पसंद",
    color_same_as_img: "तस्वीर जैसा ही रंग",
    color_any: "कोई भी रंग चलेगा",
    color_specific: "कोई खास रंग",
    color_placeholder: "रंग का नाम लिखें (जैसे नेवी ब्लू, काला, सफेद)",
    field_size: "साइज़",
    size_na: "लागू नहीं",
    field_additional: "अतिरिक्त निर्देश / विशेष ज़रूरत",
    field_additional_placeholder: "जैसे: मुझे तस्वीर जैसा ही डिज़ाइन चाहिए लेकिन पूरी आस्तीन में और सूती कपड़े में।",

    // Skincare
    field_skin_product_type: "उत्पाद का प्रकार",
    skin_type_placeholder: "जैसे: फेस सीरम, सनस्क्रीन, फेसवॉश",
    field_skin_concern: "स्किन की समस्या या ज़रूरत",
    skin_concern_placeholder: "जैसे: चेहरे की चमक, मुंहासों के लिए, रूखी त्वचा की नमी",
    field_budget: "बजट (वैकल्पिक ₹ में)",
    budget_placeholder: "जैसे: 500",

    // Shoes
    field_shoe_type: "जूते का प्रकार",
    shoe_type_placeholder: "जैसे: रनिंग शूज, फॉर्मल चमड़े के जूते, कैनवास स्नीकर्स",

    // Step 10: Request Summary
    summary_title: "आपकी मांग का सारांश",
    summary_sub: "स्थानीय दुकानों को भेजने से पहले अपनी मांग की दोबारा जांच कर लें।",
    summary_category: "श्रेणी",
    summary_pref: "खोज का तरीका",
    summary_target_shop: "चुनी हुई दुकान",
    summary_area: "स्थान / इलाका",
    summary_uploaded_image: "अपलोड की गई तस्वीर",
    summary_color: "रंग",
    summary_brand: "ब्रांड",
    summary_size: "साइज़",
    summary_notes: "विशेष निर्देश",
    btn_edit_request: "बदलाव करें",
    btn_submit_request: "दुकान को भेजें",

    // Shop Responses & Suggestions
    responses_title: "दुकानदारों के सुझाव",
    responses_sub: "दुकानदार आपकी मांग देखकर उपलब्ध उत्पाद सुझा रहे हैं।",
    no_responses_yet: "दुकानदार के जवाब की प्रतीक्षा है। जवाब आते ही यहाँ दिखाई देगा।",
    suggested_price: "कीमत",
    availability_status: "उपलब्धता",
    in_stock: "स्टॉक में उपलब्ध",
    out_of_stock: "वर्तमान में उपलब्ध नहीं",
    btn_select_product: "यह उत्पाद चुनें",
    btn_reject_product: "अस्वीकार करें",
    btn_request_another: "कोई दूसरा विकल्प दिखाएं",
    btn_find_from_other_shops: "अन्य दुकानों से यह सामान खोजें",

    // Step 13: Product Selection Confirmation
    confirm_product_title: "चुने हुए उत्पाद की पुष्टि",
    confirm_product_sub: "डिलीवरी या दुकान जाने का विकल्प चुनने से पहले उत्पाद विवरण देखें।",
    btn_confirm_proceed: "पुष्टि करें और प्राप्ति का तरीका चुनें",
    btn_choose_another: "कोई दूसरा विकल्प चुनें",

    // Step 14 & 15: Fulfillment Choice
    fulfillment_title: "आप अपना सामान कैसे प्राप्त करना चाहेंगे?",
    fulfillment_sub: "चुनें कि क्या आप खुद दुकान जाएंगे या घर पर डिलीवरी चाहते हैं।",
    opt_do_it_myself: "मैं खुद दुकान जाकर लाऊँगा",
    opt_do_it_myself_desc: "मैं खुद दुकान जाकर सामान लेना चाहता हूँ।",
    opt_get_at_home: "घर पर मंगवाएँ",
    opt_get_at_home_desc: "मैं सामान सीधे अपने घर पर मंगवाना चाहता हूँ।",

    // Visit Shop Details
    visit_shop_title: "दुकान पर जाएं",
    shop_address_label: "दुकान का पता",
    shop_contact_label: "दुकान का संपर्क",
    btn_get_directions: "रास्ता देखें (नक्शा)",
    btn_know_route: "मुझे रास्ता पता है (दुकान से उठाऊंगा)",
    directions_modal_title: "दुकान का रास्ता और दिशानिर्देश",
    directions_modal_desc: "आपके चुने हुए इलाके से दुकान तक का रास्ता:",
    btn_close: "बंद करें",

    // Home Delivery
    home_delivery_title: "घर पर डिलीवरी का पता",
    home_delivery_sub: "उस पते की पुष्टि करें जहाँ सामान पहुंचाना है।",
    saved_address: "दर्ज किया गया पता",
    btn_use_saved_address: "दर्ज पता उपयोग करें",
    btn_edit_address: "पता बदलें",
    safety_banner_title: "आपकी सुरक्षा महत्वपूर्ण है।",
    safety_banner_text: "कृपया डिलीवरी साथी पर जल्दी करने का दबाव न बनाएं। आपकी सुरक्षा और डिलीवरी पार्टनर की सुरक्षा सर्वोपरि है। दुकान की तैयारी, ट्रैफ़िक और मौसम की स्थिति के अनुसार डिलीवरी समय बदल सकता है।",
    estimated_delivery: "अनुमानित समय: 45 - 90 मिनट (मौसम और ट्रैफ़िक के आधार पर)",

    // Payment Options
    payment_title: "भुगतान का तरीका चुनें",
    payment_sub: "अपनी सुविधा अनुसार भुगतान विकल्प चुनें",
    pay_cod: "कैश ऑन डिलीवरी (COD)",
    pay_cod_desc: "सामान घर पहुंचने पर नकद या UPI द्वारा भुगतान करें।",
    pay_upi: "गूगल पे / यूपीआई (प्रोटोटाइप डेमो भुगतान)",
    pay_upi_desc: "प्रोटोटाइप परीक्षण के लिए सुरक्षित ऑनलाइन भुगतान सिमुलेशन।",
    order_bill_details: "बिल का विवरण",
    bill_subtotal: "सामान की कुल कीमत",
    bill_delivery_fee: "डिलीवरी शुल्क",
    bill_free: "मुफ़्त (दुकान से लेने पर)",
    bill_total: "कुल देय राशि",
    btn_place_order: "ऑर्डर कन्फ़र्म करें",

    // Order Tracking (My Orders)
    my_orders_title: "मेरे ऑर्डर और ट्रैकिंग",
    my_orders_sub: "अपने चालू और पुराने ऑर्डरों की स्थिति देखें।",
    order_id: "ऑर्डर संख्या",
    order_date: "तारीख",
    delivery_type: "प्राप्ति का तरीका",
    payment_type: "भुगतान",
    no_orders: "आपने अभी तक कोई ऑर्डर नहीं दिया है।",

    // Status Timeline
    status_submitted: "मांग दर्ज की गई",
    status_reviewing: "दुकानदार जांच रहा है",
    status_suggested: "उत्पाद का सुझाव दिया गया",
    status_selected: "उत्पाद चुना गया",
    status_confirmed: "ऑर्डर कन्फ़र्म हुआ",
    status_preparing: "तैयार किया जा रहा है",
    status_ready_pickup: "दुकान से लेने के लिए तैयार",
    status_out_delivery: "डिलीवरी के लिए निकल चुका है",
    status_delivered: "डिलीवर हो गया",
    status_collected: "दुकान से प्राप्त कर लिया",
    status_cancelled: "रद्द किया गया",

    // Cart
    cart_title: "आपकी शॉपिंग कार्ट",
    cart_empty: "आपकी कार्ट खाली है।",
    cart_items_count: "कार्ट में सामान",
    btn_clear_cart: "कार्ट खाली करें",
    btn_checkout: "चेकआउट के लिए आगे बढ़ें",
    single_shop_alert_title: "अन्य दुकान की चेतावनी",
    single_shop_alert_body: "आपकी कार्ट में पहले से किसी अन्य दुकान का सामान है। कृपया पहले वह ऑर्डर पूरा करें या नई दुकान का सामान जोड़ने के लिए कार्ट खाली करें।",

    // Ratings & Feedback
    feedback_title: "अपनी प्रतिक्रिया और रेटिंग दें",
    feedback_sub: "आपकी राय स्थानीय दुकानदारों और डिलीवरी सेवाओं को बेहतर बनाने में मदद करती है।",
    rate_shop_label: "दुकानदार का अनुभव कैसा रहा?",
    rate_delivery_label: "डिलीवरी सेवा कैसी रही?",
    satisfied_question: "क्या आप मिले हुए सामान से संतुष्ट हैं?",
    btn_yes: "हाँ, पूरी तरह संतुष्ट हूँ",
    btn_no: "नहीं, संतुष्ट नहीं हूँ",
    feedback_comments_placeholder: "अपनी टिप्पणी या सुझाव यहाँ लिखें (वैकल्पिक)...",
    btn_submit_feedback: "रेटिंग और समीक्षा भेजें",
    rating_submitted: "धन्यवाद! आपकी समीक्षा दर्ज कर ली गई है।",

    // Customer Profile
    profile_title: "ग्राहक प्रोफ़ाइल",
    profile_sub: "अपनी व्यक्तिगत जानकारी और संपर्क विवरण देखें और बदलें।",
    preferred_language: "पसंदीदा भाषा",
    btn_save_profile: "बदलाव सहेजें",

    // Shopkeeper Dashboard
    shopkeeper_title: "दुकानदार डैशबोर्ड",
    shopkeeper_sub: "अपनी दुकान, उत्पाद कैटलॉग, ग्राहकों की मांग और ऑर्डर प्रबंधित करें।",
    stat_requests: "सक्रिय ग्राहक मांगें",
    stat_orders: "लंबित ऑर्डर",
    stat_products: "कैटलॉग में कुल उत्पाद",
    tab_overview: "डैशबोर्ड",
    tab_profile: "दुकान प्रोफ़ाइल",
    tab_products: "मेरे उत्पाद",
    tab_add_product: "नया उत्पाद जोड़ें",
    tab_requests: "ग्राहकों की मांगें",
    tab_orders: "ऑर्डर प्रबंधन",
    tab_confirmed_orders: "कन्फ़र्म ऑर्डर",
    tab_earnings: "कमाई (Earnings)",
    tab_payment: "भुगतान और सेटलमेंट",
    shop_status_open: "दुकान खुली है (OPEN)",
    shop_status_closed: "दुकान बंद है (CLOSED)",
    btn_toggle_status: "दुकान चालू / बंद बदलें",
    btn_save_shop_profile: "दुकान विवरण सहेजें",

    // Confirmed Orders & Earnings
    confirmed_orders_title: "कन्फ़र्म किए गए ऑर्डर",
    confirmed_orders_sub: "वे ऑर्डर जिनकी आपने पुष्टि कर दी है और जो दुकान में तैयार हो रहे हैं या डिलीवर हो चुके हैं।",
    earnings_title: "दुकान की कमाई और राजस्व",
    earnings_sub: "यमुनानगर और जगाधरी में अपनी कुल बिक्री, कन्फ़र्म ऑर्डर से आय और मिलने वाली राशि देखें।",
    stat_total_earnings: "कुल राजस्व",
    stat_confirmed_count: "कन्फ़र्म ऑर्डर",
    stat_pending_amount: "लंबित कैश कलेक्शन",
    stat_digital_upi: "डिजिटल यूपीआई कलेक्शन",
    earnings_history: "ऑर्डर अनुसार कमाई विवरण",
    payment_mgmt_title: "भुगतान प्रबंधन",
    payment_mgmt_sub: "भुगतान के तरीके, एकत्रित नकद और डिजिटल सेटलमेंट का विवरण देखें।",
    notifications_page_title: "सूचनाएं",
    notifications_page_sub: "ऑर्डर, ग्राहकों की पूछताछ और डिलीवरी स्थिति के सभी अपडेट।",

    // Shopkeeper Products
    add_product_title: "दुकान में नया उत्पाद जोड़ें",
    product_name: "उत्पाद का नाम",
    product_price: "कीमत (₹)",
    product_category: "श्रेणी",
    product_description: "विवरण",
    product_sizes: "उपलब्ध साइज़ (कॉमा लगाकर लिखें)",
    product_colors: "उपलब्ध रंग (कॉमा लगाकर लिखें)",
    product_image_url: "उत्पाद की तस्वीर का लिंक",
    btn_save_product: "उत्पाद सहेजें",
    product_status_available: "उपलब्ध",
    product_status_unavailable: "अनुपलब्ध",
    btn_mark_unavailable: "अनुपलब्ध चिह्नित करें",
    btn_mark_available: "उपलब्ध चिह्नित करें",
    btn_edit: "संशोधित करें",
    btn_delete: "हटाएं",

    // Shopkeeper Customer Requests
    incoming_requests: "ग्राहकों की आई हुई मांगें",
    customer_name: "ग्राहक",
    customer_area: "इलाका",
    inquiry_details: "मांग का विवरण",
    btn_reply_suggestion: "उत्पाद का सुझाव भेजें",
    suggestion_modal_title: "ग्राहक को उत्पाद का सुझाव दें",
    suggestion_product_name: "सुझाए गए उत्पाद का नाम",
    suggestion_price: "प्रस्तावित कीमत (₹)",
    suggestion_desc: "उत्पाद विवरण / विशेष नोट",
    suggestion_image: "उत्पाद फ़ोटो लिंक",
    btn_send_suggestion: "ग्राहक को सुझाव भेजें",

    // Shopkeeper Orders
    incoming_orders: "पूरे किए जाने वाले ऑर्डर",
    customer_contact: "ग्राहक का फ़ोन",
    fulfillment_method: "प्राप्ति माध्यम",
    order_items: "ऑर्डर किया गया सामान",
    total_bill: "कुल बिल",
    order_action: "स्थिति अपडेट करें",
    btn_accept: "ऑर्डर स्वीकार करें",
    btn_reject: "ऑर्डर अस्वीकार करें",
    btn_mark_preparing: "तैयार किया जा रहा है",
    btn_mark_ready_pickup: "लेने के लिए तैयार चिह्नित करें",
    btn_mark_out_delivery: "डिलीवरी के लिए निकला चिह्नित करें",
    btn_mark_delivered: "डिलीवर हो गया चिह्नित करें",
    btn_mark_collected: "दुकान से ले लिया गया चिह्नित करें",

    // Admin Dashboard
    admin_title: "नियरबाई एडमिन कंट्रोल पैनल",
    admin_sub: "प्लेटफ़ॉर्म प्रबंधन, दुकानों का सत्यापन और निगरानी।",
    admin_stat_users: "कुल ग्राहक",
    admin_stat_shopkeepers: "दुकानदार",
    admin_stat_shops: "पंजीकृत दुकानें",
    admin_stat_products: "कुल उत्पाद",
    admin_stat_orders: "कुल ऑर्डर",
    admin_tab_shops: "दुकानों का सत्यापन",
    admin_tab_products: "उत्पाद निगरानी",
    admin_tab_orders: "सभी ऑर्डर",
    btn_approve_shop: "दुकान स्वीकृत करें",
    btn_reject_shop: "दुकान अस्वीकृत करें",
    btn_remove: "हटाएं",

    // Common
    loading: "लोड हो रहा है...",
    success: "सफल",
    error: "त्रुटि",
    actions: "कार्रवाई",
    no_data: "कोई रिकॉर्ड नहीं मिला।",
    sample_badge: "प्रोटोटाइप डेमो",
    currency_symbol: "₹"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem("localfind_lang") || "en";
  }

  get lang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (lang === "en" || lang === "hi") {
      this.currentLang = lang;
      localStorage.setItem("localfind_lang", lang);
      document.documentElement.lang = lang;
      this.applyTranslations();
      window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
    }
  }

  t(key, fallback = "") {
    const dict = translations[this.currentLang] || translations.en;
    if (dict[key] !== undefined) {
      return dict[key];
    }
    const enDict = translations.en;
    if (enDict[key] !== undefined) {
      return enDict[key];
    }
    return fallback || key;
  }

  applyTranslations(container = document) {
    // Translate text content
    container.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const translated = this.t(key);
      if (translated) {
        el.textContent = translated;
      }
    });

    // Translate placeholders
    container.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const translated = this.t(key);
      if (translated) {
        el.placeholder = translated;
      }
    });

    // Translate titles / tooltips
    container.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      const translated = this.t(key);
      if (translated) {
        el.title = translated;
      }
    });

    // Highlight active language button
    document.querySelectorAll(".lang-btn").forEach(btn => {
      if (btn.dataset.lang === this.currentLang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }
}

window.i18n = new I18nManager();
window.t = (key, fallback) => window.i18n.t(key, fallback);
window.setLanguage = (lang) => window.i18n.setLang(lang);
