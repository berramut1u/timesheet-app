from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Timesheet
from datetime import datetime

timesheet_bp = Blueprint("timesheet", __name__)

@timesheet_bp.route("/add", methods=["POST"])
@jwt_required()
def add_timesheet():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Hatalı JSON formatı, boş veri alındı!"}), 400

    user_id = int(get_jwt_identity())

    project = data.get("project")
    hours = data.get("hours")
    description = data.get("description", "")
    date = data.get("date")

    if not isinstance(project, str):
        return jsonify({"message": "Project must be a string"}), 400
    if not isinstance(hours, int):
        return jsonify({"message": "Hours must be an integer"}), 400
    if not isinstance(description, str):
        return jsonify({"message": "Description must be a string"}), 400
    if not isinstance(date, str):
        return jsonify({"message": "Date must be a string"}), 400

    valid_projects = ["Firma A", "Firma B", "Firma C", "Internal", "Resmî Tatil", "İzin"]
    if project not in valid_projects:
        return jsonify({"message": "Geçersiz proje seçimi"}), 400
    if not (1 <= hours <= 8):
        return jsonify({"message": "Mesai süresi 1-8 saat arasında olmalıdır"}), 400

    try:
        new_entry = Timesheet(user_id=user_id, project=project, hours=hours, description=description, date=date)
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({"message": "Timesheet kaydı başarıyla eklendi"}), 201
    except Exception as e:
        print("⚠️ Hata:", str(e))  
        return jsonify({"message": "Sunucu hatası, kaydedilemedi."}), 500


@timesheet_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_timesheets():
    raw_identity = get_jwt_identity()
    try:
        user_id = int(raw_identity)
    except Exception as e:
        print("❌ [ERROR] converting identity to int:", e)
        return jsonify({"message": "Invalid token identity"}), 400

    timesheets = Timesheet.query.filter_by(user_id=user_id).all()

    return jsonify([{
        "id": t.id,
        "project": t.project,
        "hours": t.hours,
        "description": t.description,
        "date": str(t.date)
    } for t in timesheets]), 200


# Edit a timesheet entry
@timesheet_bp.route("/edit/<int:id>", methods=["PUT"])
@jwt_required()
def edit_timesheet(id):
    user_id = int(get_jwt_identity())

    timesheet = Timesheet.query.get(id)
    if not timesheet or timesheet.user_id != user_id:
        return jsonify({"message": "Yetkisiz işlem"}), 403

    data = request.get_json()
    timesheet.project = data.get("project", timesheet.project)
    timesheet.hours = data.get("hours", timesheet.hours)
    timesheet.description = data.get("description", timesheet.description)
    timesheet.date = data.get("date", timesheet.date)

    db.session.commit()
    return jsonify({"message": "Timesheet başarıyla güncellendi"})

# Delete a timesheet entry
@timesheet_bp.route("/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_timesheet(id):
    user_id = int(get_jwt_identity())

    timesheet = Timesheet.query.get(id)
    if not timesheet or timesheet.user_id != user_id:
        return jsonify({"message": "Yetkisiz işlem"}), 403

    db.session.delete(timesheet)
    db.session.commit()
    return jsonify({"message": "Timesheet başarıyla silindi"})