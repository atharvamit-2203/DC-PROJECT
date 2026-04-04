import grpc
from concurrent import futures
import hashlib
import uuid
import jwt
from datetime import datetime, timedelta
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Generated protobuf imports (after compilation)
import user_service_pb2
import user_service_pb2_grpc

class UserServiceImpl(user_service_pb2_grpc.UserServiceServicer):
    def __init__(self):
        self.users = {}  # In-memory storage (use database in production)
        self.secret_key = "your-secret-key-change-in-production"
    
    def RegisterUser(self, request, context):
        if request.username in self.users:
            return user_service_pb2.RegisterResponse(
                success=False,
                message="Username already exists"
            )
        
        user_id = str(uuid.uuid4())
        hashed_password = hashlib.sha256(request.password.encode()).hexdigest()
        
        self.users[request.username] = {
            "user_id": user_id,
            "username": request.username,
            "email": request.email,
            "password": hashed_password
        }
        
        return user_service_pb2.RegisterResponse(
            success=True,
            message="User registered successfully",
            user_id=user_id
        )
    
    def LoginUser(self, request, context):
        if request.username not in self.users:
            return user_service_pb2.LoginResponse(
                success=False,
                message="Invalid credentials"
            )
        
        user = self.users[request.username]
        hashed_password = hashlib.sha256(request.password.encode()).hexdigest()
        
        if user["password"] != hashed_password:
            return user_service_pb2.LoginResponse(
                success=False,
                message="Invalid credentials"
            )
        
        token = jwt.encode({
            "user_id": user["user_id"],
            "username": user["username"],
            "exp": datetime.utcnow() + timedelta(hours=24)
        }, self.secret_key, algorithm="HS256")
        
        return user_service_pb2.LoginResponse(
            success=True,
            message="Login successful",
            token=token,
            user_id=user["user_id"]
        )
    
    def AuthenticateUser(self, request, context):
        try:
            payload = jwt.decode(request.token, self.secret_key, algorithms=["HS256"])
            return user_service_pb2.AuthResponse(
                valid=True,
                user_id=payload["user_id"],
                username=payload["username"]
            )
        except jwt.ExpiredSignatureError:
            return user_service_pb2.AuthResponse(valid=False)
        except jwt.InvalidTokenError:
            return user_service_pb2.AuthResponse(valid=False)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_service_pb2_grpc.add_UserServiceServicer_to_server(
        UserServiceImpl(), server
    )
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server started on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
