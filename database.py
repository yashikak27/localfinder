"""
database.py - Database setup and initialization for LocalFind.
Uses standard Python sqlite3 with realistic sample data.
"""
import sqlite3
import os
import json
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "localfind.db"

def get_db_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()

    # Create tables
    cur.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        address TEXT,
        pincode TEXT,
        state TEXT,
        city TEXT,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        preferred_lang TEXT DEFAULT 'en',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS shops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        area TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pincode TEXT NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT,
        contact_number TEXT,
        is_open INTEGER DEFAULT 1,
        status TEXT DEFAULT 'approved',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        sizes TEXT,
        colors TEXT,
        image_url TEXT,
        is_available INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        shop_preference TEXT NOT NULL,
        selected_shop_id INTEGER REFERENCES shops(id) ON DELETE SET NULL,
        state TEXT,
        city TEXT,
        area TEXT,
        pincode TEXT,
        category TEXT NOT NULL,
        request_mode TEXT NOT NULL,
        image_data TEXT,
        color_pref TEXT,
        brand_pref TEXT,
        size_pref TEXT,
        clothing_type TEXT,
        sleeves TEXT,
        skincare_concern TEXT,
        budget REAL,
        shoe_type TEXT,
        description TEXT,
        status TEXT DEFAULT 'Request Submitted',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS request_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER REFERENCES product_requests(id) ON DELETE CASCADE,
        shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
        product_name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image_url TEXT,
        availability TEXT DEFAULT 'Available',
        note TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        product_name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER DEFAULT 1,
        size TEXT,
        color TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
        delivery_method TEXT NOT NULL,
        delivery_address TEXT,
        customer_name TEXT,
        customer_phone TEXT,
        customer_pincode TEXT,
        customer_city TEXT,
        customer_state TEXT,
        safety_acknowledged INTEGER DEFAULT 1,
        payment_method TEXT NOT NULL,
        subtotal REAL NOT NULL,
        delivery_fee REAL NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'Order Confirmed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER,
        product_name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        size TEXT,
        color TEXT,
        image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        title_hi TEXT,
        message TEXT NOT NULL,
        message_hi TEXT,
        type TEXT DEFAULT 'info',
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
        customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        customer_name TEXT,
        shop_rating INTEGER,
        shop_review TEXT,
        delivery_rating INTEGER,
        delivery_review TEXT,
        product_satisfied TEXT,
        product_feedback TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Seed initial data if empty
    cur.execute("SELECT COUNT(*) FROM users")
    if cur.fetchone()[0] == 0:
        seed_sample_data(conn)

    conn.commit()
    conn.close()
    print("Database initialized successfully at:", DB_PATH)

def seed_sample_data(conn):
    cur = conn.cursor()

    # 1. Seed Users
    users_data = [
        # Customer
        (1, "Aman Sharma", "9876543210", "House No. 42, Civil Lines", "135001", "Haryana", "Yamunanagar", "pass123", "customer", "en"),
        # Shopkeepers
        (2, "Rajesh Gupta", "9876543211", "Shop 12, Main Bazar, Jagadhri", "135003", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "hi"),
        (3, "Pooja Verma", "9876543212", "Shop 5, Model Town Market", "135001", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "en"),
        (4, "Suresh Kumar", "9876543213", "Railway Road, Near Fountain Chowk", "135003", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "hi"),
        (5, "Anita Mehra", "9876543214", "Sector 17, HUDA Complex", "135001", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "en"),
        # Admin
        (6, "LocalFind Admin", "9999999999", "HQ Office, Jagadhri Road", "135001", "Haryana", "Yamunanagar", "admin123", "admin", "en")
    ]
    cur.executemany("""
        INSERT INTO users (id, full_name, phone, address, pincode, state, city, password, role, preferred_lang)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, users_data)

    # 2. Seed Shops
    shops_data = [
        (1, 2, "Gupta Garments & Fashion", "Shop 12, Main Bazar, Near Old Clock Tower", "Jagadhri", "Yamunanagar", "Haryana", "135003", "Clothes", 
         "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60", "9876543211", 1, "approved"),
        (2, 3, "Glow & Care Beauty Hub", "Shop 5, Model Town Central Market", "Model Town", "Yamunanagar", "Haryana", "135001", "Skincare",
         "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60", "9876543212", 1, "approved"),
        (3, 4, "StepUp Footwear Collection", "Railway Road, Near Fountain Chowk", "Jagadhri", "Yamunanagar", "Haryana", "135003", "Shoes",
         "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60", "9876543213", 1, "approved"),
        (4, 5, "Elegance Ethnic & Western Boutique", "Shop 18, HUDA Complex, Sector 17", "Model Town", "Yamunanagar", "Haryana", "135001", "Clothes",
         "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=60", "9876543214", 1, "approved")
    ]
    cur.executemany("""
        INSERT INTO shops (id, owner_id, name, address, area, city, state, pincode, category, image_url, contact_number, is_open, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, shops_data)

    # 3. Seed Products
    products_data = [
        # Shop 1: Gupta Garments (Clothes)
        (1, 1, "Clothes", "Pure Cotton Slim-Fit Casual Shirt", 799.0, 
         "100% breathable cotton shirt, spread collar, full sleeves. Perfect for summer and office casuals.",
         "M, L, XL, XXL", "Navy Blue, Sky Blue, White",
         "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60", 1),
        (2, 1, "Clothes", "Classic Stretchable Denim Jeans", 1199.0,
         "Durable washed denim with comfortable stretch waist. High durability and modern fit.",
         "30, 32, 34, 36", "Dark Blue, Slate Grey",
         "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60", 1),
        (3, 1, "Clothes", "Embroidered Festive Kurti", 899.0,
         "Handcrafted ethnic kurti with fine thread embroidery on rayon fabric. 3/4 sleeves.",
         "S, M, L, XL", "Mustard Yellow, Maroon",
         "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=60", 1),
        
        # Shop 2: Glow & Care (Skincare)
        (4, 2, "Skincare", "Vitamin C Brightening Face Serum (30ml)", 499.0,
         "Enriched with pure 10% Vitamin C and Hyaluronic acid. Reduces dark spots and provides glowing skin.",
         "30ml", "Standard",
         "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60", 1),
        (5, 2, "Skincare", "Gentle Hydrating Foaming Cleanser (100ml)", 299.0,
         "Sulfate-free soothing cleanser with Aloe Vera and Green Tea extracts for sensitive and dry skin.",
         "100ml", "Standard",
         "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60", 1),
        (6, 2, "Skincare", "SPF 50 Ultra Matte Sunscreen Gel (50g)", 399.0,
         "Broad spectrum UVA/UVB protection with zero white cast and non-greasy water-resistant formula.",
         "50g", "Clear",
         "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=60", 1),

        # Shop 3: StepUp Footwear (Shoes)
        (7, 3, "Shoes", "Lightweight Breathable Running Shoes", 1399.0,
         "High-cushion EVA sole, breathable air-mesh fabric, ideal for daily running and gym training.",
         "7, 8, 9, 10, 11", "Black/Red, Grey/Neon",
         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60", 1),
        (8, 3, "Shoes", "Handcrafted Leather Formal Oxford Shoes", 1899.0,
         "Genuine premium synthetic leather, anti-slip rubber sole, lace-up design for formal office wear.",
         "7, 8, 9, 10", "Tan Brown, Jet Black",
         "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&auto=format&fit=crop&q=60", 1),
        (9, 3, "Shoes", "Everyday Canvas Slip-On Sneakers", 749.0,
         "Easy slip-on canvas shoes with memory foam insole and vulcanized rubber sole.",
         "6, 7, 8, 9, 10", "Navy Blue, All White",
         "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format&fit=crop&q=60", 1),

        # Shop 4: Elegance Boutique (Clothes)
        (10, 4, "Clothes", "Floral Chiffon A-Line Summer Dress", 1299.0,
         "Flowy summer dress with sweetheart neckline, bell sleeves, and comfortable waist tie.",
         "S, M, L", "Soft Pink, Floral White",
         "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60", 1),
        (11, 4, "Clothes", "Linen Casual Straight Pants", 999.0,
         "Breathable pure linen trousers with elasticated waistband and deep side pockets.",
         "M, L, XL", "Beige, Olive Green",
         "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop&q=60", 1),

        # Shop 2: Glow & Care (Beauty / Makeup)
        (12, 2, "Beauty / Makeup", "Matte Long-Lasting Velvet Lipstick", 449.0,
         "Weightless creamy formula with intense pigment and 12-hour smudge-proof stay.",
         "Standard", "Ruby Red, Rose Nude",
         "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=60", 1),
        (13, 2, "Beauty / Makeup", "Waterproof Precision Liquid Eyeliner", 299.0,
         "Ultra-fine tip applicator for crisp wings and smudge-free 24-hour waterproof finish.",
         "1.5ml", "Jet Black",
         "https://images.unsplash.com/photo-1631730486784-545631bc3780?w=500&auto=format&fit=crop&q=60", 1),
        (14, 2, "Beauty / Makeup", "Oil-Control Mineral Finishing Powder", 399.0,
         "Micro-fine translucent pressed powder that blurs pores and locks makeup with a natural matte glow.",
         "9g", "Warm Beige, Natural",
         "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60", 1)
    ]
    cur.executemany("""
        INSERT INTO products (id, shop_id, category, name, price, description, sizes, colors, image_url, is_available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, products_data)

    # 4. Seed a Sample Request and Response for immediate demo demonstration
    cur.execute("""
        INSERT INTO product_requests (
            id, customer_id, shop_preference, selected_shop_id, state, city, area, pincode,
            category, request_mode, color_pref, brand_pref, size_pref, clothing_type, sleeves, description, status
        ) VALUES (
            1, 1, 'specific', 1, 'Haryana', 'Yamunanagar', 'Jagadhri', '135003',
            'Clothes', 'manual', 'Navy Blue', 'Any brand', 'L', 'Upper / Top', 'Full',
            'Looking for a smart navy blue cotton shirt for an upcoming family function this weekend.',
            'Product Suggested'
        )
    """)

    cur.execute("""
        INSERT INTO request_responses (
            id, request_id, shop_id, product_id, product_name, price, description, image_url, availability, note, status
        ) VALUES (
            1, 1, 1, 1, 'Pure Cotton Slim-Fit Casual Shirt', 799.0,
            'We have this premium navy blue cotton shirt in stock in size L. High quality fabric and perfect stitching.',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
            'Available', 'You can visit our shop at Main Bazar or place a delivery order directly.', 'pending'
        )
    """)

    # 5. Seed Sample Orders (Delivered, Preparing, Ready for Pickup)
    cur.execute("""
        INSERT INTO orders (
            id, customer_id, shop_id, delivery_method, delivery_address, customer_name, customer_phone,
            customer_pincode, customer_city, customer_state, safety_acknowledged, payment_method,
            subtotal, delivery_fee, total_amount, status
        ) VALUES (
            1, 1, 1, 'Home Delivery', 'House No. 42, Civil Lines, Yamunanagar', 'Aman Sharma', '9876543210',
            '135001', 'Yamunanagar', 'Haryana', 1, 'Cash on Delivery',
            799.0, 30.0, 829.0, 'Delivered'
        )
    """)

    cur.execute("""
        INSERT INTO order_items (
            order_id, product_id, product_name, price, quantity, size, color, image_url
        ) VALUES (
            1, 1, 'Pure Cotton Slim-Fit Casual Shirt', 799.0, 1, 'L', 'Navy Blue',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60'
        )
    """)

    cur.execute("""
        INSERT INTO orders (
            id, customer_id, shop_id, delivery_method, delivery_address, customer_name, customer_phone,
            customer_pincode, customer_city, customer_state, safety_acknowledged, payment_method,
            subtotal, delivery_fee, total_amount, status
        ) VALUES (
            2, 1, 1, 'Home Delivery', 'House No. 42, Civil Lines, Yamunanagar', 'Aman Sharma', '9876543210',
            '135001', 'Yamunanagar', 'Haryana', 1, 'Google Pay / UPI',
            1199.0, 30.0, 1229.0, 'Preparing'
        )
    """)

    cur.execute("""
        INSERT INTO order_items (
            order_id, product_id, product_name, price, quantity, size, color, image_url
        ) VALUES (
            2, 2, 'Classic Stretchable Denim Jeans', 1199.0, 1, '32', 'Dark Blue',
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60'
        )
    """)

    cur.execute("""
        INSERT INTO orders (
            id, customer_id, shop_id, delivery_method, delivery_address, customer_name, customer_phone,
            customer_pincode, customer_city, customer_state, safety_acknowledged, payment_method,
            subtotal, delivery_fee, total_amount, status
        ) VALUES (
            3, 1, 1, 'Self Pickup', 'Shop 12, Main Bazar, Jagadhri', 'Aman Sharma', '9876543210',
            '135003', 'Yamunanagar', 'Haryana', 1, 'Cash on Delivery',
            899.0, 0.0, 899.0, 'Ready for Pickup'
        )
    """)

    cur.execute("""
        INSERT INTO order_items (
            order_id, product_id, product_name, price, quantity, size, color, image_url
        ) VALUES (
            3, 3, 'Embroidered Festive Kurti', 899.0, 1, 'M', 'Mustard Yellow',
            'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=60'
        )
    """)

    # 6. Seed Sample Review
    cur.execute("""
        INSERT INTO reviews (
            order_id, shop_id, customer_id, customer_name, shop_rating, shop_review,
            delivery_rating, delivery_review, product_satisfied, product_feedback
        ) VALUES (
            1, 1, 1, 'Aman Sharma', 5, 'Excellent quality shirt and quick response from shopkeeper Rajesh ji!',
            5, 'Delivery was on time and very polite partner.', 'Yes', 'Fabric is very soft and fits well.'
        )
    """)

    # 7. Seed Sample Notifications
    notifications_data = [
        (1, "Welcome to LocalFind!", "लोकलफाइंड में आपका स्वागत है!",
         "Discover local shops in Yamunanagar & Jagadhri and find what you need without traveling!",
         "यमुनानगर और जगाधरी की स्थानीय दुकानों को खोजें और बिना भटके सामान पाएं!", "info"),
        (1, "Shopkeeper Suggested a Product", "दुकानदार ने उत्पाद का सुझाव दिया",
         "Gupta Garments has sent a suggestion for your shirt request #1.",
         "गुप्ता गारमेंट्स ने आपकी शर्ट की मांग #1 के लिए उत्पाद का सुझाव भेजा है।", "request")
    ]
    cur.executemany("""
        INSERT INTO notifications (user_id, title, title_hi, message, message_hi, type)
        VALUES (?, ?, ?, ?, ?, ?)
    """, notifications_data)

if __name__ == "__main__":
    init_db()
