from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User


auth_bp = Blueprint("auth", __name__)
protected_bp = Blueprint("protected", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email ve şifre zorunludur"}), 400

    # Kullanıcı zaten var mı kontrol et
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Bu email zaten kayıtlı"}), 400

    # Yeni kullanıcı oluştur
    new_user = User(email=email)
    new_user.set_password(password)  # Şifreyi hashle
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Kullanıcı başarıyla kaydedildi"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Geçersiz e-posta veya şifre"}), 401

    # Kullanıcıya JWT Token oluştur
    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token}), 200

# JWT ile Korunan Dashboard Endpointi
@protected_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    current_user_id = get_jwt_identity()  # JWT içindeki kullanıcı ID'sini al
    return jsonify({"message": f"Merhaba Kullanıcı {current_user_id}, bu senin dashboard sayfan!"}), 200

# Kullanıcı Bilgilerini Getiren Endpoint
@protected_bp.route("/me", methods=["GET"])
@jwt_required()
def get_user_info():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Kullanıcı bulunamadı"}), 404

    return jsonify({"id": user.id, "email": user.email}), 200