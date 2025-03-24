import os
from dotenv import load_dotenv

# .env dosyasındaki değişkenleri yükle
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "110604")
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:110604@localhost/timesheet"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "2576")  # JWT için anahtar

