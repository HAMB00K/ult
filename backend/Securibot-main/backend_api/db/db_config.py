# Connect to the firebase database

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate(r"C:\Users\nassi\Downloads\Securibot-main\Securibot-main\backend_api\db\securibottest-firebase-adminsdk-fbsvc-73ca8983ca.json")

firebase_admin.initialize_app(cred)

db = firestore.client()

print("Connected to the firebase database")

exports = {"db": db}