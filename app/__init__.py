from flask import Flask
from flask_cors import CORS
from config import Config
from app.dash.dash_app import init_dashboard  # Main dashboard
from app.dash.mba import create_mba_dashboard  # MBA dashboard

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for React frontend
    CORS(app, origins=['http://localhost:3000'])

    from app.routes import main
    from app.api.routes import api
    app.register_blueprint(main)
    app.register_blueprint(api)

    # Initialize Dash apps
    init_dashboard(app)
    create_mba_dashboard(app)

    return app