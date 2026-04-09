import { defineConfig } from 'vite';
import xmlrpc from 'xmlrpc';

const RPC_UPSTREAMS = [
  { name: 'primary', host: 'localhost', port: 8001, path: '/RPC2' },
  { name: 'backup', host: 'localhost', port: 8002, path: '/RPC2' }
];

const upstreamHealth = new Map(RPC_UPSTREAMS.map((upstream) => [upstream.name, { healthy: true, failedAt: 0 }]));
let roundRobinIndex = 0;

function createRpcClient(upstream) {
  return xmlrpc.createClient({
    host: upstream.host,
    port: upstream.port,
    path: upstream.path
  });
}

function callUpstream(upstream, method, params = []) {
  return new Promise((resolve, reject) => {
    const client = createRpcClient(upstream);
    client.methodCall(method, params, (err, value) => {
      if (err) {
        upstreamHealth.set(upstream.name, { healthy: false, failedAt: Date.now() });
        reject(err);
        return;
      }
      upstreamHealth.set(upstream.name, { healthy: true, failedAt: 0 });
      resolve(value);
    });
  });
}

function isMethodSafe(method) {
  return ['list_categories', 'filter_by_category', 'get_product'].includes(method);
}

function orderedUpstreams(method) {
  const healthy = RPC_UPSTREAMS.filter((upstream) => upstreamHealth.get(upstream.name)?.healthy !== false);
  const unhealthy = RPC_UPSTREAMS.filter((upstream) => !healthy.includes(upstream));
  const pool = healthy.length ? healthy : [...RPC_UPSTREAMS];

  if (isMethodSafe(method)) {
    const start = roundRobinIndex % pool.length;
    roundRobinIndex = (roundRobinIndex + 1) % pool.length;
    return [...pool.slice(start), ...pool.slice(0, start), ...unhealthy];
  }

  const primaryFirst = [...pool];
  const primaryIndex = primaryFirst.findIndex((upstream) => upstream.name === 'primary');
  if (primaryIndex > 0) {
    const [primary] = primaryFirst.splice(primaryIndex, 1);
    primaryFirst.unshift(primary);
  }
  return [...primaryFirst, ...unhealthy];
}

async function rpcCall(method, params = []) {
  const attempts = [];
  for (const upstream of orderedUpstreams(method)) {
    try {
      const result = await callUpstream(upstream, method, params);
      return { result, upstream: upstream.name };
    } catch (err) {
      attempts.push(`${upstream.name}:${err.message || String(err)}`);
    }
  }

  throw new Error(`All RPC upstreams failed for ${method}. Attempts: ${attempts.join(' | ')}`);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    open: true
  },
  plugins: [
    {
      name: 'xmlrpc-bridge',
      configureServer(server) {
        server.middlewares.use('/api/rpc', async (req, res, next) => {
          try {
            const url = new URL(req.url || '/', 'http://localhost');

            if (req.method === 'GET' && url.pathname === '/list_categories') {
              const { result, upstream } = await rpcCall('list_categories', []);
              res.setHeader('x-rpc-upstream', upstream);
              sendJson(res, 200, result);
              return;
            }

            if (req.method === 'GET' && url.pathname === '/filter_by_category') {
              const category = url.searchParams.get('category') || 'ALL';
              const { result, upstream } = await rpcCall('filter_by_category', [category]);
              res.setHeader('x-rpc-upstream', upstream);
              sendJson(res, 200, result);
              return;
            }

            if (req.method === 'GET' && url.pathname === '/get_product') {
              const productId = Number(url.searchParams.get('id') || '0');
              const { result, upstream } = await rpcCall('get_product', [productId]);
              res.setHeader('x-rpc-upstream', upstream);
              sendJson(res, 200, result);
              return;
            }

            if (req.method === 'POST' && url.pathname === '/reserve_stock') {
              const payload = await readBody(req);
              const { result, upstream } = await rpcCall('reserve_stock', [payload]);
              res.setHeader('x-rpc-upstream', upstream);
              sendJson(res, 200, result);
              return;
            }

            if (req.method === 'POST' && url.pathname === '/release_stock') {
              const payload = await readBody(req);
              const { result, upstream } = await rpcCall('release_stock', [payload]);
              res.setHeader('x-rpc-upstream', upstream);
              sendJson(res, 200, result);
              return;
            }

            if (req.method === 'POST' && url.pathname === '/process_payment') {
              const payload = await readBody(req);
              const { result, upstream } = await rpcCall('process_payment', [payload]);
              res.setHeader('x-rpc-upstream', upstream);
              sendJson(res, 200, result);
              return;
            }

            next();
          } catch (err) {
            sendJson(res, 500, {
              success: false,
              message: `RPC bridge error: ${err.message || String(err)}`
            });
          }
        });
      }
    }
  ]
});
