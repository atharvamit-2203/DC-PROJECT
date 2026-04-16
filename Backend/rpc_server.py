from xmlrpc.server import SimpleXMLRPCServer, SimpleXMLRPCRequestHandler
from socketserver import ThreadingMixIn
import argparse
import datetime
import json
import random
import sqlite3
import threading
import time
import heapq
import uuid
from pathlib import Path

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
    {"id": 45, "name": "Limited Edition Sneaker", "category": "Clothing",  "price": 15000,  "stock": 1,   "rating": 5.0},
    {"id": 46, "name": "Ancient Roman Coin",     "category": "Books",     "price": 50000,  "stock": 1,   "rating": 4.9},
    {"id": 47, "name": "Prototype Drone X",     "category": "Electronics", "price": 99999,  "stock": 1,   "rating": 4.8},
    {"id": 48, "name": "One-of-a-kind Vase",    "category": "Furniture",   "price": 12000,  "stock": 1,   "rating": 4.7},
]

db_lock = threading.Lock()
processed_idempotency = {}
processed_payment = {}
BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DB_PATH = BASE_DIR / "rpc_state.db"
DB_PATH = DEFAULT_DB_PATH
RESERVATION_HOLD_SECONDS = 60


class ThreadedXMLRPCServer(ThreadingMixIn, SimpleXMLRPCServer):
    daemon_threads = True

def _serialize_response(payload: dict) -> str:
    return json.dumps(payload, separators=(",", ":"))


def _deserialize_response(payload: str) -> dict:
    return json.loads(payload)


def _utc_now() -> datetime.datetime:
    return datetime.datetime.utcnow()


def _to_utc_string(value: datetime.datetime) -> str:
    return value.strftime("%Y-%m-%dT%H:%M:%SZ")


def _from_utc_string(value: str) -> datetime.datetime:
    return datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ")


def _seconds_until(expiry_utc: str) -> int:
    delta = _from_utc_string(expiry_utc) - _utc_now()
    return max(0, int(delta.total_seconds()))


def _is_hold_active(expiry_utc: str) -> bool:
    return _seconds_until(expiry_utc) > 0


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=30, isolation_level=None)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA synchronous=NORMAL")
    conn.execute("PRAGMA busy_timeout=5000")
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price INTEGER NOT NULL,
                stock INTEGER NOT NULL,
                rating REAL NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS response_cache (
                cache_key TEXT PRIMARY KEY,
                kind TEXT NOT NULL,
                response_json TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS reservations (
                reservation_token TEXT PRIMARY KEY,
                idempotency_key TEXT,
                order_id TEXT,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                released_at TEXT,
                release_reason TEXT
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS reservation_items (
                reservation_token TEXT NOT NULL,
                product_id INTEGER NOT NULL,
                qty INTEGER NOT NULL,
                PRIMARY KEY (reservation_token, product_id)
            )
            """
        )
        conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_reservations_status_exp ON reservations(status, expires_at)"
        )

        current_count = conn.execute("SELECT COUNT(*) AS count FROM products").fetchone()["count"]
        if current_count == 0:
            conn.executemany(
                "INSERT INTO products (id, name, category, price, stock, rating) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    (p["id"], p["name"], p["category"], p["price"], p["stock"], p["rating"])
                    for p in PRODUCTS_DB
                ]
            )


def expire_old_reservations(conn: sqlite3.Connection) -> None:
    now_utc = _to_utc_string(_utc_now())
    conn.execute(
        """
        UPDATE reservations
        SET status = 'EXPIRED',
            released_at = ?,
            release_reason = COALESCE(release_reason, 'hold_timeout')
        WHERE status = 'ACTIVE' AND expires_at <= ?
        """,
        (now_utc, now_utc),
    )


def get_active_reserved_map(conn: sqlite3.Connection) -> dict[int, int]:
    now_utc = _to_utc_string(_utc_now())
    rows = conn.execute(
        """
        SELECT ri.product_id, SUM(ri.qty) AS qty
        FROM reservation_items ri
        JOIN reservations r ON r.reservation_token = ri.reservation_token
        WHERE r.status = 'ACTIVE' AND r.expires_at > ?
        GROUP BY ri.product_id
        """,
        (now_utc,),
    ).fetchall()
    return {int(row["product_id"]): int(row["qty"]) for row in rows}


def get_products_with_available_stock(conn: sqlite3.Connection, category: str | None = None):
    now_utc = _to_utc_string(_utc_now())
    base_query = """
        SELECT
            p.id,
            p.name,
            p.category,
            p.price,
            MAX(p.stock - COALESCE(ar.reserved_qty, 0), 0) AS stock,
            p.rating
        FROM products p
        LEFT JOIN (
            SELECT ri.product_id, SUM(ri.qty) AS reserved_qty
            FROM reservation_items ri
            JOIN reservations r ON r.reservation_token = ri.reservation_token
            WHERE r.status = 'ACTIVE' AND r.expires_at > ?
            GROUP BY ri.product_id
        ) ar ON ar.product_id = p.id
    """
    if category is None:
        query = base_query + " ORDER BY p.id"
        return conn.execute(query, (now_utc,)).fetchall()
    query = base_query + " WHERE lower(p.category) = lower(?) ORDER BY p.id"
    return conn.execute(query, (now_utc, category.strip())).fetchall()


def load_cached_response(cache_key: str, kind: str) -> dict | None:
    if not cache_key:
        return None
    with get_connection() as conn:
        row = conn.execute(
            "SELECT response_json FROM response_cache WHERE cache_key = ? AND kind = ?",
            (cache_key, kind),
        ).fetchone()
    if not row:
        return None
    return _deserialize_response(row["response_json"])


def store_cached_response(cache_key: str, kind: str, response: dict) -> None:
    if not cache_key:
        return
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO response_cache (cache_key, kind, response_json, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(cache_key) DO UPDATE SET
                kind = excluded.kind,
                response_json = excluded.response_json,
                updated_at = excluded.updated_at
            """,
            (cache_key, kind, _serialize_response(response), datetime.datetime.now().isoformat()),
        )


def rows_to_products(rows):
    return [
        {
            "id": row["id"],
            "name": row["name"],
            "category": row["category"],
            "price": row["price"],
            "stock": row["stock"],
            "rating": row["rating"],
        }
        for row in rows
    ]

class PriorityMutex:
    def __init__(self):
        self.lock = threading.Lock()
        self.condition = threading.Condition(self.lock)
        self.queue = []  
        self.owner = None
        self._counter = 0

    def acquire(self, is_priority=False):
        priority_val = 0 if is_priority else 1
        with self.lock:
            # If no one owns the lock and no one is waiting with higher/equal priority
            if self.owner is None and not self.queue:
                self.owner = threading.get_ident()
                return

            # Otherwise, wait in queue
            event = threading.Event()
            self._counter += 1
            entry = (priority_val, self._counter, event)
            heapq.heappush(self.queue, entry)
            
            while self.owner is not None or self.queue[0][2] != event:
                self.condition.wait()
            
            heapq.heappop(self.queue)
            self.owner = threading.get_ident()

    def release(self):
        with self.lock:
            self.owner = None
            self.condition.notify_all()

priority_mutex = PriorityMutex()

class RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_paths = ('/RPC2',)


def filter_by_category(category: str) -> dict:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[RPC SERVER] [{timestamp}] filter_by_category('{category}')")
    with get_connection() as conn:
        expire_old_reservations(conn)
        if category.strip().upper() == "ALL":
            rows = get_products_with_available_stock(conn)
        else:
            rows = get_products_with_available_stock(conn, category)
        all_categories = [row["category"] for row in conn.execute("SELECT DISTINCT category FROM products ORDER BY category").fetchall()]

    matched = rows_to_products(rows)
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
    with get_connection() as conn:
        expire_old_reservations(conn)
        product_row = conn.execute(
            """
            SELECT
                p.id,
                p.name,
                p.category,
                p.price,
                MAX(p.stock - COALESCE(ar.reserved_qty, 0), 0) AS stock,
                p.rating
            FROM products p
            LEFT JOIN (
                SELECT ri.product_id, SUM(ri.qty) AS reserved_qty
                FROM reservation_items ri
                JOIN reservations r ON r.reservation_token = ri.reservation_token
                WHERE r.status = 'ACTIVE' AND r.expires_at > ?
                GROUP BY ri.product_id
            ) ar ON ar.product_id = p.id
            WHERE p.id = ?
            """,
            (_to_utc_string(_utc_now()), product_id),
        ).fetchone()
    product = rows_to_products([product_row])[0] if product_row else None
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
    with get_connection() as conn:
        expire_old_reservations(conn)
        rows = conn.execute(
            "SELECT category, COUNT(*) AS count FROM products GROUP BY category ORDER BY category"
        ).fetchall()
        categories = [row["category"] for row in rows]
        counts = {row["category"]: row["count"] for row in rows}
        total_products = conn.execute("SELECT COUNT(*) AS count FROM products").fetchone()["count"]
    return {
        "status": "success",
        "categories": categories,
        "counts": counts,
        "total_products": total_products,
    }


def reserve_stock(payload: dict) -> dict:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cart = payload.get("cart", []) if isinstance(payload, dict) else []
    idempotency_key = payload.get("idempotencyKey") if isinstance(payload, dict) else None
    is_priority = payload.get("priority", False) if isinstance(payload, dict) else False
    order_id = payload.get("orderId") if isinstance(payload, dict) else None
    hold_seconds_raw = payload.get("holdSeconds", RESERVATION_HOLD_SECONDS) if isinstance(payload, dict) else RESERVATION_HOLD_SECONDS

    try:
        hold_seconds = int(hold_seconds_raw)
    except (TypeError, ValueError):
        hold_seconds = RESERVATION_HOLD_SECONDS
    hold_seconds = max(5, min(120, hold_seconds))
    
    print(f"[RPC SERVER] [{timestamp}] reserve_stock() request received | Priority: {is_priority}")

    if idempotency_key:
        cached = load_cached_response(idempotency_key, "reserve_stock")
        if cached and ("holdExpiresAt" not in cached or _is_hold_active(cached["holdExpiresAt"])):
            print(f"[RPC SERVER] idempotency replay: {idempotency_key}")
            return cached

    if not cart:
        print("[RPC SERVER] reserve_stock() failed: empty cart")
        return {
            "success": False,
            "message": "Cart is empty",
            "timestamp": timestamp,
        }

    print(f"[RPC SERVER] Thread {threading.get_ident()} waiting for priority_lock...")
    priority_mutex.acquire(is_priority)
    try:
        print(f"[RPC SERVER] lock acquired by thread {threading.get_ident()} (Priority: {is_priority})")

        normalized_cart = {}
        for item in cart:
            pid = item.get("id")
            qty = int(item.get("qty", 0))
            if qty <= 0:
                return {
                    "success": False,
                    "message": "Invalid quantity in cart",
                    "timestamp": timestamp,
                }
            normalized_cart[pid] = normalized_cart.get(pid, 0) + qty

        with get_connection() as conn:
            try:
                conn.execute("BEGIN IMMEDIATE")
                expire_old_reservations(conn)

                rows = conn.execute(
                    f"SELECT id, name, stock FROM products WHERE id IN ({','.join(['?'] * len(normalized_cart))})",
                    tuple(normalized_cart.keys()),
                ).fetchall()
                products = {row["id"]: row for row in rows}
                reserved_map = get_active_reserved_map(conn)

                for pid, qty in normalized_cart.items():
                    row = products.get(pid)
                    if not row:
                        print(f"[RPC SERVER] product not found: id={pid}")
                        conn.rollback()
                        return {
                            "success": False,
                            "message": f"Product with ID {pid} not found",
                            "timestamp": timestamp,
                        }

                    available = int(row["stock"]) - int(reserved_map.get(pid, 0))
                    if available < qty:
                        print(f"[RPC SERVER] insufficient stock for {row['name']}: requested={qty}, available={available}")
                        conn.rollback()
                        return {
                            "success": False,
                            "message": f"Insufficient stock for {row['name']}",
                            "timestamp": timestamp,
                        }

                created_at = _utc_now()
                expires_at = created_at + datetime.timedelta(seconds=hold_seconds)
                reservation_token = f"RSV-{uuid.uuid4().hex[:14].upper()}"
                conn.execute(
                    """
                    INSERT INTO reservations (
                        reservation_token, idempotency_key, order_id, status, created_at, expires_at
                    )
                    VALUES (?, ?, ?, 'ACTIVE', ?, ?)
                    """,
                    (
                        reservation_token,
                        idempotency_key,
                        order_id,
                        _to_utc_string(created_at),
                        _to_utc_string(expires_at),
                    ),
                )

                for pid, qty in normalized_cart.items():
                    conn.execute(
                        "INSERT INTO reservation_items (reservation_token, product_id, qty) VALUES (?, ?, ?)",
                        (reservation_token, pid, qty),
                    )
                    print(f"[RPC SERVER] hold created for id={pid} qty={qty} token={reservation_token}")

                updated = [
                    {"id": row["id"], "stock": row["stock"]}
                    for row in get_products_with_available_stock(conn)
                ]
                conn.commit()
            except Exception:
                conn.rollback()
                raise

        response = {
            "success": True,
            "message": f"Stock reserved for {hold_seconds}s. Complete payment before expiry.",
            "reservationToken": reservation_token,
            "holdExpiresAt": _to_utc_string(expires_at),
            "holdSeconds": hold_seconds,
            "updated_products": updated,
            "timestamp": timestamp,
        }

        if idempotency_key:
            store_cached_response(idempotency_key, "reserve_stock", response)

        print("[RPC SERVER] reserve_stock() completed successfully")
        return response
    finally:
        priority_mutex.release()
        print(f"[RPC SERVER] lock released by thread {threading.get_ident()}")


def release_stock(payload: dict) -> dict:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cart = payload.get("cart", []) if isinstance(payload, dict) else []
    reason = payload.get("reason", "compensation") if isinstance(payload, dict) else "compensation"
    reservation_token = payload.get("reservationToken") if isinstance(payload, dict) else None
    order_id = payload.get("orderId") if isinstance(payload, dict) else None
    print(f"[RPC SERVER] [{timestamp}] release_stock() reason={reason}")

    if not cart and not reservation_token and not order_id:
        return {
            "success": False,
            "message": "Cart is empty",
            "timestamp": timestamp,
        }

    priority_mutex.acquire(False)
    try:
        with get_connection() as conn:
            print("[RPC SERVER] lock acquired for release_stock")
            try:
                conn.execute("BEGIN IMMEDIATE")
                expire_old_reservations(conn)

                target = None
                if reservation_token:
                    target = conn.execute(
                        "SELECT reservation_token FROM reservations WHERE reservation_token = ? AND status = 'ACTIVE'",
                        (reservation_token,),
                    ).fetchone()
                if not target and order_id:
                    target = conn.execute(
                        """
                        SELECT reservation_token
                        FROM reservations
                        WHERE order_id = ? AND status = 'ACTIVE'
                        ORDER BY created_at DESC
                        LIMIT 1
                        """,
                        (order_id,),
                    ).fetchone()

                if target:
                    conn.execute(
                        """
                        UPDATE reservations
                        SET status = 'CANCELLED', released_at = ?, release_reason = ?
                        WHERE reservation_token = ? AND status = 'ACTIVE'
                        """,
                        (_to_utc_string(_utc_now()), reason, target["reservation_token"]),
                    )
                    message = "Reservation released"
                else:
                    message = "No active reservation found to release"
                conn.commit()
            except Exception:
                conn.rollback()
                raise
    finally:
        priority_mutex.release()

    return {
        "success": True,
        "message": message,
        "timestamp": timestamp,
    }


def process_payment(payload: dict) -> dict:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    order_id = payload.get("orderId", "UNKNOWN") if isinstance(payload, dict) else "UNKNOWN"
    amount = int(payload.get("amount", 0)) if isinstance(payload, dict) else 0
    payment_key = (payload.get("paymentKey") if isinstance(payload, dict) else None) or order_id
    reservation_token = payload.get("reservationToken") if isinstance(payload, dict) else None
    demo_fail = payload.get("demo_fail", False) if isinstance(payload, dict) else False
    simulate_server_error = payload.get("simulate_server_error", False) if isinstance(payload, dict) else False
    print(f"[PAYMENT SERVICE] [{timestamp}] process_payment() order={order_id} amount={amount} demo_fail={demo_fail}")

    cached = load_cached_response(payment_key, "payment")
    if cached:
        print(f"[PAYMENT SERVICE] idempotency replay: {payment_key}")
        return cached

    if simulate_server_error:
        response = {
            "success": False,
            "status": "ERROR",
            "message": "Internal server error (simulated)",
            "orderId": order_id,
            "timestamp": timestamp,
        }
        store_cached_response(payment_key, "payment", response)
        print(f"[PAYMENT SERVICE] simulated server error for {order_id}")
        return response

    if not reservation_token:
        response = {
            "success": False,
            "status": "INVALID_REQUEST",
            "message": "Missing reservation token",
            "orderId": order_id,
            "timestamp": timestamp,
        }
        store_cached_response(payment_key, "payment", response)
        return response

    priority_mutex.acquire(False)
    try:
        with get_connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            expire_old_reservations(conn)

            reservation = conn.execute(
                """
                SELECT reservation_token, status, expires_at
                FROM reservations
                WHERE reservation_token = ?
                """,
                (reservation_token,),
            ).fetchone()

            if not reservation:
                conn.rollback()
                response = {
                    "success": False,
                    "status": "INVALID_RESERVATION",
                    "message": "Reservation not found",
                    "orderId": order_id,
                    "timestamp": timestamp,
                }
                store_cached_response(payment_key, "payment", response)
                return response

            if reservation["status"] != "ACTIVE":
                conn.rollback()
                response = {
                    "success": False,
                    "status": "HOLD_EXPIRED",
                    "message": "Reservation is no longer active",
                    "orderId": order_id,
                    "timestamp": timestamp,
                }
                store_cached_response(payment_key, "payment", response)
                return response

            # If demo_fail flag is set, force failure
            if demo_fail:
                approved = False
                print(f"[PAYMENT SERVICE] DEMO MODE: Payment failure injected (demo_fail=True)")
            else:
                approved = random.random() > 0.2
                if amount <= 0:
                    approved = False

            if approved:
                items = conn.execute(
                    "SELECT product_id, qty FROM reservation_items WHERE reservation_token = ?",
                    (reservation_token,),
                ).fetchall()
                for item in items:
                    row = conn.execute("SELECT stock, name FROM products WHERE id = ?", (item["product_id"],)).fetchone()
                    if not row or row["stock"] < item["qty"]:
                        conn.rollback()
                        response = {
                            "success": False,
                            "status": "INVENTORY_MISMATCH",
                            "message": "Inventory mismatch while finalizing payment",
                            "orderId": order_id,
                            "timestamp": timestamp,
                        }
                        store_cached_response(payment_key, "payment", response)
                        return response

                for item in items:
                    conn.execute(
                        "UPDATE products SET stock = stock - ? WHERE id = ?",
                        (item["qty"], item["product_id"]),
                    )

                conn.execute(
                    """
                    UPDATE reservations
                    SET status = 'CONFIRMED',
                        order_id = ?,
                        released_at = ?,
                        release_reason = 'paid'
                    WHERE reservation_token = ?
                    """,
                    (order_id, _to_utc_string(_utc_now()), reservation_token),
                )
                conn.commit()

                response = {
                    "success": True,
                    "status": "PAID",
                    "message": "Payment approved",
                    "orderId": order_id,
                    "timestamp": timestamp,
                }
                print(f"[PAYMENT SERVICE] payment success for {order_id}")
            else:
                conn.execute(
                    """
                    UPDATE reservations
                    SET status = 'CANCELLED',
                        order_id = ?,
                        released_at = ?,
                        release_reason = 'payment_declined'
                    WHERE reservation_token = ?
                    """,
                    (order_id, _to_utc_string(_utc_now()), reservation_token),
                )
                conn.commit()
                response = {
                    "success": False,
                    "status": "DECLINED",
                    "message": "Payment declined by bank simulator" if not demo_fail else "Payment failure (demo mode)",
                    "orderId": order_id,
                    "timestamp": timestamp,
                }
                print(f"[PAYMENT SERVICE] payment failed for {order_id}")
    finally:
        priority_mutex.release()

    store_cached_response(payment_key, "payment", response)

    return response


def start_server(host="0.0.0.0", port=8001, db_path=None):
    global DB_PATH
    DB_PATH = Path(db_path).resolve() if db_path else DEFAULT_DB_PATH
    init_db()

    server = ThreadedXMLRPCServer(
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
    print(f"   DB Path  : {DB_PATH}")
    print(f"   Products : {len(PRODUCTS_DB)}  |  Currency: INR (₹)")
    print("   Waiting for RPC calls... (Ctrl+C to stop)\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[RPC SERVER] Shutting down.")
        server.server_close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Distributed E-Commerce RPC product server")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8001)
    parser.add_argument("--db-path", default=str(DEFAULT_DB_PATH))
    args = parser.parse_args()
    start_server(args.host, args.port, args.db_path)