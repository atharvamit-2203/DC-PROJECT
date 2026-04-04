const PRODUCTS = [
  { id: 1, name: 'iPhone 15 Pro', category: 'Electronics', price: 99999, stock: 10, rating: 4.8 },
  { id: 2, name: 'Samsung Galaxy S24', category: 'Electronics', price: 74999, stock: 8, rating: 4.6 },
  { id: 3, name: 'Sony WH-1000XM5', category: 'Electronics', price: 26999, stock: 12, rating: 4.9 },
  { id: 4, name: 'Nike Air Max 270', category: 'Clothing', price: 10795, stock: 20, rating: 4.4 },
  { id: 5, name: 'Clean Code', category: 'Books', price: 2999, stock: 30, rating: 4.9 },
  { id: 6, name: 'Ergonomic Chair', category: 'Furniture', price: 29999, stock: 5, rating: 4.7 }
];

const inventory = new Map(PRODUCTS.map((p) => [p.id, p.stock]));
const idempotencyStore = new Map();

class Mutex {
  constructor() {
    this.locked = false;
    this.queue = [];
  }

  async lock() {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise((resolve) => this.queue.push(resolve));
  }

  unlock() {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
      return;
    }
    this.locked = false;
  }

  async runExclusive(fn) {
    await this.lock();
    try {
      return await fn();
    } finally {
      this.unlock();
    }
  }
}

const stockMutex = new Mutex();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

async function reserveStock(payload) {
  const { cart, idempotencyKey } = payload;

  if (idempotencyStore.has(idempotencyKey)) {
    return idempotencyStore.get(idempotencyKey);
  }

  const response = await stockMutex.runExclusive(async () => {
    await delay(180);

    for (const item of cart) {
      const current = inventory.get(item.id) ?? 0;
      if (current < item.qty) {
        return { success: false, message: 'Stock conflict detected. Please retry.' };
      }
    }

    for (const item of cart) {
      const current = inventory.get(item.id) ?? 0;
      inventory.set(item.id, current - item.qty);
    }

    return { success: true, message: 'Stock reserved' };
  });

  idempotencyStore.set(idempotencyKey, response);
  return response;
}

export async function rpcCall(method, payload) {
  switch (method) {
    case 'ReserveStock':
      return reserveStock(payload);
    default:
      return { success: false, message: `Unknown RPC method: ${method}` };
  }
}

export function listProducts() {
  return PRODUCTS.map((p) => ({ ...p }));
}

export function listCategories() {
  return [...new Set(PRODUCTS.map((p) => p.category))];
}

export function peekInventory(id) {
  return inventory.get(id) ?? 0;
}

export function getProductSnapshot(id) {
  const p = getProduct(id);
  if (!p) return null;
  return { ...p, stock: peekInventory(id) };
}
