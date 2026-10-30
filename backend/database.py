from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

try:
    client = MongoClient(
        "mongodb://localhost:27017/",
        serverSelectionTimeoutMS=8000
    )
    client.admin.command("ping")
    print("MongoDB is connected Successfully")

except ConnectionFailure as e:
    print("MongoDB Connection Failed")
    print("Error : ",e)
    exit()

db = client["banking_database"]
customers = db["customers"]
personal_details = db["personal_details"]