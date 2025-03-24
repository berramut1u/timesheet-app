from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes import auth_bp, protected_bp
from flask_jwt_extended import JWTManager  
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

# Database ve JWT başlatma
db.init_app(app)
jwt = JWTManager(app)  
migrate = Migrate(app, db)

# Veritabanını oluştur
with app.app_context():
    db.create_all()

# Blueprintleri kaydet
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(protected_bp, url_prefix="/protected")

if __name__ == "__main__":
    app.run(debug=True)
