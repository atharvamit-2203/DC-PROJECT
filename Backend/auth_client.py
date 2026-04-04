import socket
import json
import time
import threading

class AuthClient:
    def __init__(self, host='localhost', port=9999):
        self.host = host
        self.port = port
        self.session_id = None
    
    def send_request(self, data):
        try:
            client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client_socket.connect((self.host, self.port))
            
            client_socket.send(json.dumps(data).encode())
            
            response = client_socket.recv(1024).decode()
            client_socket.close()
            
            return json.loads(response)
            
        except Exception as e:
            return {'success': False, 'message': f'Connection error: {str(e)}'}
    
    def login(self, username, password):
        data = {'command': 'login', 'username': username, 'password': password}
        response = self.send_request(data)
        
        if response.get('success'):
            self.session_id = response.get('session_id')
        
        return response
    
    def authenticate(self):
        if not self.session_id:
            return {'valid': False, 'message': 'No active session'}
        
        data = {'command': 'authenticate', 'session_id': self.session_id}
        return self.send_request(data)
    
    def logout(self):
        if not self.session_id:
            return {'success': False, 'message': 'No active session'}
        
        data = {'command': 'logout', 'session_id': self.session_id}
        response = self.send_request(data)
        
        if response.get('success'):
            self.session_id = None
        
        return response


def _watch_sessions(client, stop_event):
    """Background thread: polls server every 2s and prints new logins/logouts."""
    known = {}  

    while not stop_event.is_set():
        resp = client.send_request({'command': 'list_sessions'})
        if resp.get('success'):
            current = {s['session_id']: s for s in resp.get('active_sessions', [])}

            for sid, s in current.items():
                if sid not in known:
                    print(f"\n  [SERVER] New login — user: '{s['username']}' "
                          f"at {s['logged_in_at']} (session: {sid})")
                    print("  Your choice: ", end="", flush=True)

            for sid, username in known.items():
                if sid not in current:
                    print(f"\n  [SERVER] Logout — user: '{username}' "
                          f"(session: {sid})")
                    print("  Your choice: ", end="", flush=True)

            known = {sid: s['username'] for sid, s in current.items()}

        stop_event.wait(2)


def main():
    import sys
    print("\n" + "=" * 55)
    print("   Authentication Client  —  Auth Service")
    print("=" * 55)

    client = AuthClient()

    # Test connection
    test = client.send_request({'command': 'authenticate', 'session_id': 'test'})
    if 'Connection error' in test.get('message', ''):
        print("[ERROR] Cannot connect to auth server on localhost:9999")
        print("   Start the server first: python Backend/auth_server.py")
        sys.exit(1)
    print("[OK] Connected to auth server")
    print("[WATCHING] Monitoring logins from all clients (including frontend)...\n")

    # Start background session watcher
    stop_event = threading.Event()
    watcher = threading.Thread(target=_watch_sessions, args=(client, stop_event), daemon=True)
    watcher.start()

    menu = {
        "1": "Login (as this client)",
        "2": "Check My Session",
        "3": "List All Active Sessions",
        "4": "Logout",
        "5": "Exit",
    }

    while True:
        print("-" * 42)
        for k, v in menu.items():
            print(f"  [{k}] {v}")
        print("-" * 42)
        choice = input("  Your choice: ").strip()

        if choice == "1":
            username = input("  Username: ").strip()
            password = input("  Password: ").strip()
            if not username or not password:
                print("  [!] Username and password required.")
                continue
            response = client.login(username, password)
            if response.get('success'):
                print(f"  [OK] {response['message']}")
                print(f"  Session ID: {client.session_id}")
            else:
                print(f"  [FAIL] {response['message']}")

        elif choice == "2":
            response = client.authenticate()
            if response.get('valid'):
                print(f"  [OK] Session valid — logged in as '{response['username']}'")
            else:
                print(f"  [FAIL] {response['message']}")

        elif choice == "3":
            response = client.send_request({'command': 'list_sessions'})
            if response.get('success'):
                sessions = response.get('active_sessions', [])
                if not sessions:
                    print("  No active sessions on the server.")
                else:
                    print(f"\n  Active Sessions ({response['count']} total):")
                    print("  " + "-" * 52)
                    print(f"  {'Username':<15} {'Logged In':>10} {'Age (sec)':>12}  Session")
                    print("  " + "-" * 52)
                    for s in sessions:
                        print(f"  {s['username']:<15} {s['logged_in_at']:>10} {s['age_seconds']:>12}s  {s['session_id']}")
                    print()
            else:
                print(f"  [FAIL] {response['message']}")

        elif choice == "4":
            response = client.logout()
            if response.get('success'):
                print(f"  [OK] {response['message']}")
            else:
                print(f"  [FAIL] {response['message']}")

        elif choice == "5":
            stop_event.set()
            print("\n  Goodbye!\n")
            break

        else:
            print("  [!] Invalid option.\n")


if __name__ == "__main__":
    main()
