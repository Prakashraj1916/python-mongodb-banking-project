from getpass import getpass
from database import customers
from login import hash_password
login_users = customers.database["login_users"]

username = input("Enter username :").strip().lower()
password = getpass("Enter password :")

if not username or not password:
    raise ValueError("Username and password are required")

salt, password_hash, iterations = hash_password(password)

result = login_users.update_one(
    {
        "username" : username
    },
    {
        "$setOnInsert" : {
            "username" : username,
            "password_salt" :salt,
            "password_hash" : password_hash,
            "status" : "ACTIVE"
        }
    },
    upsert = True
)
if result.upserted_id:
    print("Login account created successfully.")
else:
    print("Username already exists. Existing credentials were not changed.")