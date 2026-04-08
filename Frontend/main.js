import './styles.css';

// ─── STATE ────────────────────────────────────────────────────────────────────
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
  auth: { loggedIn: false, name: '', email: '' },
  selectedPaymentMethod: 'UPI',
  startTime: Date.now(),
  sliderValue: 0,
  toasts: []
};

const app = document.querySelector('#app');
let scrollObserver = null;
let searchDebounceTimer = null;

const PAGE_TITLES = {
  home: 'Home', shop: 'Shop', cart: 'Cart',
  payment: 'Payment', orders: 'Orders', activity: 'Activity', account: 'Account'
};

const PAGE_ICONS = {
  home: '⌂', shop: '◈', cart: '◳', payment: '◉',
  orders: '≡', activity: '◎', account: '◯'
};

// ─── PRODUCT IMAGES ────────────────────────────────────────────────────────────
// Comprehensive Unsplash image map — keyed by product ID, with per-category pools
const PRODUCT_IMAGE_POOLS = {
  electronics: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1610945464075-084fb24b7591?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1574920162043-b872873f37b8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=800&q=80',
  ],
  books: [
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
  ],
  clothing: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad23f32b0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1467043237213-65f2da53396f?auto=format&fit=crop&w=800&q=80',
  ],
  furniture: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  ],
  sports: [
    'https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
  ],
  food: [
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  ]
};

// Cache so the same product always gets the same image
const _imageCache = new Map();

function getProductImage(id, category) {
  const key = `${id}-${category}`;
  if (_imageCache.has(key)) return _imageCache.get(key);

  const n = parseInt(id, 10);
  // Normalise category name to match pool keys
  const cat = (category || '').toLowerCase()
    .replace(/[^a-z]/g, '')   // strip hyphens, spaces, etc.
    .split('').slice(0, 10).join(''); // max 10 chars

  const poolKey = Object.keys(PRODUCT_IMAGE_POOLS).find(k => cat.startsWith(k)) || 'default';
  const pool = PRODUCT_IMAGE_POOLS[poolKey];
  const url = pool[n % pool.length];

  _imageCache.set(key, url);
  return url;
}

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const nowTime = () => new Date().toLocaleTimeString();

function inr(v) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(v);
}

function stars(r) {
  const full = Math.floor(r), half = r % 1 >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

function cartCount()  { return state.cart.reduce((s, i) => s + i.qty, 0); }
function cartTotal()  {
  return state.cart.reduce((s, i) => {
    const p = productById(i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
}

function productById(id) { return state.productIndex.get(id); }

function getMaxProductPrice() {
  return state.products.length ? Math.max(...state.products.map(p => p.price)) : 0;
}

// Highlight query matches inside text, returns HTML string
function highlightMatch(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function filteredProducts() {
  const q = state.searchQuery.trim().toLowerCase();
  let items = [...state.products];
  if (q) items = items.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  if (state.maxPrice > 0) items = items.filter(p => p.price <= state.maxPrice);
  if (state.sortBy === 'price-asc')    items.sort((a, b) => a.price - b.price);
  if (state.sortBy === 'price-desc')   items.sort((a, b) => b.price - a.price);
  if (state.sortBy === 'rating-desc')  items.sort((a, b) => b.rating - a.rating);
  return items;
}

// ─── TOAST SYSTEM ──────────────────────────────────────────────────────────────
const TOAST_ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };

function renderToast(message, type = 'info') {
  const id = `${Date.now()}-${Math.random()}`;
  state.toasts.push({ id, message, type });
  setTimeout(() => {
    const el = document.querySelector(`[data-toast="${id}"]`);
    if (el) {
      el.style.animation = 'toastOut 0.3s cubic-bezier(0.65,0,0.35,1) forwards';
      setTimeout(() => { state.toasts = state.toasts.filter(t => t.id !== id); render(); }, 280);
    } else {
      state.toasts = state.toasts.filter(t => t.id !== id); render();
    }
  }, 4500);
  render();
}

function closeToast(id) {
  const el = document.querySelector(`[data-toast="${id}"]`);
  if (el) {
    el.style.animation = 'toastOut 0.25s cubic-bezier(0.65,0,0.35,1) forwards';
    setTimeout(() => { state.toasts = state.toasts.filter(t => t.id !== id); render(); }, 240);
  } else {
    state.toasts = state.toasts.filter(t => t.id !== id); render();
  }
}

function renderToasts() {
  if (!state.toasts.length) return '';
  return `
    <style>
      @keyframes toastOut {
        from { opacity: 1; transform: translateX(0) scale(1); }
        to   { opacity: 0; transform: translateX(48px) scale(0.88); }
      }
    </style>
    <div class="toast-container">
      ${state.toasts.map(t => `
        <div class="toast toast-${t.type}" data-toast="${t.id}">
          <span class="toast-icon">${TOAST_ICONS[t.type] || 'ℹ'}</span>
          <span>${t.message}</span>
          <button class="toast-close" onclick="closeToast('${t.id}')">×</button>
        </div>`).join('')}
    </div>`;
}

// ─── ACTIVITY LOG ──────────────────────────────────────────────────────────────
function logActivity(message, type = 'info') {
  state.activity.unshift({ id: `${Date.now()}-${Math.random()}`, message, type, at: nowTime() });
  if (state.activity.length > 60) state.activity = state.activity.slice(0, 60);
}

// ─── NAVIGATION ────────────────────────────────────────────────────────────────
function goTo(page) {
  if (!PAGE_TITLES[page] && page !== 'product') return;
  const shell = document.querySelector('.page-shell');
  const doNav = () => {
    state.page = page;
    window.location.hash = page === 'product' && state.activeProductId
      ? `product-${state.activeProductId}` : page;
    render();
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };
  if (shell) {
    shell.style.transition = 'opacity 0.18s ease, transform 0.18s ease, filter 0.18s ease';
    shell.style.opacity = '0';
    shell.style.transform = 'translateY(-10px)';
    shell.style.filter = 'blur(6px)';
    setTimeout(doNav, 190);
  } else { doNav(); }
}

function syncPageFromHash() {
  const hash = (window.location.hash || '#home').replace('#', '').toLowerCase();
  if (hash.startsWith('product-')) {
    const pid = Number(hash.replace('product-', ''));
    if (!isNaN(pid) && pid > 0) { state.activeProductId = pid; state.page = 'product'; return; }
  }
  state.page = PAGE_TITLES[hash] ? hash : 'home';
}

function openProduct(id) { state.activeProductId = id; goTo('product'); }

// ─── AUTH ──────────────────────────────────────────────────────────────────────
function loginUser(name, email) {
  state.auth = { loggedIn: true, name: name.trim(), email: email.trim() };
  logActivity(`Signed in as ${state.auth.name}`, 'success');
}

function logoutUser() {
  const name = state.auth.name;
  state.auth = { loggedIn: false, name: '', email: '' };
  logActivity(`${name} signed out`, 'info');
}

// ─── RPC CALLS ────────────────────────────────────────────────────────────────
async function rpcGet(path) {
  const res = await fetch(`/api/rpc${path}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'RPC request failed');
  return data;
}

async function rpcPost(path, payload) {
  const res = await fetch(`/api/rpc${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'RPC request failed');
  return data;
}

function updateProductIndex(products) {
  products.forEach(p => state.productIndex.set(p.id, { ...p, image: getProductImage(p.id, p.category) }));
}

async function loadCategories() {
  const data = await rpcGet('/list_categories');
  state.categories = ['All', ...data.categories];
}

async function loadProducts(category = 'All') {
  const queryCategory = category === 'All' ? 'ALL' : category;
  const data = await rpcGet(`/filter_by_category?category=${encodeURIComponent(queryCategory)}`);
  const newProducts = (data.products || []).map(p => ({ ...p, image: getProductImage(p.id, p.category) }));
  const changed = newProducts.length !== state.products.length ||
    newProducts.some((p, i) => { const o = state.products[i]; return !o || p.stock !== o.stock || p.price !== o.price; });
  if (changed) {
    state.products = newProducts;
    updateProductIndex(state.products);
    const limit = getMaxProductPrice();
    if (state.maxPrice === 0 || state.maxPrice > limit) state.maxPrice = limit;
    if (!state.sliderValue || state.sliderValue > limit)  state.sliderValue = limit;
    render();
  }
}

function startSynchronization() {
  setInterval(async () => {
    try {
      const ind = document.querySelector('.sync-indicator');
      if (ind) ind.classList.add('pulse');
      await loadProducts(state.selectedCategory);
      setTimeout(() => { if (ind) ind.classList.remove('pulse'); }, 600);
    } catch (e) { console.warn('Sync failed:', e); }
  }, 3000);
}

// ─── SCROLL OBSERVER ───────────────────────────────────────────────────────────
function initScrollObserver() {
  if (scrollObserver) scrollObserver.disconnect();

  scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const siblings = [...(e.target.parentElement?.querySelectorAll('.scroll-fade-item') || [])];
        const idx = siblings.indexOf(e.target);
        e.target.style.transitionDelay = `${Math.min(idx * 0.055, 0.4)}s`;
        e.target.classList.add('in-view');
        scrollObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-fade-item').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.style.transitionDelay = '0s';
      el.classList.add('in-view');
    } else {
      scrollObserver.observe(el);
    }
  });
}

// ─── IMAGE LAZY LOAD WITH FADE-IN ──────────────────────────────────────────────
function initImageFadeIn() {
  document.querySelectorAll('.product-image, .detail-main-image, .thumb-row img').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      img.addEventListener('error', () => {
        // Fallback to a reliable placeholder on error
        const seed = Math.abs(img.src.length * 7 % 100);
        img.src = `https://picsum.photos/seed/${seed}/800/600`;
        img.classList.add('loaded');
      }, { once: true });
    }
  });
}

// ─── CARD TILT ─────────────────────────────────────────────────────────────────
function initCardTilt() {
  document.querySelectorAll('.product-card, .feature-card').forEach(card => {
    let raf = null;
    card.addEventListener('mousemove', e => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const tiltX = dy * -7;
        const tiltY = dx * 7;
        const shine = `radial-gradient(circle at ${((e.clientX - rect.left) / rect.width * 100).toFixed(1)}% ${((e.clientY - rect.top) / rect.height * 100).toFixed(1)}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px) scale(1.018)`;
        if (!card.querySelector('.card-shine')) {
          const shineEl = document.createElement('div');
          shineEl.className = 'card-shine';
          shineEl.style.cssText = 'position:absolute;inset:0;border-radius:inherit;pointer-events:none;transition:background 0.1s;z-index:1;';
          card.appendChild(shineEl);
        }
        const s = card.querySelector('.card-shine');
        if (s) s.style.background = shine;
      });
    });
    card.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = '';
      card.style.transition = 'transform 0.55s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.5s ease';
      const s = card.querySelector('.card-shine');
      if (s) s.style.background = 'none';
      setTimeout(() => { card.style.transition = ''; }, 550);
    });
  });
}

// ─── ANIMATED COUNTER ──────────────────────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.dataset.counter, 10);
    const duration = 900;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = now => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(target * ease(progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

async function initialize() {
  try {
    state.loading = true; state.error = '';
    syncPageFromHash(); render();
    await loadCategories();
    await loadProducts('All');
    state.maxPrice = getMaxProductPrice();
    state.sliderValue = state.maxPrice;
    logActivity('Connected to RPC server — catalog loaded', 'success');
    render();
    startSynchronization();
  } catch (err) {
    state.error = err.message || String(err);
    logActivity(`Connection error: ${state.error}`, 'error');
  } finally {
    state.loading = false; render();
  }
}

// ─── CART ACTIONS ──────────────────────────────────────────────────────────────
function addToCart(id) {
  const p = productById(id);
  if (!p || p.stock <= 0) { renderToast('Out of stock', 'error'); return; }
  const ex = state.cart.find(i => i.id === id);
  if (ex) ex.qty += 1; else state.cart.push({ id, qty: 1 });
  logActivity(`Added to cart: ${p.name}`, 'info');
  renderToast(`${p.name} added to cart`, 'success');
  render();
  const cartLink = document.querySelector('[data-nav="cart"]');
  if (cartLink) { cartLink.classList.add('cart-pop'); setTimeout(() => cartLink.classList.remove('cart-pop'), 600); }
}

function removeFromCart(id) {
  const p = productById(id);
  state.cart = state.cart.filter(i => i.id !== id);
  logActivity(`Removed: ${p?.name || `Product ${id}`}`, 'info');
  render();
}

// ─── CHECKOUT / PAYMENT ───────────────────────────────────────────────────────
async function checkout() {
  if (state.rpcBusy) { renderToast('RPC in progress. Please wait.', 'info'); return; }
  if (!state.cart.length) { renderToast('Your cart is empty', 'error'); return; }
  const isPriority = document.getElementById('high-priority')?.checked || false;
  state.rpcBusy = true;
  logActivity(`Requesting stock reservation${isPriority ? ' (HIGH PRIORITY)' : ''}…`, 'info');
  logActivity('Waiting for distributed lock…', 'warning');
  render();
  let reservation;
  try {
    reservation = await rpcPost('/reserve_stock', {
      cart: state.cart.map(i => ({ ...i })),
      idempotencyKey: `idem-${Date.now()}`,
      priority: isPriority
    });
  } catch (err) {
    state.rpcBusy = false; render();
    logActivity(`Reservation error: ${err.message}`, 'error');
    renderToast('Reservation request failed', 'error'); return;
  }
  if (!reservation.success) {
    state.rpcBusy = false; render();
    logActivity(`Reservation failed: ${reservation.message}`, 'error');
    renderToast(reservation.message, 'error'); return;
  }
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const orderItems = state.cart.map(i => ({ ...i }));
  state.pendingPayment = { orderId, items: orderItems, amount: cartTotal(), createdAt: new Date().toLocaleTimeString() };
  state.orders.unshift({ orderId, status: 'AWAITING_PAYMENT', at: state.pendingPayment.createdAt, items: orderItems });
  state.cart = [];
  await loadProducts(state.selectedCategory);
  state.rpcBusy = false;
  goTo('payment');
  logActivity(`Stock reserved for ${orderId}. Awaiting payment.`, 'success');
  render();
  renderToast(`Order ${orderId} reserved — proceed to payment`, 'info');
}

async function payNow(method = 'UPI') {
  if (state.rpcBusy || !state.pendingPayment) return;
  let paymentDetails = {};
  if (method === 'UPI')  paymentDetails.vpa        = document.getElementById('vpa-input')?.value || 'user@upi';
  if (method === 'CARD') paymentDetails.cardNumber  = document.getElementById('card-num')?.value  || '**** **** **** 1234';
  state.failureDemo.simulatePaymentFailure = document.getElementById('fail-payment')?.checked || false;
  state.failureDemo.simulateTimeout        = document.getElementById('fail-timeout')?.checked  || false;
  state.failureDemo.simulateServerError    = document.getElementById('fail-server')?.checked   || false;
  state.rpcBusy = true;
  logActivity(`Processing ${method} payment for ${state.pendingPayment.orderId}…`, 'info');
  render();
  try {
    if (state.failureDemo.simulateTimeout) {
      logActivity('Simulating network timeout…', 'warning');
      await new Promise(r => setTimeout(r, 4000));
      throw new Error('Connection timed out');
    }
    const response = await rpcPost('/process_payment', {
      orderId: state.pendingPayment.orderId,
      amount: state.pendingPayment.amount,
      method,
      details: paymentDetails,
      demo_fail: state.failureDemo.simulatePaymentFailure,
      simulate_server_error: state.failureDemo.simulateServerError
    });
    if (!response.success) throw new Error(response.message);
    state.orders = state.orders.map(o =>
      o.orderId === state.pendingPayment.orderId ? { ...o, status: 'CONFIRMED_PAID' } : o
    );
    logActivity(`Payment successful! ${state.pendingPayment.orderId} confirmed.`, 'success');
    renderToast('Payment successful! 🎉', 'success');
    state.pendingPayment = null;
    goTo('orders');
  } catch (err) {
    logActivity(`Payment failed: ${err.message}`, 'error');
    renderToast(err.message, 'error');
    if (err.message.includes('500') || state.failureDemo.simulateServerError) {
      logActivity('Server error — releasing reserved stock…', 'warning');
      await rpcPost('/release_stock', { orderId: state.pendingPayment.orderId, reason: 'payment_failed' });
      state.orders = state.orders.map(o =>
        o.orderId === state.pendingPayment.orderId ? { ...o, status: 'PAYMENT_FAILED_STOCK_RELEASED' } : o
      );
      state.pendingPayment = null;
    }
  } finally {
    state.rpcBusy = false; render();
  }
}

// ─── RENDER: HEADER ────────────────────────────────────────────────────────────
function renderHeader() {
  const count = cartCount();
  const links = Object.keys(PAGE_TITLES).map(key => {
    const isCart = key === 'cart';
    const badge  = isCart && count > 0 ? `<span class="cart-badge">${count > 9 ? '9+' : count}</span>` : '';
    return `<button class="nav-link ${state.page === key ? 'active' : ''}" data-nav="${key}">
      ${PAGE_ICONS[key]} ${PAGE_TITLES[key]}${badge}
    </button>`;
  }).join('');

  return `
    <header class="site-header fade-in">
      <div class="brand-wrap">
        <p class="brand-kicker">
          <span class="sync-indicator" title="Live sync active"></span>
          Distributed Commerce
        </p>
        <h1 class="brand-title">Aster<span>Cart</span></h1>
      </div>
      <nav class="nav-row">${links}</nav>
      <div class="header-stats">
        <span class="pill">${state.orders.length} Orders</span>
        <span class="pill ${state.auth.loggedIn ? 'ok-pill' : ''}">${state.auth.loggedIn ? `◉ ${state.auth.name}` : 'Guest'}</span>
      </div>
    </header>
  `;
}

// ─── RENDER: HOME ──────────────────────────────────────────────────────────────
function renderHomePage() {
  const featured = state.products.slice(0, 4).map((p, i) => `
    <article class="feature-card" data-view="${p.id}" style="animation-delay:${i * 0.08}s">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      <div class="feature-overlay">
        <h3>${p.name}</h3>
        <p>${inr(p.price)}</p>
      </div>
      <span class="feature-explore">Explore →</span>
    </article>`).join('');

  return `
    <section class="home-hero page-enter">
      <div class="home-copy">
        <p class="kicker">Mutex · RPC · Saga Compensation</p>
        <h2>Shop with <em>reliable</em> stock reservation &amp; payment orchestration.</h2>
        <p>Every order reserves inventory atomically, then processes payment — and automatically releases stock on failure.</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <strong data-counter="${state.products.length}">${state.products.length}</strong>
            <span>Products</span>
          </div>
          <div class="hero-stat">
            <strong data-counter="${state.categories.length - 1}">${state.categories.length - 1}</strong>
            <span>Categories</span>
          </div>
          <div class="hero-stat">
            <strong data-counter="${state.orders.length}">${state.orders.length}</strong>
            <span>Orders placed</span>
          </div>
        </div>
        <div class="hero-actions">
          <button class="cta" data-nav="shop">Start Shopping</button>
          <button class="cta ghost" data-nav="activity">View Activity</button>
        </div>
      </div>
      <div class="feature-grid">${featured}</div>
    </section>
  `;
}

// ─── RENDER: SHOP ──────────────────────────────────────────────────────────────
function renderShopPage() {
  const maxLimit = getMaxProductPrice();
  const slider   = state.sliderValue ?? maxLimit;
  const q        = state.searchQuery.trim();
  const results  = filteredProducts();

  const cards = results.map(p => {
    const stockOk = p.stock > 0;
    const nameHtml = highlightMatch(p.name, q);
    return `
      <article class="product-card stagger-item scroll-fade-item">
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy" />
          <span class="product-badge">${p.category}</span>
          <span class="stock-badge ${stockOk ? 'ok' : 'out'}">${stockOk ? `${p.stock} left` : 'Sold out'}</span>
          <div class="product-quick">
            <button class="ghost-btn" data-view="${p.id}" style="font-size:0.75rem;">Quick View</button>
            <button data-add="${p.id}" ${!stockOk ? 'disabled' : ''} style="font-size:0.75rem;">+ Cart</button>
          </div>
        </div>
        <div class="product-body">
          <div class="meta">${p.category}</div>
          <h3>${nameHtml}</h3>
          <div class="price-row">
            <span class="price">${inr(p.price)}</span>
          </div>
          <div class="rating"><span class="stars">${stars(p.rating)}</span> ${p.rating}</div>
          <div class="action-row">
            <button class="ghost-btn" data-view="${p.id}">Details</button>
            <button data-add="${p.id}" ${!stockOk ? 'disabled' : ''}>Add to Cart</button>
          </div>
        </div>
      </article>`;
  }).join('');

  // Build an informative empty state
  const emptyState = `
    <div class="catalog-empty">
      <div class="catalog-empty-icon">🔍</div>
      <h3>No products found</h3>
      <p>${q ? `No results for "${q}" — try a different term or clear the filter.` : 'Try adjusting your filters.'}</p>
      <button class="ghost-btn" data-reset-filters style="margin-top:0.5rem;">Clear all filters</button>
    </div>`;

  // Count badge shown next to search input
  const countLabel = q ? `${results.length}` : '';

  return `
    <section class="shop-wrap page-enter">
      <div class="toolbar">
        <div class="chips">
          ${state.categories.map(c => `<button class="chip ${state.selectedCategory === c ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('')}
        </div>
        <div class="filter-row">
          <div class="search-wrap ${q ? 'has-value' : ''}">
            <span class="search-icon">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </span>
            <input
              type="text"
              id="search-input"
              placeholder="Search products…"
              value="${q}"
              autocomplete="off"
              spellcheck="false"
            />
            ${q ? `<span class="search-count">${countLabel}</span>` : ''}
            <button class="search-clear ghost-btn" data-clear-search title="Clear search" aria-label="Clear search">✕</button>
          </div>
          <select data-sort>
            <option value="featured"   ${state.sortBy === 'featured'   ? 'selected' : ''}>Featured</option>
            <option value="price-asc"  ${state.sortBy === 'price-asc'  ? 'selected' : ''}>Price: Low → High</option>
            <option value="price-desc" ${state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High → Low</option>
            <option value="rating-desc"${state.sortBy === 'rating-desc'? 'selected' : ''}>Top Rated</option>
          </select>
          <label class="price-slider">
            <span data-price-label>Up to ${inr(slider)}</span>
            <input type="range" min="0" max="${maxLimit}" step="500" value="${slider}" data-price />
          </label>
          <button class="ghost-btn" data-reset-filters style="white-space:nowrap;">Reset ↺</button>
        </div>
      </div>
      <section class="catalog">${cards || emptyState}</section>
    </section>
  `;
}

// ─── RENDER: CART ──────────────────────────────────────────────────────────────
function renderCartPage() {
  const items = state.cart.length
    ? state.cart.map(i => {
        const p = productById(i.id);
        if (!p) return '';
        return `
          <li class="cart-item">
            <img src="${p.image}" alt="${p.name}" />
            <div>
              <strong>${p.name}</strong>
              <small>${i.qty} × ${inr(p.price)} = ${inr(p.price * i.qty)}</small>
            </div>
            <button class="link" data-remove="${i.id}" title="Remove">✕</button>
          </li>`;
      }).join('')
    : '<li class="empty" style="padding:1rem 0;">Your cart is empty</li>';

  return `
    <section class="cart-page page-enter">
      <div class="panel">
        <h2>Cart <span style="font-family:DM Sans;font-size:1rem;color:var(--muted);font-weight:400;">(${cartCount()} items)</span></h2>
        <ul class="cart-list">${items}</ul>
        ${state.cart.length ? `
          <div class="demo-box" style="margin-top:1rem;">
            <label class="demo-label">
              <input type="checkbox" id="high-priority" />
              🚀 High Priority Order (VIP)
            </label>
            <p style="font-size:0.75rem;color:var(--muted);margin:0.25rem 0 0 1.5rem;">Priority requests jump the queue when the server is busy.</p>
          </div>` : ''}
      </div>
      <div class="panel">
        <h2>Summary</h2>
        <div style="margin-bottom:0.5rem;">
          ${state.cart.map(i => {
            const p = productById(i.id);
            return p ? `<div style="display:flex;justify-content:space-between;padding:0.3rem 0;font-size:0.85rem;color:var(--muted);">
              <span>${p.name} ×${i.qty}</span><span>${inr(p.price * i.qty)}</span>
            </div>` : '';
          }).join('')}
        </div>
        <div class="total-row">
          <span>Total</span>
          <strong>${inr(cartTotal())}</strong>
        </div>
        <button class="checkout" data-checkout ${state.rpcBusy ? 'disabled' : ''}>
          ${state.rpcBusy ? '⟳ Processing…' : 'Reserve & Checkout →'}
        </button>
        <p style="font-size:0.72rem;color:var(--muted);text-align:center;margin-top:0.75rem;">
          Stock is reserved first — payment happens next
        </p>
      </div>
    </section>
  `;
}

// ─── RENDER: PAYMENT ───────────────────────────────────────────────────────────
function renderPaymentPage() {
  if (!state.pendingPayment) return `
    <section class="panel page-enter" style="max-width:480px;">
      <h2>Payment</h2>
      <p class="empty">No pending payment. Reserve an order from Cart first.</p>
      <button class="cta" data-nav="cart" style="margin-top:1rem;">Go to Cart</button>
    </section>`;

  const m = state.selectedPaymentMethod;

  const formContent = m === 'UPI' ? `
    <div class="fade-in">
      <div class="pay-field">
        <label>UPI ID (VPA)</label>
        <input type="text" id="vpa-input" placeholder="username@bank" />
      </div>
      <div class="quick-fill">
        <span class="quick-chip" onclick="document.getElementById('vpa-input').value='success@okaxis'">success@okaxis</span>
        <span class="quick-chip" onclick="document.getElementById('vpa-input').value='demo@okicici'">demo@okicici</span>
      </div>
    </div>
  ` : m === 'CARD' ? `
    <div class="fade-in">
      <div class="pay-field">
        <label>Card Number</label>
        <input type="text" id="card-num" placeholder="XXXX XXXX XXXX XXXX" />
      </div>
      <div class="pay-field-row">
        <div class="pay-field">
          <label>Expiry</label>
          <input type="text" placeholder="MM / YY" />
        </div>
        <div class="pay-field">
          <label>CVV</label>
          <input type="password" placeholder="•••" />
        </div>
      </div>
      <div class="quick-fill">
        <span class="quick-chip" onclick="document.getElementById('card-num').value='4242 4242 4242 4242'">Fill Test Card</span>
      </div>
    </div>
  ` : `
    <div class="fade-in cod-info">
      <span class="cod-icon">🏠</span>
      <p>Pay cash when your order arrives at your door.</p>
    </div>
  `;

  return `
    <section class="payment-page page-enter">
      <div class="payment-panel">
        <div class="payment-header">
          <div>
            <p class="section-eyebrow">Order ${state.pendingPayment.orderId}</p>
            <h2>Payment</h2>
          </div>
          <div class="payment-amount">
            <small>Amount due</small>
            <strong>${inr(state.pendingPayment.amount)}</strong>
          </div>
        </div>

        <div class="pay-tabs">
          <button class="pay-tab ${m === 'UPI'  ? 'active' : ''}" onclick="state.selectedPaymentMethod='UPI';render();">📱 UPI</button>
          <button class="pay-tab ${m === 'CARD' ? 'active' : ''}" onclick="state.selectedPaymentMethod='CARD';render();">💳 Card</button>
          <button class="pay-tab ${m === 'COD'  ? 'active' : ''}" onclick="state.selectedPaymentMethod='COD';render();">🏠 COD</button>
        </div>

        ${formContent}

        <div class="divider"></div>

        <div class="demo-box demo-box-warn">
          <h4>⚠ Failure Simulation (Dev Mode)</h4>
          <label class="demo-label"><input type="checkbox" id="fail-payment" ${state.failureDemo.simulatePaymentFailure ? 'checked' : ''} /> Simulate Insufficient Funds</label>
          <label class="demo-label"><input type="checkbox" id="fail-timeout"  ${state.failureDemo.simulateTimeout        ? 'checked' : ''} /> Simulate Network Timeout (4s)</label>
          <label class="demo-label"><input type="checkbox" id="fail-server"   ${state.failureDemo.simulateServerError    ? 'checked' : ''} /> Simulate Server Outage + Stock Recovery</label>
        </div>

        <button class="pay-cta" onclick="payNow('${m}')" ${state.rpcBusy ? 'disabled' : ''}>
          ${state.rpcBusy ? '⟳ Verifying…' : `Pay ${inr(state.pendingPayment.amount)}`}
        </button>
      </div>
    </section>
  `;
}

// ─── RENDER: PRODUCT DETAIL ────────────────────────────────────────────────────
function renderProductPage() {
  const p = productById(state.activeProductId);
  if (!p) return `
    <section class="panel page-enter">
      <h2>Product not found</h2>
      <p class="empty">This product isn't available in the current catalog view.</p>
      <button class="cta" data-nav="shop" style="margin-top:1rem;">Back to Shop</button>
    </section>`;

  // Use slightly varied image seeds for thumbnails
  const thumb1 = getProductImage(p.id * 3 + 1, p.category + 'b');
  const thumb2 = getProductImage(p.id * 5 + 2, p.category + 'c');
  const thumb3 = getProductImage(p.id * 7 + 3, p.category + 'd');

  return `
    <section class="product-page page-enter">
      <div class="product-gallery">
        <img src="${p.image}" alt="${p.name}" class="detail-main-image" />
        <div class="thumb-row">
          <img src="${thumb1}" alt="${p.name} view 1" />
          <img src="${thumb2}" alt="${p.name} view 2" />
          <img src="${thumb3}" alt="${p.name} view 3" />
        </div>
      </div>
      <div class="panel product-info">
        <p class="meta">${p.category}</p>
        <h2 style="font-family:'Instrument Serif',serif;font-size:2rem;line-height:1.1;margin:0.25rem 0 0.5rem;">${p.name}</h2>
        <p class="detail-price">${inr(p.price)}</p>
        <div class="rating"><span class="stars">${stars(p.rating)}</span> ${p.rating} / 5.0</div>
        <p class="empty" style="margin:0.75rem 0 0;">Built for distributed ordering demos with mutex-protected stock reservation and saga-based payment orchestration.</p>
        <div class="spec-grid">
          <div><span>Stock</span><strong>${p.stock > 0 ? p.stock + ' units' : 'Out of stock'}</strong></div>
          <div><span>SKU</span><strong class="mono">SKU-${String(p.id).padStart(4, '0')}</strong></div>
          <div><span>Delivery</span><strong>2–4 days</strong></div>
          <div><span>Warranty</span><strong>1 year</strong></div>
        </div>
        <div class="hero-actions">
          <button data-add="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>Add to Cart</button>
          <button class="ghost-btn" data-nav="shop">← Continue Shopping</button>
        </div>
      </div>
    </section>
  `;
}

// ─── RENDER: ORDERS ────────────────────────────────────────────────────────────
function renderOrdersPage() {
  const rows = state.orders.length
    ? state.orders.map((o, i) => `
        <li class="order-row" style="animation-delay:${i * 0.05}s">
          <div>
            <strong class="mono">${o.orderId}</strong>
            <small>${o.at}</small>
          </div>
          <span class="order-status ${o.status.toLowerCase()}">${o.status.replace(/_/g, ' ')}</span>
        </li>`).join('')
    : '<li class="empty" style="padding:1rem 0;">No orders yet — add something to cart!</li>';

  return `
    <section class="panel page-enter">
      <h2>Orders <span style="font-size:1rem;font-family:DM Sans;font-weight:400;color:var(--muted);">(${state.orders.length})</span></h2>
      <ul class="orders">${rows}</ul>
    </section>
  `;
}

// ─── RENDER: ACTIVITY ─────────────────────────────────────────────────────────
function renderActivityPage() {
  const rows = state.activity.length
    ? state.activity.map((a, i) => `
        <li class="activity-row ${a.type}" style="animation-delay:${i * 0.03}s">
          <span class="dot"></span>
          <div>
            <p>${a.message}</p>
            <small>${a.at}</small>
          </div>
        </li>`).join('')
    : '<li class="empty" style="padding:1rem 0;">No activity yet.</li>';

  return `
    <section class="panel page-enter">
      <h2>Activity Feed</h2>
      <ul class="activity-list">${rows}</ul>
    </section>
  `;
}

// ─── RENDER: ACCOUNT ───────────────────────────────────────────────────────────
function renderAccountPage() {
  if (!state.auth.loggedIn) return `
    <section class="account-page page-enter">
      <div class="panel account-panel">
        <h2>Sign In</h2>
        <p class="empty" style="margin-bottom:1.25rem;">Local session simulation — no server required.</p>
        <form class="auth-form" data-auth-form>
          <label>Name</label>
          <input type="text" name="name" placeholder="Amit Kumar" required />
          <label>Email</label>
          <input type="email" name="email" placeholder="you@example.com" required />
          <button type="submit" style="margin-top:0.5rem;">Sign In →</button>
        </form>
      </div>
    </section>`;

  return `
    <section class="account-page page-enter">
      <div class="panel account-panel">
        <h2>Profile</h2>
        <div class="profile-card">
          <div class="avatar">${state.auth.name[0].toUpperCase()}</div>
          <div>
            <p>${state.auth.name}</p>
            <small>${state.auth.email}</small>
          </div>
        </div>
        <div class="spec-grid">
          <div><span>Orders</span><strong>${state.orders.length}</strong></div>
          <div><span>Cart Items</span><strong>${cartCount()}</strong></div>
          <div><span>Status</span><strong style="color:var(--ok)">Active</strong></div>
          <div><span>Tier</span><strong style="color:var(--accent)">Gold</strong></div>
        </div>
        <button class="ghost-btn" data-logout style="margin-top:0.5rem;">Sign Out</button>
      </div>
    </section>`;
}

// ─── RENDER: ROUTER ────────────────────────────────────────────────────────────
function renderCurrentPage() {
  const map = {
    home: renderHomePage, shop: renderShopPage, cart: renderCartPage,
    payment: renderPaymentPage, product: renderProductPage,
    orders: renderOrdersPage, activity: renderActivityPage, account: renderAccountPage
  };
  return (map[state.page] || renderHomePage)();
}

// ─── MAIN RENDER ───────────────────────────────────────────────────────────────
function render() {
  if (state.loading) {
    app.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p style="color:var(--muted);font-size:0.9rem;margin:0;">Connecting to RPC server…</p>
        <p style="color:var(--muted);font-size:0.78rem;margin:0;">Start <span class="mono">Backend/rpc_server.py</span> on localhost:8001</p>
      </div>`;
    return;
  }

  if (state.error) {
    app.innerHTML = `
      <div class="panel page-enter" style="max-width:480px;margin:3rem auto;text-align:center;">
        <p style="font-size:2.5rem;margin-bottom:0.5rem;">⚡</p>
        <h2 style="color:var(--bad);">Connection Failed</h2>
        <p class="empty">${state.error}</p>
        <button class="cta" onclick="location.reload()" style="margin-top:1rem;">Retry</button>
      </div>`;
    return;
  }

  // Preserve search input focus and cursor position across re-renders
  const prevSearchEl = document.getElementById('search-input');
  const prevSelStart = prevSearchEl?.selectionStart;
  const prevSelEnd   = prevSearchEl?.selectionEnd;
  const prevFocused  = document.activeElement?.id === 'search-input';

  app.innerHTML = `
    ${renderHeader()}
    <main class="page-shell">${renderCurrentPage()}</main>
    ${renderToasts()}
  `;

  // ── Restore search focus / cursor ──────────────────────────────────────────
  if (prevFocused) {
    const newSearchEl = document.getElementById('search-input');
    if (newSearchEl) {
      newSearchEl.focus();
      try { newSearchEl.setSelectionRange(prevSelStart, prevSelEnd); } catch (_) {}
    }
  }

  // ── Event Bindings ──────────────────────────────────────────────────────────

  document.querySelectorAll('[data-nav]').forEach(btn =>
    btn.addEventListener('click', () => goTo(btn.getAttribute('data-nav')))
  );

  document.querySelectorAll('[data-cat]').forEach(btn =>
    btn.addEventListener('click', async () => {
      state.selectedCategory = btn.getAttribute('data-cat');
      state.loading = true; render();
      try { await loadProducts(state.selectedCategory); }
      catch (e) { state.error = e.message; }
      state.loading = false; render();
    })
  );

  document.querySelectorAll('[data-add]').forEach(btn =>
    btn.addEventListener('click', () => addToCart(Number(btn.getAttribute('data-add'))))
  );

  document.querySelectorAll('[data-view]').forEach(btn =>
    btn.addEventListener('click', () => openProduct(Number(btn.getAttribute('data-view'))))
  );

  document.querySelectorAll('[data-remove]').forEach(btn =>
    btn.addEventListener('click', () => removeFromCart(Number(btn.getAttribute('data-remove'))))
  );

  document.querySelector('[data-checkout]')?.addEventListener('click', checkout);

  // ── SEARCH: debounced input, instant clear ──────────────────────────────────
  const searchEl = document.getElementById('search-input');
  if (searchEl) {
    searchEl.addEventListener('input', e => {
      const val = e.target.value;
      // Update the wrapper class for clear button visibility instantly (no re-render)
      const wrap = searchEl.closest('.search-wrap');
      if (wrap) wrap.classList.toggle('has-value', val.length > 0);
      // Debounce the actual filter + re-render
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        state.searchQuery = val;
        // Soft update: only re-render the catalog, not the whole page
        _updateCatalogOnly();
      }, 220);
    });

    // Handle keyboard shortcuts
    searchEl.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        clearTimeout(searchDebounceTimer);
        state.searchQuery = '';
        searchEl.value = '';
        const wrap = searchEl.closest('.search-wrap');
        if (wrap) wrap.classList.remove('has-value');
        _updateCatalogOnly();
      }
    });
  }

  // ── CLEAR SEARCH BUTTON ─────────────────────────────────────────────────────
  document.querySelector('[data-clear-search]')?.addEventListener('click', () => {
    clearTimeout(searchDebounceTimer);
    state.searchQuery = '';
    const el = document.getElementById('search-input');
    if (el) {
      el.value = '';
      el.focus();
      const wrap = el.closest('.search-wrap');
      if (wrap) wrap.classList.remove('has-value');
    }
    _updateCatalogOnly();
  });

  const sortEl = document.querySelector('[data-sort]');
  if (sortEl) sortEl.addEventListener('change', e => { state.sortBy = e.target.value; _updateCatalogOnly(); });

  const priceEl = document.querySelector('[data-price]');
  if (priceEl) {
    priceEl.addEventListener('input', e => {
      state.sliderValue = Number(e.target.value);
      const lbl = document.querySelector('[data-price-label]');
      if (lbl) {
        lbl.textContent = `Up to ${inr(state.sliderValue)}`;
        lbl.style.transform = 'scale(1.05)';
        lbl.style.transition = 'transform 0.15s var(--ease-bounce)';
        setTimeout(() => { lbl.style.transform = ''; }, 200);
      }
      const pct = (state.sliderValue / getMaxProductPrice()) * 100;
      priceEl.style.background = `linear-gradient(90deg, var(--accent) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
    });
    priceEl.addEventListener('change', e => {
      state.maxPrice = Number(e.target.value);
      state.sliderValue = state.maxPrice;
      _updateCatalogOnly();
    });
    const initPct = getMaxProductPrice() > 0 ? (state.sliderValue / getMaxProductPrice()) * 100 : 100;
    priceEl.style.background = `linear-gradient(90deg, var(--accent) ${initPct}%, rgba(255,255,255,0.1) ${initPct}%)`;
  }

  document.querySelector('[data-reset-filters]')?.addEventListener('click', () => {
    clearTimeout(searchDebounceTimer);
    state.searchQuery = ''; state.sortBy = 'featured';
    state.maxPrice = getMaxProductPrice(); state.sliderValue = state.maxPrice;
    render();
  });

  const authForm = document.querySelector('[data-auth-form]');
  if (authForm) {
    authForm.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(authForm);
      const name  = String(fd.get('name')  || '').trim();
      const email = String(fd.get('email') || '').trim();
      if (!name || !email) { renderToast('Please fill in all fields', 'error'); return; }
      loginUser(name, email);
      renderToast(`Welcome, ${name}! 👋`, 'success');
      render();
    });
  }

  document.querySelector('[data-logout]')?.addEventListener('click', () => {
    logoutUser(); renderToast('Signed out', 'info'); render();
  });

  // ── Post-render enhancements ───────────────────────────────────────────────
  requestAnimationFrame(() => {
    initScrollObserver();
    initCardTilt();
    initImageFadeIn();
    if (state.page === 'home') setTimeout(animateCounters, 200);
  });
}

// ─── PARTIAL UPDATE: CATALOG ONLY (avoids full re-render on search) ───────────
function _updateCatalogOnly() {
  const catalogEl = document.querySelector('.catalog');
  if (!catalogEl || state.page !== 'shop') {
    // Fall back to full render if catalog isn't in DOM
    render();
    return;
  }

  const q        = state.searchQuery.trim();
  const results  = filteredProducts();

  // Update search wrapper class
  const wrap = document.querySelector('.search-wrap');
  if (wrap) wrap.classList.toggle('has-value', q.length > 0);

  // Update result count badge
  const countEl = document.querySelector('.search-count');
  if (countEl) {
    countEl.textContent = q ? `${results.length}` : '';
  } else if (q) {
    // Insert count badge if it doesn't exist yet
    const newCountEl = document.createElement('span');
    newCountEl.className = 'search-count';
    newCountEl.textContent = `${results.length}`;
    if (wrap) wrap.appendChild(newCountEl);
  }

  if (results.length === 0) {
    catalogEl.innerHTML = `
      <div class="catalog-empty">
        <div class="catalog-empty-icon">🔍</div>
        <h3>No products found</h3>
        <p>${q ? `No results for "${q}" — try a different term or clear the filter.` : 'Try adjusting your filters.'}</p>
        <button class="ghost-btn" data-reset-filters style="margin-top:0.5rem;">Clear all filters</button>
      </div>`;
    catalogEl.querySelector('[data-reset-filters]')?.addEventListener('click', () => {
      clearTimeout(searchDebounceTimer);
      state.searchQuery = ''; state.sortBy = 'featured';
      state.maxPrice = getMaxProductPrice(); state.sliderValue = state.maxPrice;
      render();
    });
    return;
  }

  catalogEl.innerHTML = results.map(p => {
    const stockOk = p.stock > 0;
    const nameHtml = highlightMatch(p.name, q);
    return `
      <article class="product-card stagger-item scroll-fade-item">
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy" />
          <span class="product-badge">${p.category}</span>
          <span class="stock-badge ${stockOk ? 'ok' : 'out'}">${stockOk ? `${p.stock} left` : 'Sold out'}</span>
          <div class="product-quick">
            <button class="ghost-btn" data-view="${p.id}" style="font-size:0.75rem;">Quick View</button>
            <button data-add="${p.id}" ${!stockOk ? 'disabled' : ''} style="font-size:0.75rem;">+ Cart</button>
          </div>
        </div>
        <div class="product-body">
          <div class="meta">${p.category}</div>
          <h3>${nameHtml}</h3>
          <div class="price-row"><span class="price">${inr(p.price)}</span></div>
          <div class="rating"><span class="stars">${stars(p.rating)}</span> ${p.rating}</div>
          <div class="action-row">
            <button class="ghost-btn" data-view="${p.id}">Details</button>
            <button data-add="${p.id}" ${!stockOk ? 'disabled' : ''}>Add to Cart</button>
          </div>
        </div>
      </article>`;
  }).join('');

  // Re-attach card event listeners (only for the new cards)
  catalogEl.querySelectorAll('[data-add]').forEach(btn =>
    btn.addEventListener('click', () => addToCart(Number(btn.getAttribute('data-add'))))
  );
  catalogEl.querySelectorAll('[data-view]').forEach(btn =>
    btn.addEventListener('click', () => openProduct(Number(btn.getAttribute('data-view'))))
  );

  requestAnimationFrame(() => {
    initScrollObserver();
    initCardTilt();
    initImageFadeIn();
  });
}

// ─── GLOBAL HOOKS ──────────────────────────────────────────────────────────────
window.state        = state;
window.render       = render;
window.payNow       = payNow;
window.closeToast   = closeToast;

window.addEventListener('hashchange', () => { syncPageFromHash(); render(); });
window.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') goTo('shop');
});

initialize();