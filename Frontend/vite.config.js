import { defineConfig } from 'vite';
import xmlrpc from 'xmlrpc';

function createRpcClient() {
  return xmlrpc.createClient({
    host: 'localhost',
    port: 8001,
    path: '/RPC2'
  });
}

function rpcCall(method, params = []) {
  const client = createRpcClient();
  return new Promise((resolve, reject) => {
    client.methodCall(method, params, (err, value) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(value);
    });
  });
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
              const result = await rpcCall('list_categories', []);
              sendJson(res, 200, result);
              return;
            }

            if (req.method === 'GET' && url.pathname === '/filter_by_category') {
              const category = url.searchParams.get('category') || 'ALL';
              const result = await rpcCall('filter_by_category', [category]);
              sendJson(res, 200, result);
              return;
            }

            if (req.method === 'GET' && url.pathname === '/get_product') {
              const productId = Number(url.searchParams.get('id') || '0');
              const result = await rpcCall('get_product', [productId]);
              sendJson(res, 200, result);
              return;
            }

            if (req.method === 'POST' && url.pathname === '/reserve_stock') {
              const payload = await readBody(req);
              const result = await rpcCall('reserve_stock', [payload]);
              sendJson(res, 200, result);
              return;
            }

            if (req.method === 'POST' && url.pathname === '/release_stock') {
              const payload = await readBody(req);
              const result = await rpcCall('release_stock', [payload]);
              sendJson(res, 200, result);
              return;
            }

            if (req.method === 'POST' && url.pathname === '/process_payment') {
              const payload = await readBody(req);
              const result = await rpcCall('process_payment', [payload]);
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
