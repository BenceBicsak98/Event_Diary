"""
This module provides authentication and user data retrieval functionalities for a FastAPI application.
Routes:
    - POST /token: Authenticates a user and generates a JWT token.
    - GET /get_user_data: Retrieves user data based on the provided username.
Functions:
    - verify_password(plain_password, hashed_password): Verifies a plain password against a hashed password.
    - login(form_data: OAuth2PasswordRequestForm): Authenticates a user, verifies credentials, and generates a JWT token.
    - get_user_data(username: str): Retrieves user data from the Oracle database.
Constants:
    - DB_USER_misz: Oracle database username.
    - DB_PASS_misz: Oracle database password.
    - DB_DSN_misz: Oracle database connection string.
    - SECRET_KEY: Secret key used for JWT token encoding.
    - ALGORITHM: Algorithm used for JWT token encoding.
Dependencies:
    - FastAPI: Provides the API routing and dependency injection.
    - oracledb: Used to connect to the Oracle database.
    - passlib: Provides password hashing and verification.
    - jose: Used for JWT token encoding and decoding.
Notes:
    - The Oracle Instant Client library must be initialized with the correct path.
    - Ensure that the database credentials and secret key are securely managed.
    - The `login` endpoint generates a token valid for 1 hour.
    - The `get_user_data` endpoint retrieves user details, including sensitive information like passwords. Ensure proper security measures are in place.
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
import oracledb

router = APIRouter()

# Oracle config misz
DB_USER_misz = "misz"
DB_PASS_misz = "misz"
DB_DSN_misz = "mirdb2.vasiviz.hu:1521/mirdb.vasiviz.hu"

# 🔒 Hash-verification
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

SECRET_KEY = "secret"
ALGORITHM = "HS256"

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")  # csak egyszer kell
        oracledb.init_oracle_client(lib_dir=r"/opt/oracle/instantclient")
        connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
        cursor = connection.cursor()

        # 🔍 Lekérdezzük a felhasználót
        cursor.execute(
            "SELECT username, password FROM ER_USERS WHERE username = :username AND IS_ENABLED = '1'",
            [form_data.username]
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=400, detail="Incorrect username or password")
        else:
            db_username, db_password = row
            
            if not verify_password(form_data.password, db_password):
                raise HTTPException(status_code=400, detail="Incorrect username or password")
            else:
                # 🔐 Token generálás
                token_data = {
                    "sub": db_username,
                    "exp": datetime.utcnow() + timedelta(hours=1)
                }
                token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

                return {"access_token": token, "token_type": "bearer"}

    except oracledb.DatabaseError as e:
        error, = e.args
        print("❌ Oracle hiba:", error.message)
        raise HTTPException(status_code=500, detail="Database connection error")

    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass
        
@router.get("/get_user_data")
def get_user_data(username: str):
    try:    
        # oracledb.init_oracle_client(lib_dir="C:\\instantclient_11_2")  # csak egyszer kell
        oracledb.init_oracle_client(lib_dir=r"/opt/oracle/instantclient")
        connection = oracledb.connect(user=DB_USER_misz, password=DB_PASS_misz, dsn=DB_DSN_misz)
        cursor = connection.cursor()

        # 🔍 Lekérdezzük a felhasználó adatait
        cursor.execute(
            "SELECT * FROM ER_USERS WHERE username = :username",
            [username]
        )
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="User not found or disabled")
        else:
            user_data = {
                "ID": row[0],
                "username": row[1],
                "password": row[2],
                "first_name": row[3],
                "last_name": row[4],
                "last_login": str(row[5]),  
                "last_modified": str(row[6]),
                "is_admin": row[7],
                "is_enable": row[8],
            }

            return JSONResponse(content=user_data)
    except oracledb.DatabaseError as e:
        error, = e.args
        print("❌ Oracle hiba:", error.message)
        raise HTTPException(status_code=500, detail="Database connection error")
    finally:
        try:
            cursor.close()
            connection.close()
        except:
            pass
