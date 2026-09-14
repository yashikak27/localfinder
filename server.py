"""
server.py - Lightweight, zero-dependency REST API and static file server for LocalFind.
Runs using standard Python 3 libraries: http.server, sqlite3, json, urllib.
"""
import http.server
import socketserver
import json
import urllib.parse
import os
import sys
from pathlib import Path
import sqlite3
import database

PORT = 8000
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

class LocalFindHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def _set_json_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_json_headers(204)

    def _read_json_body(self):
        content_len = int(self.headers.get("Content-Length", 0))
        if content_len == 0:
            return {}
        body = self.rfile.read(content_len)
        try:
            return json.loads(body.decode("utf-8"))
        except Exception:
            return {}

    def _send_json(self, data, status=200):
        self._set_json_headers(status)
        self.wfile.write(json.dumps(data, default=str).encode("utf-8"))

    def _send_error(self, message, status=400):
        self._send_json({"success": False, "error": message}, status=status)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Serve API routes
        if path.startswith("/api/"):
            try:
                self.handle_api_get(path, query)
            except Exception as e:
                self._send_error(str(e), status=500)
            return

        # Serve root -> index.html
        if path == "/" or path == "":
            self.path = "/index.html"
            return super().do_GET()

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path.startswith("/api/"):
            try:
                data = self._read_json_body()
                self.handle_api_post(path, data)
            except Exception as e:
                self._send_error(str(e), status=500)
            return
        self._send_error("Not Found", status=404)

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)
        if path.startswith("/api/"):
            try:
                data = self._read_json_body()
                self.handle_api_put(path, query, data)
            except Exception as e:
                self._send_error(str(e), status=500)
            return
        self._send_error("Not Found", status=404)

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)
        if path.startswith("/api/"):
            try:
                self.handle_api_delete(path, query)
            except Exception as e:
                self._send_error(str(e), status=500)
            return
        self._send_error("Not Found", status=404)

    # ---------------- API GET ROUTES ----------------
    def handle_api_get(self, path, query):
        conn = database.get_db_connection()
        cur = conn.cursor()

        # Current user profile
        if path == "/api/auth/me":
            user_id = query.get("user_id", [None])[0]
            if not user_id:
                self._send_error("User ID required", 400)
                conn.close()
                return
            cur.execute("SELECT id, full_name, phone, address, pincode, state, city, role, preferred_lang FROM users WHERE id = ?", (user_id,))
            user = cur.fetchone()
            if not user:
                self._send_error("User not found", 404)
                conn.close()
                return
            user_dict = dict(user)
            if user_dict["role"] == "shopkeeper":
                cur.execute("SELECT * FROM shops WHERE owner_id = ?", (user_dict["id"],))
                shop = cur.fetchone()
                user_dict["shop"] = dict(shop) if shop else None
            self._send_json({"success": True, "user": user_dict})
            conn.close()
            return

        # List shops
        if path == "/api/shops":
            category = query.get("category", [None])[0]
            area = query.get("area", [None])[0]
            city = query.get("city", [None])[0]
            search = query.get("search", [None])[0]

            sql = "SELECT * FROM shops WHERE status = 'approved'"
            params = []
            if category and category != "All":
                sql += " AND category LIKE ?"
                params.append(f"%{category}%")
            if area and area != "All":
                sql += " AND area = ?"
                params.append(area)
            if city and city != "All":
                sql += " AND city = ?"
                params.append(city)
            if search:
                sql += " AND (name LIKE ? OR address LIKE ? OR category LIKE ?)"
                params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

            sql += " ORDER BY is_open DESC, id ASC"
            cur.execute(sql, params)
            shops = [dict(row) for row in cur.fetchall()]

            # Attach average rating & product count
            for s in shops:
                cur.execute("SELECT AVG(shop_rating), COUNT(*) FROM reviews WHERE shop_id = ?", (s["id"],))
                r = cur.fetchone()
                s["avg_rating"] = round(r[0], 1) if r[0] else 4.8
                s["review_count"] = r[1]
                cur.execute("SELECT COUNT(*) FROM products WHERE shop_id = ? AND is_available = 1", (s["id"],))
                s["product_count"] = cur.fetchone()[0]

            self._send_json({"success": True, "shops": shops})
            conn.close()
            return

        # Single shop details
        if path.startswith("/api/shops/"):
            shop_id = path.replace("/api/shops/", "").strip()
            cur.execute("SELECT * FROM shops WHERE id = ?", (shop_id,))
            shop = cur.fetchone()
            if not shop:
                self._send_error("Shop not found", 404)
                conn.close()
                return
            shop_dict = dict(shop)
            # Products
            cur.execute("SELECT * FROM products WHERE shop_id = ?", (shop_id,))
            shop_dict["products"] = [dict(p) for p in cur.fetchall()]
            # Reviews
            cur.execute("SELECT * FROM reviews WHERE shop_id = ? ORDER BY id DESC", (shop_id,))
            shop_dict["reviews"] = [dict(r) for r in cur.fetchall()]
            cur.execute("SELECT AVG(shop_rating) FROM reviews WHERE shop_id = ?", (shop_id,))
            avg = cur.fetchone()[0]
            shop_dict["avg_rating"] = round(avg, 1) if avg else 4.8
            self._send_json({"success": True, "shop": shop_dict})
            conn.close()
            return

        # List products
        if path == "/api/products":
            shop_id = query.get("shop_id", [None])[0]
            category = query.get("category", [None])[0]
            search = query.get("search", [None])[0]

            sql = "SELECT p.*, s.name as shop_name, s.area as shop_area, s.city as shop_city FROM products p JOIN shops s ON p.shop_id = s.id WHERE 1=1"
            params = []
            if shop_id:
                sql += " AND p.shop_id = ?"
                params.append(shop_id)
            if category and category != "All":
                sql += " AND p.category = ?"
                params.append(category)
            if search:
                sql += " AND (p.name LIKE ? OR p.description LIKE ?)"
                params.extend([f"%{search}%", f"%{search}%"])

            sql += " ORDER BY p.id ASC"
            cur.execute(sql, params)
            products = [dict(row) for row in cur.fetchall()]
            self._send_json({"success": True, "products": products})
            conn.close()
            return

        # Single product
        if path.startswith("/api/products/"):
            prod_id = path.replace("/api/products/", "").strip()
            cur.execute("SELECT p.*, s.name as shop_name, s.address as shop_address, s.area as shop_area, s.contact_number as shop_contact FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.id = ?", (prod_id,))
            prod = cur.fetchone()
            if not prod:
                self._send_error("Product not found", 404)
                conn.close()
                return
            self._send_json({"success": True, "product": dict(prod)})
            conn.close()
            return

        # List requests
        if path == "/api/requests":
            customer_id = query.get("customer_id", [None])[0]
            shop_id = query.get("shop_id", [None])[0]

            if customer_id:
                cur.execute("""
                    SELECT r.*, s.name as shop_name, s.address as shop_address 
                    FROM product_requests r 
                    LEFT JOIN shops s ON r.selected_shop_id = s.id 
                    WHERE r.customer_id = ? 
                    ORDER BY r.id DESC
                """, (customer_id,))
            elif shop_id:
                # Find requests sent specifically to this shop OR nearby requests matching shop category and area
                cur.execute("SELECT category, area, city FROM shops WHERE id = ?", (shop_id,))
                shop_info = cur.fetchone()
                if shop_info:
                    cur.execute("""
                        SELECT r.*, u.full_name as customer_name, u.phone as customer_phone
                        FROM product_requests r
                        JOIN users u ON r.customer_id = u.id
                        WHERE r.selected_shop_id = ? 
                           OR (r.shop_preference = 'nearby' AND r.category = ? AND r.city = ?)
                        ORDER BY r.id DESC
                    """, (shop_id, shop_info["category"], shop_info["city"]))
                else:
                    cur.execute("SELECT r.*, u.full_name as customer_name, u.phone as customer_phone FROM product_requests r JOIN users u ON r.customer_id = u.id WHERE r.selected_shop_id = ? ORDER BY r.id DESC", (shop_id,))
            else:
                cur.execute("SELECT r.*, u.full_name as customer_name FROM product_requests r JOIN users u ON r.customer_id = u.id ORDER BY r.id DESC")

            requests = [dict(row) for row in cur.fetchall()]
            # Attach responses count and responses
            for req in requests:
                cur.execute("SELECT resp.*, s.name as shop_name FROM request_responses resp JOIN shops s ON resp.shop_id = s.id WHERE resp.request_id = ? ORDER BY resp.id DESC", (req["id"],))
                req["responses"] = [dict(r) for r in cur.fetchall()]

            self._send_json({"success": True, "requests": requests})
            conn.close()
            return

        # Single request
        if path.startswith("/api/requests/"):
            req_id = path.replace("/api/requests/", "").split("/")[0].strip()
            cur.execute("SELECT r.*, u.full_name as customer_name, u.phone as customer_phone, s.name as shop_name, s.address as shop_address FROM product_requests r JOIN users u ON r.customer_id = u.id LEFT JOIN shops s ON r.selected_shop_id = s.id WHERE r.id = ?", (req_id,))
            req = cur.fetchone()
            if not req:
                self._send_error("Request not found", 404)
                conn.close()
                return
            req_dict = dict(req)
            cur.execute("SELECT resp.*, s.name as shop_name, s.address as shop_address, s.contact_number as shop_contact FROM request_responses resp JOIN shops s ON resp.shop_id = s.id WHERE resp.request_id = ? ORDER BY resp.id DESC", (req_id,))
            req_dict["responses"] = [dict(r) for r in cur.fetchall()]
            self._send_json({"success": True, "request": req_dict})
            conn.close()
            return

        # Get Cart
        if path == "/api/cart":
            customer_id = query.get("customer_id", [None])[0]
            if not customer_id:
                self._send_error("Customer ID required", 400)
                conn.close()
                return
            cur.execute("""
                SELECT c.*, s.name as shop_name 
                FROM cart_items c 
                JOIN shops s ON c.shop_id = s.id 
                WHERE c.customer_id = ?
            """, (customer_id,))
            items = [dict(row) for row in cur.fetchall()]
            subtotal = sum(item["price"] * item["quantity"] for item in items)
            delivery_fee = 30.0 if items else 0.0
            shop_id = items[0]["shop_id"] if items else None
            shop_name = items[0]["shop_name"] if items else None

            self._send_json({
                "success": True,
                "items": items,
                "subtotal": subtotal,
                "delivery_fee": delivery_fee,
                "total": subtotal + delivery_fee,
                "shop_id": shop_id,
                "shop_name": shop_name,
                "item_count": sum(item["quantity"] for item in items)
            })
            conn.close()
            return

        # Get Orders
        if path == "/api/orders":
            customer_id = query.get("customer_id", [None])[0]
            shop_id = query.get("shop_id", [None])[0]
            status_filter = query.get("status_filter", [None])[0]

            if customer_id:
                cur.execute("""
                    SELECT o.*, s.name as shop_name, s.address as shop_address, s.contact_number as shop_contact
                    FROM orders o
                    JOIN shops s ON o.shop_id = s.id
                    WHERE o.customer_id = ?
                    ORDER BY o.id DESC
                """, (customer_id,))
            elif shop_id:
                if status_filter == "confirmed":
                    cur.execute("""
                        SELECT o.*, s.name as shop_name
                        FROM orders o
                        JOIN shops s ON o.shop_id = s.id
                        WHERE o.shop_id = ? AND o.status IN ('Confirmed', 'Order Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Collected')
                        ORDER BY o.id DESC
                    """, (shop_id,))
                else:
                    cur.execute("""
                        SELECT o.*, s.name as shop_name
                        FROM orders o
                        JOIN shops s ON o.shop_id = s.id
                        WHERE o.shop_id = ?
                        ORDER BY o.id DESC
                    """, (shop_id,))
            else:
                cur.execute("SELECT o.*, s.name as shop_name FROM orders o JOIN shops s ON o.shop_id = s.id ORDER BY o.id DESC")

            orders = [dict(row) for row in cur.fetchall()]
            for o in orders:
                cur.execute("SELECT * FROM order_items WHERE order_id = ?", (o["id"],))
                o["items"] = [dict(it) for it in cur.fetchall()]
                cur.execute("SELECT * FROM reviews WHERE order_id = ?", (o["id"],))
                r = cur.fetchone()
                o["review"] = dict(r) if r else None

            self._send_json({"success": True, "orders": orders})
            conn.close()
            return

        # Get Shopkeeper Earnings
        if path == "/api/earnings":
            shop_id = query.get("shop_id", [None])[0]
            if not shop_id:
                self._send_error("Shop ID required", 400)
                conn.close()
                return

            cur.execute("SELECT COUNT(*) FROM orders WHERE shop_id = ?", (shop_id,))
            total_orders = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM orders WHERE shop_id = ? AND status IN ('Confirmed', 'Order Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Collected')", (shop_id,))
            confirmed_orders = cur.fetchone()[0]

            cur.execute("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE shop_id = ? AND status IN ('Confirmed', 'Order Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Collected')", (shop_id,))
            total_earnings = cur.fetchone()[0]

            cur.execute("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE shop_id = ? AND status IN ('Confirmed', 'Order Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery') AND payment_method = 'Cash on Delivery'", (shop_id,))
            pending_amount = cur.fetchone()[0]

            cur.execute("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE shop_id = ? AND status IN ('Confirmed', 'Order Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Collected') AND payment_method LIKE '%UPI%'", (shop_id,))
            upi_earnings = cur.fetchone()[0]

            cur.execute("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE shop_id = ? AND status IN ('Delivered', 'Collected') AND payment_method = 'Cash on Delivery'", (shop_id,))
            cod_collected = cur.fetchone()[0]

            cur.execute("""
                SELECT id, customer_name, total_amount, payment_method, delivery_method, status, created_at
                FROM orders
                WHERE shop_id = ? AND status IN ('Confirmed', 'Order Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Collected')
                ORDER BY id DESC
            """, (shop_id,))
            breakdown = [dict(r) for r in cur.fetchall()]

            earnings_data = {
                "total_orders": total_orders,
                "confirmed_orders": confirmed_orders,
                "total_earnings": round(total_earnings, 2),
                "pending_amount": round(pending_amount, 2),
                "pending_cod": round(pending_amount, 2),
                "upi_earnings": round(upi_earnings, 2),
                "cod_collected": round(cod_collected, 2),
                "breakdown": breakdown
            }
            self._send_json({
                "success": True,
                **earnings_data,
                "earnings": earnings_data
            })
            conn.close()
            return

        # Get Single Order
        if path.startswith("/api/orders/"):
            order_id = path.replace("/api/orders/", "").strip()
            cur.execute("""
                SELECT o.*, s.name as shop_name, s.address as shop_address, s.contact_number as shop_contact
                FROM orders o
                JOIN shops s ON o.shop_id = s.id
                WHERE o.id = ?
            """, (order_id,))
            order = cur.fetchone()
            if not order:
                self._send_error("Order not found", 404)
                conn.close()
                return
            order_dict = dict(order)
            cur.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,))
            order_dict["items"] = [dict(it) for it in cur.fetchall()]
            cur.execute("SELECT * FROM reviews WHERE order_id = ?", (order_id,))
            r = cur.fetchone()
            order_dict["review"] = dict(r) if r else None
            self._send_json({"success": True, "order": order_dict})
            conn.close()
            return

        # Notifications
        if path == "/api/notifications":
            user_id = query.get("user_id", [None])[0]
            if not user_id:
                self._send_error("User ID required", 400)
                conn.close()
                return
            cur.execute("SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 20", (user_id,))
            notifications = [dict(row) for row in cur.fetchall()]
            unread_count = sum(1 for n in notifications if not n["is_read"])
            self._send_json({"success": True, "notifications": notifications, "unread_count": unread_count})
            conn.close()
            return

        # Admin overview
        if path == "/api/admin/overview":
            cur.execute("SELECT COUNT(*) FROM users WHERE role = 'customer'")
            total_customers = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM users WHERE role = 'shopkeeper'")
            total_shopkeepers = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM shops")
            total_shops = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM products")
            total_products = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM orders")
            total_orders = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM product_requests")
            total_requests = cur.fetchone()[0]

            cur.execute("SELECT * FROM shops ORDER BY id DESC")
            shops = [dict(r) for r in cur.fetchall()]

            cur.execute("SELECT u.id, u.full_name, u.phone, u.city, u.role, u.created_at, s.name as shop_name, s.status as shop_status, s.id as shop_id FROM users u LEFT JOIN shops s ON u.id = s.owner_id WHERE u.role = 'shopkeeper' ORDER BY u.id DESC")
            shopkeepers = [dict(r) for r in cur.fetchall()]

            cur.execute("SELECT p.*, s.name as shop_name FROM products p JOIN shops s ON p.shop_id = s.id ORDER BY p.id DESC LIMIT 50")
            products = [dict(r) for r in cur.fetchall()]

            cur.execute("SELECT o.*, s.name as shop_name FROM orders o JOIN shops s ON o.shop_id = s.id ORDER BY o.id DESC LIMIT 20")
            recent_orders = [dict(r) for r in cur.fetchall()]

            self._send_json({
                "success": True,
                "stats": {
                    "customers": total_customers,
                    "shopkeepers": total_shopkeepers,
                    "shops": total_shops,
                    "products": total_products,
                    "orders": total_orders,
                    "requests": total_requests
                },
                "shops": shops,
                "shopkeepers": shopkeepers,
                "products": products,
                "orders": recent_orders
            })
            conn.close()
            return

        self._send_error(f"Endpoint GET {path} not found", 404)
        conn.close()

    # ---------------- API POST ROUTES ----------------
    def handle_api_post(self, path, data):
        conn = database.get_db_connection()
        cur = conn.cursor()

        # Registration
        if path == "/api/auth/register":
            full_name = data.get("full_name", "").strip()
            phone = data.get("phone", "").strip()
            password = data.get("password", "").strip()
            address = data.get("address", "").strip()
            pincode = data.get("pincode", "").strip()
            state = data.get("state", "Haryana").strip()
            city = data.get("city", "Yamunanagar").strip()
            role = data.get("role", "customer").strip()

            if not full_name or not phone or not password or not address or not pincode or not city:
                self._send_error("All required fields must be filled.", 400)
                conn.close()
                return

            if len(phone) < 10:
                self._send_error("Please enter a valid 10-digit phone number.", 400)
                conn.close()
                return

            cur.execute("SELECT id FROM users WHERE phone = ?", (phone,))
            if cur.fetchone():
                self._send_error("An account with this phone number already exists. Please log in.", 400)
                conn.close()
                return

            cur.execute("""
                INSERT INTO users (full_name, phone, address, pincode, state, city, password, role)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (full_name, phone, address, pincode, state, city, password, role))
            user_id = cur.lastrowid

            shop_id = None
            if role == "shopkeeper":
                shop_name = data.get("shop_name", f"{full_name}'s Store").strip()
                shop_category = data.get("shop_category", "Clothes").strip()
                shop_address = data.get("shop_address", address).strip()
                shop_pincode = data.get("shop_pincode", pincode).strip()
                shop_area = data.get("shop_area", "Jagadhri").strip()
                contact_number = data.get("contact_number", phone).strip()

                cur.execute("""
                    INSERT INTO shops (owner_id, name, address, area, city, state, pincode, category, contact_number, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')
                """, (user_id, shop_name, shop_address, shop_area, city, state, shop_pincode, shop_category, contact_number))
                shop_id = cur.lastrowid

            # Add welcome notification
            cur.execute("""
                INSERT INTO notifications (user_id, title, title_hi, message, message_hi, type)
                VALUES (?, 'Account Created', 'खाता बनाया गया', 'Welcome to LocalFind! Start finding or managing local products.', 'लोकलफाइंड में आपका स्वागत है! स्थानीय उत्पाद खोजना या प्रबंधित करना शुरू करें।', 'system')
            """, (user_id,))

            conn.commit()
            cur.execute("SELECT id, full_name, phone, address, pincode, state, city, role, preferred_lang FROM users WHERE id = ?", (user_id,))
            new_user = dict(cur.fetchone())
            if shop_id:
                cur.execute("SELECT * FROM shops WHERE id = ?", (shop_id,))
                new_user["shop"] = dict(cur.fetchone())

            self._send_json({"success": True, "message": "Registered successfully", "user": new_user})
            conn.close()
            return

        # Login
        if path == "/api/auth/login":
            phone = data.get("phone", "").strip()
            password = data.get("password", "").strip()

            if not phone or not password:
                self._send_error("Please enter both phone number and password.", 400)
                conn.close()
                return

            cur.execute("SELECT id, full_name, phone, address, pincode, state, city, role, preferred_lang, password FROM users WHERE phone = ?", (phone,))
            user = cur.fetchone()
            if not user or user["password"] != password:
                self._send_error("Invalid phone number or password. Please try again.", 401)
                conn.close()
                return

            user_dict = dict(user)
            del user_dict["password"]

            if user_dict["role"] == "shopkeeper":
                cur.execute("SELECT * FROM shops WHERE owner_id = ?", (user_dict["id"],))
                shop = cur.fetchone()
                user_dict["shop"] = dict(shop) if shop else None

            self._send_json({"success": True, "message": "Login successful", "user": user_dict})
            conn.close()
            return

        # Create Product Request (Customer)
        if path == "/api/requests":
            customer_id = data.get("customer_id")
            shop_pref = data.get("shop_preference", "nearby")
            selected_shop_id = data.get("selected_shop_id")
            state = data.get("state", "Haryana")
            city = data.get("city", "Yamunanagar")
            area = data.get("area", "Jagadhri")
            pincode = data.get("pincode", "135003")
            category = data.get("category", "Clothes")
            request_mode = data.get("request_mode", "manual")
            image_data = data.get("image_data")
            color_pref = data.get("color_pref")
            brand_pref = data.get("brand_pref")
            size_pref = data.get("size_pref")
            clothing_type = data.get("clothing_type")
            sleeves = data.get("sleeves")
            skincare_concern = data.get("skincare_concern")
            budget = data.get("budget")
            shoe_type = data.get("shoe_type")
            description = data.get("description", "")

            cur.execute("""
                INSERT INTO product_requests (
                    customer_id, shop_preference, selected_shop_id, state, city, area, pincode,
                    category, request_mode, image_data, color_pref, brand_pref, size_pref,
                    clothing_type, sleeves, skincare_concern, budget, shoe_type, description, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Request Submitted')
            """, (customer_id, shop_pref, selected_shop_id, state, city, area, pincode,
                  category, request_mode, image_data, color_pref, brand_pref, size_pref,
                  clothing_type, sleeves, skincare_concern, budget, shoe_type, description))
            req_id = cur.lastrowid

            # Create notification for target shopkeeper(s)
            if shop_pref == "specific" and selected_shop_id:
                cur.execute("SELECT owner_id FROM shops WHERE id = ?", (selected_shop_id,))
                owner = cur.fetchone()
                if owner and owner["owner_id"]:
                    cur.execute("""
                        INSERT INTO notifications (user_id, title, title_hi, message, message_hi, type)
                        VALUES (?, 'New Customer Inquiry', 'नई ग्राहक मांग',
                                'A customer has submitted an item request to your shop.',
                                'एक ग्राहक ने आपकी दुकान के लिए सामान की मांग भेजी है।', 'request')
                    """, (owner["owner_id"],))

            # Customer confirmation notification
            cur.execute("""
                INSERT INTO notifications (user_id, title, title_hi, message, message_hi, type)
                VALUES (?, 'Request Submitted', 'मांग दर्ज की गई', ?, ?, 'request')
            """, (customer_id, f"Your product request #{req_id} has been submitted to local shops.", f"आपकी उत्पाद मांग #{req_id} स्थानीय दुकानों को भेज दी गई है।"))

            conn.commit()
            conn.close()
            self._send_json({"success": True, "request_id": req_id, "message": "Request submitted successfully"})
            return

        # Shopkeeper responds to customer request with product suggestion
        if path.endswith("/respond") and "/api/requests/" in path:
            req_id = path.replace("/api/requests/", "").replace("/respond", "").strip()
            shop_id = data.get("shop_id")
            product_id = data.get("product_id")
            product_name = data.get("product_name", "").strip()
            price = float(data.get("price", 0))
            description = data.get("description", "")
            image_url = data.get("image_url", "")
            note = data.get("note", "")

            if not product_name or price <= 0:
                self._send_error("Product name and a valid price are required.", 400)
                conn.close()
                return

            cur.execute("""
                INSERT INTO request_responses (request_id, shop_id, product_id, product_name, price, description, image_url, note, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
            """, (req_id, shop_id, product_id, product_name, price, description, image_url, note))

            # Update request status to 'Product Suggested'
            cur.execute("UPDATE product_requests SET status = 'Product Suggested' WHERE id = ?", (req_id,))

            # Notify customer
            cur.execute("SELECT customer_id FROM product_requests WHERE id = ?", (req_id,))
            c = cur.fetchone()
            if c:
                cur.execute("SELECT name FROM shops WHERE id = ?", (shop_id,))
                sh = cur.fetchone()
                shop_title = sh["name"] if sh else "A shop"
                cur.execute("""
                    INSERT INTO notifications (user_id, title, title_hi, message, message_hi, type)
                    VALUES (?, 'Product Suggested for Your Request', 'आपकी मांग पर उत्पाद का सुझाव आया', ?, ?, 'suggestion')
                """, (c["customer_id"], f"{shop_title} has suggested a product ({product_name}) for your request.", f"{shop_title} ने आपकी मांग के लिए उत्पाद ({product_name}) का सुझाव भेजा है।"))

            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Product suggestion sent to customer."})
            return

        # Cart: Add Item (Enforces single-shop constraint)
        if path == "/api/cart/add":
            customer_id = data.get("customer_id")
            shop_id = data.get("shop_id")
            product_id = data.get("product_id")
            product_name = data.get("product_name")
            price = float(data.get("price", 0))
            quantity = int(data.get("quantity", 1))
            size = data.get("size", "")
            color = data.get("color", "")
            image_url = data.get("image_url", "")

            # Check if cart already has items from another shop
            cur.execute("SELECT shop_id, s.name as shop_name FROM cart_items c JOIN shops s ON c.shop_id = s.id WHERE c.customer_id = ? LIMIT 1", (customer_id,))
            existing = cur.fetchone()
            if existing and existing["shop_id"] != shop_id:
                conn.close()
                self._send_json({
                    "success": False,
                    "error": "DIFFERENT_SHOP",
                    "current_shop_id": existing["shop_id"],
                    "current_shop_name": existing["shop_name"],
                    "message": f"Your cart currently contains products from '{existing['shop_name']}'. In this version, an order can only be from one shop at a time. Please place that order first or clear the cart to add items from this shop."
                }, status=400)
                return

            # Check if product already in cart -> increment quantity
            cur.execute("SELECT id, quantity FROM cart_items WHERE customer_id = ? AND product_id = ? AND size = ? AND color = ?", (customer_id, product_id, size, color))
            existing_item = cur.fetchone()
            if existing_item:
                new_qty = existing_item["quantity"] + quantity
                cur.execute("UPDATE cart_items SET quantity = ? WHERE id = ?", (new_qty, existing_item["id"]))
            else:
                cur.execute("""
                    INSERT INTO cart_items (customer_id, shop_id, product_id, product_name, price, quantity, size, color, image_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (customer_id, shop_id, product_id, product_name, price, quantity, size, color, image_url))

            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Product added to cart successfully."})
            return

        # Place Order
        if path == "/api/orders":
            customer_id = data.get("customer_id")
            shop_id = data.get("shop_id")
            delivery_method = data.get("delivery_method", "Home Delivery")
            delivery_address = data.get("delivery_address", "")
            customer_name = data.get("customer_name", "")
            customer_phone = data.get("customer_phone", "")
            customer_pincode = data.get("customer_pincode", "")
            customer_city = data.get("customer_city", "")
            customer_state = data.get("customer_state", "")
            payment_method = data.get("payment_method", "Cash on Delivery")
            subtotal = float(data.get("subtotal", 0))
            delivery_fee = float(data.get("delivery_fee", 0))
            total_amount = float(data.get("total_amount", subtotal + delivery_fee))
            items = data.get("items", [])

            if not items:
                self._send_error("Cannot create order without items.", 400)
                conn.close()
                return

            cur.execute("""
                INSERT INTO orders (
                    customer_id, shop_id, delivery_method, delivery_address,
                    customer_name, customer_phone, customer_pincode, customer_city, customer_state,
                    safety_acknowledged, payment_method, subtotal, delivery_fee, total_amount, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, 'Order Confirmed')
            """, (customer_id, shop_id, delivery_method, delivery_address,
                  customer_name, customer_phone, customer_pincode, customer_city, customer_state,
                  payment_method, subtotal, delivery_fee, total_amount))
            order_id = cur.lastrowid

            for it in items:
                cur.execute("""
                    INSERT INTO order_items (order_id, product_id, product_name, price, quantity, size, color, image_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (order_id, it.get("product_id"), it.get("product_name"), it.get("price"), it.get("quantity", 1), it.get("size", ""), it.get("color", ""), it.get("image_url", "")))

            # Clear user's cart if ordered items were in cart
            cur.execute("DELETE FROM cart_items WHERE customer_id = ?", (customer_id,))

            # Notify shopkeeper
            cur.execute("SELECT owner_id, name FROM shops WHERE id = ?", (shop_id,))
            shop_owner = cur.fetchone()
            if shop_owner and shop_owner["owner_id"]:
                cur.execute("""
                    INSERT INTO notifications (user_id, title, title_hi, message, message_hi, type)
                    VALUES (?, ?, ?, ?, ?, 'order')
                """, (shop_owner["owner_id"], f"New Order Received #{order_id}", f"नया ऑर्डर प्राप्त हुआ #{order_id}", f"Customer {customer_name} placed a new order via {delivery_method}.", f"ग्राहक {customer_name} ने {delivery_method} के माध्यम से नया ऑर्डर दिया है।"))

            # Notify customer
            shop_title = shop_owner["name"] if shop_owner else "the shop"
            cur.execute("""
                INSERT INTO notifications (user_id, title, title_hi, message, message_hi, type)
                VALUES (?, 'Order Placed Successfully', 'ऑर्डर सफलतापूर्वक दर्ज हुआ', ?, ?, 'order')
            """, (customer_id, f"Your order #{order_id} has been confirmed with {shop_title}.", f"आपका ऑर्डर #{order_id} {shop_title} के साथ दर्ज हो चुका है।"))

            conn.commit()
            conn.close()
            self._send_json({"success": True, "order_id": order_id, "message": "Order placed successfully!"})
            return

        # Add Product (Shopkeeper)
        if path == "/api/products":
            shop_id = data.get("shop_id")
            category = data.get("category", "Clothes")
            name = data.get("name", "").strip()
            price = float(data.get("price", 0))
            description = data.get("description", "")
            sizes = data.get("sizes", "")
            colors = data.get("colors", "")
            image_url = data.get("image_url", "")
            is_available = int(data.get("is_available", 1))

            if not name or price <= 0:
                self._send_error("Product name and valid price are required.", 400)
                conn.close()
                return

            cur.execute("""
                INSERT INTO products (shop_id, category, name, price, description, sizes, colors, image_url, is_available)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (shop_id, category, name, price, description, sizes, colors, image_url, is_available))
            prod_id = cur.lastrowid
            conn.commit()
            conn.close()
            self._send_json({"success": True, "product_id": prod_id, "message": "Product added successfully."})
            return

        # Submit Review
        if path == "/api/reviews":
            order_id = data.get("order_id")
            shop_id = data.get("shop_id")
            customer_id = data.get("customer_id")
            customer_name = data.get("customer_name", "Customer")
            shop_rating = int(data.get("shop_rating", 5))
            shop_review = data.get("shop_review", "")
            delivery_rating = data.get("delivery_rating")
            delivery_review = data.get("delivery_review", "")
            product_satisfied = data.get("product_satisfied", "Yes")
            product_feedback = data.get("product_feedback", "")

            cur.execute("""
                INSERT INTO reviews (order_id, shop_id, customer_id, customer_name, shop_rating, shop_review, delivery_rating, delivery_review, product_satisfied, product_feedback)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (order_id, shop_id, customer_id, customer_name, shop_rating, shop_review, delivery_rating, delivery_review, product_satisfied, product_feedback))

            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Feedback submitted successfully. Thank you!"})
            return

        self._send_error(f"Endpoint POST {path} not found", 404)
        conn.close()

    # ---------------- API PUT ROUTES ----------------
    def handle_api_put(self, path, query, data):
        conn = database.get_db_connection()
        cur = conn.cursor()

        # Update User Profile
        if path == "/api/auth/profile":
            user_id = data.get("id")
            full_name = data.get("full_name", "").strip()
            phone = data.get("phone", "").strip()
            address = data.get("address", "").strip()
            pincode = data.get("pincode", "").strip()
            state = data.get("state", "").strip()
            city = data.get("city", "").strip()
            preferred_lang = data.get("preferred_lang", "en")

            cur.execute("""
                UPDATE users SET full_name = ?, phone = ?, address = ?, pincode = ?, state = ?, city = ?, preferred_lang = ?
                WHERE id = ?
            """, (full_name, phone, address, pincode, state, city, preferred_lang, user_id))
            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Profile updated successfully."})
            return

        # Update Shop Profile (Shopkeeper)
        if path.startswith("/api/shops/"):
            shop_id = path.replace("/api/shops/", "").strip()
            name = data.get("name")
            category = data.get("category")
            address = data.get("address")
            area = data.get("area")
            city = data.get("city")
            state = data.get("state")
            pincode = data.get("pincode")
            contact_number = data.get("contact_number")
            is_open = data.get("is_open")
            image_url = data.get("image_url")

            cur.execute("""
                UPDATE shops SET name = COALESCE(?, name),
                                category = COALESCE(?, category),
                                address = COALESCE(?, address),
                                area = COALESCE(?, area),
                                city = COALESCE(?, city),
                                state = COALESCE(?, state),
                                pincode = COALESCE(?, pincode),
                                contact_number = COALESCE(?, contact_number),
                                is_open = COALESCE(?, is_open),
                                image_url = COALESCE(?, image_url)
                WHERE id = ?
            """, (name, category, address, area, city, state, pincode, contact_number, is_open, image_url, shop_id))
            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Shop profile updated successfully."})
            return

        # Update Product
        if path.startswith("/api/products/"):
            prod_id = path.replace("/api/products/", "").strip()
            name = data.get("name")
            category = data.get("category")
            price = data.get("price")
            description = data.get("description")
            sizes = data.get("sizes")
            colors = data.get("colors")
            image_url = data.get("image_url")
            is_available = data.get("is_available")

            cur.execute("""
                UPDATE products SET name = COALESCE(?, name),
                                    category = COALESCE(?, category),
                                    price = COALESCE(?, price),
                                    description = COALESCE(?, description),
                                    sizes = COALESCE(?, sizes),
                                    colors = COALESCE(?, colors),
                                    image_url = COALESCE(?, image_url),
                                    is_available = COALESCE(?, is_available)
                WHERE id = ?
            """, (name, category, price, description, sizes, colors, image_url, is_available, prod_id))
            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Product updated successfully."})
            return

        # Customer Selects or Rejects Product Suggestion
        if "/select" in path and "/api/requests/" in path:
            req_id = path.replace("/api/requests/", "").replace("/select", "").strip()
            response_id = data.get("response_id")
            action = data.get("action", "select") # 'select' or 'reject'

            if action == "select":
                cur.execute("UPDATE request_responses SET status = 'selected' WHERE id = ?", (response_id,))
                cur.execute("UPDATE product_requests SET status = 'Product Selected' WHERE id = ?", (req_id,))

                # Notify shopkeeper
                cur.execute("SELECT shop_id, product_name FROM request_responses WHERE id = ?", (response_id,))
                resp = cur.fetchone()
                if resp:
                    cur.execute("SELECT owner_id FROM shops WHERE id = ?", (resp["shop_id"],))
                    owner = cur.fetchone()
                    if owner and owner["owner_id"]:
                        cur.execute("""
                            INSERT INTO notifications (user_id, title, title_hi, message, message_hi, type)
                            VALUES (?, 'Customer Selected Your Product', 'ग्राहक ने आपका उत्पाद चुना', ?, ?, 'order')
                        """, (owner["owner_id"], f"Customer has accepted your suggested product: {resp['product_name']}.", f"ग्राहक ने आपका सुझाया गया उत्पाद स्वीकार कर लिया है: {resp['product_name']}।"))
            else:
                cur.execute("UPDATE request_responses SET status = 'rejected' WHERE id = ?", (response_id,))

            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": f"Response {action}ed successfully."})
            return

        # Cart Item Update Quantity
        if path == "/api/cart/update":
            item_id = data.get("item_id")
            quantity = int(data.get("quantity", 1))
            if quantity <= 0:
                cur.execute("DELETE FROM cart_items WHERE id = ?", (item_id,))
            else:
                cur.execute("UPDATE cart_items SET quantity = ? WHERE id = ?", (quantity, item_id))
            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Cart updated."})
            return

        # Update Order Status (Shopkeeper)
        if path.startswith("/api/orders/") and path.endswith("/status"):
            order_id = path.replace("/api/orders/", "").replace("/status", "").strip()
            new_status = data.get("status")
            cur.execute("UPDATE orders SET status = ? WHERE id = ?", (new_status, order_id))

            # Notify customer
            cur.execute("SELECT customer_id, shop_id FROM orders WHERE id = ?", (order_id,))
            ord_row = cur.fetchone()
            if ord_row:
                cur.execute("""
                    INSERT INTO notifications (user_id, title, title_hi, message, message_hi, type)
                    VALUES (?, 'Order Status Updated', 'ऑर्डर की स्थिति अपडेट हुई', ?, ?, 'order')
                """, (ord_row["customer_id"], f"Your order #{order_id} status has changed to: {new_status}", f"आपके ऑर्डर #{order_id} की स्थिति बदलकर: {new_status} हो गई है"))

            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": f"Order status updated to {new_status}"})
            return

        # Mark Notification as Read
        if path == "/api/notifications/read":
            notif_id = query.get("id", [None])[0] or data.get("id")
            cur.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", (notif_id,))
            conn.commit()
            conn.close()
            self._send_json({"success": True})
            return

        # Admin: Approve / Reject Shop
        if path.startswith("/api/admin/shops/") and path.endswith("/status"):
            shop_id = path.replace("/api/admin/shops/", "").replace("/status", "").strip()
            new_status = data.get("status", "approved") # 'approved' or 'rejected'
            cur.execute("UPDATE shops SET status = ? WHERE id = ?", (new_status, shop_id))
            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": f"Shop status set to {new_status}"})
            return

        self._send_error(f"Endpoint PUT {path} not found", 404)
        conn.close()

    # ---------------- API DELETE ROUTES ----------------
    def handle_api_delete(self, path, query):
        conn = database.get_db_connection()
        cur = conn.cursor()

        # Remove from cart
        if path == "/api/cart/remove":
            item_id = query.get("item_id", [None])[0]
            cur.execute("DELETE FROM cart_items WHERE id = ?", (item_id,))
            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Item removed from cart."})
            return

        # Clear cart
        if path == "/api/cart/clear":
            customer_id = query.get("customer_id", [None])[0]
            cur.execute("DELETE FROM cart_items WHERE customer_id = ?", (customer_id,))
            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Cart cleared."})
            return

        # Delete product
        if path.startswith("/api/products/"):
            prod_id = path.replace("/api/products/", "").strip()
            cur.execute("DELETE FROM products WHERE id = ?", (prod_id,))
            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Product deleted."})
            return

        # Admin delete shop
        if path.startswith("/api/admin/shops/"):
            shop_id = path.replace("/api/admin/shops/", "").strip()
            cur.execute("DELETE FROM shops WHERE id = ?", (shop_id,))
            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Shop removed by admin."})
            return

        self._send_error(f"Endpoint DELETE {path} not found", 404)
        conn.close()

def run_server(port=PORT):
    database.init_db()
    with socketserver.TCPServer(("", port), LocalFindHandler) as httpd:
        print(f"==================================================")
        print(f" LocalFind Server running at: http://localhost:{port}")
        print(f" Serving frontend from: {STATIC_DIR}")
        print(f" SQLite Database: {database.DB_PATH}")
        print(f" Press Ctrl+C to stop.")
        print(f"==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run_server(port)
