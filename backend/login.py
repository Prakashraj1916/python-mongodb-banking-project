import hashlib
import hmac
import secrets

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from database import customers



# LOGIN ROUTER
router = APIRouter(
    prefix="/login",
    tags=["Login"]
)


# MongoDB login collection
login_users = customers.database["login_users"]


# PASSWORD SETTINGS


ALGORITHM = "PBKDF2-SHA256"

ITERATIONS = 600000

SALT_LENGTH = 16



# LOGIN REQUEST

class LoginRequest(BaseModel):

    username: str = Field(
        min_length=1,
        max_length=100
    )

    password: str = Field(
        min_length=1,
        max_length=200
    )

# HASH PASSWORD

def hash_password(
    password: str,
    salt: str = None,
    iterations: int = ITERATIONS
):

    if salt is None:
        salt = secrets.token_hex(SALT_LENGTH)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        iterations
    ).hex()

    return salt, password_hash, iterations


# VERIFY PASSWORD

def verify_password(
    password: str,
    salt: str,
    stored_hash: str,
    iterations: int
):

    _, password_hash, _ = hash_password(
        password,
        salt,
        iterations
    )

    return hmac.compare_digest(
        password_hash,
        stored_hash
    )


# LOGIN API


@router.post("")
@router.post("/")
def login(data: LoginRequest):

    username = data.username.strip().lower()

    user = login_users.find_one({
        "username": username
    })

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if user.get("status", "ACTIVE") != "ACTIVE":

        raise HTTPException(
            status_code=403,
            detail="This account is inactive"
        )

    stored_salt = user.get("password_salt")

    stored_hash = user.get("password_hash")

    if not stored_salt or not stored_hash:

        raise HTTPException(
            status_code=500,
            detail="Password information is missing"
        )

    # Support old users created with 310000 iterations
    stored_iterations = user.get(
        "iterations",
        310000
    )

    password_valid = verify_password(
        data.password,
        stored_salt,
        stored_hash,
        stored_iterations
    )

    if not password_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    return {
        "success": True,
        "message": "Login successful",
        "username": username
    }

@router.get("/users")
def get_login_users():
    users = list(login_users.find({},
                                  {
                                      "_id" : 0,
                                      "username" :1,
                                      "password_hash":1,
                                      "password_salt":1,                                      
                                  }))

    return {
        "success":True,
        "total_users":len(users),
        "users": users
    }

# LOGIN STATUS


@router.get("/status")
def login_status():

    return {
        "success": True,
        "message": "Login API is working"
    }
