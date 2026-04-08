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
  },
  selectedPaymentMethod: 'UPI',
  startTime: Date.now()
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
  // Electronics
  1: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', // iPhone 15 Pro
  2: 'https://images.unsplash.com/photo-1610945464075-084fb24b7591?auto=format&fit=crop&w=800&q=80', // Samsung S24
  3: 'https://images.unsplash.com/photo-1618366712010-f10f21475c8b?auto=format&fit=crop&w=800&q=80', // Sony WH-1000XM5
  4: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=800&q=80', // MacBook Air M3
  
  // Clothing
  5: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // Nike Air Max
  6: 'https://images.unsplash.com/photo-1541099649105-f69ad23f32b0?auto=format&fit=crop&w=800&q=80', // Levi's 501
  7: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80', // Adidas Hoodie
  
  // Books
  8: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80', // Clean Code
  9: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', // Python Crash Course
  10: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80', // JavaScript Guide
  
  // Furniture
  11: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', // Modern Sofa
  12: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80', // Desk Chair
  
  // New Limited Edition Items
  45: 'https://images.unsplash.com/photo-1525966222134-fcfa99bcf9cf?auto=format&fit=crop&w=800&q=80', // Limited Sneaker
  46: 'https://images.unsplash.com/photo-1589234200632-48868dac3684?auto=format&fit=crop&w=800&q=80', // Ancient Coin
  47: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80', // Prototype Drone
  48: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80', // One-of-a-kind Vase
};

function getProductImage(id, category) {
  const numericId = parseInt(id, 10);
  if (PRODUCT_IMAGE_MAP[numericId]) {
    return PRODUCT_IMAGE_MAP[numericId];
  }
  
  // Fallback to category-based Unsplash search (more reliable than picsum)
  const cat = (category || 'product').toLowerCase();
  const searchMap = {
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=70',
    'books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=70',
    'clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=70',
    'furniture': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=70'
  };
  
  if (searchMap[cat]) return searchMap[cat];
  
  return `https://picsum.photos/seed/${numericId}/600/400`;
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
  
  const newProducts = (data.products || []).map((p) => ({
    ...p,
    image: getProductImage(p.id, p.category)
  }));

  // Smart Sync: Re-render if stock, price, or images changed
  const changed = newProducts.length !== state.products.length || 
    newProducts.some((p, i) => {
      const old = state.products[i];
      return !old || p.stock !== old.stock || p.image !== old.image || p.price !== old.price;
    });

  if (changed) {
    state.products = newProducts;
    updateProductIndex(state.products);
    const limit = getMaxProductPrice();
    if (state.maxPrice === 0 || state.maxPrice > limit) {
      state.maxPrice = limit;
    }
    render();
  }
}

function startSynchronization() {
  // Sync every 3 seconds
  setInterval(async () => {
    try {
      // Show sync pulse
      const indicator = document.querySelector('.sync-indicator');
      if (indicator) indicator.classList.add('pulse');
      
      await loadProducts(state.selectedCategory);
      
      setTimeout(() => {
        if (indicator) indicator.classList.remove('pulse');
      }, 500);
    } catch (err) {
      console.warn('Sync failed:', err);
    }
  }, 3000);
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
    
    // Force render to ensure images catch up
    render();
    
    startSynchronization();
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
  const p = productById(id);
  if (!p || p.stock <= 0) {
    renderToast('Out of stock', 'error');
    return;
  }
  
  const existing = state.cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id, qty: 1 });
  }
  
  logActivity(`Added to cart: ${p.name}`, 'info');
  renderToast('Added to cart', 'success');
  
  render();
  
  // Micro-animation for cart link
  const cartLink = document.querySelector('[data-nav="cart"]');
  if (cartLink) {
    cartLink.classList.add('cart-pop');
    setTimeout(() => cartLink.classList.remove('cart-pop'), 400);
  }
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

  const isPriority = document.getElementById('high-priority')?.checked || false;
  
  state.rpcBusy = true;
  logActivity(`Requesting stock reservation${isPriority ? ' (HIGH PRIORITY)' : ''}...`, 'info');
  logActivity('Waiting for distributed system lock...', 'warning');
  render();

  let reservation;
  try {
    reservation = await rpcPost('/reserve_stock', {
      cart: state.cart.map((i) => ({ ...i })),
      idempotencyKey: `idem-${Date.now()}`,
      priority: isPriority
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
  if (state.rpcBusy || !state.pendingPayment) return;

  // Read form data based on method
  let paymentDetails = {};
  if (method === 'UPI') {
    paymentDetails.vpa = document.getElementById('vpa-input')?.value || 'user@upi';
  } else if (method === 'CARD') {
    paymentDetails.cardNumber = document.getElementById('card-num')?.value || '**** **** **** 1234';
  }

  // Update demo flags from UI
  state.failureDemo.simulatePaymentFailure = document.getElementById('fail-payment')?.checked || false;
  state.failureDemo.simulateTimeout = document.getElementById('fail-timeout')?.checked || false;
  state.failureDemo.simulateServerError = document.getElementById('fail-server')?.checked || false;

  state.rpcBusy = true;
  logActivity(`Processing ${method} payment for ${state.pendingPayment.orderId}...`, 'info');
  render();

  try {
    if (state.failureDemo.simulateTimeout) {
      logActivity('Simulating network timeout...', 'warning');
      await new Promise(r => setTimeout(r, 4000));
      throw new Error('Connection timed out');
    }

    // RPC call to process payment
    const response = await rpcPost('/process_payment', {
      orderId: state.pendingPayment.orderId,
      amount: state.pendingPayment.amount,
      method: method,
      details: paymentDetails,
      demo_fail: state.failureDemo.simulatePaymentFailure,
      simulate_server_error: state.failureDemo.simulateServerError
    });

    if (!response.success) {
      throw new Error(response.message);
    }

    state.orders = state.orders.map(o => 
      o.orderId === state.pendingPayment.orderId ? { ...o, status: 'CONFIRMED_PAID' } : o
    );
    
    logActivity(`Payment successful! Order ${state.pendingPayment.orderId} confirmed.`, 'success');
    renderToast('Payment successful!', 'success');
    state.pendingPayment = null;
    goTo('orders');
  } catch (err) {
    logActivity(`Payment failed: ${err.message}`, 'error');
    renderToast(err.message, 'error');
    
    // Auto-compensation if server error
    if (err.message.includes('500') || state.failureDemo.simulateServerError) {
       logActivity('Server error detected. Initiating stock recovery...', 'warning');
       await rpcPost('/release_stock', {
         orderId: state.pendingPayment.orderId,
         reason: 'payment_failed'
       });
       state.orders = state.orders.map(o => 
         o.orderId === state.pendingPayment.orderId ? { ...o, status: 'PAYMENT_FAILED_STOCK_RELEASED' } : o
       );
       state.pendingPayment = null;
    }
  } finally {
    state.rpcBusy = false;
    render();
  }
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
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <p class="brand-kicker">DISTRIBUTED COMMERCE</p>
          <span class="sync-indicator" title="Live Sync Active"></span>
        </div>
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
        <article class="product-card stagger-item">
          <img src="${p.image}${p.image.includes('?') ? '&' : '?'}v=${state.startTime}" alt="${p.name}" class="product-image" loading="lazy" />
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
          <img src="${p.image}${p.image.includes('?') ? '&' : '?'}v=${state.startTime}" alt="${p.name}" />
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
        
        <div class="demo-options" style="margin-bottom: 1.2rem; padding: 0.8rem; border: 1px dashed var(--accent); border-radius: 12px; background: rgba(254, 189, 105, 0.05);">
          <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; color: var(--accent); font-size: 0.9rem; font-weight: 600;">
            <input type="checkbox" id="high-priority" style="accent-color: var(--accent); width: 18px; height: 18px;" /> 🚀 High Priority Order (VIP)
          </label>
          <p style="font-size: 0.75rem; color: var(--muted); margin: 0.4rem 0 0 1.8rem;">Priority requests jump the queue if the server is busy.</p>
        </div>

        <button class="checkout" data-checkout ${state.rpcBusy ? 'disabled' : ''}>${state.rpcBusy ? 'Processing...' : 'Place Order'}</button>
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
  const method = state.selectedPaymentMethod;

  return `
    <section class="payment-page page-enter">
      <div class="panel payment-panel">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2 style="margin: 0;">Payment</h2>
          <span class="pill" style="background: var(--surface-soft);">${state.pendingPayment.orderId}</span>
        </div>
        
        <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 1.2rem;">Total Amount: <strong style="color: var(--ink); font-size: 1.1rem;">${inr(state.pendingPayment.amount)}</strong></p>

        <div class="payment-tabs" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; background: rgba(0,0,0,0.2); padding: 0.3rem; border-radius: 12px;">
          <button class="nav-link ${method === 'UPI' ? 'active' : ''}" style="flex: 1; border: 0;" onclick="state.selectedPaymentMethod = 'UPI'; render();">UPI</button>
          <button class="nav-link ${method === 'CARD' ? 'active' : ''}" style="flex: 1; border: 0;" onclick="state.selectedPaymentMethod = 'CARD'; render();">Card</button>
          <button class="nav-link ${method === 'COD' ? 'active' : ''}" style="flex: 1; border: 0;" onclick="state.selectedPaymentMethod = 'COD'; render();">COD</button>
        </div>

        <div class="payment-form-wrap" style="min-height: 200px;">
          ${method === 'UPI' ? `
            <div class="fade-in">
              <label style="display: block; margin-bottom: 0.5rem; color: var(--muted); font-size: 0.85rem;">Enter UPI ID (VPA)</label>
              <input type="text" id="vpa-input" placeholder="username@bank" style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); color: #fff; margin-bottom: 1rem;" />
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="chip" style="font-size: 0.75rem; cursor: pointer;" onclick="document.getElementById('vpa-input').value='success@okaxis';">success@okaxis</span>
                <span class="chip" style="font-size: 0.75rem; cursor: pointer;" onclick="document.getElementById('vpa-input').value='demo@okicici';">demo@okicici</span>
              </div>
            </div>
          ` : method === 'CARD' ? `
            <div class="fade-in">
              <label style="display: block; margin-bottom: 0.5rem; color: var(--muted); font-size: 0.85rem;">Card Number</label>
              <input type="text" id="card-num" placeholder="XXXX XXXX XXXX XXXX" style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); color: #fff; margin-bottom: 1rem;" />
              <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <div style="flex: 2;">
                   <label style="display: block; margin-bottom: 0.5rem; color: var(--muted); font-size: 0.85rem;">Expiry</label>
                   <input type="text" placeholder="MM/YY" style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); color: #fff;" />
                </div>
                <div style="flex: 1;">
                   <label style="display: block; margin-bottom: 0.5rem; color: var(--muted); font-size: 0.85rem;">CVV</label>
                   <input type="password" placeholder="***" style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); color: #fff;" />
                </div>
              </div>
              <button class="ghost-btn" style="width: 100%; font-size: 0.8rem;" onclick="document.getElementById('card-num').value='4242 4242 4242 4242';">Fill Test Card</button>
            </div>
          ` : `
            <div class="fade-in" style="text-align: center; padding: 2rem 0;">
              <p style="color: var(--muted);">Pay cash when your order is delivered.</p>
            </div>
          `}
        </div>

        <div class="demo-options" style="margin-top: 2rem; padding: 1rem; border: 1px dashed var(--warn); border-radius: 12px; background: rgba(216, 160, 74, 0.05);">
          <h3 style="font-size: 0.85rem; color: var(--warn); margin-bottom: 0.8rem; text-transform: uppercase;">⚠️ Failure Simulation</h3>
          <div style="display: grid; gap: 0.6rem;">
            <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; font-size: 0.85rem; color: var(--muted);">
              <input type="checkbox" id="fail-payment" ${state.failureDemo.simulatePaymentFailure ? 'checked' : ''} /> Simulate Insufficient Funds
            </label>
            <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; font-size: 0.85rem; color: var(--muted);">
              <input type="checkbox" id="fail-timeout" ${state.failureDemo.simulateTimeout ? 'checked' : ''} /> Simulate Network Timeout (4s)
            </label>
            <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; font-size: 0.85rem; color: var(--muted);">
              <input type="checkbox" id="fail-server" ${state.failureDemo.simulateServerError ? 'checked' : ''} /> Simulate Server Outage (Distributed Crash)
            </label>
          </div>
        </div>

        <button class="cta" style="width: 100%; margin-top: 1.5rem; font-size: 1.1rem; padding: 1rem;" onclick="payNow('${method}')" ${state.rpcBusy ? 'disabled' : ''}>
          ${state.rpcBusy ? 'Verifying...' : `Pay ${inr(state.pendingPayment.amount)} Now`}
        </button>
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
        <img src="${p.image}${p.image.includes('?') ? '&' : '?'}v=${state.startTime}" alt="${p.name}" class="detail-main-image" />
        <div class="thumb-row">
          <img src="${getProductImage(p.id, `${p.category}-a`)}&v=${state.startTime}" alt="${p.name} view 1" />
          <img src="${getProductImage(p.id, `${p.category}-b`)}&v=${state.startTime}" alt="${p.name} view 2" />
          <img src="${getProductImage(p.id, `${p.category}-c`)}&v=${state.startTime}" alt="${p.name} view 3" />
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
