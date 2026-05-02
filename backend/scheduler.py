from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date
from models import Birthday
from notifications import send_push_notification
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_birthdays(app):
    with app.app_context():
        logger.info("Running birthday check...")
        today = date.today()
        birthdays = Birthday.query.all()

        for birthday in birthdays:
            next_birthday = birthday.dob.replace(year=today.year)

            if next_birthday < today:
                next_birthday = next_birthday.replace(year=today.year + 1)

            days_until = (next_birthday - today).days

            if days_until == 14:
                send_push_notification(
                    title="🎂 Birthday Reminder!",
                    body=f"{birthday.name}'s birthday is in 2 weeks!"
                )
            elif days_until == 7:
                send_push_notification(
                    title="🎂 Birthday Reminder!",
                    body=f"{birthday.name}'s birthday is in 1 week!"
                )
            elif days_until == 3:
                send_push_notification(
                    title="🎂 Birthday Reminder!",
                    body=f"{birthday.name}'s birthday is in 3 days!"
                )
            elif days_until == 1:
                send_push_notification(
                    title="🎂 Birthday Reminder!",
                    body=f"{birthday.name}'s birthday is tomorrow!"
                )
            elif days_until == 0:
                send_push_notification(
                    title="🎉 Happy Birthday!",
                    body=f"Today is {birthday.name}'s birthday!"
                )

def start_scheduler(app):
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=check_birthdays,
        args=[app],
        trigger='cron',
        hour=9,
        minute=0
    )
    scheduler.start()
    logger.info("Scheduler started successfully!")