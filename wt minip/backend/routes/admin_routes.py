import csv
import io
from collections import Counter

from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required
from sqlalchemy import func

from models import Feedback, db
from routes.feedback_routes import build_feedback_summary


admin_bp = Blueprint("admin", __name__)


def admin_required():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"message": "Admin access required."}), 403
    return None


def serialize_dashboard(filters):
    query = Feedback.query

    if filters.get("course"):
        query = query.filter(Feedback.course.ilike(f"%{filters['course']}%"))
    if filters.get("teacher"):
        query = query.filter(Feedback.teacher.ilike(f"%{filters['teacher']}%"))
    if filters.get("rating"):
        query = query.filter(Feedback.rating == int(filters["rating"]))

    feedback_items = query.order_by(Feedback.date.desc()).all()
    filtered_subquery = query.subquery()

    teacher_avg_rows = (
        db.session.query(filtered_subquery.c.teacher, func.avg(filtered_subquery.c.rating))
        .group_by(filtered_subquery.c.teacher)
        .all()
    )
    course_avg_rows = (
        db.session.query(filtered_subquery.c.course, func.avg(filtered_subquery.c.rating))
        .group_by(filtered_subquery.c.course)
        .all()
    )
    rating_distribution = Counter(item.rating for item in feedback_items)

    return {
        "feedback": [item.to_dict() for item in feedback_items],
        "stats": {
            "total_feedback": len(feedback_items),
            "teacher_average_ratings": [
                {"teacher": teacher, "average_rating": round(avg_rating, 2)}
                for teacher, avg_rating in teacher_avg_rows
            ],
            "course_average_ratings": [
                {"course": course, "average_rating": round(avg_rating, 2)}
                for course, avg_rating in course_avg_rows
            ],
            "rating_distribution": [
                {"rating": rating, "count": rating_distribution.get(rating, 0)}
                for rating in range(1, 6)
            ],
            "summary": build_feedback_summary(feedback_items),
        },
    }


@admin_bp.route("/api/admin/feedback", methods=["GET"])
@jwt_required()
def get_admin_feedback():
    guard = admin_required()
    if guard:
        return guard

    filters = {
        "course": (request.args.get("course") or "").strip(),
        "teacher": (request.args.get("teacher") or "").strip(),
        "rating": (request.args.get("rating") or "").strip(),
    }
    return jsonify(serialize_dashboard(filters))


@admin_bp.route("/api/admin/delete/<int:feedback_id>", methods=["DELETE"])
@jwt_required()
def delete_feedback(feedback_id):
    guard = admin_required()
    if guard:
        return guard

    feedback = Feedback.query.get_or_404(feedback_id)
    db.session.delete(feedback)
    db.session.commit()
    return jsonify({"message": "Feedback deleted successfully."})


@admin_bp.route("/api/admin/export", methods=["GET"])
@jwt_required()
def export_feedback():
    guard = admin_required()
    if guard:
        return guard

    feedback_items = Feedback.query.order_by(Feedback.date.desc()).all()
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["ID", "Student", "Course", "Teacher", "Rating", "Comment", "Anonymous", "Date"])
    for item in feedback_items:
        writer.writerow(
            [
                item.id,
                item.student_name,
                item.course,
                item.teacher,
                item.rating,
                item.comment,
                item.anonymous,
                item.date.isoformat(),
            ]
        )

    return Response(
        buffer.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=feedback_export.csv"},
    )
