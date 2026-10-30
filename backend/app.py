import fastapi  # type: ignore[reportMissingImports]
from database import customers, personal_details
import pydantic  # type: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware  # type: ignore[reportMissingImports]
from fastapi.responses import StreamingResponse
import pandas as pd
from io import BytesIO
from login import router as login_router
from chatbot import router as chatbot_router
from fastapi import Query
from typing import Optional
import re

app = fastapi.FastAPI()
app.include_router(chatbot_router)
app.include_router(login_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#=====================================================================================================================================
# CUSTOMER MODEL
#=====================================================================================================================================


class Customer(pydantic.BaseModel):
    name: str
    age: int
    account_type: str
    balance: float


def generate_account_id() -> int:
    latest_customer = customers.find_one(
        {},
        sort=[("account_id", -1)]
    )
    return (latest_customer.get("account_id", 0) if latest_customer else 0) + 1

#Search the customers with the credentials 
@app.get("/customers/search")
def search_customers(
    search: Optional[str] = None,
    account_type : Optional[str] = None,
    status: Optional[str] =None,
    page:int = Query(1, ge=1),
    limit:int = Query(10, ge=1, le=100)
):
    try:
        query= {}

        if search and search.strip():
            search_value = search.strip()
            search_conditions=[
                {
                    "name":{
                        "$regex": re.escape(search_value),
                        "$options":"i"
                    }
                }
            ]

            #Account id is numeric in this projcet
            if search_value.isdigit():
                search_conditions.append({
                    "account_id":int(search_value)
                })
            query["$or"] = search_conditions

        if account_type:
            query["account_type"] = account_type

        if status:
            query["status"] = status.upper()

        total = customers.count_documents(query)

        skip = (page -1)*limit

        customer_list = list(
            customers.find(query,{"_id":0})
            .sort("account_id",1)
            .skip(skip)
            .limit(limit)
        )

        return{
            "success" : True,
            "total" : total,
            "page" : page,
            "limit" : limit,
            "total_pages": (total + limit - 1)//limit,
            "customers": customer_list
        }
    except Exception as e:
        return{
            "success" : False,
            "message" : str(e)
        }


# GET NEXT ACCOUNT ID
@app.get("/customers/next-account-id")
def get_next_account_id():
    return {
        "account_id": generate_account_id()
    }




# CREATE CUSTOMER
@app.post("/customers/posting")
def create_customer(customer: Customer):

    # Generate Account ID automatically
    account_id = generate_account_id()

    # Convert Pydantic model to dictionary
    customer_data = customer.model_dump()

    # Add generated Account ID
    customer_data["account_id"] = account_id

    # Add account status
    customer_data["status"] = "ACTIVE"

    # Insert customer into MongoDB
    result = customers.insert_one(customer_data)

    return {
        "Message": "Customer details created successfully",
        "id": str(result.inserted_id),
        "account_id": account_id,
        "status": "ACTIVE"
    }


# READ ACTIVE CUSTOMERS


@app.get("/customers/read")
def get_customers():

    active_customers = customers.find({
        "status": "ACTIVE"
    }).sort(
        "account_id",1
    )

    result = []

    for customer in active_customers:

        customer["_id"] = str(customer["_id"])

        result.append(customer)

    return result

# READ CUSTOMER BY ACCOUNT ID


@app.get("/customers/read/{account_id}")
def get_customer(account_id: int):

    customer = customers.find_one({
        "account_id": account_id
    })

    if customer is None:
        raise fastapi.HTTPException(
            status_code=404,
            detail="Customer ID not found"
        )

    customer["_id"] = str(customer["_id"])

    return customer


class CustomerUpdate(pydantic.BaseModel):
    name : str
    age : int
    account_type :str
    balance :float
    
# UPDATE BALANCE
@app.put("/customers/update/{account_id}")
def update_customer(account_id: int, detail: CustomerUpdate):

    # Check whether customer exists
    customer = customers.find_one({
        "account_id": account_id
    })

    if customer is None:
        raise fastapi.HTTPException(
            status_code=404,
            detail="Customer ID not found"
        )

    # Update the customer's details, including the balance.
    customers.update_one(
        {
            "account_id": account_id
        },
        {
            "$set": {
                "name": detail.name,
                "age": detail.age,
                "account_type": detail.account_type,
                "balance": detail.balance
            }
        }
    )

    return {
        "Message": "Customer balance updated successfully"
    }



# BLOCK CUSTOMER


@app.put("/customers/{account_id}/block")
def block_customer(account_id: int):

    customer = customers.find_one({
        "account_id": account_id
    })

    if customer is None:
        raise fastapi.HTTPException(
            status_code=404,
            detail="Customer ID not found"
        )

    customers.update_one(
        {
            "account_id": account_id
        },
        {
            "$set": {
                "status": "BLOCKED"
            }
        }
    )
    personal_details.update_one(
            {
                "account_id": account_id
            },
            {
                "$set": {
                    "status": "BLOCKED"
                }
            }
        )

    return {
        "Message": "Customer blocked successfully"
    }


# UNBLOCK CUSTOMER
@app.put("/customers/{account_id}/unblock")
def unblock_customer(account_id: int):

    customer = customers.find_one({
        "account_id": account_id
    })

    if customer is None:
        raise fastapi.HTTPException(
            status_code=404,
            detail="Customer ID not found"
        )

    customers.update_one(
        {
            "account_id": account_id
        },
        {
            "$set": {
                "status": "ACTIVE"
            }
        }
    )
    personal_details.update_one(
        {
            "account_id" : account_id
        },
        {
            "$set":{
                "status" : "ACTIVE"
            }
        }
    )

    return {
        "Message": "Customer unblocked successfully"
    }


# DEACTIVATE CUSTOMER


@app.delete("/customers/{account_id}/delete")
def deactivate_customer(account_id: int):

    customer = customers.find_one({
        "account_id": account_id
    })

    if customer is None:
        raise fastapi.HTTPException(
            status_code=404,
            detail="Customer ID not found"
        )

    customers.update_one(
        {
            "account_id": account_id
        },
        {
            "$set": {
                "status": "INACTIVE"
            }
        }
    )

    personal_details.update_one(
            {
                "account_id": account_id
            },
            {
            "$set": {
                "status": "INACTIVE"
            }
        }
    )
    
    return {
        "Message": "Customer account deactivated successfully"
    }




#================================================================================================================================
# PERSONAL DETAILS MODEL
#================================================================================================================================



class PersonalDetails(pydantic.BaseModel):
    account_id: int
    aadhaar_no: str
    address: str
    pincode: int


@app.post("/personal_details/post")
def create_personal_details(details: PersonalDetails):

    customer = customers.find_one({
        "account_id": details.account_id
    })

    if customer is None:
        raise fastapi.HTTPException(
            status_code=404,
            detail="Account ID not found"
        )

    existing_details = personal_details.find_one({
        "account_id": details.account_id
    })

    if existing_details:
        raise fastapi.HTTPException(
            status_code=409,
            detail="Personal details already exist for this account"
        )

    customer_status = customer.get(
        "status",
        "ACTIVE"
    )

    personal_data = details.model_dump()

    personal_data["status"] = customer_status

    result = personal_details.insert_one(
        personal_data
    )

    return {
        "Message": "Personal details created successfully",
        "id": str(result.inserted_id),
        "account_id": details.account_id,
        "status": customer_status
    }



@app.get("/personal_details/read")
def get_personal_details():

    active_personalDetails= personal_details.find({
        "status": "ACTIVE"
    }).sort(
        "account_id",1
    )

    result = []
    for details in active_personalDetails:

        details["_id"] = str(details["_id"])

        result.append(details)
    return result



# READ PERSONAL DETAILS BY ACCOUNT ID

@app.get("/personal_details/read/{account_id}")
def get_personal_details_by_account(account_id: int):

    details = personal_details.find_one({
        "account_id": account_id
    })

    if details is None:
        raise fastapi.HTTPException(
            status_code=404,
            detail="Personal details not found"
        )

    details["_id"] = str(details["_id"])

    return details


#To update the personal details in customer and personal details

@app.put("/personal_details/update/{account_id}")
def update_personal_details(
    account_id: int,
    details: PersonalDetails
):

    # Check customer exists
    customer = customers.find_one({
        "account_id": account_id
    })

    if customer is None:
        raise fastapi.HTTPException(
            status_code=404,
            detail="Account ID not found"
        )

    # Check personal details exist
    existing_details = personal_details.find_one({
        "account_id": account_id
    })

    if existing_details is None:
        raise fastapi.HTTPException(
            status_code=404,
            detail="Personal details not found"
        )

    # Update personal_details collection
    result = personal_details.update_one(
        {
            "account_id": account_id
        },
        {
            "$set": {
                "aadhaar_no": details.aadhaar_no,
                "address": details.address,
                "pincode": details.pincode,
            }
        }
    )
    return {
        "Message": "Personal details updated successfully"
    }


#===============================================================================================================================
#customer and personal details aggregation codes
#===============================================================================================================================

@app.get("/customer/personal_details/search")
def search_complete_customers(
    search: Optional[str] = None,
    account_type: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    try:
        match_query = {}

        # Search by name or account ID
        if search and search.strip():
            value = search.strip()

            conditions = [
                {
                    "name": {
                        "$regex": re.escape(value),
                        "$options": "i"
                    }
                }
            ]

            if value.isdigit():
                conditions.append({
                    "account_id": int(value)
                })

            match_query["$or"] = conditions

        # Account type filter
        if account_type:
            match_query["account_type"] = account_type

        # Status filter
        if status:
            match_query["status"] = status.upper()

        # Combine customer and personal details
        pipeline = [
            {
                "$lookup": {
                    "from": "personal_details",
                    "localField": "account_id",
                    "foreignField": "account_id",
                    "as": "personal"
                }
            },
            {
                "$unwind": "$personal"
            },
            {
                "$project": {
                    "_id": 0,
                    "account_id": 1,
                    "name": 1,
                    "age": 1,
                    "account_type": 1,
                    "balance": 1,
                    "status": 1,
                    "aadhaar_no": "$personal.aadhaar_no",
                    "address": "$personal.address",
                    "pincode": "$personal.pincode"
                }
            },
            {
                "$match": match_query
            },
            {
                "$sort": {"account_id": 1}
            }
        ]

        # Count matching records
        count_pipeline = pipeline + [
            {"$count": "total"}
        ]

        count_result = list(
            customers.aggregate(count_pipeline)
        )

        total = count_result[0]["total"] if count_result else 0

        # Pagination
        skip = (page - 1) * limit

        data_pipeline = pipeline + [
            {"$skip": skip},
            {"$limit": limit}
        ]

        result = list(
            customers.aggregate(data_pipeline)
        )

        return {
            "success": True,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit,
            "customers": result
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

    
@app.get("/customer/personal_details/active")
def get_all_active_customer_details():
    active_data = customers.aggregate([

        #Find only the Active customers
        {
            "$match" :{
                "status" : "ACTIVE"
            }
        },

        # join with personal_details using account_id
        {
            "$lookup" :{
                "from" : "personal_details",
                "localField" : "account_id",
                "foreignField": "account_id",
                "as" : "personal_details"
            }
        },
        #Convert the personal details array into an object
        {
            "$unwind": {
                "path" : "$personal_details",
                "preserveNullAndEmptyArrays": True
            }
        },

        #Select the fields we want to return
        {
            "$project":{
                "_id" : 0,
                "account_id" : 1,
                "name" : 1,
                "age" : 1,
                "account_type" : 1,
                "balance":1,
                "status" :1,

                "personal_details" :{
                    "aadhaar_no" :"$personal_details.aadhaar_no",
                    "address" : "$personal_details.address",
                    "pincode" : "$personal_details.pincode"
                }
            }
        },

        #Sort the data as per the account_id
        {
            "$sort":{
                "account_id":1
            }
        }
    ])

    #Displaying the data as an list format
    result = list(active_data)
    if not result:
        raise fastapi.HTTPException(
            status_code=404,
            detail="No ACTIVE customers found"
        )

    return result
    

#to get the customer and personal_details from the both collections through the matching account_id
@app.get("/customer/personal_details/read/{account_id}")
def get_complete_customer_details(account_id: int):

    customer_data = customers.aggregate([
        
        # Find the particular customer
        {
            "$match": {
                "account_id": account_id
            }
        },

        # Convert personal_details array into an object
        {
            "$unwind": {
                "path": "$personal_details",
                "preserveNullAndEmptyArrays": True
            }
        },

        # Join personal_details collection
        {
            "$lookup": {
                "from": "personal_details",
                "localField": "account_id",
                "foreignField": "account_id",
                "as": "personal_details"
            }
        },

        
        # Remove duplicate account_id and other unwanted fields
        {
            "$project": {
                "_id": 0,
                "account_id": 1,
                "name": 1,
                "age": 1,
                "account_type": 1,
                "balance": 1,
                "status": 1,

                "personal_details": {
                    "aadhaar_no": "$personal_details.aadhaar_no",
                    "address": "$personal_details.address",
                    "pincode": "$personal_details.pincode"
                }
            }
        },

        {
            "$sort":{
                "account_id":1
            }
        }
    ])

    result = list(customer_data)

    if not result:
        raise fastapi.HTTPException(
            status_code=404,
            detail="Customer ID not found"
        )

    return result[0]


#balance above the range
@app.get("/customer/personal_details/balance_above/{balance}")
def balance_above(balance : int):
    balance_data = customers.aggregate([
        {
            "$match" : {
                "status" : "ACTIVE",
                "balance" : {"$gte" : balance},
            }
        },
        # Convert personal_details array into an object
        {
            "$unwind": {
                "path": "$personal_details",
                "preserveNullAndEmptyArrays": True
            }
        },
        
                # Join personal_details collection
        {
            "$lookup": {
                "from": "personal_details",
                "localField": "account_id",
                "foreignField": "account_id",
                "as": "personal_details"
            }
        },
        
                
        # Remove duplicate account_id and other unwanted fields
        {
            "$project": {
                "_id": 0,
                "account_id": 1,
                "name": 1,
                "age": 1,
                "account_type": 1,
                "balance": 1,
                "status": 1,        
                "personal_details": {
                    "aadhaar_no": "$personal_details.aadhaar_no",
                    "address": "$personal_details.address",
                    "pincode": "$personal_details.pincode"
                }
            }
        },
        
        {
            "$sort":{
                "account_id":1
            }
        }
    ])
    result = list(balance_data)
    
    if not result:
        raise fastapi.HTTPException(
            status_code=404,
            detail="No active accounts"
        )
    
    return result


#balance below the range
@app.get("/customer/personal_details/balance_below/{balance}")
def balance_above(balance : float):
    balance_data = customers.aggregate([
        {
            "$match" : {
                "status" : "ACTIVE",
                "balance" : {"$lte" : balance},
            }
        },
        # Convert personal_details array into an object
        {
            "$unwind": {
                "path": "$personal_details",
                "preserveNullAndEmptyArrays": True
            }
        },
        
                # Join personal_details collection
        {
            "$lookup": {
                "from": "personal_details",
                "localField": "account_id",
                "foreignField": "account_id",
                "as": "personal_details"
            }
        },
        
                
        # Remove duplicate account_id and other unwanted fields
        {
            "$project": {
                "_id": 0,
                "account_id": 1,
                "name": 1,
                "age": 1,
                "account_type": 1,
                "balance": 1,
                "status": 1,        
                "personal_details": {
                    "aadhaar_no": "$personal_details.aadhaar_no",
                    "address": "$personal_details.address",
                    "pincode": "$personal_details.pincode"
                }
            }
        },
        
        {
            "$sort":{
                "account_id":1
            }
        }
    ])
    result = list(balance_data)
    
    if not result:
        raise fastapi.HTTPException(
            status_code=404,
            detail="No active accounts"
        )
    
    return result


#total bank balance 
@app.get("/customer/personal_details/bank_balance")
def banck_balance():
    bank_balance = customers.aggregate([
        {
            "$match" : {
                "status":"ACTIVE"
            }
        },
        {
            "$group" : {
                "_id" : None,
                "total_balance" :{
                    "$sum" : "$balance"
                }
            }
        }
    ])

    result = list (bank_balance)

    if not result :
        raise fastapi.HTTPException(
            status_code=404,
            detail= "No Active accounts in this bank"
        )
    return {
        "Message" : "Total balance of this bank" , 
        "total_bank_balance": result[0]["total_balance"]
    }



#Average balance in the bank
@app.get("/customer/personal_details/avg")
def average():
    avg_balance = customers.aggregate([
        {
            "$match" : {
                "status" : "ACTIVE"
            }
        },
        {
            "$group":{
                "_id" : None,
                "average_balance":{
                    "$avg" : "$balance"
                }
            }
        }
    ])

    result = list(avg_balance)
    if not result:
        raise fastapi.HTTPException(
            status_code= 404,
            detail= "there is no account in this bank"
        )
    return {
        "Message" : "The average amount availabe in this Bank",
        "Average_Amount : ":result[0]["average_balance"]
    }




#analysing the high_low of the account balance
@app.get("/customer/personal_details/high_low_balance")
def high_low_balance():
    high_low = customers.aggregate([
        {
            "$match" : {
                "status":"ACTIVE"
            }
        },
        {
            "$group" : {
                "_id" : None,
                "highest_balance" :{"$max":"$balance"},
                "lowest_balance" :{"$min":"$balance"}
            }
        }
    ])

    result = list(high_low)

    if not result:
        raise fastapi.HTTPException(
            status_code= 404,
            detail="there is no accounts in this bank"
        )
    return {
        "Message" : "The Highest and lowest bank balances are :",
        "Highest_balance" : result[0]["highest_balance"],
        "Lowest_balance" : result[0]["lowest_balance"]
    }



# counting the seperate accounts type
@app.get("/customer/personal_details/type_count")
def account_type_count():
    count = customers.aggregate([
        {
            "$match" :{
                "status" : "ACTIVE"
            }
        },
        {
            "$group":{
                "_id" : "$account_type",
                "total_account_type":{
                    "$sum" : 1
                }
            }
        },
        {
            "$sort":{
                "_id" :1
            }
        }
    ])

    result = list(count)
    if not result:
        raise fastapi.HTTPException(
            status_code= 404,
            detail= "There is no account"
        )
    return{
        "Message" : "The different types of account with it's count : ",
        "The account types" :[
            {
                "account_type" : item["_id"],
                "total_accounts" : item["total_account_type"]
            }
            for item in result
        ]
    }



#counting the customer account status
@app.get("/customer/personal_details/status_count")
def status_count():
    status_counting = customers.aggregate([
        {
            "$group" : {
                "_id" : "$status",
                "total" : {
                    "$sum" : 1
                }
            }
        },
        {
            "$sort" : {
                "_id" : 1
            }
        }
    ])

    result = list(status_counting)
    if not result:
        raise fastapi.HTTPException(
            status_code=404,
            detail= "there is no account defined"
        )
    return{
        "Message":"The Status counts are : ",
        "The status count" :[
            {
                "status" : item["_id"],
                "Count" : item["total"]
            }
            for item in result
        ]    
    }


#fetching top_5 high profile accounts
@app.get("/customer/personal_details/top_5")
def High_balance():
    high_profile = customers.aggregate([
        {
            "$match":{
                "status" : "ACTIVE"
            }
        },
        {
            "$sort":{
                "balance" : -1
            }
        },
        {
            "$limit" : 5
        },
        {
            "$project" : {
                "_id":0,
                "account_id":1,
                "name ": 1,
                "age":1,
                "account_type":1,
                "status":1,
                "balance":1
            }
        }
    ])

    result = list (high_profile)
    if not result:
        raise fastapi.HTTPException(
            status_code=404,
            detail="There is no high profile data's"
        )
    return {
        "Message":"The high profile accounts :",
        "High profile accounts" :len(result),
        "Customers" : result
    }



#to add the field category in the collection and project it 
@app.get("/customer/personal_details/category")
def category_updation():
    category = customers.aggregate([
        {
            "$match":{
                "status":"ACTIVE"
            }
        },
        {
            "$set":{
                "customer_catogory":{
                    "$cond":[
                        {"$gte":["balance",500000]},
                        "High_Balance",
                        "Normal_Balance"
                    ]
                }
            }
        },
        {
            "$project":{
                "_id":0,
                "name":1,
                "account_id":1,
                "age":1,
                "balance":1,
                "status":1,
                "customer_catogory":1
            }
        }
    ])

    result = list(category)
    if not result:
        raise fastapi.HTTPException(
            status_code=404,
            detail="The are no active customers"
        )
    return{
        "Message":"Customer balance categories",
        "Customers" : result
    }


#excel form download
@app.get("/customer/personal_details/download-excel")
def download_excel():
    customers_data = list(customers.find({},{"_id" : 0}))
    personal_data = list(personal_details.find({},{"_id":0}))

    customer_df = pd.DataFrame(customers_data)
    personal_df = pd.DataFrame(personal_data)

    #Merge using account_id
    if not personal_df.empty:
        final_df = pd.merge(
            customer_df,
            personal_df,
            on="account_id",
            how="left",
            suffixes=("", "_personal")
        )
    else:
        final_df = customer_df
    output = BytesIO()

    with pd.ExcelWriter(output, engine="openpyxl")as writer:
        final_df.to_excel(
            writer,
            index=False,
            sheet_name="Complete Data"
        )
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedovument.spreadsheetml.sheet",
        headers={
            "Content-Dispositon":"attachment; finlename = bank_complete_data.xlsx"
        }
    )

#Calling complete data's from the database
@app.get("/customer/personal_details/complete")
def get_complete_customers():

    result = list(
        customers.aggregate([
            {
                "$lookup": {
                    "from": "personal_details",
                    "localField": "account_id",
                    "foreignField": "account_id",
                    "as": "personal_details"
                }
            },
            {
                "$unwind": {
                    "path": "$personal_details",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "account_id": 1,
                    "name": 1,
                    "age": 1,
                    "account_type": 1,
                    "balance": 1,
                    "status": 1,

                    "aadhaar_no": "$personal_details.aadhaar_no",
                    "address": "$personal_details.address",
                    "pincode": "$personal_details.pincode"
                }
            },
            {
                "$sort": {
                    "account_id": 1
                }
            }
        ])
    )

    return result


#Creating the dashboard bar chart for balance check
@app.get("/dashboard/balance-range")
def balance_chart():
    pipeline = [
        {
            "$match":{
            "status" : "ACTIVE"
            }
        },
        {
            "$bucket" : {
                "groupBy" : "$balance",
                "boundaries" :[
                    0,
                    500,
                    1000,
                    10000,
                    100000,
                    float("inf")
                ],
                "default" : "OTHER",
                "output":{
                    "customer_count":{
                        "$sum":1
                    }
                }
            }
        }
    ]

    result = list(customers.aggregate(pipeline))

    return result


@app.get("/dashboard/summary")
def dashboard_summary():

    pipeline = [
        {
            "$match": {
                "status": "ACTIVE"
            }
        },
        {
            "$group": {
                "_id": None,
                "total_customers": {"$sum": 1},
                "total_balance": {"$sum": "$balance"},
                "average_balance": {"$avg": "$balance"}
            }
        }
    ]

    result = list(customers.aggregate(pipeline))

    if not result:
        return {
            "total_customers": 0,
            "total_balance": 0,
            "average_balance": 0
        }

    return {
        "total_customers": result[0]["total_customers"],
        "total_balance": result[0]["total_balance"],
        "average_balance": round(result[0]["average_balance"], 2)
    }


@app.get("/dashboard/account-type")
def dashboard_account_type():

    pipeline = [
        {
            "$match": {
                "status": "ACTIVE"
            }
        },
        {
            "$group": {
                "_id": "$account_type",
                "customer_count": {
                    "$sum": 1
                },
                "total_balance": {
                    "$sum": "$balance"
                }
            }
        },
        {
            "$sort": {
                "customer_count": -1
            }
        }
    ]

    result = list(customers.aggregate(pipeline))

    response = []

    for item in result:

        response.append({
            "account_type": item["_id"],
            "customer_count": item["customer_count"],
            "total_balance": item["total_balance"]
        })

    return response