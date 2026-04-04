import socket
import json
import hashlib
import uuid
import threading
from datetime import datetime, timedelta

class AuthServer:
    def __init__(self, host='localhost', port=9999):
        self.host = host
        self.port = port
        # Pre-configured users (username: password)
        self.users = {
            'admin': self.hash_password('admin123'),
            'user': self.hash_password('user123'),
            'alice': self.hash_password('password123')
        }
        self.sessions = {}  # Active sessions
        
    def hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()
    
    def create_session(self, username):
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            'username': username,
            'created_at': datetime.now()
        }
        return session_id
    
    def validate_session(self, session_id):
        if session_id in self.sessions:
            session = self.sessions[session_id]
            if datetime.now() - session['created_at'] < timedelta(hours=1):
                return True, session['username']
            else:
                del self.sessions[session_id]
        return False, None
    
    def handle_request(self, data):
        command = data.get('command')
        
        if command == 'login':
            username = data.get('username')
            password = data.get('password')
            
            if username not in self.users:
                return {'success': False, 'message': 'User not found'}
            
            if self.users[username] != self.hash_password(password):
                return {'success': False, 'message': 'Invalid password'}
            
            session_id = self.create_session(username)
            return {
                'success': True, 
                'session_id': session_id,
                'message': 'Login successful'
            }
        
        elif command == 'authenticate':
            session_id = data.get('session_id')
            is_valid, username = self.validate_session(session_id)
            
            if is_valid:
                return {
                    'valid': True,
                    'username': username,
                    'message': 'Session valid'
                }
            else:
                return {
                    'valid': False,
                    'message': 'Invalid or expired session'
                }
        
        elif command == 'logout':
            session_id = data.get('session_id')
            if session_id in self.sessions:
                del self.sessions[session_id]
                return {'success': True, 'message': 'Logged out successfully'}
            else:
                return {'success': False, 'message': 'No active session'}

        elif command == 'list_sessions':
            now = datetime.now()
            active = []
            expired = []
            for sid, info in list(self.sessions.items()):
                age = now - info['created_at']
                if age < timedelta(hours=1):
                    active.append({
                        'session_id': sid[:8] + '...',
                        'username': info['username'],
                        'logged_in_at': info['created_at'].strftime('%H:%M:%S'),
                        'age_seconds': int(age.total_seconds()),
                    })
                else:
                    expired.append(sid)
            for sid in expired:
                del self.sessions[sid]
            return {
                'success': True,
                'active_sessions': active,
                'count': len(active),
            }

        else:
            return {'success': False, 'message': 'Unknown command'}
    
    def handle_client(self, client_socket, address):
        try:
            data = client_socket.recv(1024).decode()
            if not data:
                return

            request = json.loads(data)
            response = self.handle_request(request)

            cmd = request.get('command', '?')
            if cmd == 'login':
                status = '[OK] LOGIN' if response.get('success') else '[FAIL] LOGIN'
                print(f"  {status} — user: '{request.get('username')}' from {address}")
            elif cmd == 'logout':
                print(f"  [LOGOUT] session closed from {address}")
            elif cmd == 'authenticate':
                user = response.get('username', 'unknown')
                valid = response.get('valid')
                print(f"  [AUTH] {'valid, user: ' + user if valid else 'invalid session'} from {address}")
            elif cmd == 'list_sessions':
                print(f"  [SESSIONS] {response.get('count', 0)} active from {address}")
            else:
                print(f"  [RESPONSE] [{address}] {response}")

            client_socket.send(json.dumps(response).encode())

        except Exception as e:
            error_response = {'success': False, 'message': f'Error: {str(e)}'}
            try:
                client_socket.send(json.dumps(error_response).encode())
            except Exception:
                pass
        finally:
            client_socket.close()

    def start(self):
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind((self.host, self.port))
        server_socket.listen(10)

        print(f"Authentication Server running on {self.host}:{self.port}")
        print("Pre-configured users:")
        print("   - admin / admin123")
        print("   - user / user123")
        print("   - alice / password123")
        print("Waiting for connections... (Ctrl+C to stop)\n")

        try:
            while True:
                client_socket, address = server_socket.accept()
                print(f"[CONNECT] {address}")
                t = threading.Thread(target=self.handle_client, args=(client_socket, address), daemon=True)
                t.start()

        except KeyboardInterrupt:
            print("\nServer shutting down...")
        finally:
            server_socket.close()

if __name__ == '__main__':
    server = AuthServer()
    server.start()
