"""
database.py - Database setup and initialization for Nearby.
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

    cur.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT,
        phone TEXT UNIQUE NOT NULL,
        address TEXT NOT NULL,
        post_office TEXT,
        local_area TEXT,
        district TEXT,
        pincode TEXT NOT NULL,
        state TEXT NOT NULL,
        city TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        store_specialty TEXT,
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
        specialty TEXT NOT NULL,
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
        ref_image_url TEXT,
        image_data TEXT,
        color_mode TEXT,
        color_custom TEXT,
        brand_mode TEXT,
        brand_custom TEXT,
        size_chip TEXT,
        alteration_notes TEXT,
        clothing_type TEXT,
        sleeves TEXT,
        skincare_volume TEXT,
        skin_type TEXT,
        items_count INTEGER DEFAULT 1,
        makeup_type TEXT,
        makeup_shade TEXT,
        shoe_type TEXT,
        shoe_size TEXT,
        description TEXT,
        is_broadcasted INTEGER DEFAULT 0,
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
        fulfillment_mode TEXT DEFAULT 'delivery',
        route_requested INTEGER DEFAULT 0,
        delivery_lat REAL,
        delivery_lng REAL,
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
        delivery_status TEXT DEFAULT 'Order Placed',
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

    # Safe schema migration for district column in users
    cur.execute("PRAGMA table_info(users)")
    cols = [r[1] for r in cur.fetchall()]
    if "district" not in cols:
        cur.execute("ALTER TABLE users ADD COLUMN district TEXT")

    cur.execute("SELECT COUNT(*) FROM users")
    if cur.fetchone()[0] == 0:
        seed_sample_data(conn)

    conn.commit()
    conn.close()
    print("Database initialized successfully at:", DB_PATH)

def seed_sample_data(conn):
    cur = conn.cursor()

    # 1. Seed Users (with mandatory PIN code and authentic details)
    users_data = [
        # Customer
        (1, "Aman Sharma", "aman@example.com", "9876543210", "House No. 42, Civil Lines", "Yamunanagar H.O.", "Civil Lines", "135001", "Haryana", "Yamunanagar", "pass123", "customer", None, "en"),
        # Shopkeepers
        (2, "Rajesh Gupta", "rajesh@guptagarments.com", "9876543211", "Shop 12, Main Bazar, Jagadhri", "Jagadhri H.O.", "Main Bazar", "135003", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "Clothes & Apparel", "hi"),
        (3, "Pooja Verma", "pooja@glowcare.com", "9876543212", "Shop 5, Model Town Market", "Model Town S.O.", "Model Town", "135001", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "Beauty & Skincare", "en"),
        (4, "Suresh Kumar", "suresh@stepupfootwear.com", "9876543213", "Railway Road, Near Fountain Chowk", "Jagadhri H.O.", "Fountain Chowk", "135003", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "Footwear / Shoes", "hi"),
        (5, "Anita Mehra", "anita@eleganceboutique.com", "9876543214", "Shop 18, HUDA Complex, Sector 17", "Sector 17 S.O.", "Sector 17", "135001", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "Clothes & Apparel", "en"),
        (6, "Vikram Kapoor", "vikram@glamourcosmetics.com", "9876543215", "Shop 9, Fountain Chowk Market", "Jagadhri H.O.", "Fountain Chowk", "135003", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "Beauty & Skincare", "en"),
        (7, "Dr. Meenakshi Jain", "dr.jain@dermapureskin.com", "9876543216", "Near Civil Hospital, Jagadhri Road", "Jagadhri H.O.", "Hospital Road", "135003", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "Beauty & Skincare", "en"),
        (8, "Amit Batra", "amit@metrowalkshoes.com", "9876543217", "Shop 22, Model Town Main Market", "Model Town S.O.", "Model Town", "135001", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "Footwear / Shoes", "en"),
        (9, "Neha Singhal", "neha@rosepetalsbeauty.com", "9876543218", "Near Madhu Hotel, Model Town", "Model Town S.O.", "Model Town", "135001", "Haryana", "Yamunanagar", "pass123", "shopkeeper", "Beauty & Skincare", "en")
    ]
    cur.executemany("""
        INSERT INTO users (id, full_name, email, phone, address, post_office, local_area, pincode, state, city, password, role, store_specialty, preferred_lang)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, users_data)

    # 2. Seed Shops - Categorized with specialty tags
    shops_data = [
        # Clothes (Clothes & Apparel)
        (1, 2, "Gupta Garments & Fashion", "Shop 12, Main Bazar, Near Old Clock Tower", "Jagadhri", "Yamunanagar", "Haryana", "135003", "Clothes", "Clothes & Apparel",
         "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60", "9876543211", 1, "approved"),
        (4, 5, "Elegance Ethnic & Western Boutique", "Shop 18, HUDA Complex, Sector 17", "Model Town", "Yamunanagar", "Haryana", "135001", "Clothes", "Clothes & Apparel",
         "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=60", "9876543214", 1, "approved"),

        # Skincare (Beauty & Skincare)
        (2, 3, "Glow & Care Skincare Studio", "Shop 5, Model Town Central Market", "Model Town", "Yamunanagar", "Haryana", "135001", "Skincare", "Beauty & Skincare",
         "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60", "9876543212", 1, "approved"),
        (5, 7, "DermaPure Skin Wellness Clinic", "Near Civil Hospital, Jagadhri Road", "Jagadhri", "Yamunanagar", "Haryana", "135003", "Skincare", "Beauty & Skincare",
         "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60", "9876543216", 1, "approved"),

        # Beauty / Makeup (Beauty & Skincare)
        (6, 6, "Glamour Cosmetics & Makeup Lounge", "Shop 9, Fountain Chowk Market", "Jagadhri", "Yamunanagar", "Haryana", "135003", "Beauty / Makeup", "Beauty & Skincare",
         "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=60", "9876543215", 1, "approved"),
        (7, 9, "Rose Petals Beauty & Cosmetics Bar", "Near Madhu Hotel, Model Town", "Model Town", "Yamunanagar", "Haryana", "135001", "Beauty / Makeup", "Beauty & Skincare",
         "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=60", "9876543218", 1, "approved"),

        # Shoes (Footwear / Shoes)
        (3, 4, "StepUp Footwear Collection", "Railway Road, Near Fountain Chowk", "Jagadhri", "Yamunanagar", "Haryana", "135003", "Shoes", "Footwear / Shoes",
         "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60", "9876543213", 1, "approved"),
        (8, 8, "Metro Walk Shoe Lounge & Sneakers", "Shop 22, Model Town Main Market", "Model Town", "Yamunanagar", "Haryana", "135001", "Shoes", "Footwear / Shoes",
         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60", "9876543217", 1, "approved")
    ]
    cur.executemany("""
        INSERT INTO shops (id, owner_id, name, address, area, city, state, pincode, category, specialty, image_url, contact_number, is_open, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, shops_data)

    # 3. Seed Products explicitly mapped to each shop
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

        # Shop 4: Elegance Boutique (Clothes)
        (4, 4, "Clothes", "Floral Chiffon A-Line Summer Dress", 1299.0,
         "Flowy summer dress with sweetheart neckline, bell sleeves, and comfortable waist tie.",
         "S, M, L", "Soft Pink, Floral White",
         "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60", 1),
        (5, 4, "Clothes", "Linen Casual Straight Pants", 999.0,
         "Breathable pure linen trousers with elasticated waistband and deep side pockets.",
         "M, L, XL", "Beige, Olive Green",
         "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop&q=60", 1),

        # Shop 2: Glow & Care (Skincare)
        (6, 2, "Skincare", "Vitamin C Brightening Face Serum (30ml)", 499.0,
         "Enriched with pure 10% Vitamin C and Hyaluronic acid. Reduces dark spots and provides glowing skin.",
         "30ml", "Standard",
         "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60", 1),
        (7, 2, "Skincare", "Gentle Hydrating Foaming Cleanser (100ml)", 299.0,
         "Sulfate-free soothing cleanser with Aloe Vera and Green Tea extracts for sensitive and dry skin.",
         "100ml", "Standard",
         "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60", 1),
        (8, 2, "Skincare", "SPF 50 Ultra Matte Sunscreen Gel (50g)", 399.0,
         "Broad spectrum UVA/UVB protection with zero white cast and non-greasy water-resistant formula.",
         "50g", "Clear",
         "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=60", 1),

        # Shop 5: DermaPure Skin Clinic (Skincare)
        (9, 5, "Skincare", "Niacinamide 10% Pore Minimizing Serum (30ml)", 549.0,
         "Clinical grade clarifying formulation that unclogs pores, balances sebum, and repairs barrier.",
         "30ml", "Standard",
         "https://images.unsplash.com/photo-1608248597359-548a30dbf20c?w=500&auto=format&fit=crop&q=60", 1),
        (10, 5, "Skincare", "Ceramide Intense Barrier Repair Cream (50g)", 649.0,
         "Rich soothing moisturizer with 5 essential ceramides for compromised skin barriers.",
         "50g", "Standard",
         "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=60", 1),

        # Shop 6: Glamour Cosmetics (Beauty / Makeup)
        (11, 6, "Beauty / Makeup", "Velvet Matte Liquid Lipstick (Chili Red)", 399.0,
         "Long-lasting 12hr smudge-proof liquid lipstick with hydrating vitamin E.",
         "Standard", "Chili Red, Nude Pink, Berry Wine",
         "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=60", 1),
        (12, 6, "Beauty / Makeup", "Waterproof Precision Sketch Eyeliner (0.5ml)", 249.0,
         "Jet black 24hr stay with ultra-fine flexible tip for winged lines.",
         "0.5ml", "Jet Black",
         "https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?w=500&auto=format&fit=crop&q=60", 1),

        # Shop 7: Rose Petals Beauty (Beauty / Makeup)
        (13, 7, "Beauty / Makeup", "HD Mattifying Compact Powder SPF 25", 349.0,
         "Ultra-fine oil control powder that blurs imperfections with natural finish.",
         "9g", "Beige 01, Warm Sand 02, Honey 03",
         "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=60", 1),
        (14, 7, "Beauty / Makeup", "9-in-1 Rose Gold Eyeshadow Palette", 599.0,
         "Shimmer and matte highly pigmented buttery shades for party and daily looks.",
         "Standard", "Multi Rose Gold",
         "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&auto=format&fit=crop&q=60", 1),

        # Shop 3: StepUp Footwear (Shoes)
        (15, 3, "Shoes", "Mesh Breathable Running Sports Shoes", 1399.0,
         "Ultra-lightweight shock absorbing sole with responsive EVA cushioning.",
         "UK 6, 7, 8, 9, 10", "All Black, Grey Orange, Navy",
         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60", 1),
        (16, 3, "Shoes", "Handcrafted Tan Leather Formal Shoes", 1899.0,
         "Genuine leather lace-up derby shoes with padded memory foam insole.",
         "UK 7, 8, 9, 10", "Tan Brown, Classic Black",
         "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&auto=format&fit=crop&q=60", 1),

        # Shop 8: Metro Walk Shoes (Shoes)
        (17, 8, "Shoes", "Retro Casual Streetwear High-Top Sneakers", 1599.0,
         "Trendy high top vulcanized rubber sole sneakers with ankle support.",
         "UK 6, 7, 8, 9", "White Green, Panda Black & White",
         "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=60", 1),
        (18, 8, "Shoes", "Comfort Memory Foam Daily Slip-On Loafers", 999.0,
         "Easy slip on lightweight loafers for daily market walks and casual office wear.",
         "UK 6, 7, 8, 9, 10", "Dark Brown, Navy Blue",
         "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=60", 1)
    ]
    cur.executemany("""
        INSERT INTO products (id, shop_id, category, name, price, description, sizes, colors, image_url, is_available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, products_data)

    # 4. Seed Product Request & Responses
    cur.execute("""
        INSERT INTO product_requests (
            id, customer_id, shop_preference, selected_shop_id, state, city, area, pincode,
            category, request_mode, ref_image_url, color_mode, brand_mode, size_chip,
            alteration_notes, description, status
        ) VALUES (
            1, 1, 'specific', 1, 'Haryana', 'Yamunanagar', 'Civil Lines', '135001',
            'Clothes', 'image', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
            'Same as image', 'Specific brand', 'L', 'Need stitched cuffs',
            'Looking for navy blue pure cotton casual shirt in size L with button-down collar.',
            'Stock Offered'
        )
    """)

    cur.execute("""
        INSERT INTO request_responses (
            id, request_id, shop_id, product_id, product_name, price, description,
            image_url, availability, note, status
        ) VALUES (
            1, 1, 1, 1, 'Pure Cotton Slim-Fit Casual Shirt', 799.0,
            'Ready in stock! Size L Navy Blue available immediately with stitched cuffs.',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
            'Available', 'Can arrange counter pickup or deliver within 30 minutes.', 'selected'
        )
    """)

    # 5. Seed Orders
    cur.execute("""
        INSERT INTO orders (
            id, customer_id, shop_id, delivery_method, fulfillment_mode, route_requested,
            delivery_lat, delivery_lng, delivery_address, customer_name, customer_phone,
            customer_pincode, customer_city, customer_state, safety_acknowledged, payment_method,
            subtotal, delivery_fee, total_amount, delivery_status, status
        ) VALUES (
            1, 1, 1, 'Home Delivery', 'delivery', 0,
            30.1345, 77.2882, 'House No. 42, Civil Lines, Yamunanagar', 'Aman Sharma', '9876543210',
            '135001', 'Yamunanagar', 'Haryana', 1, 'Cash on Delivery',
            799.0, 30.0, 829.0, 'Delivered', 'Order Delivered'
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

    # 6. Seed Sample Review
    reviews_data = [
        (1, 1, 1, 1, "Aman Sharma", 5, "Excellent shirt quality! Delivered in 25 minutes.", 5, "Polite delivery partner, verified package at door.", "Yes", "Cotton texture is ultra soft.")
    ]
    cur.executemany("""
        INSERT INTO reviews (id, order_id, shop_id, customer_id, customer_name, shop_rating, shop_review, delivery_rating, delivery_review, product_satisfied, product_feedback)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, reviews_data)

    # 7. Seed Sample Notification
    cur.execute("""
        INSERT INTO notifications (user_id, title, title_hi, message, message_hi, type)
        VALUES (1, 'Welcome to Nearby', 'Nearby में आपका स्वागत है', 'Discover verified local shops near you in Yamunanagar & Jagadhri.', 'यमुनानगर और जगाधरी में अपने आस-पास की सत्यापित स्थानीय दुकानों की खोज करें।', 'success')
    """)

def reset_db():
    """Drop all tables and recreate clean database"""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.executescript("""
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS notifications;
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart_items;
    DROP TABLE IF EXISTS request_responses;
    DROP TABLE IF EXISTS product_requests;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS shops;
    DROP TABLE IF EXISTS users;
    """)
    conn.commit()
    conn.close()
    init_db()

if __name__ == "__main__":
    reset_db()
