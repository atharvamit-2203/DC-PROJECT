"""
===================================================
  STREAMLIT FRONTEND
  RPC-Based E-Commerce System
  — Category Filtering & Product Selection via RPC —
===================================================
Run with:
    streamlit run app.py
Make sure rpc_server.py is running first.
"""

import streamlit as st
import xmlrpc.client
import time

# ─────────────────────────────────────────────────
#  PAGE CONFIG
# ─────────────────────────────────────────────────
st.set_page_config(
    page_title="ShopRPC — E-Commerce Demo",
    page_icon="🛒",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─────────────────────────────────────────────────
#  CUSTOM CSS
# ─────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

html, body, [class*="css"] {
    font-family: 'DM Sans', sans-serif;
}

/* Dark saffron-tinted background */
.stApp {
    background: #0f0e0d;
    color: #f0ede8;
}

/* Hide default streamlit chrome */
#MainMenu, footer, header { visibility: hidden; }

/* ── Hero banner ── */
.hero {
    background: linear-gradient(135deg, #1a1410 0%, #2d1f0e 50%, #1a1410 100%);
    border: 1px solid #f97316;
    border-radius: 16px;
    padding: 2.5rem 3rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
}
.hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%);
    border-radius: 50%;
}
.hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: 2.8rem;
    font-weight: 800;
    color: #f97316;
    margin: 0 0 0.3rem 0;
    letter-spacing: -1px;
}
.hero p {
    color: #b8a99a;
    font-size: 1rem;
    margin: 0;
}

/* ── Section label ── */
.section-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #f97316;
    margin-bottom: 0.5rem;
}

/* ── RPC badge ── */
.rpc-badge {
    display: inline-block;
    background: rgba(249,115,22,0.15);
    border: 1px solid rgba(249,115,22,0.4);
    color: #f97316;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 2px;
    padding: 3px 10px;
    border-radius: 20px;
    font-family: 'DM Sans', monospace;
    margin-bottom: 1rem;
}

/* ── Status chip ── */
.chip-success {
    display: inline-block;
    background: rgba(34,197,94,0.15);
    border: 1px solid rgba(34,197,94,0.35);
    color: #4ade80;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 20px;
    letter-spacing: 1px;
}
.chip-error {
    display: inline-block;
    background: rgba(239,68,68,0.15);
    border: 1px solid rgba(239,68,68,0.35);
    color: #f87171;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 20px;
}

/* ── Product card ── */
.product-card {
    background: #1a1712;
    border: 1px solid #2e2820;
    border-radius: 12px;
    padding: 1.2rem 1.4rem;
    margin-bottom: 0.9rem;
    transition: border-color 0.2s;
    position: relative;
}
.product-card:hover {
    border-color: #f97316;
}
.card-id {
    font-size: 0.65rem;
    color: #5a5248;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 0.2rem;
}
.card-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #f0ede8;
    margin-bottom: 0.5rem;
}
.card-price {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem;
    font-weight: 800;
    color: #f97316;
}
.card-meta {
    font-size: 0.78rem;
    color: #7a6f66;
    margin-top: 0.4rem;
}
.card-stock-ok  { color: #4ade80; font-size: 0.78rem; font-weight: 500; }
.card-stock-out { color: #f87171; font-size: 0.78rem; font-weight: 500; }
.card-rating    { color: #facc15; }

/* ── Detail box ── */
.detail-box {
    background: #1a1712;
    border: 1px solid #f97316;
    border-radius: 14px;
    padding: 1.8rem 2rem;
}
.detail-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: #f0ede8;
    margin-bottom: 0.3rem;
}
.detail-price {
    font-family: 'Syne', sans-serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: #f97316;
    margin-bottom: 1.2rem;
}
.detail-row {
    display: flex;
    justify-content: space-between;
    padding: 0.55rem 0;
    border-bottom: 1px solid #2e2820;
    font-size: 0.88rem;
}
.detail-row:last-child { border-bottom: none; }
.detail-key   { color: #7a6f66; font-weight: 500; }
.detail-value { color: #f0ede8; font-weight: 500; }

/* ── Sidebar ── */
section[data-testid="stSidebar"] {
    background: #110f0d !important;
    border-right: 1px solid #2e2820;
}
section[data-testid="stSidebar"] * { color: #c8bfb5 !important; }

/* ── Log box ── */
.log-box {
    background: #0a0908;
    border: 1px solid #2e2820;
    border-radius: 8px;
    padding: 0.9rem 1.1rem;
    font-family: 'Courier New', monospace;
    font-size: 0.78rem;
    color: #7a6f66;
    max-height: 220px;
    overflow-y: auto;
}
.log-entry { margin-bottom: 0.3rem; }
.log-ok    { color: #4ade80; }
.log-err   { color: #f87171; }
.log-info  { color: #f97316; }

/* ── Category pill ── */
.cat-pill {
    display: inline-block;
    background: rgba(249,115,22,0.1);
    border: 1px solid rgba(249,115,22,0.25);
    color: #c2824a;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 3px 12px;
    border-radius: 20px;
    margin: 3px;
    font-family: 'DM Sans', sans-serif;
}

/* ── Streamlit widget overrides ── */
.stSelectbox label, .stNumberInput label, .stTextInput label {
    color: #b8a99a !important;
    font-size: 0.82rem !important;
    font-weight: 500 !important;
}
div[data-baseweb="select"] {
    background: #1a1712 !important;
    border-color: #3a3028 !important;
}
.stButton > button {
    background: #f97316 !important;
    color: #0f0e0d !important;
    border: none !important;
    border-radius: 8px !important;
    font-family: 'Syne', sans-serif !important;
    font-weight: 700 !important;
    font-size: 0.88rem !important;
    letter-spacing: 0.5px !important;
    padding: 0.5rem 1.6rem !important;
    transition: opacity 0.2s !important;
}
.stButton > button:hover { opacity: 0.88 !important; }
hr { border-color: #2e2820 !important; }
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────────
#  RPC HELPERS
# ─────────────────────────────────────────────────
SERVER_URL = "http://localhost:8001/RPC2"

@st.cache_resource(show_spinner=False)
def get_proxy():
    """Cached RPC proxy — created once per session."""
    try:
        proxy = xmlrpc.client.ServerProxy(SERVER_URL, allow_none=True)
        proxy.system.listMethods()
        return proxy, None
    except Exception as e:
        return None, str(e)


def fmt_inr(amount) -> str:
    """Format integer rupees with Indian comma style: ₹1,14,999"""
    s = str(int(amount))
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


def stars(rating) -> str:
    full  = int(rating)
    half  = 1 if (rating - full) >= 0.5 else 0
    empty = 5 - full - half
    return "★" * full + "½" * half + "☆" * empty


def log(msg, kind="info"):
    if "rpc_log" not in st.session_state:
        st.session_state.rpc_log = []
    ts = time.strftime("%H:%M:%S")
    st.session_state.rpc_log.append((ts, msg, kind))
    if len(st.session_state.rpc_log) > 30:
        st.session_state.rpc_log.pop(0)


# ─────────────────────────────────────────────────
#  SESSION STATE INIT
# ─────────────────────────────────────────────────
for key in ["rpc_log", "cat_result", "prod_result", "cat_data"]:
    if key not in st.session_state:
        st.session_state[key] = [] if key == "rpc_log" else None


# ─────────────────────────────────────────────────
#  HERO HEADER
# ─────────────────────────────────────────────────
st.markdown("""
<div class="hero">
  <h1>🛒 ShopRPC</h1>
  <p>RPC-Based Microservices E-Commerce · Mutual Exclusion · Load Balancing · Fault Tolerance</p>
</div>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────────
#  SERVER STATUS  (top bar)
# ─────────────────────────────────────────────────
proxy, err = get_proxy()

col_s1, col_s2, col_s3 = st.columns([2, 2, 4])
with col_s1:
    if proxy:
        st.markdown('<span class="chip-success">● RPC SERVER ONLINE</span>', unsafe_allow_html=True)
    else:
        st.markdown('<span class="chip-error">✖ RPC SERVER OFFLINE</span>', unsafe_allow_html=True)
with col_s2:
    st.markdown(f'<span style="font-size:0.78rem;color:#5a5248;">endpoint: <code style="color:#f97316">{SERVER_URL}</code></span>', unsafe_allow_html=True)

if not proxy:
    st.error(f"Cannot reach RPC server. Make sure **rpc_server.py** is running.\n\n`python rpc_server.py`\n\nError: `{err}`")
    st.stop()

st.markdown("<hr>", unsafe_allow_html=True)

# ─────────────────────────────────────────────────
#  SIDEBAR — RPC Call Log
# ─────────────────────────────────────────────────
with st.sidebar:
    st.markdown('<div class="section-label">System</div>', unsafe_allow_html=True)
    st.markdown("**RPC-Based Microservices**")
    st.markdown('<div style="font-size:0.78rem;color:#5a5248;margin-bottom:1rem;">XML-RPC · Python · Streamlit</div>', unsafe_allow_html=True)

    st.markdown('<div class="section-label" style="margin-top:1rem;">Architecture</div>', unsafe_allow_html=True)
    st.markdown("""
<div style="font-size:0.78rem;line-height:1.9;color:#7a6f66;">
Browser (Streamlit)<br>
&nbsp;&nbsp;&nbsp;↓ HTTP<br>
<span style="color:#f97316;">Streamlit App</span><br>
&nbsp;&nbsp;&nbsp;↓ <b style="color:#f97316;">RPC</b><br>
<span style="color:#f97316;">Product RPC Server</span><br>
&nbsp;&nbsp;&nbsp;↓ Thread Lock<br>
In-Memory DB (INR ₹)<br>
</div>
""", unsafe_allow_html=True)

    st.markdown('<div class="section-label" style="margin-top:1.5rem;">RPC Call Log</div>', unsafe_allow_html=True)
    log_html = '<div class="log-box">'
    if st.session_state.rpc_log:
        for ts, msg, kind in reversed(st.session_state.rpc_log):
            css = f"log-{kind}"
            log_html += f'<div class="log-entry {css}">[{ts}] {msg}</div>'
    else:
        log_html += '<div style="color:#3a3028;">No calls yet...</div>'
    log_html += '</div>'
    st.markdown(log_html, unsafe_allow_html=True)

    if st.button("Clear Log"):
        st.session_state.rpc_log = []
        st.rerun()

# ─────────────────────────────────────────────────
#  MAIN TABS
# ─────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs(["📦 Category Filter", "🔍 Product Lookup", "📊 All Products"])

# ══════════════════════════════════════════════════
#  TAB 1 — Category Filter (RPC: filter_by_category)
# ══════════════════════════════════════════════════
with tab1:
    st.markdown('<div class="rpc-badge">RPC CALL → filter_by_category()</div>', unsafe_allow_html=True)
    st.markdown('<div class="section-label">Select a Category</div>', unsafe_allow_html=True)

    # Load categories once
    if st.session_state.cat_data is None:
        try:
            r = proxy.list_categories()
            st.session_state.cat_data = r
            log("list_categories() → OK", "ok")
        except Exception as e:
            log(f"list_categories() → FAIL: {e}", "err")

    cat_data = st.session_state.cat_data
    options = ["ALL"] + (cat_data["categories"] if cat_data else [])

    col_f1, col_f2 = st.columns([3, 1])
    with col_f1:
        selected_cat = st.selectbox(
            "Category",
            options=options,
            format_func=lambda x: f"🗂 {x}" if x != "ALL" else "📋 ALL — Show entire catalog",
        )
    with col_f2:
        st.markdown("<br>", unsafe_allow_html=True)
        search_clicked = st.button("Search via RPC", use_container_width=True)

    if search_clicked:
        with st.spinner("Making RPC call..."):
            try:
                result = proxy.filter_by_category(selected_cat)
                st.session_state.cat_result = result
                log(f"filter_by_category('{selected_cat}') → {result['status']} ({result['count']} items)", "ok")
            except Exception as e:
                log(f"filter_by_category() → ERROR: {e}", "err")
                st.error(f"RPC Error: {e}")

    result = st.session_state.cat_result
    if result:
        st.markdown(f"""
<div style="margin: 1rem 0 1.5rem; display:flex; align-items:center; gap: 1rem;">
  <span class="chip-{'success' if result['status']=='success' else 'error'}">
    {'✓ ' + str(result['count']) + ' products found' if result['status']=='success' else '✖ Not found'}
  </span>
  <span style="font-size:0.75rem;color:#5a5248;">{result['timestamp']}</span>
</div>
""", unsafe_allow_html=True)

        if result['status'] == 'success':
            cols = st.columns(2)
            for i, p in enumerate(result['products']):
                stock_cls  = "card-stock-ok"  if p['stock'] > 0 else "card-stock-out"
                stock_text = f"✅ {p['stock']} in stock" if p['stock'] > 0 else "❌ Out of stock"
                with cols[i % 2]:
                    st.markdown(f"""
<div class="product-card">
  <div class="card-id">ID #{p['id']} · {p['category']}</div>
  <div class="card-name">{p['name']}</div>
  <div class="card-price">{fmt_inr(p['price'])}</div>
  <div class="card-meta">
    <span class="card-rating">{stars(p['rating'])}</span> {p['rating']}/5.0 &nbsp;|&nbsp;
    <span class="{stock_cls}">{stock_text}</span>
  </div>
</div>
""", unsafe_allow_html=True)
        else:
            avail = "".join(f'<span class="cat-pill">{c}</span>' for c in result.get('available_categories', []))
            st.markdown(f'<div style="margin-top:1rem;">Available categories:<br>{avail}</div>', unsafe_allow_html=True)


# ══════════════════════════════════════════════════
#  TAB 2 — Product Lookup (RPC: get_product)
# ══════════════════════════════════════════════════
with tab2:
    st.markdown('<div class="rpc-badge">RPC CALL → get_product()</div>', unsafe_allow_html=True)
    st.markdown('<div class="section-label">Enter Product ID</div>', unsafe_allow_html=True)

    col_p1, col_p2 = st.columns([3, 1])
    with col_p1:
        product_id = st.number_input(
            "Product ID (1–12)",
            min_value=1, max_value=999,
            value=1, step=1,
        )
    with col_p2:
        st.markdown("<br>", unsafe_allow_html=True)
        lookup_clicked = st.button("Lookup via RPC", use_container_width=True)

    if lookup_clicked:
        with st.spinner("Making RPC call..."):
            try:
                result = proxy.get_product(int(product_id))
                st.session_state.prod_result = result
                log(f"get_product({product_id}) → {result['status']}", "ok" if result['status']=='success' else "err")
            except Exception as e:
                log(f"get_product({product_id}) → ERROR: {e}", "err")
                st.error(f"RPC Error: {e}")

    prod_result = st.session_state.prod_result
    if prod_result:
        st.markdown(f"""
<div style="margin: 1rem 0 1.5rem; display:flex; align-items:center; gap: 1rem;">
  <span class="chip-{'success' if prod_result['status']=='success' else 'error'}">
    {'✓ Product found' if prod_result['status']=='success' else '✖ Not found'}
  </span>
  <span style="font-size:0.75rem;color:#5a5248;">{prod_result['timestamp']}</span>
</div>
""", unsafe_allow_html=True)

        if prod_result['status'] == 'success':
            p = prod_result['product']
            stock_label  = "✅ In Stock"   if prod_result['in_stock'] else "❌ Out of Stock"
            stock_color  = "#4ade80"       if prod_result['in_stock'] else "#f87171"

            col_d1, col_d2 = st.columns([5, 3])
            with col_d1:
                st.markdown(f"""
<div class="detail-box">
  <div class="detail-name">{p['name']}</div>
  <div class="detail-price">{fmt_inr(p['price'])}</div>
  <div class="detail-row">
    <span class="detail-key">Product ID</span>
    <span class="detail-value">#{p['id']}</span>
  </div>
  <div class="detail-row">
    <span class="detail-key">Category</span>
    <span class="detail-value">{p['category']}</span>
  </div>
  <div class="detail-row">
    <span class="detail-key">Stock</span>
    <span class="detail-value" style="color:{stock_color};">{p['stock']} units — {stock_label}</span>
  </div>
  <div class="detail-row">
    <span class="detail-key">Rating</span>
    <span class="detail-value"><span style="color:#facc15;">{stars(p['rating'])}</span> {p['rating']} / 5.0</span>
  </div>
  <div class="detail-row">
    <span class="detail-key">Currency</span>
    <span class="detail-value">Indian Rupee (₹ INR)</span>
  </div>
</div>
""", unsafe_allow_html=True)

            with col_d2:
                st.markdown("""
<div style="background:#1a1712;border:1px solid #2e2820;border-radius:12px;padding:1.4rem;">
  <div class="section-label">RPC Concepts Shown</div>
  <div style="font-size:0.82rem;line-height:2;color:#7a6f66;">
    <span style="color:#4ade80;">✓</span> Remote Procedure Call<br>
    <span style="color:#4ade80;">✓</span> Mutual Exclusion (thread lock)<br>
    <span style="color:#4ade80;">✓</span> Fault-tolerant connection<br>
    <span style="color:#4ade80;">✓</span> Structured response dict<br>
    <span style="color:#4ade80;">✓</span> Server-side timestamp<br>
  </div>
</div>
""", unsafe_allow_html=True)

        else:
            st.warning(f"Product ID **{product_id}** does not exist in the database. Try IDs 1–12.")


# ══════════════════════════════════════════════════
#  TAB 3 — All Products (RPC: filter_by_category ALL)
# ══════════════════════════════════════════════════
with tab3:
    st.markdown('<div class="rpc-badge">RPC CALL → filter_by_category("ALL")</div>', unsafe_allow_html=True)

    if st.button("Load Full Catalog via RPC", use_container_width=False):
        with st.spinner("Fetching all products..."):
            try:
                r = proxy.filter_by_category("ALL")
                st.session_state["all_products"] = r
                log(f"filter_by_category('ALL') → {r['count']} products", "ok")
            except Exception as e:
                log(f"filter_by_category('ALL') → ERROR: {e}", "err")
                st.error(str(e))

    all_r = st.session_state.get("all_products")
    if all_r and all_r['status'] == 'success':
        products = all_r['products']

        # Summary metrics
        total_val = sum(p['price'] for p in products)
        avg_rating = sum(p['rating'] for p in products) / len(products)
        in_stock_count = sum(1 for p in products if p['stock'] > 0)

        m1, m2, m3, m4 = st.columns(4)
        metric_style = "background:#1a1712;border:1px solid #2e2820;border-radius:10px;padding:1rem;text-align:center;"
        with m1:
            st.markdown(f'<div style="{metric_style}"><div style="font-size:1.6rem;font-weight:800;color:#f97316;font-family:Syne,sans-serif;">{len(products)}</div><div style="font-size:0.72rem;color:#5a5248;letter-spacing:2px;">TOTAL PRODUCTS</div></div>', unsafe_allow_html=True)
        with m2:
            st.markdown(f'<div style="{metric_style}"><div style="font-size:1.6rem;font-weight:800;color:#f97316;font-family:Syne,sans-serif;">{in_stock_count}</div><div style="font-size:0.72rem;color:#5a5248;letter-spacing:2px;">IN STOCK</div></div>', unsafe_allow_html=True)
        with m3:
            st.markdown(f'<div style="{metric_style}"><div style="font-size:1.4rem;font-weight:800;color:#f97316;font-family:Syne,sans-serif;">{fmt_inr(total_val)}</div><div style="font-size:0.72rem;color:#5a5248;letter-spacing:2px;">CATALOG VALUE</div></div>', unsafe_allow_html=True)
        with m4:
            st.markdown(f'<div style="{metric_style}"><div style="font-size:1.6rem;font-weight:800;color:#f97316;font-family:Syne,sans-serif;">{avg_rating:.1f}⭐</div><div style="font-size:0.72rem;color:#5a5248;letter-spacing:2px;">AVG RATING</div></div>', unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        # Group by category
        from collections import defaultdict
        by_cat = defaultdict(list)
        for p in products:
            by_cat[p['category']].append(p)

        for cat, items in sorted(by_cat.items()):
            st.markdown(f'<div class="section-label" style="margin-top:1.5rem;">{cat}</div>', unsafe_allow_html=True)
            cols = st.columns(min(len(items), 4))
            for i, p in enumerate(items):
                stock_cls  = "card-stock-ok"  if p['stock'] > 0 else "card-stock-out"
                stock_text = f"✅ {p['stock']}"  if p['stock'] > 0 else "❌ Out"
                with cols[i % 4]:
                    st.markdown(f"""
<div class="product-card">
  <div class="card-id">#{p['id']}</div>
  <div class="card-name" style="font-size:0.92rem;">{p['name']}</div>
  <div class="card-price" style="font-size:1.1rem;">{fmt_inr(p['price'])}</div>
  <div class="card-meta">
    <span class="card-rating">{'★' * int(p['rating'])}</span><br>
    <span class="{stock_cls}">{stock_text}</span>
  </div>
</div>
""", unsafe_allow_html=True)

    elif all_r and all_r['status'] != 'success':
        st.error("Failed to load products.")
    else:
        st.markdown('<div style="color:#5a5248;font-size:0.9rem;margin-top:1rem;">Click the button above to make an RPC call and load the catalog.</div>', unsafe_allow_html=True)