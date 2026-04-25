from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Birthday(db.Model):
    __tablename__ = 'birthdays'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable = False)
    dob = db.Column(db.Date, nullable = False)


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'dob': self.dob.stfrftime('%Y-%m-%d')
        }