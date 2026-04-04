"""
===================================================
  RPC CLIENT — core proxy module
  Used by both the CLI and the Streamlit frontend.
===================================================
"""

import xmlrpc.client
import time
import argparse


SERVER_URL = "http://localhost:8001/RPC2"
_proxy = None


def get_proxy(url: str = SERVER_URL) -> xmlrpc.client.ServerProxy | None:
    """Return a cached proxy, reconnecting if needed."""
    global _proxy
    if _proxy is not None:
        return _proxy
    for attempt in range(1, 4):
        try:
            proxy = xmlrpc.client.ServerProxy(url, allow_none=True)
            proxy.system.listMethods()
            _proxy = proxy
            return _proxy
        except ConnectionRefusedError:
            print(f"⚠️  Attempt {attempt}/3: Server unreachable. Retrying in 2s...")
            time.sleep(2)
    return None


def rpc_list_categories():
    proxy = get_proxy()
    if not proxy:
        return None
    return proxy.list_categories()


def rpc_filter_by_category(category: str):
    proxy = get_proxy()
    if not proxy:
        return None
    return proxy.filter_by_category(category)


def rpc_get_product(product_id: int):
    proxy = get_proxy()
    if not proxy:
        return None
    return proxy.get_product(product_id)


def rpc_reserve_stock(cart: list[dict], idempotency_key: str):
    proxy = get_proxy()
    if not proxy:
        return None
    payload = {
        "cart": cart,
        "idempotencyKey": idempotency_key,
    }
    return proxy.reserve_stock(payload)


# ─────────────────────────────────────────────────
#  CLI MODE  (python rpc_client.py)
# ─────────────────────────────────────────────────
def fmt_inr(amount: int) -> str:
    """Format integer rupees as ₹1,14,999"""
    s = str(amount)
    if len(s) <= 3:
        return f"₹{s}"
    last3 = s[-3:]
    rest = s[:-3]
    parts = []
    while len(rest) > 2:
        parts.append(rest[-2:])
        rest = rest[:-2]
    if rest:
        parts.append(rest)
    parts.reverse()
    return "₹" + ",".join(parts) + "," + last3


def print_products(products):
    if not products:
        print("  (no products)")
        return
    print(f"\n  {'ID':<5} {'Name':<28} {'Price (INR)':>14} {'Stock':>8} {'Rating':>7}")
    print("  " + "-" * 66)
    for p in products:
        stock = f"{p['stock']} units" if p['stock'] > 0 else "OUT OF STOCK"
        print(f"  {p['id']:<5} {p['name']:<28} {fmt_inr(p['price']):>14} {stock:>13} ⭐{p['rating']}")
    print()


def cli_filter_category():
    print("\n  Type a category name or 'ALL' for the full catalog.")
    category = input("  Enter category: ").strip()
    if not category:
        print("  ⚠️  No input given.")
        return
    print(f"\n  ⏳ Calling RPC → filter_by_category('{category}')...")
    result = rpc_filter_by_category(category)
    if not result:
        print("  ❌ Server unreachable.")
        return
    print(f"  Status : {result['status'].upper()}  |  {result['message']}")
    if result['status'] == 'success':
        print_products(result['products'])
    else:
        print(f"  Available: {', '.join(result['available_categories'])}\n")


def cli_get_product():
    raw = input("\n  Enter product ID: ").strip()
    if not raw or not raw.isdigit():
        print("  ❌ Invalid ID.")
        return
    pid = int(raw)
    print(f"\n  ⏳ Calling RPC → get_product({pid})...")
    result = rpc_get_product(pid)
    if not result:
        print("  ❌ Server unreachable.")
        return
    print(f"  Status : {result['status'].upper()}  |  {result['message']}")
    if result['status'] == 'success':
        p = result['product']
        stock_label = "✅ In Stock" if result['in_stock'] else "❌ Out of Stock"
        print(f"""
  ┌─ Product Details ───────────────────────────────
  │  ID       : {p['id']}
  │  Name     : {p['name']}
  │  Category : {p['category']}
  │  Price    : {fmt_inr(p['price'])}
  │  Stock    : {p['stock']} units  {stock_label}
  │  Rating   : ⭐ {p['rating']} / 5.0
  └─────────────────────────────────────────────────""")
    print()


def cli_list_categories():
    print("\n  ⏳ Calling RPC → list_categories()...")
    result = rpc_list_categories()
    if not result:
        print("  ❌ Server unreachable.")
        return
    print(f"\n  Total products: {result['total_products']}\n")
    print(f"  {'Category':<20} {'# Products':>12}")
    print("  " + "-" * 34)
    for cat in result['categories']:
        print(f"  {cat:<20} {result['counts'][cat]:>12}")
    print()


def cli_reserve_stock():
    raw_pid = input("\n  Enter product ID: ").strip()
    raw_qty = input("  Enter quantity: ").strip()

    if not raw_pid.isdigit() or not raw_qty.isdigit():
        print("  ❌ Invalid product ID or quantity.\n")
        return

    pid = int(raw_pid)
    qty = int(raw_qty)
    if qty <= 0:
        print("  ❌ Quantity must be greater than 0.\n")
        return

    idem = f"cli-{int(time.time() * 1000)}"
    print(f"\n  ⏳ Calling RPC → reserve_stock(pid={pid}, qty={qty})...")
    result = rpc_reserve_stock([{"id": pid, "qty": qty}], idem)
    if not result:
        print("  ❌ Server unreachable.")
        return

    status = "OK" if result.get("success") else "FAIL"
    print(f"  Status : {status}  |  {result.get('message', 'No message')}")

    if result.get("success") and result.get("updated_products"):
        updated = next((p for p in result["updated_products"] if p.get("id") == pid), None)
        if updated:
            print(f"  Updated Stock for ID {pid}: {updated['stock']} units")
    print()


def run_interactive_menu():
    menu = {
        "1": ("Filter products by category", cli_filter_category),
        "2": ("Get product by ID",           cli_get_product),
        "3": ("List all categories",         cli_list_categories),
        "4": ("Reserve stock (checkout sim)", cli_reserve_stock),
        "5": ("Exit",                        None),
    }

    while True:
        print("-" * 42)
        for k, (label, _) in menu.items():
            print(f"  [{k}] {label}")
        print("-" * 42)
        choice = input("  Your choice: ").strip()
        if choice == "5":
            print("\n  👋 Goodbye!\n")
            break
        if choice not in menu:
            print("  ⚠️  Invalid option.\n")
            continue
        try:
            menu[choice][1]()
        except Exception as e:
            print(f"  ❌ Error: {e}\n")


def run_watch_mode(interval_sec: int):
    print(f"[CLIENT] Watch mode started (interval={interval_sec}s). Press Ctrl+C to stop.")
    while True:
        result = rpc_list_categories()
        ts = time.strftime("%H:%M:%S")
        if not result:
            print(f"[CLIENT] [{ts}] Server unreachable")
        else:
            total = result.get("total_products", "?")
            count = len(result.get("categories", []))
            print(f"[CLIENT] [{ts}] RPC OK | categories={count} | products={total}")
        time.sleep(max(interval_sec, 1))


def run_reserve_once(product_id: int, qty: int):
    idem = f"cli-{int(time.time() * 1000)}"
    print(f"[CLIENT] Reserve once -> product={product_id}, qty={qty}")
    result = rpc_reserve_stock([{"id": product_id, "qty": qty}], idem)
    if not result:
        print("[CLIENT] ❌ Server unreachable")
        return

    status = "OK" if result.get("success") else "FAIL"
    print(f"[CLIENT] {status}: {result.get('message', 'No message')}")
    if result.get("success") and result.get("updated_products"):
        updated = next((p for p in result["updated_products"] if p.get("id") == product_id), None)
        if updated:
            print(f"[CLIENT] Updated stock for {product_id}: {updated['stock']}")


def main():
    import sys
    print("\n" + "=" * 58)
    print("    🛒  E-Commerce RPC Client  —  Product Service")
    print("=" * 58)
    if not get_proxy():
        sys.exit(1)
    print("✅ Connected\n")

    parser = argparse.ArgumentParser(description="RPC client modes")
    parser.add_argument("--interactive", action="store_true", help="Run old interactive menu mode")
    parser.add_argument("--watch", action="store_true", help="Run watch mode (non-interactive)")
    parser.add_argument("--interval", type=int, default=5, help="Watch mode interval in seconds")
    parser.add_argument("--reserve", type=int, metavar="PRODUCT_ID", help="Reserve stock once for a product ID")
    parser.add_argument("--qty", type=int, default=1, help="Quantity for --reserve (default: 1)")
    args = parser.parse_args()

    try:
        if args.interactive:
            run_interactive_menu()
            return

        if args.reserve is not None:
            run_reserve_once(args.reserve, max(args.qty, 1))
            return

        # Default behavior is non-interactive watch mode (server-like).
        if args.watch or (not args.interactive and args.reserve is None):
            run_watch_mode(args.interval)
    except KeyboardInterrupt:
        print("\n[CLIENT] Stopped by user.")


if __name__ == "__main__":
    main()