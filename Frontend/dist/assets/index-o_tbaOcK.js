(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={products:[],productIndex:new Map,categories:[`All`],selectedCategory:`All`,searchQuery:``,sortBy:`featured`,maxPrice:0,cart:[],orders:[],pendingPayment:null,rpcBusy:!1,loading:!0,error:``,page:`home`,activity:[],activeProductId:null,failureDemo:{simulatePaymentFailure:!1,simulateTimeout:!1,simulateServerError:!1},auth:{loggedIn:!1,name:``,email:``}},t=document.querySelector(`#app`),n={home:`Home`,shop:`Shop`,cart:`Cart`,payment:`Payment`,orders:`Orders`,activity:`Activity`,account:`Account`},r={1:`https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80`,2:`https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1200&q=80`,3:`https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=1200&q=80`,4:`https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80`,5:`https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80`,6:`https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80`,7:`https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80`,8:`https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1200&q=80`,9:`https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80`,10:`https://images.unsplash.com/photo-1455885666463-6ed922aa0f4e?auto=format&fit=crop&w=1200&q=80`,11:`https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80`,12:`https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=1200&q=80`,13:`https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1200&q=80`,14:`https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80`,15:`https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80`,16:`https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1200&q=80`,17:`https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80`,18:`https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80`,19:`https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=1200&q=80`,20:`https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1200&q=80`,21:`https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80`,22:`https://images.unsplash.com/photo-1592878940526-0214b0f374f6?auto=format&fit=crop&w=1200&q=80`,23:`https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80`,24:`https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=1200&q=80`,25:`https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80`,26:`https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80`,27:`https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80`,28:`https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1200&q=80`,29:`https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80`,30:`https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80`,31:`https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80`,32:`https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80`,33:`https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80`,34:`https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80`,35:`https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80`,36:`https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80`,37:`https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80`,38:`https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80`,39:`https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80`,40:`https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=1200&q=80`,41:`https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80`,42:`https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80`,43:`https://images.unsplash.com/photo-1532372320572-cda25653a26c?auto=format&fit=crop&w=1200&q=80`,44:`https://images.unsplash.com/photo-1582582429416-2d1165f1f4b1?auto=format&fit=crop&w=1200&q=80`};function i(e,t){return r[e]?r[e]:`https://picsum.photos/seed/${`${t||`product`}-${e}`.replace(/\s+/g,`-`).toLowerCase()}/640/420`}function a(){return new Date().toLocaleTimeString()}function o(t,n=`info`){e.activity.unshift({id:`${Date.now()}-${Math.random()}`,message:t,type:n,at:a()}),e.activity.length>50&&(e.activity=e.activity.slice(0,50))}function s(t){!n[t]&&t!==`product`||(e.page=t,t===`product`&&e.activeProductId?window.location.hash=`product-${e.activeProductId}`:window.location.hash=t,V())}function c(){let t=(window.location.hash||`#home`).replace(`#`,``).toLowerCase();if(t.startsWith(`product-`)){let n=Number(t.replace(`product-`,``));if(!Number.isNaN(n)&&n>0){e.activeProductId=n,e.page=`product`;return}}e.page=n[t]?t:`home`}function l(){return e.products.length===0?0:Math.max(...e.products.map(e=>e.price))}function u(t){e.activeProductId=t,s(`product`)}function d(t,n){e.auth.loggedIn=!0,e.auth.name=t.trim(),e.auth.email=n.trim(),o(`User signed in: ${e.auth.name}`,`success`)}function f(){let t=e.auth.name||`User`;e.auth.loggedIn=!1,e.auth.name=``,e.auth.email=``,o(`${t} signed out`,`info`)}async function p(e){let t=await fetch(`/api/rpc${e}`),n=await t.json();if(!t.ok)throw Error(n.message||`RPC request failed`);return n}async function m(e,t){let n=await fetch(`/api/rpc${e}`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),r=await n.json();if(!n.ok)throw Error(r.message||`RPC request failed`);return r}function h(t){t.forEach(t=>{e.productIndex.set(t.id,{...t,image:i(t.id,t.category)})})}async function g(){e.categories=[`All`,...(await p(`/list_categories`)).categories]}async function _(t=`All`){e.products=((await p(`/filter_by_category?category=${encodeURIComponent(t===`All`?`ALL`:t)}`)).products||[]).map(e=>({...e,image:i(e.id,e.category)})),h(e.products);let n=l();(e.maxPrice===0||e.maxPrice>n)&&(e.maxPrice=n)}async function v(){try{e.loading=!0,e.error=``,c(),V(),await g(),await _(`All`),e.maxPrice=l(),o(`Connected to RPC server and loaded catalog`,`success`)}catch(t){e.error=t.message||String(t),o(`Connection error: ${e.error}`,`error`)}finally{e.loading=!1,V()}}function y(e){return new Intl.NumberFormat(`en-IN`,{style:`currency`,currency:`INR`,maximumFractionDigits:0}).format(e)}function b(e){let t=Math.floor(e);return`★`.repeat(t)+`☆`.repeat(5-t)}function x(){return e.categories}function S(){let t=e.searchQuery.trim().toLowerCase(),n=[...e.products];return t&&(n=n.filter(e=>e.name.toLowerCase().includes(t)||e.category.toLowerCase().includes(t))),e.maxPrice>0&&(n=n.filter(t=>t.price<=e.maxPrice)),e.sortBy===`price-asc`&&n.sort((e,t)=>e.price-t.price),e.sortBy===`price-desc`&&n.sort((e,t)=>t.price-e.price),e.sortBy===`rating-desc`&&n.sort((e,t)=>t.rating-e.rating),n}function C(){return e.cart.reduce((e,t)=>e+t.qty,0)}function w(t){let n=e.cart.find(e=>e.id===t),r=e.productIndex.get(t),i=r?r.stock:0;if(i<=0){A(`Out of stock for this item`,`error`),o(`Attempted to add out-of-stock item: ${r?.name||t}`,`warning`);return}if(n){if(n.qty+1>i){A(`Not enough stock available`,`error`);return}n.qty+=1}else e.cart.push({id:t,qty:1});o(`Added to cart: ${r?.name||`Product ${t}`}`,`info`),V()}function T(t){let n=O(t);e.cart=e.cart.filter(e=>e.id!==t),o(`Removed from cart: ${n?.name||`Product ${t}`}`,`info`),V()}async function E(){if(e.rpcBusy){A(`RPC in progress. Please wait.`,`info`);return}if(e.cart.length===0){A(`Your cart is empty`,`error`);return}e.rpcBusy=!0,o(`Starting stock reservation via RPC`,`info`),V();let t;try{t=await m(`/reserve_stock`,{cart:e.cart.map(e=>({...e})),idempotencyKey:`idem-${Date.now()}`})}catch(t){e.rpcBusy=!1,V(),o(`Reservation error: ${t.message||String(t)}`,`error`),A(`Reservation request failed`,`error`);return}if(!t.success){e.rpcBusy=!1,V(),o(`Reservation failed: ${t.message}`,`error`),A(t.message,`error`);return}let n=`ORD-${Date.now().toString().slice(-6)}`,r=e.cart.map(e=>({...e}));e.pendingPayment={orderId:n,items:r,amount:k(),createdAt:new Date().toLocaleTimeString()},e.orders.unshift({orderId:n,status:`AWAITING_PAYMENT`,at:e.pendingPayment.createdAt,items:r}),e.cart=[],await _(e.selectedCategory),e.rpcBusy=!1,s(`payment`),o(`Stock reserved for ${n}. Awaiting payment.`,`success`),V(),A(`Order ${n} reserved. Continue to payment.`,`info`)}async function D(t=`UPI`){if(e.rpcBusy||!e.pendingPayment)return;e.failureDemo.simulatePaymentFailure=document.getElementById(`fail-payment`)?.checked||!1,e.failureDemo.simulateTimeout=document.getElementById(`fail-timeout`)?.checked||!1,e.failureDemo.simulateServerError=document.getElementById(`fail-server`)?.checked||!1,e.rpcBusy=!0;let n=e.failureDemo.simulatePaymentFailure?` [FAIL INJECTED]`:``;if(o(`Processing payment (${t}) for ${e.pendingPayment.orderId}${n}`,`info`),V(),e.failureDemo.simulateTimeout){await new Promise(e=>setTimeout(e,3e3)),e.rpcBusy=!1,V(),o(`Payment timeout: Server took too long to respond`,`error`),A(`Payment timeout - please try again`,`error`);return}if(e.failureDemo.simulateServerError){e.rpcBusy=!1,V(),o(`Payment error: Server encountered an error`,`error`),A(`Server error - please contact support`,`error`);return}let r;try{r=await m(`/process_payment`,{orderId:e.pendingPayment.orderId,amount:e.pendingPayment.amount,paymentKey:`pay-${Date.now()}`,method:t,demo_fail:e.failureDemo.simulatePaymentFailure})}catch(t){e.rpcBusy=!1,V(),o(`Payment RPC error: ${t.message||String(t)}`,`error`),A(`Payment request failed`,`error`);return}let i=e.orders.find(t=>t.orderId===e.pendingPayment.orderId);if(!r.success){try{await m(`/release_stock`,{cart:e.pendingPayment.items,reason:`payment_failed`})}catch(e){o(`Compensation release failed: ${e.message||String(e)}`,`error`)}i&&(i.status=`PAYMENT_FAILED_STOCK_RELEASED`,i.at=new Date().toLocaleTimeString()),o(`Payment failed for ${e.pendingPayment.orderId}. Stock released.`,`warning`),e.pendingPayment=null,await _(e.selectedCategory),e.rpcBusy=!1,s(`orders`),V(),A(`Payment failed. Stock released automatically.`,`error`);return}i&&(i.status=`CONFIRMED_PAID`,i.at=new Date().toLocaleTimeString()),o(`Payment successful for ${e.pendingPayment.orderId}`,`success`),e.pendingPayment=null,e.rpcBusy=!1,s(`orders`),V(),A(`Payment successful. Order confirmed.`,`success`)}function O(t){return e.productIndex.get(t)}function k(){return e.cart.reduce((e,t)=>{let n=O(t.id);return e+(n?n.price*t.qty:0)},0)}function A(e,t=`info`){let n=document.createElement(`div`);n.className=`toast ${t}`,n.textContent=e,document.body.appendChild(n),setTimeout(()=>n.classList.add(`show`),10),setTimeout(()=>{n.classList.remove(`show`),setTimeout(()=>n.remove(),250)},2e3)}function j(){return`
    <header class="site-header fade-in">
      <div class="brand-wrap">
        <p class="brand-kicker">DISTRIBUTED COMMERCE</p>
        <h1 class="brand-title">Aster Cart</h1>
      </div>
      <nav class="nav-row">${Object.keys(n).map(t=>`
      <button class="nav-link ${e.page===t?`active`:``}" data-nav="${t}">
        ${n[t]}
      </button>
    `).join(``)}</nav>
      <div class="header-stats">
        <span class="pill">Items ${C()}</span>
        <span class="pill">Orders ${e.orders.length}</span>
        <span class="pill ${e.auth.loggedIn?`ok-pill`:``}">${e.auth.loggedIn?`Hi ${e.auth.name}`:`Guest`}</span>
      </div>
    </header>
  `}function M(){return`
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
      <div class="feature-grid">${e.products.slice(0,3).map(e=>`
      <article class="feature-card">
        <img src="${e.image}" alt="${e.name}" />
        <div class="feature-overlay">
          <h3>${e.name}</h3>
          <p>${y(e.price)}</p>
        </div>
      </article>
    `).join(``)}</div>
    </section>
  `}function N(){let t=x(),n=l(),r=S().map(e=>{let t=e.stock;return`
        <article class="product-card page-enter">
          <img src="${e.image}" alt="${e.name}" class="product-image" />
          <div class="product-body">
            <div class="meta">${e.category}</div>
            <h3>${e.name}</h3>
            <div class="price-row">
              <span class="price">${y(e.price)}</span>
              <span class="stock ${t>0?`ok`:`out`}">${t>0?`${t} left`:`Out of stock`}</span>
            </div>
            <div class="rating">${b(e.rating)} ${e.rating}</div>
            <div class="action-row">
              <button class="ghost-btn" data-view="${e.id}">View Details</button>
              <button data-add="${e.id}" ${t<=0?`disabled`:``}>Add to Cart</button>
            </div>
          </div>
        </article>
      `}).join(``);return`
    <section class="shop-wrap page-enter">
      <div class="toolbar">
        <div class="chips">
          ${t.map(t=>`<button class="chip ${e.selectedCategory===t?`active`:``}" data-cat="${t}">${t}</button>`).join(``)}
        </div>
        <div class="filter-row">
          <input type="text" placeholder="Search products or category" value="${e.searchQuery}" data-search />
          <select data-sort>
            <option value="featured" ${e.sortBy===`featured`?`selected`:``}>Featured</option>
            <option value="price-asc" ${e.sortBy===`price-asc`?`selected`:``}>Price: Low to High</option>
            <option value="price-desc" ${e.sortBy===`price-desc`?`selected`:``}>Price: High to Low</option>
            <option value="rating-desc" ${e.sortBy===`rating-desc`?`selected`:``}>Rating: High to Low</option>
          </select>
          <label class="price-slider">
            <span>Up to ${y(e.maxPrice||n)}</span>
            <input type="range" min="0" max="${n}" step="500" value="${e.maxPrice||n}" data-price />
          </label>
          <button class="ghost-btn" data-reset-filters>Reset</button>
        </div>
      </div>
      <section class="catalog">${r||`<p class="empty">No products found.</p>`}</section>
    </section>
  `}function P(){return`
    <section class="cart-page page-enter">
      <div class="panel">
        <h2>Cart</h2>
        <ul class="cart-list">${e.cart.length?e.cart.map(e=>{let t=O(e.id);return t?`
        <li class="cart-item">
          <img src="${t.image}" alt="${t.name}" />
          <div>
            <strong>${t.name}</strong>
            <small>${e.qty} x ${y(t.price)}</small>
          </div>
          <button data-remove="${e.id}" class="link">Remove</button>
        </li>
      `:``}).join(``):`<li class="empty">No items in cart</li>`}</ul>
      </div>
      <div class="panel">
        <h2>Summary</h2>
        <div class="total-row"><span>Total</span><strong>${y(k())}</strong></div>
        <button class="checkout" data-checkout ${e.rpcBusy?`disabled`:``}>${e.rpcBusy?`Reserving...`:`Place Order`}</button>
      </div>
    </section>
  `}function F(){return e.pendingPayment?`
    <section class="payment-page page-enter">
      <div class="panel payment-panel">
        <h2>Complete Payment</h2>
        <p>Order: <strong>${e.pendingPayment.orderId}</strong></p>
        <p>Amount: <strong>${y(e.pendingPayment.amount)}</strong></p>
        
        <!-- Failure Simulation Options (Demo Mode) -->
        <div class="demo-options">
          <h3 style="font-size: 0.9rem; color: var(--accent); margin-top: 1.5rem; margin-bottom: 0.8rem;">⚡ Failure Simulation (Demo Only)</h3>
          <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem; cursor: pointer; color: var(--text-secondary); font-size: 0.9rem;">
            <input type="checkbox" id="fail-payment" ${e.failureDemo.simulatePaymentFailure?`checked`:``} /> Simulate Payment Failure
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem; cursor: pointer; color: var(--text-secondary); font-size: 0.9rem;">
            <input type="checkbox" id="fail-timeout" ${e.failureDemo.simulateTimeout?`checked`:``} /> Simulate Network Timeout
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-secondary); font-size: 0.9rem;">
            <input type="checkbox" id="fail-server" ${e.failureDemo.simulateServerError?`checked`:``} /> Simulate Server Error
          </label>
        </div>
        
        <div class="method-grid" style="margin-top: 1.5rem;">
          <button class="pay-btn" data-pay="UPI" ${e.rpcBusy?`disabled`:``}>Pay with UPI</button>
          <button class="pay-btn" data-pay="CARD" ${e.rpcBusy?`disabled`:``}>Pay with Card</button>
          <button class="pay-btn" data-pay="COD" ${e.rpcBusy?`disabled`:``}>Cash on Delivery</button>
        </div>
      </div>
    </section>
  `:`
      <section class="panel page-enter">
        <h2>Payment Service</h2>
        <p class="empty">No pending payment. Reserve an order from Cart first.</p>
      </section>
    `}function I(){let t=O(e.activeProductId);return t?`
    <section class="product-page page-enter">
      <div class="panel product-gallery">
        <img src="${t.image}" alt="${t.name}" class="detail-main-image" />
        <div class="thumb-row">
          <img src="${i(t.id,`${t.category}-a`)}" alt="${t.name} view 1" />
          <img src="${i(t.id,`${t.category}-b`)}" alt="${t.name} view 2" />
          <img src="${i(t.id,`${t.category}-c`)}" alt="${t.name} view 3" />
        </div>
      </div>
      <div class="panel product-info">
        <p class="meta">${t.category}</p>
        <h2>${t.name}</h2>
        <p class="detail-price">${y(t.price)}</p>
        <p class="rating">${b(t.rating)} ${t.rating}</p>
        <p class="empty">Built for distributed ordering demos with stock reservation and payment orchestration.</p>
        <div class="spec-grid">
          <div><span>Stock</span><strong>${t.stock}</strong></div>
          <div><span>SKU</span><strong>SKU-${t.id.toString().padStart(4,`0`)}</strong></div>
          <div><span>Delivery</span><strong>2-4 days</strong></div>
          <div><span>Warranty</span><strong>1 year</strong></div>
        </div>
        <div class="hero-actions">
          <button data-add="${t.id}" ${t.stock<=0?`disabled`:``}>Add to Cart</button>
          <button class="ghost-btn" data-nav="shop">Continue Shopping</button>
        </div>
      </div>
    </section>
  `:`
      <section class="panel page-enter">
        <h2>Product not found</h2>
        <p class="empty">This product is unavailable in current catalog view.</p>
        <button class="cta" data-nav="shop">Back to Shop</button>
      </section>
    `}function L(){return e.auth.loggedIn?`
    <section class="account-page page-enter">
      <div class="panel account-panel">
        <h2>Profile</h2>
        <div class="profile-card">
          <div class="avatar">${e.auth.name.slice(0,1).toUpperCase()}</div>
          <div>
            <p><strong>${e.auth.name}</strong></p>
            <small>${e.auth.email}</small>
          </div>
        </div>
        <div class="spec-grid">
          <div><span>Orders</span><strong>${e.orders.length}</strong></div>
          <div><span>Cart Items</span><strong>${C()}</strong></div>
          <div><span>Status</span><strong>Active</strong></div>
          <div><span>Tier</span><strong>Gold</strong></div>
        </div>
        <button class="ghost-btn" data-logout>Sign Out</button>
      </div>
    </section>
  `:`
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
    `}function R(){return`
    <section class="panel page-enter">
      <h2>Orders</h2>
      <ul class="orders">${e.orders.length?e.orders.map(e=>`
      <li class="order-row">
        <div>
          <strong>${e.orderId}</strong>
          <small>${e.at}</small>
        </div>
        <span class="order-status ${e.status.toLowerCase()}">${e.status}</span>
      </li>
    `).join(``):`<li class="empty">No orders yet</li>`}</ul>
    </section>
  `}function z(){return`
    <section class="panel page-enter">
      <h2>Activity Feed</h2>
      <ul class="activity-list">${e.activity.length?e.activity.map(e=>`
      <li class="activity-row ${e.type}">
        <span class="dot"></span>
        <div>
          <p>${e.message}</p>
          <small>${e.at}</small>
        </div>
      </li>
    `).join(``):`<li class="empty">No activity yet</li>`}</ul>
    </section>
  `}function B(){return e.page===`home`?M():e.page===`shop`?N():e.page===`cart`?P():e.page===`payment`?F():e.page===`product`?I():e.page===`orders`?R():e.page===`activity`?z():e.page===`account`?L():M()}function V(){if(e.loading){t.innerHTML=`<div class="panel page-enter"><p class="brand-kicker">RPC BRIDGE</p><h2>Connecting to rpc_server...</h2><p class="empty">Make sure Backend/rpc_server.py is running on localhost:8001.</p></div>`;return}if(e.error){t.innerHTML=`<div class="panel page-enter"><p class="brand-kicker">RPC BRIDGE</p><h2>Connection Failed</h2><p class="empty">${e.error}</p></div>`;return}t.innerHTML=`
    <div class="background-shape shape-a"></div>
    <div class="background-shape shape-b"></div>
    ${j()}
    <main class="page-shell">${B()}</main>
  `,document.querySelectorAll(`[data-nav]`).forEach(e=>{e.addEventListener(`click`,()=>{s(e.getAttribute(`data-nav`))})}),document.querySelectorAll(`[data-cat]`).forEach(t=>{t.addEventListener(`click`,async()=>{e.selectedCategory=t.getAttribute(`data-cat`),e.loading=!0,V();try{await _(e.selectedCategory)}catch(t){e.error=t.message||String(t)}e.loading=!1,V()})}),document.querySelectorAll(`[data-add]`).forEach(e=>{e.addEventListener(`click`,()=>w(Number(e.getAttribute(`data-add`))))}),document.querySelectorAll(`[data-view]`).forEach(e=>{e.addEventListener(`click`,()=>{u(Number(e.getAttribute(`data-view`)))})}),document.querySelectorAll(`[data-remove]`).forEach(e=>{e.addEventListener(`click`,()=>T(Number(e.getAttribute(`data-remove`))))});let n=document.querySelector(`[data-checkout]`);n&&n.addEventListener(`click`,E);let r=document.querySelector(`[data-search]`);r&&r.addEventListener(`input`,t=>{e.searchQuery=t.target.value,V()});let i=document.querySelector(`[data-sort]`);i&&i.addEventListener(`change`,t=>{e.sortBy=t.target.value,V()});let a=document.querySelector(`[data-price]`);a&&a.addEventListener(`input`,t=>{e.maxPrice=Number(t.target.value),V()});let o=document.querySelector(`[data-reset-filters]`);o&&o.addEventListener(`click`,()=>{e.searchQuery=``,e.sortBy=`featured`,e.maxPrice=l(),V()}),document.querySelectorAll(`[data-pay]`).forEach(e=>{e.addEventListener(`click`,()=>{D(e.getAttribute(`data-pay`)||`UPI`)})});let c=document.querySelector(`[data-auth-form]`);c&&c.addEventListener(`submit`,e=>{e.preventDefault();let t=new FormData(c),n=String(t.get(`name`)||``).trim(),r=String(t.get(`email`)||``).trim();if(!n||!r){A(`Please enter name and email`,`error`);return}d(n,r),A(`Welcome, ${n}`,`success`),V()});let p=document.querySelector(`[data-logout]`);p&&p.addEventListener(`click`,()=>{f(),A(`Signed out`,`info`),V()}),window.scrollTo({top:0,behavior:`smooth`})}window.addEventListener(`hashchange`,()=>{c(),V()}),window.addEventListener(`keydown`,e=>{e.key.toLowerCase()===`s`&&s(`shop`)}),v();