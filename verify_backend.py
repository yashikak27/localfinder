"""
verify_backend.py - End-to-End Automated Test Suite for LocalFind
Tests database, seed data, and REST API routes.
"""
import urllib.request
import urllib.parse
import json
import time
import subprocess
import sys
import os

BASE_URL = "http://127.0.0.1:8000"

def request_json(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def run_tests():
    print(">>> 1. Testing GET /api/shops")
    res = request_json("/api/shops")
    assert res["success"] is True
    assert len(res["shops"]) >= 4
    print(f"    PASS: Found {len(res['shops'])} approved shops.")

    print(">>> 2. Testing GET /api/products")
    res = request_json("/api/products?category=Clothes")
    assert res["success"] is True
    assert len(res["products"]) >= 3
    print(f"    PASS: Found {len(res['products'])} clothes products.")

    print(">>> 3. Testing POST /api/auth/login (Customer)")
    res = request_json("/api/auth/login", method="POST", data={"phone": "9876543210", "password": "pass123"})
    assert res["success"] is True
    assert res["user"]["role"] == "customer"
    print(f"    PASS: Logged in customer: {res['user']['full_name']}")

    print(">>> 4. Testing POST /api/auth/login (Shopkeeper)")
    res = request_json("/api/auth/login", method="POST", data={"phone": "9876543211", "password": "pass123"})
    assert res["success"] is True
    assert res["user"]["role"] == "shopkeeper"
    shop_id = res["user"]["shop"]["id"]
    print(f"    PASS: Logged in shopkeeper with shop id {shop_id}: {res['user']['shop']['name']}")

    print(">>> 5. Testing POST /api/requests (Customer product inquiry)")
    req_payload = {
        "customer_id": 1,
        "shop_preference": "specific",
        "selected_shop_id": 1,
        "state": "Haryana",
        "city": "Yamunanagar",
        "area": "Jagadhri",
        "pincode": "135003",
        "category": "Clothes",
        "request_mode": "manual",
        "color_pref": "Dark Blue",
        "brand_pref": "Any brand",
        "size_pref": "XL",
        "clothing_type": "Upper / Top",
        "sleeves": "Full",
        "description": "Looking for a formal dark blue shirt"
    }
    res = request_json("/api/requests", method="POST", data=req_payload)
    assert res["success"] is True
    created_req_id = res["request_id"]
    print(f"    PASS: Created request #{created_req_id}")

    print(">>> 6. Testing POST /api/requests/:id/respond (Shopkeeper suggestion)")
    sug_payload = {
        "shop_id": 1,
        "product_name": "Premium Oxford Dark Blue Shirt",
        "price": 849.0,
        "description": "100% fine cotton, size XL available in stock",
        "image_url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
        "note": "We have 2 units in stock right now"
    }
    res = request_json(f"/api/requests/{created_req_id}/respond", method="POST", data=sug_payload)
    assert res["success"] is True
    print("    PASS: Shopkeeper sent product suggestion.")

    print(">>> 7. Testing Cart Single-Shop Restriction")
    # Add from shop 1
    res1 = request_json("/api/cart/add", method="POST", data={
        "customer_id": 1,
        "shop_id": 1,
        "product_id": 1,
        "product_name": "Cotton Shirt",
        "price": 799.0,
        "quantity": 1
    })
    assert res1["success"] is True
    print("    PASS: Added product from Shop 1 to cart.")

    # Try to add from shop 2
    try:
        res2 = request_json("/api/cart/add", method="POST", data={
            "customer_id": 1,
            "shop_id": 2,
            "product_id": 4,
            "product_name": "Face Serum",
            "price": 499.0,
            "quantity": 1
        })
        print("    FAIL: Should have rejected item from different shop!")
        sys.exit(1)
    except urllib.error.HTTPError as err:
        err_data = json.loads(err.read().decode("utf-8"))
        assert err_data["error"] == "DIFFERENT_SHOP"
        print(f"    PASS: Correctly rejected different shop addition: {err_data['message'][:45]}...")

    print(">>> 8. Testing POST /api/orders (Home Delivery Order)")
    order_payload = {
        "customer_id": 1,
        "shop_id": 1,
        "delivery_method": "Home Delivery",
        "delivery_address": "House 42, Civil Lines, Yamunanagar",
        "customer_name": "Aman Sharma",
        "customer_phone": "9876543210",
        "customer_pincode": "135001",
        "customer_city": "Yamunanagar",
        "customer_state": "Haryana",
        "payment_method": "Cash on Delivery",
        "subtotal": 799.0,
        "delivery_fee": 30.0,
        "total_amount": 829.0,
        "items": [{
            "product_id": 1,
            "product_name": "Cotton Shirt",
            "price": 799.0,
            "quantity": 1,
            "size": "L"
        }]
    }
    res = request_json("/api/orders", method="POST", data=order_payload)
    assert res["success"] is True
    order_id = res["order_id"]
    print(f"    PASS: Placed order #{order_id}")

    print(">>> 9. Testing PUT /api/orders/:id/status (Progression timeline)")
    res = request_json(f"/api/orders/{order_id}/status", method="PUT", data={"status": "Preparing"})
    assert res["success"] is True
    res = request_json(f"/api/orders/{order_id}/status", method="PUT", data={"status": "Delivered"})
    assert res["success"] is True
    print(f"    PASS: Order #{order_id} progressed to 'Delivered'.")

    print(">>> 10. Testing POST /api/reviews (3-Part Rating)")
    review_payload = {
        "order_id": order_id,
        "shop_id": 1,
        "customer_id": 1,
        "customer_name": "Aman Sharma",
        "shop_rating": 5,
        "shop_review": "Great quality shirt and friendly shopkeeper",
        "delivery_rating": 5,
        "delivery_review": "Delivered safely and quickly",
        "product_satisfied": "Yes",
        "product_feedback": "Perfect size"
    }
    res = request_json("/api/reviews", method="POST", data=review_payload)
    assert res["success"] is True
    print("    PASS: Rating and feedback recorded.")

    print(">>> 11. Testing GET /api/admin/overview")
    res = request_json("/api/admin/overview")
    assert res["success"] is True
    assert "stats" in res
    print(f"    PASS: Admin stats verified. Total orders: {res['stats']['orders']}")

    print(">>> 12. Testing GET /api/earnings?shop_id=1")
    res = request_json("/api/earnings?shop_id=1")
    assert res["success"] is True
    assert "total_earnings" in res
    assert "pending_cod" in res
    assert "confirmed_orders" in res
    print(f"    PASS: Earnings verified: Rs.{res['total_earnings']} revenue, Rs.{res['pending_cod']} pending COD, {res['confirmed_orders']} confirmed orders.")

    print(">>> 13. Testing GET /api/orders?shop_id=1&status_filter=confirmed")
    res = request_json("/api/orders?shop_id=1&status_filter=confirmed")
    assert res["success"] is True
    assert "orders" in res and isinstance(res["orders"], list)
    print(f"    PASS: Confirmed orders endpoint verified. Count: {len(res['orders'])}")

    print("\n=======================================================")
    print(" ALL 13 AUTOMATED INTEGRATION TESTS PASSED SUCCESSFULLY! ")
    print("=======================================================\n")

if __name__ == "__main__":
    run_tests()
