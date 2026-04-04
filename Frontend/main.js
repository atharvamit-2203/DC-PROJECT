import './styles.css';

const state = {
  products: [],
  productIndex: new Map(),
  categories: ['All'],
  selectedCategory: 'All',
  searchQuery: '',
  sortBy: 'featured',
  maxPrice: 0,
  cart: [],
  orders: [],
  pendingPayment: null,
  rpcBusy: false,
  loading: true,
  error: '',
  page: 'home',
  activity: [],
  activeProductId: null,
  failureDemo: {
    simulatePaymentFailure: false,
    simulateTimeout: false,
    simulateServerError: false
  },
  auth: {
    loggedIn: false,
    name: '',
    email: ''
  }
};

const app = document.querySelector('#app');

const PAGE_TITLES = {
  home: 'Home',
  shop: 'Shop',
  cart: 'Cart',
  payment: 'Payment',
  orders: 'Orders',
  activity: 'Activity',
  account: 'Account'
};

const PRODUCT_IMAGE_MAP = {
  1: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
  2: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1200&q=80',
  3: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=1200&q=80',
  4: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  5: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80',
  6: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80',
  7: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
  8: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1200&q=80',
  9: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
  10: 'https://images.unsplash.com/photo-1455885666463-6ed922aa0f4e?auto=format&fit=crop&w=1200&q=80',
  11: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  12: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=1200&q=80',
  13: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1200&q=80',
  14: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80',
  15: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
  16: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1200&q=80',
  17: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
  18: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80',
  19: 'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=1200&q=80',
  20: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1200&q=80',
  21: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
  22: 'https://images.unsplash.com/photo-1592878940526-0214b0f374f6?auto=format&fit=crop&w=1200&q=80',
  23: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80',
  24: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=1200&q=80',
  25: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  26: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80',
  27: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
  28: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1200&q=80',
  29: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
  30: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80',
  31: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80',
  32: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
  33: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
  34: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80',
  35: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80',
  36: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80',
  37: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
  38: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  39: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80',
  40: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=1200&q=80',
  41: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80',
  42: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
  43: 'https://images.unsplash.com/photo-1532372320572-cda25653a26c?auto=format&fit=crop&w=1200&q=80',
  44: 'https://images.unsplash.com/photo-1582582429416-2d1165f1f4b1?auto=format&fit=crop&w=1200&q=80'
};

function getProductImage(id, category) {
  if (PRODUCT_IMAGE_MAP[id]) {
    return PRODUCT_IMAGE_MAP[id];
  }
  const seed = `${category || 'product'}-${id}`.replace(/\s+/g, '-').toLowerCase();
  return `https://picsum.photos/seed/${seed}/640/420`;
}

function nowTime() {
  return new Date().toLocaleTimeString();
}

function logActivity(message, type = 'info') {
  state.activity.unshift({
    id: `${Date.now()}-${Math.random()}`,
    message,
    type,
    at: nowTime()
  });
  if (state.activity.length > 50) {
    state.activity = state.activity.slice(0, 50);
  }
}

function goTo(page) {
  if (!PAGE_TITLES[page] && page !== 'product') return;
  state.page = page;
  if (page === 'product' && state.activeProductId) {
    window.location.hash = `product-${state.activeProductId}`;
  } else {
    window.location.hash = page;
  }
  render();
}

function syncPageFromHash() {
  const hash = (window.location.hash || '#home').replace('#', '').toLowerCase();
  if (hash.startsWith('product-')) {
    const pid = Number(hash.replace('product-', ''));
    if (!Number.isNaN(pid) && pid > 0) {
      state.activeProductId = pid;
      state.page = 'product';
      return;
    }
  }
  state.page = PAGE_TITLES[hash] ? hash : 'home';
}

function getMaxProductPrice() {
  if (state.products.length === 0) return 0;
  return Math.max(...state.products.map((p) => p.price));
}

function openProduct(id) {
  state.activeProductId = id;
  goTo('product');
}

function loginUser(name, email) {
  state.auth.loggedIn = true;
  state.auth.name = name.trim();
  state.auth.email = email.trim();
  logActivity(`User signed in: ${state.auth.name}`, 'success');
}

function logoutUser() {
  const name = state.auth.name || 'User';
  state.auth.loggedIn = false;
  state.auth.name = '';
  state.auth.email = '';
  logActivity(`${name} signed out`, 'info');
}

async function rpcGet(path) {
  const res = await fetch(`/api/rpc${path}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'RPC request failed');
  }
  return data;
}

async function rpcPost(path, payload) {
  const res = await fetch(`/api/rpc${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'RPC request failed');
  }
  return data;
}

function updateProductIndex(products) {
  products.forEach((p) => {
    state.productIndex.set(p.id, {
      ...p,
      image: getProductImage(p.id, p.category)
    });
  });
}

async function loadCategories() {
  const data = await rpcGet('/list_categories');
  state.categories = ['All', ...data.categories];
}

async function loadProducts(category = 'All') {
  const queryCategory = category === 'All' ? 'ALL' : category;
  const data = await rpcGet(`/filter_by_category?category=${encodeURIComponent(queryCategory)}`);
  state.products = (data.products || []).map((p) => ({
    ...p,
    image: getProductImage(p.id, p.category)
  }));
  updateProductIndex(state.products);
  const limit = getMaxProductPrice();
  if (state.maxPrice === 0 || state.maxPrice > limit) {
    state.maxPrice = limit;
  }
}

async function initialize() {
  try {
    state.loading = true;
    state.error = '';
    syncPageFromHash();
    render();
    await loadCategories();
    await loadProducts('All');
    state.maxPrice = getMaxProductPrice();
    logActivity('Connected to RPC server and loaded catalog', 'success');
  } catch (err) {
    state.error = err.message || String(err);
    logActivity(`Connection error: ${state.error}`, 'error');
  } finally {
    state.loading = false;
    render();
  }
}

function inr(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function stars(rating) {
  const full = Math.floor(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function categoryList() {
  return state.categories;
}

function filteredProducts() {
  const q = state.searchQuery.trim().toLowerCase();
  let items = [...state.products];

  if (q) {
    items = items.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (state.maxPrice > 0) {
    items = items.filter((p) => p.price <= state.maxPrice);
  }

  if (state.sortBy === 'price-asc') items.sort((a, b) => a.price - b.price);
  if (state.sortBy === 'price-desc') items.sort((a, b) => b.price - a.price);
  if (state.sortBy === 'rating-desc') items.sort((a, b) => b.rating - a.rating);
  return items;
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function addToCart(id) {
  const existing = state.cart.find((item) => item.id === id);
  const product = state.productIndex.get(id);
  const available = product ? product.stock : 0;
  if (available <= 0) {
    renderToast('Out of stock for this item', 'error');
    logActivity(`Attempted to add out-of-stock item: ${product?.name || id}`, 'warning');
    return;
  }
  if (existing) {
    if (existing.qty + 1 > available) {
      renderToast('Not enough stock available', 'error');
      return;
    }
    existing.qty += 1;
  } else {
    state.cart.push({ id, qty: 1 });
  }
  logActivity(`Added to cart: ${product?.name || `Product ${id}`}`, 'info');
  render();
}

function removeFromCart(id) {
  const p = productById(id);
  state.cart = state.cart.filter((i) => i.id !== id);
  logActivity(`Removed from cart: ${p?.name || `Product ${id}`}`, 'info');
  render();
}

async function checkout() {
  if (state.rpcBusy) {
    renderToast('RPC in progress. Please wait.', 'info');
    return;
  }

  if (state.cart.length === 0) {
    renderToast('Your cart is empty', 'error');
    return;
  }

  state.rpcBusy = true;
  logActivity('Starting stock reservation via RPC', 'info');
  render();

  let reservation;
  try {
    reservation = await rpcPost('/reserve_stock', {
      cart: state.cart.map((i) => ({ ...i })),
      idempotencyKey: `idem-${Date.now()}`
    });
  } catch (err) {
    state.rpcBusy = false;
    render();
    logActivity(`Reservation error: ${err.message || String(err)}`, 'error');
    renderToast('Reservation request failed', 'error');
    return;
  }

  if (!reservation.success) {
    state.rpcBusy = false;
    render();
    logActivity(`Reservation failed: ${reservation.message}`, 'error');
    renderToast(reservation.message, 'error');
    return;
  }

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const orderItems = state.cart.map((i) => ({ ...i }));
  state.pendingPayment = {
    orderId,
    items: orderItems,
    amount: cartTotal(),
    createdAt: new Date().toLocaleTimeString(),
  };

  state.orders.unshift({
    orderId,
    status: 'AWAITING_PAYMENT',
    at: state.pendingPayment.createdAt,
    items: orderItems,
  });

  state.cart = [];
  await loadProducts(state.selectedCategory);
  state.rpcBusy = false;
  goTo('payment');
  logActivity(`Stock reserved for ${orderId}. Awaiting payment.`, 'success');
  render();
  renderToast(`Order ${orderId} reserved. Continue to payment.`, 'info');
}

async function payNow(method = 'UPI') {
  if (state.rpcBusy || !state.pendingPayment) {
    return;
  }

  // Update failure demo flags from checkboxes
  state.failureDemo.simulatePaymentFailure = document.getElementById('fail-payment')?.checked || false;
  state.failureDemo.simulateTimeout = document.getElementById('fail-timeout')?.checked || false;
  state.failureDemo.simulateServerError = document.getElementById('fail-server')?.checked || false;

  state.rpcBusy = true;
  const failureStr = state.failureDemo.simulatePaymentFailure ? ' [FAIL INJECTED]' : '';
  logActivity(`Processing payment (${method}) for ${state.pendingPayment.orderId}${failureStr}`, 'info');
  render();

  // Handle timeout simulation on client side
  if (state.failureDemo.simulateTimeout) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    state.rpcBusy = false;
    render();
    logActivity('Payment timeout: Server took too long to respond', 'error');
    renderToast('Payment timeout - please try again', 'error');
    return;
  }

  // Handle server error simulation on client side
  if (state.failureDemo.simulateServerError) {
    state.rpcBusy = false;
    render();
    logActivity('Payment error: Server encountered an error', 'error');
    renderToast('Server error - please contact support', 'error');
    return;
  }

  let payment;
  try {
    payment = await rpcPost('/process_payment', {
      orderId: state.pendingPayment.orderId,
      amount: state.pendingPayment.amount,
      paymentKey: `pay-${Date.now()}`,
      method,
      demo_fail: state.failureDemo.simulatePaymentFailure
    });
  } catch (err) {
    state.rpcBusy = false;
    render();
    logActivity(`Payment RPC error: ${err.message || String(err)}`, 'error');
    renderToast('Payment request failed', 'error');
    return;
  }

  const order = state.orders.find((o) => o.orderId === state.pendingPayment.orderId);
  if (!payment.success) {
    try {
      await rpcPost('/release_stock', {
        cart: state.pendingPayment.items,
        reason: 'payment_failed'
      });
    } catch (err) {
      logActivity(`Compensation release failed: ${err.message || String(err)}`, 'error');
    }
    if (order) {
      order.status = 'PAYMENT_FAILED_STOCK_RELEASED';
      order.at = new Date().toLocaleTimeString();
    }
    logActivity(`Payment failed for ${state.pendingPayment.orderId}. Stock released.`, 'warning');
    state.pendingPayment = null;
    await loadProducts(state.selectedCategory);
    state.rpcBusy = false;
    goTo('orders');
    render();
    renderToast('Payment failed. Stock released automatically.', 'error');
    return;
  }

  if (order) {
    order.status = 'CONFIRMED_PAID';
    order.at = new Date().toLocaleTimeString();
  }
  logActivity(`Payment successful for ${state.pendingPayment.orderId}`, 'success');
  state.pendingPayment = null;
  state.rpcBusy = false;
  goTo('orders');
  render();
  renderToast('Payment successful. Order confirmed.', 'success');
}

function productById(id) {
  return state.productIndex.get(id);
}

function cartTotal() {
  return state.cart.reduce((sum, item) => {
    const p = productById(item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function renderToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 2000);
}

function renderHeader() {
  const links = Object.keys(PAGE_TITLES)
    .map((key) => `
      <button class="nav-link ${state.page === key ? 'active' : ''}" data-nav="${key}">
        ${PAGE_TITLES[key]}
      </button>
    `)
    .join('');

  return `
    <header class="site-header fade-in">
      <div class="brand-wrap">
        <p class="brand-kicker">DISTRIBUTED COMMERCE</p>
        <h1 class="brand-title">Aster Cart</h1>
      </div>
      <nav class="nav-row">${links}</nav>
      <div class="header-stats">
        <span class="pill">Items ${cartCount()}</span>
        <span class="pill">Orders ${state.orders.length}</span>
        <span class="pill ${state.auth.loggedIn ? 'ok-pill' : ''}">${state.auth.loggedIn ? `Hi ${state.auth.name}` : 'Guest'}</span>
      </div>
    </header>
  `;
}

function renderHomePage() {
  const featured = state.products.slice(0, 3)
    .map((p) => `
      <article class="feature-card">
        <img src="${p.image}" alt="${p.name}" />
        <div class="feature-overlay">
          <h3>${p.name}</h3>
          <p>${inr(p.price)}</p>
        </div>
      </article>
    `)
    .join('');

  return `
    <section class="home-hero page-enter">
      <div class="home-copy">
        <p class="kicker">Mutex + RPC + Saga Compensation</p>
        <h2>Shop with reliable stock reservation and payment orchestration.</h2>
        <p>Every order reserves inventory first, then processes payment, and auto-releases stock on failure.</p>
        <div class="hero-actions">
          <button class="cta" data-nav="shop">Start Shopping</button>
          <button class="cta ghost" data-nav="activity">View Activity</button>
        </div>
      </div>
      <div class="feature-grid">${featured}</div>
    </section>
  `;
}

function renderShopPage() {
  const categories = categoryList();
  const maxPriceLimit = getMaxProductPrice();
  const cards = filteredProducts()
    .map((p) => {
      const remaining = p.stock;
      return `
        <article class="product-card page-enter">
          <img src="${p.image}" alt="${p.name}" class="product-image" />
          <div class="product-body">
            <div class="meta">${p.category}</div>
            <h3>${p.name}</h3>
            <div class="price-row">
              <span class="price">${inr(p.price)}</span>
              <span class="stock ${remaining > 0 ? 'ok' : 'out'}">${remaining > 0 ? `${remaining} left` : 'Out of stock'}</span>
            </div>
            <div class="rating">${stars(p.rating)} ${p.rating}</div>
            <div class="action-row">
              <button class="ghost-btn" data-view="${p.id}">View Details</button>
              <button data-add="${p.id}" ${remaining <= 0 ? 'disabled' : ''}>Add to Cart</button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  return `
    <section class="shop-wrap page-enter">
      <div class="toolbar">
        <div class="chips">
          ${categories.map((c) => `<button class="chip ${state.selectedCategory === c ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('')}
        </div>
        <div class="filter-row">
          <input type="text" placeholder="Search products or category" value="${state.searchQuery}" data-search />
          <select data-sort>
            <option value="featured" ${state.sortBy === 'featured' ? 'selected' : ''}>Featured</option>
            <option value="price-asc" ${state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
            <option value="rating-desc" ${state.sortBy === 'rating-desc' ? 'selected' : ''}>Rating: High to Low</option>
          </select>
          <label class="price-slider">
            <span>Up to ${inr(state.maxPrice || maxPriceLimit)}</span>
            <input type="range" min="0" max="${maxPriceLimit}" step="500" value="${state.maxPrice || maxPriceLimit}" data-price />
          </label>
          <button class="ghost-btn" data-reset-filters>Reset</button>
        </div>
      </div>
      <section class="catalog">${cards || '<p class="empty">No products found.</p>'}</section>
    </section>
  `;
}

function renderCartPage() {
  const cartItems = state.cart.length
    ? state.cart.map((i) => {
      const p = productById(i.id);
      if (!p) return '';
      return `
        <li class="cart-item">
          <img src="${p.image}" alt="${p.name}" />
          <div>
            <strong>${p.name}</strong>
            <small>${i.qty} x ${inr(p.price)}</small>
          </div>
          <button data-remove="${i.id}" class="link">Remove</button>
        </li>
      `;
    }).join('')
    : '<li class="empty">No items in cart</li>';

  return `
    <section class="cart-page page-enter">
      <div class="panel">
        <h2>Cart</h2>
        <ul class="cart-list">${cartItems}</ul>
      </div>
      <div class="panel">
        <h2>Summary</h2>
        <div class="total-row"><span>Total</span><strong>${inr(cartTotal())}</strong></div>
        <button class="checkout" data-checkout ${state.rpcBusy ? 'disabled' : ''}>${state.rpcBusy ? 'Reserving...' : 'Place Order'}</button>
      </div>
    </section>
  `;
}

function renderPaymentPage() {
  if (!state.pendingPayment) {
    return `
      <section class="panel page-enter">
        <h2>Payment Service</h2>
        <p class="empty">No pending payment. Reserve an order from Cart first.</p>
      </section>
    `;
  }

  return `
    <section class="payment-page page-enter">
      <div class="panel payment-panel">
        <h2>Complete Payment</h2>
        <p>Order: <strong>${state.pendingPayment.orderId}</strong></p>
        <p>Amount: <strong>${inr(state.pendingPayment.amount)}</strong></p>
        
        <!-- Failure Simulation Options (Demo Mode) -->
        <div class="demo-options">
          <h3 style="font-size: 0.9rem; color: var(--accent); margin-top: 1.5rem; margin-bottom: 0.8rem;">⚡ Failure Simulation (Demo Only)</h3>
          <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem; cursor: pointer; color: var(--text-secondary); font-size: 0.9rem;">
            <input type="checkbox" id="fail-payment" ${state.failureDemo.simulatePaymentFailure ? 'checked' : ''} /> Simulate Payment Failure
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem; cursor: pointer; color: var(--text-secondary); font-size: 0.9rem;">
            <input type="checkbox" id="fail-timeout" ${state.failureDemo.simulateTimeout ? 'checked' : ''} /> Simulate Network Timeout
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-secondary); font-size: 0.9rem;">
            <input type="checkbox" id="fail-server" ${state.failureDemo.simulateServerError ? 'checked' : ''} /> Simulate Server Error
          </label>
        </div>
        
        <div class="method-grid" style="margin-top: 1.5rem;">
          <button class="pay-btn" data-pay="UPI" ${state.rpcBusy ? 'disabled' : ''}>Pay with UPI</button>
          <button class="pay-btn" data-pay="CARD" ${state.rpcBusy ? 'disabled' : ''}>Pay with Card</button>
          <button class="pay-btn" data-pay="COD" ${state.rpcBusy ? 'disabled' : ''}>Cash on Delivery</button>
        </div>
      </div>
    </section>
  `;
}

function renderProductPage() {
  const p = productById(state.activeProductId);
  if (!p) {
    return `
      <section class="panel page-enter">
        <h2>Product not found</h2>
        <p class="empty">This product is unavailable in current catalog view.</p>
        <button class="cta" data-nav="shop">Back to Shop</button>
      </section>
    `;
  }

  return `
    <section class="product-page page-enter">
      <div class="panel product-gallery">
        <img src="${p.image}" alt="${p.name}" class="detail-main-image" />
        <div class="thumb-row">
          <img src="${getProductImage(p.id, `${p.category}-a`)}" alt="${p.name} view 1" />
          <img src="${getProductImage(p.id, `${p.category}-b`)}" alt="${p.name} view 2" />
          <img src="${getProductImage(p.id, `${p.category}-c`)}" alt="${p.name} view 3" />
        </div>
      </div>
      <div class="panel product-info">
        <p class="meta">${p.category}</p>
        <h2>${p.name}</h2>
        <p class="detail-price">${inr(p.price)}</p>
        <p class="rating">${stars(p.rating)} ${p.rating}</p>
        <p class="empty">Built for distributed ordering demos with stock reservation and payment orchestration.</p>
        <div class="spec-grid">
          <div><span>Stock</span><strong>${p.stock}</strong></div>
          <div><span>SKU</span><strong>SKU-${p.id.toString().padStart(4, '0')}</strong></div>
          <div><span>Delivery</span><strong>2-4 days</strong></div>
          <div><span>Warranty</span><strong>1 year</strong></div>
        </div>
        <div class="hero-actions">
          <button data-add="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>Add to Cart</button>
          <button class="ghost-btn" data-nav="shop">Continue Shopping</button>
        </div>
      </div>
    </section>
  `;
}

function renderAccountPage() {
  if (!state.auth.loggedIn) {
    return `
      <section class="account-page page-enter">
        <div class="panel account-panel">
          <h2>Sign In</h2>
          <p class="empty">Local account simulation for profile and order history.</p>
          <form class="auth-form" data-auth-form>
            <label>Name</label>
            <input type="text" name="name" placeholder="Amit" required />
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" required />
            <button type="submit">Sign In</button>
          </form>
        </div>
      </section>
    `;
  }

  return `
    <section class="account-page page-enter">
      <div class="panel account-panel">
        <h2>Profile</h2>
        <div class="profile-card">
          <div class="avatar">${state.auth.name.slice(0, 1).toUpperCase()}</div>
          <div>
            <p><strong>${state.auth.name}</strong></p>
            <small>${state.auth.email}</small>
          </div>
        </div>
        <div class="spec-grid">
          <div><span>Orders</span><strong>${state.orders.length}</strong></div>
          <div><span>Cart Items</span><strong>${cartCount()}</strong></div>
          <div><span>Status</span><strong>Active</strong></div>
          <div><span>Tier</span><strong>Gold</strong></div>
        </div>
        <button class="ghost-btn" data-logout>Sign Out</button>
      </div>
    </section>
  `;
}

function renderOrdersPage() {
  const rows = state.orders.length
    ? state.orders.map((o) => `
      <li class="order-row">
        <div>
          <strong>${o.orderId}</strong>
          <small>${o.at}</small>
        </div>
        <span class="order-status ${o.status.toLowerCase()}">${o.status}</span>
      </li>
    `).join('')
    : '<li class="empty">No orders yet</li>';

  return `
    <section class="panel page-enter">
      <h2>Orders</h2>
      <ul class="orders">${rows}</ul>
    </section>
  `;
}

function renderActivityPage() {
  const rows = state.activity.length
    ? state.activity.map((a) => `
      <li class="activity-row ${a.type}">
        <span class="dot"></span>
        <div>
          <p>${a.message}</p>
          <small>${a.at}</small>
        </div>
      </li>
    `).join('')
    : '<li class="empty">No activity yet</li>';

  return `
    <section class="panel page-enter">
      <h2>Activity Feed</h2>
      <ul class="activity-list">${rows}</ul>
    </section>
  `;
}

function renderCurrentPage() {
  if (state.page === 'home') return renderHomePage();
  if (state.page === 'shop') return renderShopPage();
  if (state.page === 'cart') return renderCartPage();
  if (state.page === 'payment') return renderPaymentPage();
  if (state.page === 'product') return renderProductPage();
  if (state.page === 'orders') return renderOrdersPage();
  if (state.page === 'activity') return renderActivityPage();
  if (state.page === 'account') return renderAccountPage();
  return renderHomePage();
}

function render() {
  if (state.loading) {
    app.innerHTML = '<div class="panel page-enter"><p class="brand-kicker">RPC BRIDGE</p><h2>Connecting to rpc_server...</h2><p class="empty">Make sure Backend/rpc_server.py is running on localhost:8001.</p></div>';
    return;
  }

  if (state.error) {
    app.innerHTML = `<div class="panel page-enter"><p class="brand-kicker">RPC BRIDGE</p><h2>Connection Failed</h2><p class="empty">${state.error}</p></div>`;
    return;
  }

  app.innerHTML = `
    <div class="background-shape shape-a"></div>
    <div class="background-shape shape-b"></div>
    ${renderHeader()}
    <main class="page-shell">${renderCurrentPage()}</main>
  `;

  document.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav');
      goTo(target);
    });
  });

  document.querySelectorAll('[data-cat]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      state.selectedCategory = btn.getAttribute('data-cat');
      state.loading = true;
      render();
      try {
        await loadProducts(state.selectedCategory);
      } catch (err) {
        state.error = err.message || String(err);
      }
      state.loading = false;
      render();
    });
  });

  document.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(Number(btn.getAttribute('data-add'))));
  });

  document.querySelectorAll('[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-view'));
      openProduct(id);
    });
  });

  document.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.getAttribute('data-remove'))));
  });

  const checkoutBtn = document.querySelector('[data-checkout]');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }

  const searchInput = document.querySelector('[data-search]');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      render();
    });
  }

  const sortSelect = document.querySelector('[data-sort]');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      render();
    });
  }

  const priceSlider = document.querySelector('[data-price]');
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      state.maxPrice = Number(e.target.value);
      render();
    });
  }

  const resetFiltersBtn = document.querySelector('[data-reset-filters]');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      state.searchQuery = '';
      state.sortBy = 'featured';
      state.maxPrice = getMaxProductPrice();
      render();
    });
  }

  document.querySelectorAll('[data-pay]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const method = btn.getAttribute('data-pay') || 'UPI';
      payNow(method);
    });
  });

  const authForm = document.querySelector('[data-auth-form]');
  if (authForm) {
    authForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(authForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      if (!name || !email) {
        renderToast('Please enter name and email', 'error');
        return;
      }
      loginUser(name, email);
      renderToast(`Welcome, ${name}`, 'success');
      render();
    });
  }

  const logoutBtn = document.querySelector('[data-logout]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutUser();
      renderToast('Signed out', 'info');
      render();
    });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('hashchange', () => {
  syncPageFromHash();
  render();
});

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 's') {
    goTo('shop');
  }
});

initialize();
