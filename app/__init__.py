from flask import Flask
from flask_cors import CORS
from flask_caching import Cache
from config import Config
from app.dash.dash_app import init_dashboard
from app.dash.mba import create_mba_dashboard
from app.api.improved_routes import register_improved_routes

# Initialize extensions
cache = Cache()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app, origins=['http://localhost:3000'])
    cache.init_app(app, config={'CACHE_TYPE': 'simple'})
    
    # Register blueprints
    from app.routes import main
    from app.api.routes import api
    app.register_blueprint(main)
    app.register_blueprint(api)
    
    # Register improved routes
    register_improved_routes(app)
    
    # Initialize Dash apps
    init_dashboard(app)
    create_mba_dashboard(app)
    
    return app