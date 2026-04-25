import firebase_admin
from firebase_admin import credentials, messaging
import os

# Initialize Firebase Admin SDK
def initialize_firebase():
    cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
    
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

def send_push_notification(title, body, token=None):
    initialize_firebase()
    
    # If no specific token, send to all devices (topic based)
    if token:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            token=token
        )
    else:
        # Send to all subscribed devices via topic
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