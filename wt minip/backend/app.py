import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from models import Feedback, User, db
from routes import admin_bp, auth_bp, feedback_bp
from routes.auth_routes import bcrypt


def create_app():
    app = Flask(__name__)
    base_dir = os.path.abspath(os.path.dirname(__file__))

    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(base_dir, 'feedback.db')}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "change-this-in-production")

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    bcrypt.init_app(app)
    JWTManager(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(feedback_bp)
    app.register_blueprint(admin_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"})

    with app.app_context():
        db.create_all()
        seed_sample_data()

    return app


def seed_sample_data():
    if User.query.first():
        return

    from routes.auth_routes import bcrypt

    admin = User(
        username="admin",
        password=bcrypt.generate_password_hash("admin123").decode("utf-8"),
        role="admin",
    )
    alice = User(
        username="alice",
        password=bcrypt.generate_password_hash("student123").decode("utf-8"),
        role="student",
    )
    brian = User(
        username="brian",
        password=bcrypt.generate_password_hash("student123").decode("utf-8"),
        role="student",
    )
    db.session.add_all([admin, alice, brian])
    db.session.flush()

    feedback_entries = [
        Feedback(
            student_id=alice.id,
            student_name="alice",
            course="Computer Networks",
            teacher="Dr. Mehta",
            rating=5,
            comment="Clear explanations and very engaging lectures.",
        ),
        Feedback(
            student_id=brian.id,
            student_name="Anonymous Student",
            course="Database Systems",
            teacher="Prof. Sharma",
            rating=4,
            comment="Helpful teacher, but some topics moved a bit fast.",
            anonymous=True,
        ),
        Feedback(
            student_id=alice.id,
            student_name="alice",
            course="Operating Systems",
            teacher="Dr. Iyer",
            rating=3,
            comment="Good content overall, though practical examples could be improved.",
        ),
    ]
    db.session.add_all(feedback_entries)
    db.session.commit()


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
