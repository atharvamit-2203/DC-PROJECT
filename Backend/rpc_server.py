"""
===================================================
  RPC SERVER — Product & Category Filtering Service
  E-Commerce Microservices (XML-RPC)
  Prices in Indian Rupees (₹)
===================================================
Run this FIRST before the Streamlit app.
"""

from xmlrpc.server import SimpleXMLRPCServer, SimpleXMLRPCRequestHandler
import datetime
import threading
import random

# ─────────────────────────────────────────────────
#  MOCK DATABASE  — Prices in INR (₹)
# ─────────────────────────────────────────────────
PRODUCTS_DB = [
    {"id": 1,  "name": "iPhone 15 Pro",      "category": "Electronics", "price": 99999,  "stock": 25,  "rating": 4.8},
    {"id": 2,  "name": "Samsung Galaxy S24", "category": "Electronics", "price": 74999,  "stock": 18,  "rating": 4.6},
    {"id": 3,  "name": "Sony WH-1000XM5",    "category": "Electronics", "price": 26999,  "stock": 42,  "rating": 4.9},
    {"id": 4,  "name": "MacBook Air M3",      "category": "Electronics", "price": 114999, "stock": 9,   "rating": 4.9},
    {"id": 5,  "name": "Nike Air Max 270",    "category": "Clothing",    "price": 10795,  "stock": 75,  "rating": 4.4},
    {"id": 6,  "name": "Levi's 501 Jeans",   "category": "Clothing",    "price": 5999,   "stock": 60,  "rating": 4.3},
    {"id": 7,  "name": "Adidas Hoodie",       "category": "Clothing",    "price": 4999,   "stock": 88,  "rating": 4.2},
    {"id": 8,  "name": "Clean Code (Book)",   "category": "Books",       "price": 2999,   "stock": 200, "rating": 4.9},
    {"id": 9,  "name": "Python Crash Course", "category": "Books",       "price": 2499,   "stock": 155, "rating": 4.8},
    {"id": 10, "name": "Atomic Habits",       "category": "Books",       "price": 1999,   "stock": 300, "rating": 4.9},
    {"id": 11, "name": "IKEA Study Desk",     "category": "Furniture",   "price": 17999,  "stock": 30,  "rating": 4.1},
    {"id": 12, "name": "Ergonomic Chair",     "category": "Furniture",   "price": 29999,  "stock": 15,  "rating": 4.7},
    {"id": 13, "name": "OnePlus 12",          "category": "Electronics", "price": 64999,  "stock": 20,  "rating": 4.6},
    {"id": 14, "name": "Google Pixel 8",      "category": "Electronics", "price": 75999,  "stock": 16,  "rating": 4.7},
    {"id": 15, "name": "Dell XPS 13",         "category": "Electronics", "price": 139999, "stock": 7,   "rating": 4.8},
    {"id": 16, "name": "iPad Air",            "category": "Electronics", "price": 59999,  "stock": 24,  "rating": 4.7},
    {"id": 17, "name": "Canon EOS R50",       "category": "Electronics", "price": 87999,  "stock": 11,  "rating": 4.5},
    {"id": 18, "name": "Sony PlayStation 5",  "category": "Electronics", "price": 54999,  "stock": 10,  "rating": 4.9},
    {"id": 19, "name": "Apple Watch Series 9", "category": "Electronics", "price": 42999, "stock": 19,  "rating": 4.7},
    {"id": 20, "name": "JBL Charge 5",        "category": "Electronics", "price": 14999,  "stock": 26,  "rating": 4.6},
    {"id": 21, "name": "Puma Running T-Shirt", "category": "Clothing",   "price": 1999,   "stock": 120, "rating": 4.3},
    {"id": 22, "name": "Zara Casual Blazer",  "category": "Clothing",    "price": 7999,   "stock": 40,  "rating": 4.4},
    {"id": 23, "name": "H&M Cotton Shirt",    "category": "Clothing",    "price": 2499,   "stock": 95,  "rating": 4.2},
    {"id": 24, "name": "Roadster Denim Jacket", "category": "Clothing",  "price": 4499,   "stock": 62,  "rating": 4.3},
    {"id": 25, "name": "US Polo Sneakers",    "category": "Clothing",    "price": 5999,   "stock": 58,  "rating": 4.4},
    {"id": 26, "name": "Allen Solly Chinos",  "category": "Clothing",    "price": 3299,   "stock": 74,  "rating": 4.1},
    {"id": 27, "name": "Reebok Training Shorts", "category": "Clothing", "price": 1899,   "stock": 102, "rating": 4.2},
    {"id": 28, "name": "North Face Winter Jacket", "category": "Clothing", "price": 10999, "stock": 32, "rating": 4.6},
    {"id": 29, "name": "The Pragmatic Programmer", "category": "Books",  "price": 3499,   "stock": 170, "rating": 4.9},
    {"id": 30, "name": "Designing Data-Intensive Applications", "category": "Books", "price": 4299, "stock": 112, "rating": 4.9},
    {"id": 31, "name": "Deep Learning with Python", "category": "Books", "price": 3899,   "stock": 88,  "rating": 4.7},
    {"id": 32, "name": "The Psychology of Money", "category": "Books",   "price": 2199,   "stock": 210, "rating": 4.8},
    {"id": 33, "name": "Refactoring",          "category": "Books",       "price": 3699,   "stock": 96,  "rating": 4.8},
    {"id": 34, "name": "Introduction to Algorithms", "category": "Books", "price": 4999, "stock": 72,  "rating": 4.9},
    {"id": 35, "name": "You Don't Know JS Yet", "category": "Books",     "price": 2799,   "stock": 132, "rating": 4.6},
    {"id": 36, "name": "Eloquent JavaScript",  "category": "Books",       "price": 2599,   "stock": 125, "rating": 4.5},
    {"id": 37, "name": "Ashley 3-Seater Sofa", "category": "Furniture",  "price": 45999,  "stock": 12,  "rating": 4.5},
    {"id": 38, "name": "King Size Bed Frame",  "category": "Furniture",   "price": 38999,  "stock": 9,   "rating": 4.4},
    {"id": 39, "name": "Wooden Bookshelf",     "category": "Furniture",   "price": 14999,  "stock": 21,  "rating": 4.3},
    {"id": 40, "name": "Dining Table Set",     "category": "Furniture",   "price": 32999,  "stock": 14,  "rating": 4.6},
    {"id": 41, "name": "Office Filing Cabinet", "category": "Furniture",  "price": 12999,  "stock": 27,  "rating": 4.0},
    {"id": 42, "name": "Minimal Floor Lamp",   "category": "Furniture",   "price": 5999,   "stock": 35,  "rating": 4.2},
    {"id": 43, "name": "Coffee Table Walnut",  "category": "Furniture",   "price": 10999,  "stock": 22,  "rating": 4.3},
    {"id": 44, "name": "Gaming Desk Pro",      "category": "Furniture",   "price": 21999,  "stock": 18,  "rating": 4.5},
]

db_lock = threading.Lock()
processed_idempotency = {}
processed_payment = {}


class RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_paths = ('/RPC2',)


def filter_by_category(category: str) -> dict:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[RPC SERVER] [{timestamp}] filter_by_category('{category}')")
    with db_lock:
        if category.strip().upper() == "ALL":
            matched = PRODUCTS_DB[:]
        else:
            matched = [p for p in PRODUCTS_DB if p["category"].lower() == category.strip().lower()]
    all_categories = sorted(set(p["category"] for p in PRODUCTS_DB))
    if not matched:
        return {
            "status": "not_found",
            "message": f"No products found in category '{category}'",
            "category": category,
            "count": 0,
            "products": [],
            "available_categories": all_categories,
            "timestamp": timestamp,
        }
    return {
        "status": "success",
        "message": f"Found {len(matched)} product(s) in '{category}'",
        "category": category,
        "count": len(matched),
        "products": matched,
        "available_categories": all_categories,
        "timestamp": timestamp,
    }


def get_product(product_id: int) -> dict:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[RPC SERVER] [{timestamp}] get_product({product_id})")
    with db_lock:
        product = next((p for p in PRODUCTS_DB if p["id"] == product_id), None)
    if not product:
        return {
            "status": "not_found",
            "message": f"Product with ID {product_id} does not exist.",
            "product": {},
            "timestamp": timestamp,
        }
    return {
        "status": "success",
        "message": f"Product '{product['name']}' found.",
        "product": product,
        "in_stock": product["stock"] > 0,
        "timestamp": timestamp,
    }


def list_categories() -> dict:
    print(f"[RPC SERVER] list_categories()")
    with db_lock:
        categories = sorted(set(p["category"] for p in PRODUCTS_DB))
        counts = {cat: sum(1 for p in PRODUCTS_DB if p["category"] == cat) for cat in categories}
    return {
        "status": "success",
        "categories": categories,
        "counts": counts,
        "total_products": len(PRODUCTS_DB),
    }


def reserve_stock(payload: dict) -> dict:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cart = payload.get("cart", []) if isinstance(payload, dict) else []
    idempotency_key = payload.get("idempotencyKey") if isinstance(payload, dict) else None
    print(f"[RPC SERVER] [{timestamp}] reserve_stock() request received")

    if not cart:
        print("[RPC SERVER] reserve_stock() failed: empty cart")
        return {
            "success": False,
            "message": "Cart is empty",
            "timestamp": timestamp,
        }

    if idempotency_key and idempotency_key in processed_idempotency:
        print(f"[RPC SERVER] idempotency replay: {idempotency_key}")
        return processed_idempotency[idempotency_key]

    with db_lock:
        print("[RPC SERVER] lock acquired for reserve_stock")

        for item in cart:
            pid = item.get("id")
            qty = int(item.get("qty", 0))
            product = next((p for p in PRODUCTS_DB if p["id"] == pid), None)
            if not product:
                print(f"[RPC SERVER] product not found: id={pid}")
                return {
                    "success": False,
                    "message": f"Product with ID {pid} not found",
                    "timestamp": timestamp,
                }
            if qty <= 0:
                print(f"[RPC SERVER] invalid quantity for id={pid}")
                return {
                    "success": False,
                    "message": "Invalid quantity in cart",
                    "timestamp": timestamp,
                }
            if product["stock"] < qty:
                print(f"[RPC SERVER] insufficient stock for {product['name']}: requested={qty}, available={product['stock']}")
                return {
                    "success": False,
                    "message": f"Insufficient stock for {product['name']}",
                    "timestamp": timestamp,
                }

        for item in cart:
            pid = item.get("id")
            qty = int(item.get("qty", 0))
            product = next((p for p in PRODUCTS_DB if p["id"] == pid), None)
            before = product["stock"]
            product["stock"] -= qty
            after = product["stock"]
            print(f"[RPC SERVER] reserved id={pid} qty={qty} stock {before}->{after}")

        updated = [{"id": p["id"], "stock": p["stock"]} for p in PRODUCTS_DB]
        response = {
            "success": True,
            "message": "Stock reserved successfully",
            "updated_products": updated,
            "timestamp": timestamp,
        }

        if idempotency_key:
            processed_idempotency[idempotency_key] = response

        print("[RPC SERVER] reserve_stock() completed successfully")
        return response


def release_stock(payload: dict) -> dict:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cart = payload.get("cart", []) if isinstance(payload, dict) else []
    reason = payload.get("reason", "compensation") if isinstance(payload, dict) else "compensation"
    print(f"[RPC SERVER] [{timestamp}] release_stock() reason={reason}")

    if not cart:
        return {
            "success": False,
            "message": "Cart is empty",
            "timestamp": timestamp,
        }

    with db_lock:
        print("[RPC SERVER] lock acquired for release_stock")
        for item in cart:
            pid = item.get("id")
            qty = int(item.get("qty", 0))
            product = next((p for p in PRODUCTS_DB if p["id"] == pid), None)
            if not product:
                continue
            before = product["stock"]
            product["stock"] += max(qty, 0)
            after = product["stock"]
            print(f"[RPC SERVER] released id={pid} qty={qty} stock {before}->{after}")

    return {
        "success": True,
        "message": "Stock released",
        "timestamp": timestamp,
    }


def process_payment(payload: dict) -> dict:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    order_id = payload.get("orderId", "UNKNOWN") if isinstance(payload, dict) else "UNKNOWN"
    amount = int(payload.get("amount", 0)) if isinstance(payload, dict) else 0
    payment_key = payload.get("paymentKey") if isinstance(payload, dict) else None
    demo_fail = payload.get("demo_fail", False) if isinstance(payload, dict) else False
    print(f"[PAYMENT SERVICE] [{timestamp}] process_payment() order={order_id} amount={amount} demo_fail={demo_fail}")

    if payment_key and payment_key in processed_payment:
        print(f"[PAYMENT SERVICE] idempotency replay: {payment_key}")
        return processed_payment[payment_key]

    # If demo_fail flag is set, force failure
    if demo_fail:
        approved = False
        print(f"[PAYMENT SERVICE] DEMO MODE: Payment failure injected (demo_fail=True)")
    else:
        approved = random.random() > 0.2
        if amount <= 0:
            approved = False

    if approved:
        response = {
            "success": True,
            "status": "PAID",
            "message": "Payment approved",
            "orderId": order_id,
            "timestamp": timestamp,
        }
        print(f"[PAYMENT SERVICE] payment success for {order_id}")
    else:
        response = {
            "success": False,
            "status": "DECLINED",
            "message": "Payment declined by bank simulator" if not demo_fail else "Payment failure (demo mode)",
            "orderId": order_id,
            "timestamp": timestamp,
        }
        print(f"[PAYMENT SERVICE] payment failed for {order_id}")

    if payment_key:
        processed_payment[payment_key] = response

    return response


def start_server(host="localhost", port=8001):
    server = SimpleXMLRPCServer(
        (host, port),
        requestHandler=RequestHandler,
        logRequests=False,
        allow_none=True,
    )
    server.register_function(filter_by_category, "filter_by_category")
    server.register_function(get_product,        "get_product")
    server.register_function(list_categories,    "list_categories")
    server.register_function(reserve_stock,      "reserve_stock")
    server.register_function(release_stock,      "release_stock")
    server.register_function(process_payment,    "process_payment")
    server.register_introspection_functions()

    print("=" * 55)
    print("   🛒  E-Commerce RPC Server — Product Service")
    print("=" * 55)
    print(f"   URL     : http://{host}:{port}/RPC2")
    print(f"   Products : {len(PRODUCTS_DB)}  |  Currency: INR (₹)")
    print("   Waiting for RPC calls... (Ctrl+C to stop)\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[RPC SERVER] Shutting down.")
        server.server_close()


if __name__ == "__main__":
    start_server()