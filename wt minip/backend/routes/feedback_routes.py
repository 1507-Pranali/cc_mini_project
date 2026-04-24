from collections import Counter

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from models import Feedback, User, db


feedback_bp = Blueprint("feedback", __name__)


def build_feedback_summary(feedback_items):
    if not feedback_items:
        return "No feedback has been submitted yet."

    average_rating = sum(item.rating for item in feedback_items) / len(feedback_items)
    all_comments = " ".join(item.comment.lower() for item in feedback_items)

    if average_rating >= 4.2:
        sentiment = "Most students are highly satisfied with teaching quality."
    elif average_rating >= 3.3:
        sentiment = "Students are generally satisfied, with a few areas that could be improved."
    else:
        sentiment = "Students are highlighting several concerns that need attention."

    keyword_buckets = {
        "teaching quality": ["teaching", "explain", "clear", "concept", "understand"],
        "engagement": ["engaging", "interactive", "interesting", "participation"],
        "pace": ["fast", "slow", "pace"],
        "support": ["helpful", "supportive", "available", "guidance"],
    }

    matched_topics = [
        topic for topic, words in keyword_buckets.items() if any(word in all_comments for word in words)
    ]

    if matched_topics:
        return f"{sentiment} Common themes include {', '.join(matched_topics[:3])}."

    rating_counter = Counter(item.rating for item in feedback_items)
    dominant_rating = rating_counter.most_common(1)[0][0]
    return f"{sentiment} The most frequent rating is {dominant_rating} out of 5."


@feedback_bp.route("/api/feedback", methods=["POST"])
@jwt_required()
def submit_feedback():
    claims = get_jwt()
    if claims.get("role") != "student":
        return jsonify({"message": "Only students can submit feedback."}), 403

    data = request.get_json() or {}
    course = (data.get("course") or "").strip()
    teacher = (data.get("teacher") or "").strip()
    comment = (data.get("comment") or "").strip()
    anonymous = bool(data.get("anonymous", False))
    rating = data.get("rating")

    if not course or not teacher or not comment:
        return jsonify({"message": "Course, teacher, and comment are required."}), 400

    try:
        rating = int(rating)
    except (TypeError, ValueError):
        return jsonify({"message": "Rating must be a number between 1 and 5."}), 400

    if rating < 1 or rating > 5:
        return jsonify({"message": "Rating must be between 1 and 5."}), 400

    user = User.query.get(int(get_jwt_identity()))
    display_name = "Anonymous Student" if anonymous else user.username
    feedback = Feedback(
        student_id=user.id,
        student_name=display_name,
        course=course,
        teacher=teacher,
        rating=rating,
        comment=comment,
        anonymous=anonymous,
    )
    db.session.add(feedback)
    db.session.commit()

    return jsonify({"message": "Feedback submitted successfully.", "feedback": feedback.to_dict()}), 201


@feedback_bp.route("/api/feedback", methods=["GET"])
@jwt_required()
def get_feedback():
    claims = get_jwt()
    user_id = int(get_jwt_identity())

    if claims.get("role") == "admin":
        feedback_items = Feedback.query.order_by(Feedback.date.desc()).all()
    else:
        feedback_items = (
            Feedback.query.filter_by(student_id=user_id).order_by(Feedback.date.desc()).all()
        )

    return jsonify(
        {
            "feedback": [item.to_dict() for item in feedback_items],
            "summary": build_feedback_summary(feedback_items),
        }
    )
