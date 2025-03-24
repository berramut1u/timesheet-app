from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Timesheet
from datetime import datetime

timesheet_bp = Blueprint("timesheet", __name__)

@timesheet_bp.route("/add", methods=["POST"])
@jwt_required()
def add_timesheet():
    data = request.get_json()
    user_id = get_jwt_identity()["id"]
    
    project = data.get("project")
    hours = data.get("hours")
    description = data.get("description", "")
    date = data.get("date")

    if project not in ["Firma A", "Firma B", "Firma C", "Internal", "Resmî Tatil", "İzin"]:
        return jsonify({"message": "Geçersiz proje seçimi"}), 400
    if not (1 <= hours <= 8):
        return jsonify({"message": "Mesai süresi 1-8 saat arasında olmalıdır"}), 400

    new_entry = Timesheet(user_id=user_id, project=project, hours=hours, description=description, date=date)
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({"message": "Timesheet kaydı başarıyla eklendi"}), 201

# Get timesheets for the logged-in user
@timesheet_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_timesheets():
    user_id = get_jwt_identity()["id"]
    timesheets = Timesheet.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": t.id, "project": t.project, "hours": t.hours, "description": t.description, "date": str(t.date)
    } for t in timesheets])

# Edit a timesheet entry
@timesheet_bp.route("/edit/<int:id>", methods=["PUT"])
@jwt_required()
def edit_timesheet(id):
    user_id = get_jwt_identity()["id"]
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
    user_id = get_jwt_identity()["id"]
    timesheet = Timesheet.query.get(id)
    if not timesheet or timesheet.user_id != user_id:
        return jsonify({"message": "Yetkisiz işlem"}), 403

    db.session.delete(timesheet)
    db.session.commit()
    return jsonify({"message": "Timesheet başarıyla silindi"})