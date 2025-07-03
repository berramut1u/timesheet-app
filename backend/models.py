from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name  = db.Column(db.String(50), nullable=False)   # new
    last_name   = db.Column(db.String(50), nullable=False)   # new
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="Çalışan")

    timesheets = db.relationship('Timesheet', back_populates='user', lazy=True)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Timesheet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    project = db.Column(db.String(50), nullable=False)  
    hours = db.Column(db.Integer, nullable=False)  
    description = db.Column(db.String(255), nullable=True)
    date = db.Column(db.String(10), nullable=False)

    user = db.relationship('User', back_populates='timesheets')