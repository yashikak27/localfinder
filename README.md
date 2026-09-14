# LocalFind 🛍️🏪

**LocalFind** is a clean, modern, beginner-friendly, and responsive **hyperlocal product discovery and shopping web application**.

It allows residents to find out from home whether the item they want is available at nearby neighborhood shops, choose between self-pickup or doorstep delivery, and manage everything in both **English** and **हिंदी (Hindi)**.

---

## 🚀 Key Features

1. **Dual-Language Interface (English & हिंदी)**:
   - Instant language switching across all menus, buttons, forms, instructions, statuses, and safety guidelines.
   - Saves language preference across visits.
2. **First-Screen Welcome & Authentication**:
   - Registration with full validation (Phone number, full name, address, pincode, state, city, password).
   - Simple login with pre-configured demo credentials.
3. **Role Selection (Customer vs. Shopkeeper vs. Admin)**:
   - Clean separation of customer discovery vs. merchant management features.
4. **Customer Discovery & "Find an Item" 5-Step Wizard**:
   - **Step 1: Shop Preference**: Inquire with a *Specific Shop* or discover *Relevant Nearby Shops*.
   - **Step 2: Area Selection**: State (Haryana), City (Yamunanagar), Locality (Jagadhri, Model Town), Pincode.
   - **Step 3: Tell Us What You Need**:
     - *Option 1*: Upload an image with live preview + color, brand, size, and sleeve preferences.
     - *Option 2*: Enter details manually with category-adaptive forms for **Clothes**, **Skincare**, and **Shoes**.
   - **Step 4: Summary**: Review inquiry before submitting.
   - **Step 5: Shop Responses**: View matching suggestions with photos and prices from local shopkeepers.
5. **Fulfillment Choice**:
   - **"Let's Do It Myself" (Self Pickup)**: Shop address, contact number, and interactive route directions.
   - **"Let's Get It at Home" (Home Delivery)**: Address confirmation, delivery time estimate, and safety advisory banner (*"Your safety matters... Please do not rush the delivery partner..."*).
6. **Payment Options**:
   - Cash on Delivery (COD).
   - Google Pay / UPI demo payment simulation with mock QR.
7. **Order Tracking with Vertical Status Timeline**:
   - Visual timeline tracking each stage (*Order Confirmed -> Preparing / Ready for Pickup -> Out for Delivery -> Delivered / Collected*).
8. **Single-Shop Shopping Cart**:
   - Add items, adjust quantity, and enforce single-shop orders with friendly notices.
9. **3-Part Ratings & Feedback**:
   - Shop rating (1 to 5 stars + review).
   - Delivery rating (1 to 5 stars, only for home delivery).
   - Product satisfaction (*Yes / No* + feedback).
10. **Shopkeeper Control Center**:
    - Manage shop open/closed status.
    - Product catalog management (Add, Edit, Delete, Toggle Availability).
    - Customer requests inbox (review customer photos & reply with product suggestions and prices).
    - Order fulfillment and live status progression.
11. **Admin Control Panel**:
    - Platform oversight, shopkeeper verification (Approve/Reject), and product moderation.

---

## 📂 Project Structure

```
localfind/
├── server.py               # Lightweight Python HTTP & REST API server (zero external pip packages needed)
├── database.py             # SQLite schema creation & seed data (Yamunanagar & Jagadhri shops/products)
├── verify_backend.py       # End-to-end automated test suite verifying all 11 core workflows
├── run.bat                 # 1-click Windows startup script
├── README.md               # Beginner-friendly documentation and guide
└── static/                 # Frontend assets served directly to the browser
    ├── index.html          # Main application document shell & modal dialogs
    ├── css/
    │   ├── styles.css      # Core design system, variables, cards, buttons, layouts
    │   ├── components.css  # Stepper, timeline, star ratings, safety banner, mock QR
    │   └── responsive.css  # Mobile and tablet responsive adaptations
    └── js/
        ├── i18n.js         # Complete English & Hindi translation dictionaries and switcher
        ├── state.js        # Global client-side reactive state (user session, cart, active view)
        ├── api.js          # REST API client
        ├── app.js          # Router, header/footer controller, modals & toast alerts
        └── views/
            ├── auth.js     # Registration, Login, Role Selection, Language Modal
            ├── customer.js # Customer Home, Categories, Find an Item Wizard, Shop Explorer
            ├── cart.js     # Cart page & Single-shop restriction verification
            ├── orders.js   # Fulfillment, Payment, Vertical Status Timeline, Ratings
            ├── profile.js  # Customer Profile view & editor
            ├── shopkeeper.js # Shopkeeper Dashboard, Catalog CRUD, Requests & Orders
            └── admin.js    # Admin Verification & Moderation Panel
```

---

## 🚀 How to Run the Project

### Option A: Using Windows One-Click Script
Double-click `run.bat` or run:
```cmd
run.bat
```

### Option B: Using Python directly (Standard Python 3)
No external `pip` installations are required! Standard library modules (`http.server`, `sqlite3`, `json`) are used.
```powershell
python server.py
```
Or with specific Python path:
```powershell
C:\Users\DELL\.local\bin\python3.14.exe server.py
```

Now open your web browser at:
👉 **[http://localhost:8000](http://localhost:8000)**

---

## 🔑 Pre-Configured Demo Accounts for Quick Testing

You can use the **1-Click Demo Buttons** in the top bar or enter credentials manually:

| Role | Name / Shop | Phone Number | Password |
|---|---|---|---|
| **Customer** | Aman Sharma | `9876543210` | `pass123` |
| **Shopkeeper** | Gupta Garments (Clothes, Jagadhri) | `9876543211` | `pass123` |
| **Shopkeeper** | Glow & Care Beauty (Skincare, Model Town) | `9876543212` | `pass123` |
| **Shopkeeper** | StepUp Footwear (Shoes, Jagadhri) | `9876543213` | `pass123` |
| **Admin** | Platform Administrator | `9999999999` | `admin123` |

---

## 🧪 Running Automated Tests

To test all 11 core backend and database operations (registration, shop filters, product inquiries, shopkeeper replies, single-shop cart restrictions, home delivery vs self-pickup, status timeline updates, ratings, and admin oversight):

1. Make sure `server.py` is running on port 8000.
2. In a separate terminal run:
```powershell
python verify_backend.py
```
