import firebase_admin
from firebase_admin import credentials, messaging
import os
import json

def initialize_firebase():
    if not firebase_admin._apps:
        # Check if running on Railway (env var) or locally (file)
        firebase_credentials = os.getenv('FIREBASE_CREDENTIALS')
        
        if firebase_credentials:
            # Running on Railway — load from environment variable
            cred_dict = json.loads(firebase_credentials)
            cred = credentials.Certificate(cred_dict)
        else:
            # Running locally — load from file
            cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
            cred = credentials.Certificate(cred_path)
            
        firebase_admin.initialize_app(cred)

def send_push_notification(title, body, token=None):
    initialize_firebase()
    
    if token:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            token=token
        )
    else:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            topic='birthday_reminders'
        )

    try:
        response = messaging.send(message)
        print(f"Notification sent successfully: {response}")
        return response
    except Exception as e:
        print(f"Error sending notification: {e}")
        return None