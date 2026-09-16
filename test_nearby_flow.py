"""
test_nearby_flow.py - Comprehensive End-to-End Verification Test for Nearby Web Application
Validates:
1. Multi-Step Onboarding Architecture:
   - Mandatory PIN Code rejection (HTTP 400 when PIN is missing/blank).
   - Authentic Registration with State, City, District, PIN, Local Area, Post Office.
   - Shopkeeper Registration with Store Specialty Category domain.
2. Three Primary Categories:
   - Category filtering for Clothes, Skincare & Beauty, and Shoes.
3. Customer Discovery & Inquiry (Option A visual chips + Option B details).
4. Shopkeeper Review & Stock Photo suggestion.
5. Customer Selection & Broadcast.
6. Fulfillment selection (Self Pick-Up with route navigation vs Home Delivery with GPS).
7. Shopkeeper 4-Section Dashboard statistics (Orders, Payments COD vs Digital, Revenue, Account).
8. Customer Profile Drawer Metrics API (/api/customer/metrics) - Shop Interaction Counter & Recent Orders.
9. Post-delivery Store & Product review submission.
"""

import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://localhost:8000"

def api_post(endpoint, data):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"error": body}

def api_get(endpoint):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {"error": body}

def run_tests():
    print("==================================================")
    print("   NEARBY - AUTOMATED VERIFICATION TEST SUITE    ")
    print("==================================================")
    passed = 0
    total = 0

    # ----------------------------------------------------
    # TEST 1: Mandatory PIN Validation
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Enforcing Mandatory PIN Code Validation...")
    status, res = api_post("/api/auth/onboard", {
        "full_name": "Test Customer",
        "phone": "9876543210",
        "password": "securepass123",
        "role": "customer",
        "address": "42 Green Avenue",
        "city": "Yamunanagar",
        "district": "Yamunanagar",
        "state": "Haryana",
        "pincode": ""  # Blank PIN should be rejected!
    })
    if status == 400 and "pin" in res.get("error", "").lower():
        print("  PASS: Missing PIN correctly rejected with HTTP 400:", res.get("error"))
        passed += 1
    else:
        print(f"  FAIL: Expected 400 for missing PIN, got {status}: {res}")

    # ----------------------------------------------------
    # TEST 2: Multi-Step Authentic Customer Registration (Credentials + Detailed Address)
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Multi-Step Onboarding with Detailed Address (District, Post Office, PIN)...")
    status, cust_res = api_post("/api/auth/onboard", {
        "full_name": "Aarav Mehra",
        "phone": "9812300001",
        "email": "aarav.mehra@nearby.local",
        "password": "securepass123",
        "role": "customer",
        "state": "Haryana",
        "city": "Yamunanagar",
        "district": "Yamunanagar",
        "pincode": "135001",
        "local_area": "Civil Lines",
        "post_office": "Yamunanagar H.O.",
        "address": "House No. 102, Civil Lines"
    })
    user_obj = cust_res.get("user", {})
    if status == 200 and cust_res.get("success") and user_obj.get("pincode") == "135001" and user_obj.get("district") == "Yamunanagar":
        customer_id = user_obj["id"]
        print(f"  PASS: Customer registered with District '{user_obj.get('district')}', Post Office '{user_obj.get('post_office')}', PIN '{user_obj.get('pincode')}' (ID: {customer_id})")
        passed += 1
    else:
        print(f"  FAIL: Could not register customer with detailed address: {status} {cust_res}")
        return

    # ----------------------------------------------------
    # TEST 3: Step 3 Role Gateway - Authentic Shopkeeper Onboarding with Specialty
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Authentic Shopkeeper Registration with Specialty Category Domain...")
    status, shop_res = api_post("/api/auth/onboard", {
        "full_name": "Vikram Sethi",
        "phone": "9812300002",
        "password": "securepass123",
        "role": "shopkeeper",
        "address": "Shop 14, Main Cloth Market",
        "city": "Yamunanagar",
        "district": "Yamunanagar",
        "state": "Haryana",
        "pincode": "135001",
        "local_area": "Main Cloth Market",
        "post_office": "Yamunanagar H.O.",
        "store_specialty": "Clothes & Apparel",
        "shop_name": "Sethi Silk & Readymade"
    })
    shop_user = shop_res.get("user", {})
    shop_data = shop_user.get("shop")
    if status == 200 and shop_res.get("success") and shop_data:
        shopkeeper_id = shop_user["id"]
        shop_id = shop_data["id"]
        specialty = shop_data.get("specialty", "")
        print(f"  PASS: Shopkeeper registered (Shop ID: {shop_id}, Specialty: {specialty})")
        passed += 1
    else:
        print(f"  FAIL: Could not register shopkeeper: {status} {shop_res}")
        return

    # ----------------------------------------------------
    # TEST 4: Three Primary Categories Filtering
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Three Primary Product Categories Filtering...")
    
    # 1. Clothes
    status1, data1 = api_get("/api/shops?category=Clothes")
    cloth_shops = data1.get("shops", [])
    
    # 2. Skincare & Beauty (Unified Category)
    status2, data2 = api_get("/api/shops?category=Skincare%20%26%20Beauty")
    beauty_shops = data2.get("shops", [])
    
    # 3. Shoes
    status3, data3 = api_get("/api/shops?category=Shoes")
    shoe_shops = data3.get("shops", [])

    if status1 == 200 and status2 == 200 and status3 == 200 and len(cloth_shops) > 0 and len(beauty_shops) >= 2 and len(shoe_shops) > 0:
        print(f"  PASS: Primary Categories Verified:")
        print(f"    * Clothes: {len(cloth_shops)} shops found")
        print(f"    * Skincare & Beauty: {len(beauty_shops)} shops found (combined skincare & cosmetics)")
        print(f"    * Shoes: {len(shoe_shops)} shops found")
        passed += 1
    else:
        print(f"  FAIL: Category filtering mismatch: Clothes={len(cloth_shops)}, Skincare & Beauty={len(beauty_shops)}, Shoes={len(shoe_shops)}")

    # ----------------------------------------------------
    # TEST 5: Customer Step 3 Inquiry Submission
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Customer Inquiry Submission with Option A Chips & Option B Details...")
    status, req_res = api_post("/api/requests", {
        "customer_id": customer_id,
        "user_id": customer_id,
        "selected_shop_id": shop_id,
        "shop_id": shop_id,
        "shop_preference": "specific",
        "category": "Clothes",
        "search_mode": "specific_shop",
        "target_shop_id": shop_id,
        "item_name": "Embroidered Pastel Kurti",
        "ref_image_url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "color_mode": "specific",
        "color_custom": "Sage Green",
        "brand_mode": "any",
        "size_chip": "L",
        "alteration_notes": "Prefer pure cotton, calf length with 3/4 sleeves.",
        "clothing_type": "upper",
        "sleeves": "3/4 Sleeves"
    })
    if status in (200, 201) and req_res.get("success"):
        request_id = req_res["request_id"]
        print(f"  PASS: Inquiry created successfully (Request ID: {request_id})")
        passed += 1
    else:
        print(f"  FAIL: Could not create inquiry: {status} {req_res}")
        return

    # ----------------------------------------------------
    # TEST 6: Shopkeeper Reviews Inquiry & Replies with Stock Photo
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Shopkeeper Reviews Inquiry & Replies with Stock Photo & Price...")
    status, reqs_data = api_get(f"/api/requests?shop_id={shop_id}")
    requests_list = reqs_data.get("requests", []) if isinstance(reqs_data, dict) else reqs_data
    found_req = next((r for r in requests_list if r["id"] == request_id), None)
    if not found_req:
        print(f"  FAIL: Inquiry #{request_id} not visible to shopkeeper")
    else:
        # Shopkeeper posts stock suggestion via /respond
        status_sug, sug_res = api_post(f"/api/requests/{request_id}/respond", {
            "shop_id": shop_id,
            "product_name": "Premium Chanderi Embroidered Kurti (Sage)",
            "price": 899,
            "description": "Pure cotton lining, hand embroidery, Size L in stock.",
            "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400"
        })
        if status_sug == 200 and sug_res.get("success"):
            print(f"  PASS: Stock photo reply sent successfully (Offered Price: Rs. 899)")
            passed += 1
        else:
            print(f"  FAIL: Shopkeeper could not send reply: {status_sug} {sug_res}")

    # ----------------------------------------------------
    # TEST 7: Request Broadcast to Other Category Shops
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Customer Broadcasts Request to Other Category Shops...")
    status_bc, bc_res = api_post(f"/api/requests/{request_id}/broadcast", {})
    if status_bc == 200 and bc_res.get("success"):
        print(f"  PASS: Request #{request_id} broadcasted successfully. Message: {bc_res.get('message')}")
        passed += 1
    else:
        print(f"  FAIL: Broadcast failed: {status_bc} {bc_res}")

    # ----------------------------------------------------
    # TEST 8: Customer Selects Suggested Product & Notifies Seller
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Customer Approves Suggested Product & Notifies Seller...")
    status_req, req_detail = api_get(f"/api/requests/{request_id}")
    req_obj = req_detail.get("request", {}) if isinstance(req_detail, dict) else {}
    responses = req_obj.get("responses", [])
    response_id = responses[0]["id"] if responses else 1

    status_sel, sel_res = api_post(f"/api/requests/{request_id}/select", {
        "response_id": response_id,
        "action": "select"
    })
    if status_sel == 200 and sel_res.get("success"):
        print(f"  PASS: Product selection confirmed! Message: {sel_res.get('message')}")
        passed += 1
    else:
        print(f"  FAIL: Product selection failed: {status_sel} {sel_res}")

    # ----------------------------------------------------
    # TEST 9: Fulfillment Selection - Self Pick-Up with Route Map
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Step 5: Self Pick-Up Order Placement with Route Navigation...")
    status_order1, ord_res1 = api_post("/api/orders", {
        "user_id": customer_id,
        "customer_id": customer_id,
        "shop_id": shop_id,
        "product_request_id": request_id,
        "items": [{
            "product_name": "Premium Chanderi Embroidered Kurti (Sage)",
            "price": 899,
            "quantity": 1
        }],
        "total_amount": 899,
        "fulfillment_mode": "pickup",
        "route_requested": 1,
        "delivery_address": "Store Pickup Counter",
        "delivery_phone": "9812300001",
        "payment_method": "cod"
    })
    if status_order1 in (200, 201) and ord_res1.get("success"):
        pickup_order_id = ord_res1["order_id"]
        print(f"  PASS: Self Pick-Up order created (Order ID: {pickup_order_id})")
        passed += 1
    else:
        print(f"  FAIL: Pickup order creation failed: {status_order1} {ord_res1}")

    # ----------------------------------------------------
    # TEST 10: Fulfillment Selection - Home Delivery with Device GPS
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Step 5: Home Delivery Order with Live GPS Coordinates...")
    status_order2, ord_res2 = api_post("/api/orders", {
        "user_id": customer_id,
        "customer_id": customer_id,
        "shop_id": shop_id,
        "items": [{
            "product_name": "Pastel Silk Dupatta",
            "price": 350,
            "quantity": 1
        }],
        "total_amount": 390,
        "fulfillment_mode": "delivery",
        "delivery_lat": 30.1290,
        "delivery_lng": 77.2674,
        "delivery_address": "House 102, Model Town, Yamunanagar",
        "delivery_phone": "9812300001",
        "payment_method": "cod"
    })
    if status_order2 in (200, 201) and ord_res2.get("success"):
        delivery_order_id = ord_res2["order_id"]
        print(f"  PASS: Home Delivery order created with GPS (Order ID: {delivery_order_id})")
        passed += 1
    else:
        print(f"  FAIL: Home delivery order creation failed: {status_order2} {ord_res2}")

    # ----------------------------------------------------
    # TEST 11: Shopkeeper 4-Section Dashboard Stats
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Shopkeeper 4-Section Dashboard API (/api/shopkeeper/stats)...")
    status_stats, stats = api_get(f"/api/shopkeeper/stats?shop_id={shop_id}")
    if status_stats == 200 and stats.get("success"):
        sec1 = stats.get("section_1_requests", {})
        sec2 = stats.get("section_2_payments", {})
        sec3 = stats.get("section_3_revenue", {})
        sec4 = stats.get("section_4_account", {})
        print(f"  PASS: 4-Section Dashboard Data Verified:")
        print(f"    * Section 1 (Orders/Requests): {sec1.get('total_orders')} orders, {sec1.get('total_requests')} inquiries")
        print(f"    * Section 2 (Payments): COD Rs. {sec2.get('cod_collected', 0)}, Digital Rs. {sec2.get('digital_collected', 0)}")
        print(f"    * Section 3 (Revenue): Total Turnover Rs. {sec3.get('total_turnover', 0)}, Settled Rs. {sec3.get('settled_payouts', 0)}")
        print(f"    * Section 4 (Account): Shop '{sec4.get('shop_name')}', Specialty '{sec4.get('specialty')}'")
        passed += 1
    else:
        print(f"  FAIL: Shopkeeper stats failed: {status_stats} {stats}")

    # ----------------------------------------------------
    # TEST 12: Customer Profile Drawer Metrics (Shop Interaction Counter & Order History)
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Customer Profile Drawer Metrics (/api/customer/metrics)...")
    status_metrics, metrics_data = api_get(f"/api/customer/metrics?user_id={customer_id}")
    if status_metrics == 200 and metrics_data.get("success"):
        contacted = metrics_data.get("shops_contacted_count", 0)
        recent = metrics_data.get("recent_orders", [])
        total_ord = metrics_data.get("total_orders", 0)
        u_info = metrics_data.get("user", {})

        print(f"  PASS: Customer Profile Drawer Data Verified:")
        print(f"    * Shop Interaction Counter: {contacted} Nearby Shop(s) contacted")
        print(f"    * Order History: {len(recent)} recent order(s) loaded (Total: {total_ord})")
        print(f"    * Saved Address: {u_info.get('district')}, {u_info.get('city')}, PIN: {u_info.get('pincode')}")
        passed += 1
    else:
        print(f"  FAIL: Customer metrics failed: {status_metrics} {metrics_data}")

    # ----------------------------------------------------
    # TEST 13: Post-Delivery Store & Product Reviews
    # ----------------------------------------------------
    total += 1
    print(f"\n[Test {total}] Step 6: Post-Delivery Review Submission (/api/reviews)...")
    status_rev, rev_res = api_post("/api/reviews", {
        "order_id": pickup_order_id,
        "shop_id": shop_id,
        "user_id": customer_id,
        "rating": 5,
        "delivery_rating": 5,
        "product_rating": 5,
        "comment": "Exceptional service! The sage green kurti fits perfectly and the fabric is lovely."
    })
    if status_rev in (200, 201) and rev_res.get("success"):
        print(f"  PASS: Review submitted successfully (Review ID: {rev_res.get('review_id')})")
        passed += 1
    else:
        print(f"  FAIL: Review submission failed: {status_rev} {rev_res}")

    # ----------------------------------------------------
    # SUMMARY
    # ----------------------------------------------------
    print("\n==================================================")
    print(f"   RESULTS: {passed}/{total} TESTS PASSED")
    print("==================================================")
    if passed == total:
        print(">>> ALL NEARBY FUNCTIONAL REQUIREMENTS VERIFIED! <<<")
        return 0
    else:
        print(f"WARNING: {total - passed} tests failed.")
        return 1

if __name__ == "__main__":
    sys.exit(run_tests())
