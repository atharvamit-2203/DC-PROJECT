# Distributed E-Commerce System Design

## 1. Service Decomposition

- User Service: signup/login/authentication
- Product Service: product details, price, category, search
- Inventory Service: stock tracking, reservation, release
- Order Service: order creation, status transitions
- Payment Service: payment execution and confirmation
- Notification Service: delivery of order updates

Each service should own its data and expose a strict API contract.

## 2. Communication Pattern

- Synchronous: gRPC for low-latency request/response interactions.
- Asynchronous: message broker for domain events and retries.

Suggested event topics/queues:

- `order.created`
- `inventory.reserved`
- `inventory.released`
- `payment.succeeded`
- `payment.failed`
- `order.confirmed`
- `order.failed`

## 3. Concurrency-Safe Inventory Design

Inventory operations must be atomic.

Reservation algorithm:

1. Validate `available_stock >= requested_quantity`.
2. If true, decrement `available_stock` and increment `reserved_stock` in one transaction.
3. Persist reservation with a unique `reservation_id` and TTL.
4. Publish `inventory.reserved`.

Release algorithm (compensation):

1. Load reservation by `reservation_id`.
2. If reservation is active, decrement `reserved_stock` and increment `available_stock`.
3. Mark reservation released.
4. Publish `inventory.released`.

Idempotency rule:

- Any repeated request with the same idempotency key must return the same final outcome.

## 4. Saga Flow for Order Processing

Primary steps:

1. Order Service creates `PENDING` order.
2. Order Service requests inventory reservation.
3. On reservation success, Order Service requests payment.
4. If payment succeeds, Order Service sets `CONFIRMED`.
5. If payment fails, Order Service triggers stock release and sets `FAILED`.

Compensation actions:

- Payment failure -> release inventory.
- Timeout/no response -> retry with exponential backoff then compensate.

## 5. Failure Handling

- Retry transient failures with bounded exponential backoff.
- Send unrecoverable messages to dead-letter queue.
- Circuit breaker on cross-service dependencies.
- Use request timeout and cancellation on all RPC calls.

## 6. Suggested Proto Contracts (Minimal)

### inventory_service.proto

```proto
syntax = "proto3";

package inventory;

service InventoryService {
  rpc ReserveStock(ReserveStockRequest) returns (ReserveStockResponse);
  rpc ReleaseStock(ReleaseStockRequest) returns (ReleaseStockResponse);
}

message ReserveStockRequest {
  string product_id = 1;
  int32 quantity = 2;
  string order_id = 3;
  string idempotency_key = 4;
}

message ReserveStockResponse {
  bool success = 1;
  string reservation_id = 2;
  string message = 3;
}

message ReleaseStockRequest {
  string reservation_id = 1;
  string reason = 2;
}

message ReleaseStockResponse {
  bool success = 1;
  string message = 2;
}
```

### order_service.proto

```proto
syntax = "proto3";

package order;

service OrderService {
  rpc PlaceOrder(PlaceOrderRequest) returns (PlaceOrderResponse);
  rpc GetOrder(GetOrderRequest) returns (GetOrderResponse);
}

message PlaceOrderRequest {
  string user_id = 1;
  string product_id = 2;
  int32 quantity = 3;
  string idempotency_key = 4;
}

message PlaceOrderResponse {
  bool success = 1;
  string order_id = 2;
  string status = 3;
  string message = 4;
}

message GetOrderRequest {
  string order_id = 1;
}

message GetOrderResponse {
  bool found = 1;
  string order_id = 2;
  string status = 3;
}
```

## 7. Mapping to Existing Repository

- Keep `Backend/server.py` as User Service.
- Add `Backend/inventory_server.py` for inventory reservation/release.
- Add `Backend/order_server.py` for order orchestration and Saga logic.
- Add `Frontend/app.py` order flow screens: product list, place order, order status.
- Keep generated protobuf files at repo root or move to a dedicated `generated/` folder.

## 8. Immediate Next Implementation Steps

1. Create `inventory_service.proto` and `order_service.proto`.
2. Generate gRPC stubs with `grpc_tools.protoc`.
3. Implement `ReserveStock` and `ReleaseStock` with atomic in-memory lock first.
4. Implement `PlaceOrder` to call inventory then simulated payment.
5. Add a simple event log (JSON or queue adapter) before introducing Kafka/RabbitMQ.
6. Integrate order placement in Streamlit frontend.
