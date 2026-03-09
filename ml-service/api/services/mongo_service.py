from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

db = client["test"]
collection = db["reports"]

def get_report_by_id(report_id: str):

    print("Searching for ID:", report_id)

    report = collection.find_one({"_id": ObjectId(report_id)})

    print("Mongo result:", report)

    return report