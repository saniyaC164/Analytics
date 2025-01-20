from flask import Flask
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    from app import routes
    app.register_blueprint(routes.main)

    from app.dash_app import init_dashboard
    app = init_dashboard(app)

    return app