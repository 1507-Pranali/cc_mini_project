from .admin_routes import admin_bp
from .auth_routes import auth_bp
from .feedback_routes import feedback_bp

__all__ = ["auth_bp", "feedback_bp", "admin_bp"]
