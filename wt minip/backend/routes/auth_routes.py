from flask import Blueprint, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token

from models import User, db


auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()


def validate_auth_payload(data, require_role=False):
    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()
    role = (data.get("role") or "student").strip().lower()

    if not username or not password:
        return None, "Username and password are required."

    if require_role and role not in {"student", "admin"}:
        return None, "Role must be student or admin."

    return {"username": username, "password": password, "role": role}, None


@auth_bp.route("/api/register", methods=["POST"])
def register():
    payload, error = validate_auth_payload(request.get_json() or {}, require_role=True)
    if error:
        return jsonify({"message": error}), 400

    if payload["role"] != "student":
        return jsonify({"message": "Only student registration is allowed."}), 403

    existing_user = User.query.filter_by(username=payload["username"]).first()
    if existing_user:
        return jsonify({"message": "Username already exists."}), 409

    hashed_password = bcrypt.generate_password_hash(payload["password"]).decode("utf-8")
    user = User(username=payload["username"], password=hashed_password, role="student")
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    return (
        jsonify(
            {
                "message": "Registration successful.",
                "token": token,
                "user": user.to_dict(),
            }
        ),
        201,
    )


@auth_bp.route("/api/login", methods=["POST"])
def login():
    payload, error = validate_auth_payload(request.get_json() or {})
    if error:
        return jsonify({"message": error}), 400

    user = User.query.filter_by(username=payload["username"]).first()
    if not user or not bcrypt.check_password_hash(user.password, payload["password"]):
        return jsonify({"message": "Invalid username or password."}), 401

    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    return jsonify(
        {
            "message": "Login successful.",
            "token": token,
            "user": user.to_dict(),
        }
    )
