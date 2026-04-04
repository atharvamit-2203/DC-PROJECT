import streamlit as st
import sys
import os
import socket
import json

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Initialize session state FIRST - before any other logic
if 'session_id' not in st.session_state:
    st.session_state.session_id = None
if 'username' not in st.session_state:
    st.session_state.username = None
if 'auth_mode' not in st.session_state:
    st.session_state.auth_mode = 'simple'  # 'simple' or 'grpc'
if 'token' not in st.session_state:
    st.session_state.token = None
if 'user_id' not in st.session_state:
    st.session_state.user_id = None

# Import both gRPC and simple auth clients
try:
    import user_service_pb2
    import user_service_pb2_grpc
    import grpc
    GRPC_AVAILABLE = True
except ImportError:
    GRPC_AVAILABLE = False

# Import simple auth client
from Backend.auth_client import AuthClient

# Simple RPC Client setup
def get_simple_rpc_client():
    try:
        return AuthClient()
    except Exception as e:
        st.error(f"Failed to create simple RPC client: {e}")
        return None

def get_live_sessions():
    """Fetch all active sessions from the auth server."""
    try:
        client = AuthClient()
        return client.send_request({'command': 'list_sessions'})
    except Exception:
        return None

# gRPC Client setup (if available)
def get_grpc_client():
    if not GRPC_AVAILABLE:
        return None
    try:
        channel = grpc.insecure_channel('localhost:50051')
        return user_service_pb2_grpc.UserServiceStub(channel)
    except Exception as e:
        st.error(f"Failed to connect to gRPC server: {e}")
        return None

# Page configuration
st.set_page_config(page_title="User Service", layout="wide")

# Navigation
st.title("User Service")

# Auth mode selector
st.sidebar.header("Authentication Mode")
auth_mode = st.sidebar.radio("Choose Mode:", ["Simple RPC", "gRPC"])
st.session_state.auth_mode = 'simple' if auth_mode == "Simple RPC" else 'grpc'

if st.session_state.session_id and st.session_state.auth_mode == 'simple':
    # Authenticated user view for Simple RPC
    st.sidebar.success(f"Logged in as: {st.session_state.username}")
    
    if st.sidebar.button("Logout"):
        client = get_simple_rpc_client()
        if client and st.session_state.session_id:
            client.session_id = st.session_state.session_id
            client.logout()
        st.session_state.session_id = None
        st.session_state.username = None
        st.rerun()
    
    st.header("Welcome to User Dashboard")
    st.write(f"Username: {st.session_state.username}")
    
    # Authentication check
    client = get_simple_rpc_client()
    if client:
        try:
            client.session_id = st.session_state.session_id
            response = client.authenticate()
            
            if response.get('valid'):
                st.success("Authentication valid!")
                st.write(f"Session ID: {st.session_state.session_id}")
            else:
                st.error("Session expired, please login again")
                st.session_state.session_id = None
                st.session_state.username = None
                st.rerun()
        except Exception as e:
            st.error(f"Authentication error: {e}")
    else:
        st.error("Cannot connect to auth server. Please ensure the server is running on localhost:9999")

elif st.session_state.token and st.session_state.auth_mode == 'grpc':
    # Authenticated user view for gRPC
    st.sidebar.success(f"Logged in as: {st.session_state.username}")
    
    if st.sidebar.button("Logout"):
        st.session_state.token = None
        st.session_state.user_id = None
        st.session_state.username = None
        st.rerun()
    
    st.header("Welcome to User Dashboard")
    st.write(f"User ID: {st.session_state.user_id}")
    
    # Authentication check
    client = get_grpc_client()
    if client:
        try:
            response = client.AuthenticateUser(user_service_pb2.AuthRequest(
                token=st.session_state.token
            ))
            
            if response.valid:
                st.success("Authentication valid!")
                st.write(f"Username: {response.username}")
            else:
                st.error("Session expired, please login again")
                st.session_state.token = None
                st.rerun()
        except Exception as e:
            st.error(f"Authentication error: {e}")
    else:
        st.error("Cannot connect to gRPC server. Please ensure the server is running on localhost:50051")

else:
    # Login/Register tabs
    tab1, tab2 = st.tabs(["Login", "About"])
    
    with tab1:
        st.header("Login")
        username = st.text_input("Username", key="login_username")
        password = st.text_input("Password", type="password", key="login_password")
        
        if st.button("Login"):
            if not username or not password:
                st.error("Please enter both username and password")
            else:
                if st.session_state.auth_mode == 'simple':
                    client = get_simple_rpc_client()
                    if client:
                        try:
                            response = client.login(username, password)
                            
                            if response.get('success'):
                                st.success(response.get('message'))
                                st.session_state.session_id = response.get('session_id')
                                st.session_state.username = username
                                st.rerun()
                            else:
                                st.error(response.get('message'))
                        except Exception as e:
                            st.error(f"Login error: {e}")
                    else:
                        st.error("Cannot connect to auth server")
                else:  # gRPC mode
                    client = get_grpc_client()
                    if client:
                        try:
                            response = client.LoginUser(user_service_pb2.LoginRequest(
                                username=username,
                                password=password
                            ))
                            
                            if response.success:
                                st.success(response.message)
                                st.session_state.token = response.token
                                st.session_state.user_id = response.user_id
                                st.session_state.username = username
                                st.rerun()
                            else:
                                st.error(response.message)
                        except Exception as e:
                            st.error(f"Login error: {e}")
                    else:
                        st.error("Cannot connect to gRPC server")
    
    with tab2:
        st.header("About Authentication System")
        st.write("This is a simple authentication server with pre-configured users.")
        st.write("### Available Users:")
        st.code("""
admin / admin123
user / user123  
alice / password123
        """)
        st.write("### Features:")
        st.write("- Secure login with password hashing")
        st.write("- Session-based authentication")
        st.write("- 1-hour session expiration")
        st.write("- Simple socket-based protocol")

# Connection status indicator
with st.sidebar:
    st.write("---")
    st.write("### Connection Status")
    
    if st.session_state.auth_mode == 'simple':
        client = get_simple_rpc_client()
        if client:
            try:
                test_response = client.send_request({'command': 'authenticate', 'session_id': 'test'})
                st.success("Connected to Simple RPC Server")
            except:
                st.success("Connected to Simple RPC Server")
        else:
            st.error("Simple RPC Server Offline")
            st.info("Start the server: `python Backend/auth_server.py`")
    else:
        client = get_grpc_client()
        if client and GRPC_AVAILABLE:
            st.success("Connected to gRPC Server")
        else:
            st.error("gRPC Server Offline")
            st.info("Start the server: `python Backend/server.py`")

    # Live Sessions panel (shows CLI + frontend logins)
    if st.session_state.auth_mode == 'simple':
        st.write("---")
        st.write("### Live Sessions")
        col_r1, col_r2 = st.columns([3, 1])
        with col_r2:
            if st.button("Refresh", help="Refresh sessions"):
                st.rerun()

        sessions_resp = get_live_sessions()
        if sessions_resp and sessions_resp.get('success'):
            sessions = sessions_resp.get('active_sessions', [])
            if not sessions:
                st.caption("No active sessions")
            else:
                for s in sessions:
                    mins = s['age_seconds'] // 60
                    secs = s['age_seconds'] % 60
                    age_str = f"{mins}m {secs}s" if mins else f"{secs}s"
                    tag = " (you)" if s['username'] == st.session_state.get('username') else ""
                    st.markdown(
                        f"**{s['username']}**{tag}  "
                        f"<br><span style='font-size:0.75rem;color:gray;'>" 
                        f"since {s['logged_in_at']} · {age_str} ago · `{s['session_id']}`"
                        f"</span>",
                        unsafe_allow_html=True
                    )
        else:
            st.caption("Auth server offline")
