(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={products:[],productIndex:new Map,categories:[`All`],selectedCategory:`All`,searchQuery:``,sortBy:`featured`,maxPrice:0,cart:[],orders:[],pendingPayment:null,rpcBusy:!1,loading:!0,error:``,page:`home`,activity:[],activeProductId:null,failureDemo:{simulatePaymentFailure:!1,simulateTimeout:!1,simulateServerError:!1},auth:{loggedIn:!1,name:``,email:``},selectedPaymentMethod:`UPI`,startTime:Date.now(),sliderValue:0,toasts:[]},t=document.querySelector(`#app`),n=null,r=null,i=!1,a={home:`Home`,shop:`Shop`,cart:`Cart`,payment:`Payment`,orders:`Orders`,activity:`Activity`,account:`Account`},o={home:`⌂`,shop:`◈`,cart:`◳`,payment:`◉`,orders:`≡`,activity:`◎`,account:`◯`},s={electronics:[`https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1610945464075-084fb24b7591?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1574920162043-b872873f37b8?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=800&q=80`],books:[`https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80`],clothing:[`https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1541099649105-f69ad23f32b0?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1467043237213-65f2da53396f?auto=format&fit=crop&w=800&q=80`],furniture:[`https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80`],sports:[`https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80`],food:[`https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80`],default:[`https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80`,`https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80`]},c=new Map;function l(e,t){let n=`${e}-${t}`;if(c.has(n))return c.get(n);let r=parseInt(e,10),i=(t||``).toLowerCase().replace(/[^a-z]/g,``).split(``).slice(0,10).join(``),a=s[Object.keys(s).find(e=>i.startsWith(e))||`default`],o=a[r%a.length];return c.set(n,o),o}var u=()=>new Date().toLocaleTimeString();function d(e){return new Intl.NumberFormat(`en-IN`,{style:`currency`,currency:`INR`,maximumFractionDigits:0}).format(e)}function f(e){let t=Math.floor(e),n=e%1>=.5?1:0;return`★`.repeat(t)+(n?`½`:``)+`☆`.repeat(5-t-n)}function p(){return e.cart.reduce((e,t)=>e+t.qty,0)}function m(){return e.cart.reduce((e,t)=>{let n=h(t.id);return e+(n?n.price*t.qty:0)},0)}function h(t){return e.productIndex.get(t)}function g(){return e.products.length?Math.max(...e.products.map(e=>e.price)):0}function _(e,t){if(!t)return e;let n=t.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`);return e.replace(RegExp(`(${n})`,`gi`),`<mark>$1</mark>`)}function v(){let t=e.searchQuery.trim().toLowerCase(),n=[...e.products];return t&&(n=n.filter(e=>e.name.toLowerCase().includes(t)||e.category.toLowerCase().includes(t))),e.maxPrice>0&&(n=n.filter(t=>t.price<=e.maxPrice)),e.sortBy===`price-asc`&&n.sort((e,t)=>e.price-t.price),e.sortBy===`price-desc`&&n.sort((e,t)=>t.price-e.price),e.sortBy===`rating-desc`&&n.sort((e,t)=>t.rating-e.rating),n}var y={success:`✓`,error:`✕`,info:`ℹ`,warning:`⚠`};function b(t,n=`info`){let r=`${Date.now()}-${Math.random()}`;e.toasts.push({id:r,message:t,type:n}),setTimeout(()=>{let t=document.querySelector(`[data-toast="${r}"]`);t?(t.style.animation=`toastOut 0.3s cubic-bezier(0.65,0,0.35,1) forwards`,setTimeout(()=>{e.toasts=e.toasts.filter(e=>e.id!==r),Q()},280)):(e.toasts=e.toasts.filter(e=>e.id!==r),Q())},4500),Q()}function x(t){let n=document.querySelector(`[data-toast="${t}"]`);n?(n.style.animation=`toastOut 0.25s cubic-bezier(0.65,0,0.35,1) forwards`,setTimeout(()=>{e.toasts=e.toasts.filter(e=>e.id!==t),Q()},240)):(e.toasts=e.toasts.filter(e=>e.id!==t),Q())}function S(){return e.toasts.length?`
    <style>
      @keyframes toastOut {
        from { opacity: 1; transform: translateX(0) scale(1); }
        to   { opacity: 0; transform: translateX(48px) scale(0.88); }
      }
    </style>
    <div class="toast-container">
      ${e.toasts.map(e=>`
        <div class="toast toast-${e.type}" data-toast="${e.id}">
          <span class="toast-icon">${y[e.type]||`ℹ`}</span>
          <span>${e.message}</span>
          <button class="toast-close" onclick="closeToast('${e.id}')">×</button>
        </div>`).join(``)}
    </div>`:``}function C(t,n=`info`){e.activity.unshift({id:`${Date.now()}-${Math.random()}`,message:t,type:n,at:u()}),e.activity.length>60&&(e.activity=e.activity.slice(0,60))}function w(t){if(!a[t]&&t!==`product`)return;let n=document.querySelector(`.page-shell`),r=()=>{e.page=t,window.location.hash=t===`product`&&e.activeProductId?`product-${e.activeProductId}`:t,Q(),requestAnimationFrame(()=>window.scrollTo({top:0,behavior:`smooth`}))};n?(n.style.transition=`opacity 0.18s ease, transform 0.18s ease, filter 0.18s ease`,n.style.opacity=`0`,n.style.transform=`translateY(-10px)`,n.style.filter=`blur(6px)`,setTimeout(r,190)):r()}function T(){let t=(window.location.hash||`#home`).replace(`#`,``).toLowerCase();if(t.startsWith(`product-`)){let n=Number(t.replace(`product-`,``));if(!isNaN(n)&&n>0){e.activeProductId=n,e.page=`product`;return}}e.page=a[t]?t:`home`}function E(t){e.activeProductId=t,w(`product`)}function ee(t,n){e.auth={loggedIn:!0,name:t.trim(),email:n.trim()},C(`Signed in as ${e.auth.name}`,`success`)}function D(){let t=e.auth.name;e.auth={loggedIn:!1,name:``,email:``},C(`${t} signed out`,`info`)}async function O(e){let t=await fetch(`/api/rpc${e}`),n=await t.json();if(!t.ok)throw Error(n.message||`RPC request failed`);return n}async function k(e,t){let n=await fetch(`/api/rpc${e}`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)}),r=await n.json();if(!n.ok)throw Error(r.message||`RPC request failed`);return r}function A(t){t.forEach(t=>e.productIndex.set(t.id,{...t,image:l(t.id,t.category)}))}async function j(){e.categories=[`All`,...(await O(`/list_categories`)).categories]}async function M(t=`All`){let n=((await O(`/filter_by_category?category=${encodeURIComponent(t===`All`?`ALL`:t)}`)).products||[]).map(e=>({...e,image:l(e.id,e.category)}));if(n.length!==e.products.length||n.some((t,n)=>{let r=e.products[n];return!r||t.stock!==r.stock||t.price!==r.price})){e.products=n,A(e.products);let t=g();(e.maxPrice===0||e.maxPrice>t)&&(e.maxPrice=t),(!e.sliderValue||e.sliderValue>t)&&(e.sliderValue=t),e.page===`shop`?$():(e.page===`product`||e.page===`cart`)&&Q()}}function te(){setInterval(async()=>{if(!(i||document.hidden)){i=!0;try{let t=document.querySelector(`.sync-indicator`);t&&t.classList.add(`pulse`),await M(e.selectedCategory),setTimeout(()=>{t&&t.classList.remove(`pulse`)},600)}catch(e){console.warn(`Sync failed:`,e)}finally{i=!1}}},7e3)}function N(){n&&n.disconnect(),n=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){let t=[...e.target.parentElement?.querySelectorAll(`.scroll-fade-item`)||[]].indexOf(e.target);e.target.style.transitionDelay=`${Math.min(t*.055,.4)}s`,e.target.classList.add(`in-view`),n.unobserve(e.target)}})},{threshold:.07,rootMargin:`0px 0px -40px 0px`}),document.querySelectorAll(`.scroll-fade-item`).forEach(e=>{let t=e.getBoundingClientRect();t.top<window.innerHeight&&t.bottom>0?(e.style.transitionDelay=`0s`,e.classList.add(`in-view`)):n.observe(e)})}function P(){document.querySelectorAll(`.product-image, .detail-main-image, .thumb-row img`).forEach(e=>{e.complete&&e.naturalWidth>0?e.classList.add(`loaded`):(e.addEventListener(`load`,()=>e.classList.add(`loaded`),{once:!0}),e.addEventListener(`error`,()=>{e.src=`https://picsum.photos/seed/${Math.abs(e.src.length*7%100)}/800/600`,e.classList.add(`loaded`)},{once:!0}))})}function F(){document.querySelectorAll(`.product-card, .feature-card`).forEach(e=>{let t=null;e.addEventListener(`mousemove`,n=>{t&&cancelAnimationFrame(t),t=requestAnimationFrame(()=>{let t=e.getBoundingClientRect(),r=t.left+t.width/2,i=t.top+t.height/2,a=(n.clientX-r)/(t.width/2),o=(n.clientY-i)/(t.height/2)*-7,s=a*7,c=`radial-gradient(circle at ${((n.clientX-t.left)/t.width*100).toFixed(1)}% ${((n.clientY-t.top)/t.height*100).toFixed(1)}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;if(e.style.transform=`perspective(800px) rotateX(${o}deg) rotateY(${s}deg) translateY(-10px) scale(1.018)`,!e.querySelector(`.card-shine`)){let t=document.createElement(`div`);t.className=`card-shine`,t.style.cssText=`position:absolute;inset:0;border-radius:inherit;pointer-events:none;transition:background 0.1s;z-index:1;`,e.appendChild(t)}let l=e.querySelector(`.card-shine`);l&&(l.style.background=c)})}),e.addEventListener(`mouseleave`,()=>{t&&cancelAnimationFrame(t),e.style.transform=``,e.style.transition=`transform 0.55s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.5s ease`;let n=e.querySelector(`.card-shine`);n&&(n.style.background=`none`),setTimeout(()=>{e.style.transition=``},550)})})}function I(){document.querySelectorAll(`[data-counter]`).forEach(e=>{let t=parseInt(e.dataset.counter,10),n=performance.now(),r=e=>1-(1-e)**3,i=a=>{let o=a-n,s=Math.min(o/900,1);e.textContent=Math.round(t*r(s)),s<1&&requestAnimationFrame(i)};requestAnimationFrame(i)})}async function L(){try{e.loading=!0,e.error=``,T(),Q(),await j(),await M(`All`),e.maxPrice=g(),e.sliderValue=e.maxPrice,C(`Connected to RPC server — catalog loaded`,`success`),Q(),te()}catch(t){e.error=t.message||String(t),C(`Connection error: ${e.error}`,`error`)}finally{e.loading=!1,Q()}}function R(t){let n=h(t);if(!n||n.stock<=0){b(`Out of stock`,`error`);return}let r=e.cart.find(e=>e.id===t);r?r.qty+=1:e.cart.push({id:t,qty:1}),C(`Added to cart: ${n.name}`,`info`),b(`${n.name} added to cart`,`success`),Q();let i=document.querySelector(`[data-nav="cart"]`);i&&(i.classList.add(`cart-pop`),setTimeout(()=>i.classList.remove(`cart-pop`),600))}function z(t){let n=h(t);e.cart=e.cart.filter(e=>e.id!==t),C(`Removed: ${n?.name||`Product ${t}`}`,`info`),Q()}async function B(){if(e.rpcBusy){b(`RPC in progress. Please wait.`,`info`);return}if(!e.cart.length){b(`Your cart is empty`,`error`);return}let t=document.getElementById(`high-priority`)?.checked||!1;e.rpcBusy=!0,C(`Requesting stock reservation${t?` (HIGH PRIORITY)`:``}…`,`info`),C(`Waiting for distributed lock…`,`warning`),Q();let n;try{n=await k(`/reserve_stock`,{cart:e.cart.map(e=>({...e})),idempotencyKey:`idem-${Date.now()}`,priority:t})}catch(t){e.rpcBusy=!1,Q(),C(`Reservation error: ${t.message}`,`error`),b(`Reservation request failed`,`error`);return}if(!n.success){e.rpcBusy=!1,Q(),C(`Reservation failed: ${n.message}`,`error`),b(n.message,`error`);return}let r=`ORD-${Date.now().toString().slice(-6)}`,i=e.cart.map(e=>({...e}));e.pendingPayment={orderId:r,items:i,amount:m(),createdAt:new Date().toLocaleTimeString()},e.orders.unshift({orderId:r,status:`AWAITING_PAYMENT`,at:e.pendingPayment.createdAt,items:i}),e.cart=[],await M(e.selectedCategory),e.rpcBusy=!1,w(`payment`),C(`Stock reserved for ${r}. Awaiting payment.`,`success`),Q(),b(`Order ${r} reserved — proceed to payment`,`info`)}async function V(t=`UPI`){if(e.rpcBusy||!e.pendingPayment)return;let n={};t===`UPI`?n.vpa=document.getElementById(`vpa-input`)?.value||`user@upi`:t===`CARD`&&(n.cardNumber=document.getElementById(`card-num`)?.value||`**** **** **** 1234`),e.failureDemo.simulatePaymentFailure=document.getElementById(`fail-payment`)?.checked||!1,e.failureDemo.simulateTimeout=document.getElementById(`fail-timeout`)?.checked||!1,e.failureDemo.simulateServerError=document.getElementById(`fail-server`)?.checked||!1,e.rpcBusy=!0,C(`Processing ${t} payment for ${e.pendingPayment.orderId}...`,`info`),Q();try{if(e.failureDemo.simulateTimeout)throw C(`Simulating network timeout...`,`warning`),await new Promise(e=>setTimeout(e,4e3)),Error(`Connection timed out`);let r=await k(`/process_payment`,{orderId:e.pendingPayment.orderId,amount:e.pendingPayment.amount,method:t,details:n,demo_fail:e.failureDemo.simulatePaymentFailure,simulate_server_error:e.failureDemo.simulateServerError});if(!r.success)throw Error(r.message);e.orders=e.orders.map(t=>t.orderId===e.pendingPayment.orderId?{...t,status:`CONFIRMED_PAID`}:t),C(`Payment successful! Order ${e.pendingPayment.orderId} confirmed.`,`success`),b(`Payment successful!`,`success`),e.pendingPayment=null,w(`orders`)}catch(t){C(`Payment failed: ${t.message}`,`error`),b(t.message,`error`),(t.message.includes(`500`)||e.failureDemo.simulateServerError)&&(C(`Server error detected. Initiating stock recovery...`,`warning`),await k(`/release_stock`,{orderId:e.pendingPayment.orderId,reason:`payment_failed`}),e.orders=e.orders.map(t=>t.orderId===e.pendingPayment.orderId?{...t,status:`PAYMENT_FAILED_STOCK_RELEASED`}:t),e.pendingPayment=null)}finally{e.rpcBusy=!1,Q()}}function H(){let t=p();return`
    <header class="site-header fade-in">
      <div class="brand-wrap">
        <p class="brand-kicker">
          <span class="sync-indicator" title="Live sync active"></span>
          Distributed Commerce
        </p>
        <h1 class="brand-title">Aster<span>Cart</span></h1>
      </div>
      <nav class="nav-row">${Object.keys(a).map(n=>{let r=n===`cart`&&t>0?`<span class="cart-badge">${t>9?`9+`:t}</span>`:``;return`<button class="nav-link ${e.page===n?`active`:``}" data-nav="${n}">
      ${o[n]} ${a[n]}${r}
    </button>`}).join(``)}</nav>
      <div class="header-stats">
        <span class="pill">${e.orders.length} Orders</span>
        <span class="pill ${e.auth.loggedIn?`ok-pill`:``}">${e.auth.loggedIn?`◉ ${e.auth.name}`:`Guest`}</span>
      </div>
    </header>
  `}function U(){let t=e.products.slice(0,4).map((e,t)=>`
    <article class="feature-card" data-view="${e.id}" style="animation-delay:${t*.08}s">
      <img src="${e.image}" alt="${e.name}" loading="lazy" />
      <div class="feature-overlay">
        <h3>${e.name}</h3>
        <p>${d(e.price)}</p>
      </div>
      <span class="feature-explore">Explore →</span>
    </article>`).join(``);return`
    <section class="home-hero page-enter">
      <div class="home-copy">
        <p class="kicker">Mutex · RPC · Saga Compensation</p>
        <h2>Shop with <em>reliable</em> stock reservation &amp; payment orchestration.</h2>
        <p>Every order reserves inventory atomically, then processes payment — and automatically releases stock on failure.</p>
        <div class="hero-stats">
          <div class="hero-stat">
            <strong data-counter="${e.products.length}">${e.products.length}</strong>
            <span>Products</span>
          </div>
          <div class="hero-stat">
            <strong data-counter="${e.categories.length-1}">${e.categories.length-1}</strong>
            <span>Categories</span>
          </div>
          <div class="hero-stat">
            <strong data-counter="${e.orders.length}">${e.orders.length}</strong>
            <span>Orders placed</span>
          </div>
        </div>
        <div class="hero-actions">
          <button class="cta" data-nav="shop">Start Shopping</button>
          <button class="cta ghost" data-nav="activity">View Activity</button>
        </div>
      </div>
      <div class="feature-grid">${t}</div>
    </section>
  `}function W(){let t=g(),n=e.sliderValue??t,r=e.searchQuery.trim(),i=v(),a=i.map(e=>{let t=e.stock>0,n=_(e.name,r);return`
      <article class="product-card stagger-item scroll-fade-item">
        <div class="product-img-wrap">
          <img src="${e.image}" alt="${e.name}" class="product-image" loading="lazy" />
          <span class="product-badge">${e.category}</span>
          <span class="stock-badge ${t?`ok`:`out`}">${t?`${e.stock} left`:`Sold out`}</span>
          <div class="product-quick">
            <button class="ghost-btn" data-view="${e.id}" style="font-size:0.75rem;">Quick View</button>
            <button data-add="${e.id}" ${t?``:`disabled`} style="font-size:0.75rem;">+ Cart</button>
          </div>
        </div>
        <div class="product-body">
          <div class="meta">${e.category}</div>
          <h3>${n}</h3>
          <div class="price-row">
            <span class="price">${d(e.price)}</span>
          </div>
          <div class="rating"><span class="stars">${f(e.rating)}</span> ${e.rating}</div>
          <div class="action-row">
            <button class="ghost-btn" data-view="${e.id}">Details</button>
            <button data-add="${e.id}" ${t?``:`disabled`}>Add to Cart</button>
          </div>
        </div>
      </article>`}).join(``),o=`
    <div class="catalog-empty">
      <div class="catalog-empty-icon">🔍</div>
      <h3>No products found</h3>
      <p>${r?`No results for "${r}" — try a different term or clear the filter.`:`Try adjusting your filters.`}</p>
      <button class="ghost-btn" data-reset-filters style="margin-top:0.5rem;">Clear all filters</button>
    </div>`,s=r?`${i.length}`:``;return`
    <section class="shop-wrap page-enter">
      <div class="toolbar">
        <div class="chips">
          ${e.categories.map(t=>`<button class="chip ${e.selectedCategory===t?`active`:``}" data-cat="${t}">${t}</button>`).join(``)}
        </div>
        <div class="filter-row">
          <div class="search-wrap ${r?`has-value`:``}">
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
              value="${r}"
              autocomplete="off"
              spellcheck="false"
            />
            ${r?`<span class="search-count">${s}</span>`:``}
            <button class="search-clear ghost-btn" data-clear-search title="Clear search" aria-label="Clear search">✕</button>
          </div>
          <select data-sort>
            <option value="featured"   ${e.sortBy===`featured`?`selected`:``}>Featured</option>
            <option value="price-asc"  ${e.sortBy===`price-asc`?`selected`:``}>Price: Low → High</option>
            <option value="price-desc" ${e.sortBy===`price-desc`?`selected`:``}>Price: High → Low</option>
            <option value="rating-desc"${e.sortBy===`rating-desc`?`selected`:``}>Top Rated</option>
          </select>
          <label class="price-slider">
            <span data-price-label>Up to ${d(n)}</span>
            <input type="range" min="0" max="${t}" step="500" value="${n}" data-price />
          </label>
          <button class="ghost-btn" data-reset-filters style="white-space:nowrap;">Reset ↺</button>
        </div>
      </div>
      <section class="catalog">${a||o}</section>
    </section>
  `}function G(){let t=e.cart.length?e.cart.map(e=>{let t=h(e.id);return t?`
          <li class="cart-item">
            <img src="${t.image}" alt="${t.name}" />
            <div>
              <strong>${t.name}</strong>
              <small>${e.qty} × ${d(t.price)} = ${d(t.price*e.qty)}</small>
            </div>
            <button class="link" data-remove="${e.id}" title="Remove">✕</button>
          </li>`:``}).join(``):`<li class="empty" style="padding:1rem 0;">Your cart is empty</li>`;return`
    <section class="cart-page page-enter">
      <div class="panel">
        <h2>Cart <span style="font-family:DM Sans;font-size:1rem;color:var(--muted);font-weight:400;">(${p()} items)</span></h2>
        <ul class="cart-list">${t}</ul>
        ${e.cart.length?`
          <div class="demo-box" style="margin-top:1rem;">
            <label class="demo-label">
              <input type="checkbox" id="high-priority" />
              🚀 High Priority Order (VIP)
            </label>
            <p style="font-size:0.75rem;color:var(--muted);margin:0.25rem 0 0 1.5rem;">Priority requests jump the queue when the server is busy.</p>
          </div>`:``}
      </div>
      <div class="panel">
        <h2>Summary</h2>
        <div style="margin-bottom:0.5rem;">
          ${e.cart.map(e=>{let t=h(e.id);return t?`<div style="display:flex;justify-content:space-between;padding:0.3rem 0;font-size:0.85rem;color:var(--muted);">
              <span>${t.name} ×${e.qty}</span><span>${d(t.price*e.qty)}</span>
            </div>`:``}).join(``)}
        </div>
        <div class="total-row">
          <span>Total</span>
          <strong>${d(m())}</strong>
        </div>
        <button class="checkout" data-checkout ${e.rpcBusy?`disabled`:``}>
          ${e.rpcBusy?`⟳ Processing…`:`Reserve & Checkout →`}
        </button>
        <p style="font-size:0.72rem;color:var(--muted);text-align:center;margin-top:0.75rem;">
          Stock is reserved first — payment happens next
        </p>
      </div>
    </section>
  `}function K(){if(!e.pendingPayment)return`
      <section class="panel page-enter">
        <h2>Payment Service</h2>
        <p class="empty">No pending payment. Reserve an order from Cart first.</p>
      </section>
    `;let t=e.selectedPaymentMethod||`UPI`;return`
    <section class="payment-page page-enter">
      <div class="panel payment-panel">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2 style="margin: 0;">Payment</h2>
          <span class="pill" style="background: var(--surface-soft);">${e.pendingPayment.orderId}</span>
        </div>
        
        <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 1.2rem;">Total Amount: <strong style="color: var(--ink); font-size: 1.1rem;">${d(e.pendingPayment.amount)}</strong></p>

        <div class="payment-tabs" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; background: rgba(0,0,0,0.2); padding: 0.3rem; border-radius: 12px;">
          <button class="nav-link ${t===`UPI`?`active`:``}" style="flex: 1; border: 0;" data-payment-method="UPI">UPI</button>
          <button class="nav-link ${t===`CARD`?`active`:``}" style="flex: 1; border: 0;" data-payment-method="CARD">Card</button>
          <button class="nav-link ${t===`COD`?`active`:``}" style="flex: 1; border: 0;" data-payment-method="COD">Other</button>
        </div>

        <div class="payment-form-wrap" style="min-height: 200px;">
          <div class="fade-in">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--muted); font-size: 0.85rem;">Enter UPI ID (VPA)</label>
            <input type="text" id="vpa-input" placeholder="username@bank" style="width: 100%; padding: 0.8rem; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); color: #fff; margin-bottom: 1rem;" />
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <span class="chip" style="font-size: 0.75rem; cursor: pointer;" data-fill="vpa-input" data-value="success@okaxis">success@okaxis</span>
              <span class="chip" style="font-size: 0.75rem; cursor: pointer;" data-fill="vpa-input" data-value="demo@okicici">demo@okicici</span>
            </div>
          </div>
        </div>

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

        <button class="cta" style="width: 100%; margin-top: 1.5rem; font-size: 1.1rem; padding: 1rem;" data-pay-now="UPI" ${e.rpcBusy?`disabled`:``}>
          ${e.rpcBusy?`Verifying...`:`Pay ${d(e.pendingPayment.amount)} Now`}
        </button>
      </div>
    </section>
  `}function q(){let t=h(e.activeProductId);if(!t)return`
    <section class="panel page-enter">
      <h2>Product not found</h2>
      <p class="empty">This product isn't available in the current catalog view.</p>
      <button class="cta" data-nav="shop" style="margin-top:1rem;">Back to Shop</button>
    </section>`;let n=l(t.id*3+1,t.category+`b`),r=l(t.id*5+2,t.category+`c`),i=l(t.id*7+3,t.category+`d`);return`
    <section class="product-page page-enter">
      <div class="product-gallery">
        <img src="${t.image}" alt="${t.name}" class="detail-main-image" />
        <div class="thumb-row">
          <img src="${n}" alt="${t.name} view 1" />
          <img src="${r}" alt="${t.name} view 2" />
          <img src="${i}" alt="${t.name} view 3" />
        </div>
      </div>
      <div class="panel product-info">
        <p class="meta">${t.category}</p>
        <h2 style="font-family:'Instrument Serif',serif;font-size:2rem;line-height:1.1;margin:0.25rem 0 0.5rem;">${t.name}</h2>
        <p class="detail-price">${d(t.price)}</p>
        <div class="rating"><span class="stars">${f(t.rating)}</span> ${t.rating} / 5.0</div>
        <p class="empty" style="margin:0.75rem 0 0;">Built for distributed ordering demos with mutex-protected stock reservation and saga-based payment orchestration.</p>
        <div class="spec-grid">
          <div><span>Stock</span><strong>${t.stock>0?t.stock+` units`:`Out of stock`}</strong></div>
          <div><span>SKU</span><strong class="mono">SKU-${String(t.id).padStart(4,`0`)}</strong></div>
          <div><span>Delivery</span><strong>2–4 days</strong></div>
          <div><span>Warranty</span><strong>1 year</strong></div>
        </div>
        <div class="hero-actions">
          <button data-add="${t.id}" ${t.stock<=0?`disabled`:``}>Add to Cart</button>
          <button class="ghost-btn" data-nav="shop">← Continue Shopping</button>
        </div>
      </div>
    </section>
  `}function J(){let t=e.orders.length?e.orders.map((e,t)=>`
        <li class="order-row" style="animation-delay:${t*.05}s">
          <div>
            <strong class="mono">${e.orderId}</strong>
            <small>${e.at}</small>
          </div>
          <span class="order-status ${e.status.toLowerCase()}">${e.status.replace(/_/g,` `)}</span>
        </li>`).join(``):`<li class="empty" style="padding:1rem 0;">No orders yet — add something to cart!</li>`;return`
    <section class="panel page-enter">
      <h2>Orders <span style="font-size:1rem;font-family:DM Sans;font-weight:400;color:var(--muted);">(${e.orders.length})</span></h2>
      <ul class="orders">${t}</ul>
    </section>
  `}function Y(){return`
    <section class="panel page-enter">
      <h2>Activity Feed</h2>
      <ul class="activity-list">${e.activity.length?e.activity.map((e,t)=>`
        <li class="activity-row ${e.type}" style="animation-delay:${t*.03}s">
          <span class="dot"></span>
          <div>
            <p>${e.message}</p>
            <small>${e.at}</small>
          </div>
        </li>`).join(``):`<li class="empty" style="padding:1rem 0;">No activity yet.</li>`}</ul>
    </section>
  `}function X(){return e.auth.loggedIn?`
    <section class="account-page page-enter">
      <div class="panel account-panel">
        <h2>Profile</h2>
        <div class="profile-card">
          <div class="avatar">${e.auth.name[0].toUpperCase()}</div>
          <div>
            <p>${e.auth.name}</p>
            <small>${e.auth.email}</small>
          </div>
        </div>
        <div class="spec-grid">
          <div><span>Orders</span><strong>${e.orders.length}</strong></div>
          <div><span>Cart Items</span><strong>${p()}</strong></div>
          <div><span>Status</span><strong style="color:var(--ok)">Active</strong></div>
          <div><span>Tier</span><strong style="color:var(--accent)">Gold</strong></div>
        </div>
        <button class="ghost-btn" data-logout style="margin-top:0.5rem;">Sign Out</button>
      </div>
    </section>`:`
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
    </section>`}function Z(){return({home:U,shop:W,cart:G,payment:K,product:q,orders:J,activity:Y,account:X}[e.page]||U)()}function Q(){if(e.loading){t.innerHTML=`
      <div class="loading">
        <div class="spinner"></div>
        <p style="color:var(--muted);font-size:0.9rem;margin:0;">Connecting to RPC server…</p>
        <p style="color:var(--muted);font-size:0.78rem;margin:0;">Start <span class="mono">Backend/rpc_server.py</span> on localhost:8001</p>
      </div>`;return}if(e.error){t.innerHTML=`
      <div class="panel page-enter" style="max-width:480px;margin:3rem auto;text-align:center;">
        <p style="font-size:2.5rem;margin-bottom:0.5rem;">⚡</p>
        <h2 style="color:var(--bad);">Connection Failed</h2>
        <p class="empty">${e.error}</p>
        <button class="cta" onclick="location.reload()" style="margin-top:1rem;">Retry</button>
      </div>`;return}let n=document.getElementById(`search-input`),i=n?.selectionStart,a=n?.selectionEnd,o=document.activeElement?.id===`search-input`;if(t.innerHTML=`
    ${H()}
    <main class="page-shell">${Z()}</main>
    ${S()}
  `,o){let e=document.getElementById(`search-input`);if(e){e.focus();try{e.setSelectionRange(i,a)}catch{}}}document.querySelectorAll(`[data-nav]`).forEach(e=>e.addEventListener(`click`,()=>w(e.getAttribute(`data-nav`)))),document.querySelectorAll(`[data-cat]`).forEach(t=>t.addEventListener(`click`,async()=>{e.selectedCategory=t.getAttribute(`data-cat`),e.loading=!0,Q();try{await M(e.selectedCategory)}catch(t){e.error=t.message}e.loading=!1,Q()})),document.querySelectorAll(`[data-add]`).forEach(e=>e.addEventListener(`click`,()=>R(Number(e.getAttribute(`data-add`))))),document.querySelectorAll(`[data-view]`).forEach(e=>e.addEventListener(`click`,()=>E(Number(e.getAttribute(`data-view`))))),document.querySelectorAll(`[data-remove]`).forEach(e=>e.addEventListener(`click`,()=>z(Number(e.getAttribute(`data-remove`))))),document.querySelector(`[data-checkout]`)?.addEventListener(`click`,B),document.querySelectorAll(`[data-payment-method]`).forEach(t=>{t.addEventListener(`click`,()=>{e.selectedPaymentMethod=t.getAttribute(`data-payment-method`)||`UPI`,Q()})}),document.querySelectorAll(`[data-pay-now]`).forEach(e=>{e.addEventListener(`click`,()=>{V(e.getAttribute(`data-pay-now`))})}),document.querySelectorAll(`[data-fill]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=document.getElementById(e.getAttribute(`data-fill`));t&&(t.value=e.getAttribute(`data-value`))})});let s=document.getElementById(`search-input`);s&&(s.addEventListener(`input`,t=>{let n=t.target.value,i=s.closest(`.search-wrap`);i&&i.classList.toggle(`has-value`,n.length>0),clearTimeout(r),r=setTimeout(()=>{e.searchQuery=n,$()},220)}),s.addEventListener(`keydown`,t=>{if(t.key===`Escape`){clearTimeout(r),e.searchQuery=``,s.value=``;let t=s.closest(`.search-wrap`);t&&t.classList.remove(`has-value`),$()}})),document.querySelector(`[data-clear-search]`)?.addEventListener(`click`,()=>{clearTimeout(r),e.searchQuery=``;let t=document.getElementById(`search-input`);if(t){t.value=``,t.focus();let e=t.closest(`.search-wrap`);e&&e.classList.remove(`has-value`)}$()});let c=document.querySelector(`[data-sort]`);c&&c.addEventListener(`change`,t=>{e.sortBy=t.target.value,$()});let l=document.querySelector(`[data-price]`);if(l){l.addEventListener(`input`,t=>{e.sliderValue=Number(t.target.value);let n=document.querySelector(`[data-price-label]`);n&&(n.textContent=`Up to ${d(e.sliderValue)}`,n.style.transform=`scale(1.05)`,n.style.transition=`transform 0.15s var(--ease-bounce)`,setTimeout(()=>{n.style.transform=``},200));let r=e.sliderValue/g()*100;l.style.background=`linear-gradient(90deg, var(--accent) ${r}%, rgba(255,255,255,0.1) ${r}%)`}),l.addEventListener(`change`,t=>{e.maxPrice=Number(t.target.value),e.sliderValue=e.maxPrice,$()});let t=g()>0?e.sliderValue/g()*100:100;l.style.background=`linear-gradient(90deg, var(--accent) ${t}%, rgba(255,255,255,0.1) ${t}%)`}document.querySelector(`[data-reset-filters]`)?.addEventListener(`click`,()=>{clearTimeout(r),e.searchQuery=``,e.sortBy=`featured`,e.maxPrice=g(),e.sliderValue=e.maxPrice,Q()});let u=document.querySelector(`[data-auth-form]`);u&&u.addEventListener(`submit`,e=>{e.preventDefault();let t=new FormData(u),n=String(t.get(`name`)||``).trim(),r=String(t.get(`email`)||``).trim();if(!n||!r){b(`Please fill in all fields`,`error`);return}ee(n,r),b(`Welcome, ${n}! 👋`,`success`),Q()}),document.querySelector(`[data-logout]`)?.addEventListener(`click`,()=>{D(),b(`Signed out`,`info`),Q()}),requestAnimationFrame(()=>{N(),F(),P(),e.page===`home`&&setTimeout(I,200)})}function $(){let t=document.querySelector(`.catalog`);if(!t||e.page!==`shop`){Q();return}let n=e.searchQuery.trim(),i=v(),a=document.querySelector(`.search-wrap`);a&&a.classList.toggle(`has-value`,n.length>0);let o=document.querySelector(`.search-count`);if(o)o.textContent=n?`${i.length}`:``;else if(n){let e=document.createElement(`span`);e.className=`search-count`,e.textContent=`${i.length}`,a&&a.appendChild(e)}if(i.length===0){t.innerHTML=`
      <div class="catalog-empty">
        <div class="catalog-empty-icon">🔍</div>
        <h3>No products found</h3>
        <p>${n?`No results for "${n}" — try a different term or clear the filter.`:`Try adjusting your filters.`}</p>
        <button class="ghost-btn" data-reset-filters style="margin-top:0.5rem;">Clear all filters</button>
      </div>`,t.querySelector(`[data-reset-filters]`)?.addEventListener(`click`,()=>{clearTimeout(r),e.searchQuery=``,e.sortBy=`featured`,e.maxPrice=g(),e.sliderValue=e.maxPrice,Q()});return}t.innerHTML=i.map(e=>{let t=e.stock>0,r=_(e.name,n);return`
      <article class="product-card stagger-item scroll-fade-item">
        <div class="product-img-wrap">
          <img src="${e.image}" alt="${e.name}" class="product-image" loading="lazy" />
          <span class="product-badge">${e.category}</span>
          <span class="stock-badge ${t?`ok`:`out`}">${t?`${e.stock} left`:`Sold out`}</span>
          <div class="product-quick">
            <button class="ghost-btn" data-view="${e.id}" style="font-size:0.75rem;">Quick View</button>
            <button data-add="${e.id}" ${t?``:`disabled`} style="font-size:0.75rem;">+ Cart</button>
          </div>
        </div>
        <div class="product-body">
          <div class="meta">${e.category}</div>
          <h3>${r}</h3>
          <div class="price-row"><span class="price">${d(e.price)}</span></div>
          <div class="rating"><span class="stars">${f(e.rating)}</span> ${e.rating}</div>
          <div class="action-row">
            <button class="ghost-btn" data-view="${e.id}">Details</button>
            <button data-add="${e.id}" ${t?``:`disabled`}>Add to Cart</button>
          </div>
        </div>
      </article>`}).join(``),t.querySelectorAll(`[data-add]`).forEach(e=>e.addEventListener(`click`,()=>R(Number(e.getAttribute(`data-add`))))),t.querySelectorAll(`[data-view]`).forEach(e=>e.addEventListener(`click`,()=>E(Number(e.getAttribute(`data-view`))))),requestAnimationFrame(()=>{N(),F(),P()})}window.state=e,window.render=Q,window.payNow=V,window.closeToast=x,window.addEventListener(`hashchange`,()=>{T(),Q()}),window.addEventListener(`keydown`,e=>{e.key.toLowerCase()===`s`&&!e.ctrlKey&&!e.metaKey&&document.activeElement.tagName!==`INPUT`&&w(`shop`)}),L();