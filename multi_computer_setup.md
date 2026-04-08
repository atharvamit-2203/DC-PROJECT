# Multi-Computer Mutual Exclusion Setup Guide

This guide explains how to set up the project to demonstrate mutual exclusion across different computers on the same network.

## 1. Setup the "Server" Computer

The Server computer will host the inventory database and the frontend application.

1.  **Find your Local IP Address**:
    - Open **Command Prompt** (cmd).
    - Type `ipconfig` and press Enter.
    - Look for **IPv4 Address** under your active network adapter (e.g., `192.168.1.15`).
    - **Note this IP down.**

2.  **Start the RPC Server**:
    - Navigate to the `Backend` directory.
    - Run:
      ```powershell
      python rpc_server.py
      ```
    - It should show: `URL : http://0.0.0.0:8001/RPC2`.

3.  **Start the Frontend**:
    - Navigate to the `Frontend` directory.
    - Run:
      ```powershell
      npm run dev
      ```
    - You will see a **Network** URL in the console, for example:
      `Network: http://192.168.1.15:5173/`

## 2. Connect from "Client" Computers

Any other computer on the same Wi-Fi or LAN can now participate.

1.  Open a browser on the Client computer.
2.  Enter the **Network URL** from Step 1.3 (e.g., `http://192.168.1.15:5173/`).
3.  The client now sees the same products and stock as the Server.

## 3. The Mutual Exclusion Demo

To demonstrate that the system correctly handles concurrent requests:

1.  **Setup**: On two different computers (or two different browsers/incognito windows), navigate to the same product (e.g., "iPhone 15 Pro").
2.  **Scenario**: Look at the stock (e.g., "10 left").
3.  **Action**: Try to "Place Order" nearly simultaneously on both computers for a high quantity (e.g., 6 items on each).
4.  **Result**:
    - One computer will succeed (remaining stock becomes 4).
    - The other computer's request will be processed **only after** the first one finishes the lock.
    - The second computer will receive a "Stock conflict detected" or "Insufficient stock" error because the inventory was updated atomically.
    - You can verify this in the `rpc_server.py` console logs, which will show the serialized lock acquisition.

---

### Troubleshooting

- **Firewall**: If a client cannot reach the server, you may need to allow port `5173` and `8001` through the Windows Firewall on the **Server** computer.
- **Network**: Ensure both computers are on the same subnet (e.g., connected to the same Wi-Fi).

### How it Works
The actual mutual exclusion happens in `Backend/rpc_server.py` using a Python `threading.Lock()`. When `reserve_stock` is called, it acquires this lock before checking or decrementing any stock values, ensuring that no two requests can modify the database at the same time.
