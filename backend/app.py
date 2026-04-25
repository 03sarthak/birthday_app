from flask import Flask, request, jsonify
from models import db, Birthday
from scheduler import start_scheduler
from datetime import datetime
import os

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///birthdays.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


with app.app_context():
    db.create_all()
    start_scheuduler(app)



@app.route('/birthdays', methods = ['GET'])
def get_birthdays():
    birthdays = Birthday.query.all()

    return jsonify([birthday.to_dict() for birthday in birthdays]), 200


@app.route('birthdays/<int:id>', methods = ['GET'])
def get_birthday(id):
    birthday = Birthday.query.get_or_404(id)

    return jsonify(birthday.to_dict()), 200


@app.route('/birthdays', methods = ['POST'])
def add_birthday():
    data = request.get_json()

    if not data or 'name' not in data or 'dob' not in data:
        return jsonify({'error': 'Name and date of birth are required'}), 400
    
    try:
        dob = datetime.strptime(data['dob'], '%Y-%m-%d').date()
    
    except ValueError:
        return jsonify({'error': 'Invalid date format, use YYYY-MM-DD'}), 400
    

    birthday = Birthday(name = data['name'], dob = dob)
    db.session.add(birthday)
    db.session.commit()

    return jsonify(birthday.to_dict()), 201


@app.route('/birthdays/<int:id>', methods = ['PUT'])
def update_birthday(id):
    birthday = Birthday.query.get_or_404(id)
    data = request.get_json()

    if 'name' in data:
        birthday.name = data['name']

    if 'dob' in data:
        try:
            birthday.dob = datetime.strptime(data['dob'], '%Y-%m-%d').date()
        
        except ValueError:
            return jsonify({'error': "Invalid date format, use YYYY-MM-DD"}), 400
    
    db.session.commit()

    return jsonify(birthday.to_dict()), 200


@app.route('/birthdays/<int:id>', methods = ['DELETE'])
def delete_birthday(id):
    birthday = Birthday.query.get_or_404(id)
    db.session.delete(birthday)
    db.session.commit()

    return jsonify({'message': f'{birthday.name} deleted successfully'}), 200



if __name__ == '__main__':
    app.run(debug = True, host = '0.0.0.0', port = 5000)