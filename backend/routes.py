from functools import wraps
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,                
)
from sqlalchemy import func    
from models import db, User, Timesheet

auth_bp = Blueprint("auth", __name__)
protected_bp = Blueprint("protected", __name__)
timesheet_bp = Blueprint("timesheet", __name__)
admin_bp = Blueprint("admin", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    first = data.get("first_name")
    last  = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "Çalışan")

    if not first or not last or not email or not password:
        return jsonify({"message": "Ad, soyad, email ve şifre zorunludur"}), 400

    if role not in ["Yönetici", "Çalışan"]:
        return jsonify({"message": "Geçersiz rol seçimi"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Bu email zaten kayıtlı"}), 400

    # Create the user
    new_user = User(first_name=first, last_name=last, email=email, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(
        identity=str(new_user.id),
        additional_claims={"role": new_user.role}
    )

    return jsonify({
        "message": "Kullanıcı başarıyla kaydedildi",
        "access_token": access_token,
        "role": new_user.role
    }), 201



@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Geçersiz e-posta veya şifre"}), 401

    access_token = create_access_token(
        identity=str(user.id),               
        additional_claims={"role": user.role}
    )


    return jsonify({
        "access_token": access_token,
        "role": user.role  
    }), 200


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
    identity = get_jwt_identity()
    user_id = identity["id"]  

    if not user:
        return jsonify({"message": "Kullanıcı bulunamadı"}), 404

    return jsonify({"id": user.id, "email": user.email}), 200

def require_admin(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()  
        if claims.get("role") != "Yönetici":
            return jsonify({"msg": "Yetkisiz işlem"}), 403
        return fn(*args, **kwargs)
    return wrapper

# 1) List all employees
@admin_bp.route("/users", methods=["GET"])
@require_admin
def admin_list_users():
    users = User.query.filter_by(role="Çalışan").all()
    return jsonify([{
      "id": u.id,
      "first_name": u.first_name,
      "last_name":  u.last_name,
      "email": u.email
    } for u in users]), 200


# 2) List timesheets
@admin_bp.route("/timesheets", methods=["GET", "OPTIONS"])
@cross_origin(origins="*", allow_headers=["Content-Type","Authorization"])
@require_admin
def admin_list_timesheets():
    user_id = request.args.get("user_id", type=int)
    query = Timesheet.query.join(User).filter(User.role=="Çalışan")
    if user_id:
        query = query.filter(Timesheet.user_id==user_id)
    sheets = query.order_by(Timesheet.date).all()
    return jsonify([{
        "id": t.id, "user_id": t.user_id, "project": t.project,
        "hours": t.hours, "date": str(t.date), "description": t.description
    } for t in sheets]), 200

# 3) Stats
@admin_bp.route("/stats", methods=["GET"])
@require_admin
def admin_stats():
    results = db.session.query(
       User.first_name, User.last_name,
       func.sum(Timesheet.hours).label("total_hours")
    ).join(Timesheet).filter(User.role=="Çalışan") \
     .group_by(User.id).all()

    return jsonify([{
      "name": f"{fn} {ln}",
      "total_hours": th
    } for fn, ln, th in results]), 200
