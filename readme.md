# Distributed E-Commerce (gRPC + Local RPC Simulation + Vite)

This project demonstrates distributed computing concepts for e-commerce with:

- gRPC-based backend services
- Local RPC simulation in frontend (no external APIs)
- Mutual exclusion for safe stock reservation under concurrent orders
- Vite frontend for fast local development

## Architecture

```
Vite Frontend (Local RPC Simulation) -> Simulated RPC Server Module (Mutex)
									  -> Atomic Inventory Reservation

Optional backend path:

Vite Frontend -> Python gRPC services (for user/auth flows)
```

## Features

- **Local RPC Simulation**: Browser-side RPC-style calls (`ReserveStock`)
- **Mutual Exclusion**: Lock-based atomic stock reservation
- **Idempotency Support**: Repeated reservation calls can return consistent outcomes
- **Vite UI**: Product browsing, cart flow, order confirmation
- **Optional gRPC User Service**: Register/login/auth contracts still available

## Setup Instructions

### 1. (Optional) Activate Python Virtual Environment

```bash
# Activate your existing virtual environment
# Replace with your actual venv path
C:\path\to\your\venv\Scripts\activate
```

### 2. Install Python Dependencies (Optional: for backend gRPC)

```bash
pip install -r requirements.txt
```

### 3. Generate gRPC Code (Optional)

```bash
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. user_service.proto
```

This will generate:
- `user_service_pb2.py`
- `user_service_pb2_grpc.py`

### 4. Start Backend Server (Optional)

```bash
cd Backend
python server.py
```

The server starts on `localhost:50051`

### 5. Start the Vite Frontend

In a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

The frontend will open in your browser at `http://localhost:5173`

### 6. Start the RPC Product Server (Required for Frontend Data + Checkout)

In another terminal:

```bash
cd Backend
python rpc_server.py
```

When you use the frontend, progress logs are printed in the `rpc_server.py` terminal for:

- `list_categories`
- `filter_by_category`
- `reserve_stock` (including lock acquisition and stock transitions)

### 7. Optional: Start a Second RPC Replica for Load Balancing / Failover

The Vite bridge can route read requests in round-robin order and retry writes on another replica if one server is unavailable. To test that path, start a second RPC server on a different port while pointing both processes at the same SQLite state file:

```bash
cd Backend
python rpc_server.py --port 8001 --db-path rpc_state.db
python rpc_server.py --port 8002 --db-path rpc_state.db
```

The frontend will prefer the primary server, but it can fall back to the backup server if the first one fails. Because both replicas share the same SQLite database file, stock changes remain consistent.

## Usage

1. Run Vite frontend (`npm run dev` in `Frontend`)
2. Browse products and add items to cart
3. Place order to invoke local RPC `ReserveStock`
4. Observe atomic stock updates protected by mutual exclusion lock

## Security Notes

- **Development Only**: This uses in-memory storage and a hardcoded secret key
- **Production**: Replace with database storage and environment variables for secrets
- **Password Hashing**: Uses SHA-256 (consider bcrypt for production)
- **JWT Tokens**: 24-hour expiration by default

## Project Structure

```
├── Backend/
│   ├── server.py          # gRPC user service
│   └── rpc_server.py      # Python local RPC demo service (optional)
├── Frontend/
│   ├── main.js            # Vite UI entry
│   ├── rpc_sim.js         # Local RPC simulation + mutex
│   ├── styles.css         # UI styles
│   └── index.html         # Frontend host page
├── user_service.proto     # Protocol buffer definition
├── requirements.txt       # Python dependencies
└── readme.md              # This file
```

## RPC Methods in Frontend Simulation

- `ReserveStock`: Atomically validates and reserves stock using a mutex

## Troubleshooting

- **Connection Error**: Ensure the backend server is running on port 50051
- **Import Error**: Make sure to generate the protobuf files after installing dependencies
- **Authentication Failed**: Check username/password and ensure user is registered

## Technologies Used

- **gRPC**: High-performance RPC framework
- **Protocol Buffers**: Data serialization format
- **Vite**: Fast frontend build tool and dev server
- **Vanilla JavaScript + CSS**: Frontend implementation
- **Local RPC Simulation**: In-browser method dispatch for zero-API demos
- **Mutex Locking**: Mutual exclusion for concurrency-safe stock mutation
- **JWT**: JSON Web Tokens for authentication
- **Python 3.7+**: Programming language

## Distributed E-Commerce Extension (Using Distributed Computing Concepts)

This project can be evolved from a single authentication-focused system into a distributed e-commerce platform.

### Problem in Traditional Monolith

- All modules (users, products, orders, inventory, payment) are tightly coupled.
- Scaling requires scaling the whole application.
- A failure in one component can impact the complete system.
- Concurrent purchases of the same item may cause inconsistent stock updates.

### Proposed Distributed Architecture

Split the platform into independent services:

- **User Service**: Authentication and user profile (already present using gRPC)
- **Product Service**: Product catalog and search
- **Inventory Service**: Stock reservation and release
- **Order Service**: Order lifecycle management
- **Payment Service**: Payment processing and status
- **Notification Service**: User notifications (email/SMS/in-app)

Communication strategy:

- **Synchronous gRPC** for request-response calls requiring immediate result.
- **Asynchronous events** (RabbitMQ/Kafka/Redis Streams) for decoupled workflows and retries.

### Concurrency and Consistency Strategy

To avoid incorrect stock updates during simultaneous orders:

1. **Inventory reservation API must be atomic** (`check-and-decrement` in one transaction).
2. **Idempotency keys** for order and payment requests to avoid duplicate processing.
3. **Saga pattern** for distributed transaction flow:
	- Reserve stock
	- Process payment
	- Confirm order
	- Compensate on failure (release reserved stock)
4. **Optimistic locking/version checks** on inventory records.

### Suggested Distributed Purchase Flow

1. Frontend sends place-order request to Order Service.
2. Order Service requests stock reservation from Inventory Service.
3. On success, Order Service triggers Payment Service.
4. If payment succeeds, order status becomes `CONFIRMED`.
5. If payment fails, compensation event releases stock and order becomes `FAILED`.
6. Notification Service sends order update asynchronously.

### Mapping to Current Repository

Use your existing files as the starting point:

- `user_service.proto`: Keep and expand with additional service contracts.
- `user_service_pb2.py` / `user_service_pb2_grpc.py`: Generated stubs for gRPC contracts.
- `Backend/server.py`: Current User Service implementation.
- `Backend/rpc_server.py` and `Backend/rpc_client.py`: Can be adapted for internal service-to-service communication and testing.
- `Frontend/main.js`: Current UI entry point.
- `Frontend/rpc_sim.js`: Local RPC simulation + mutual exclusion lock.

Recommended next proto files to add:

- `product_service.proto`
- `inventory_service.proto`
- `order_service.proto`
- `payment_service.proto`

### Reliability and Scalability Benefits

- Scale only high-load services (for example, order and inventory).
- Isolate failures so one service outage does not bring down the full platform.
- Deploy and update services independently.
- Improve throughput with event-driven asynchronous processing.

### Incremental Migration Plan

1. Keep current User Service as-is.
2. Add Product Service and Inventory Service using gRPC.
3. Introduce Order Service with Saga orchestration.
4. Add event broker for asynchronous events and retries.
5. Add Payment and Notification services.
6. Containerize each service and run with Docker Compose/Kubernetes.

Detailed design document: `distributed_system_design.md`