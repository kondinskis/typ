from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from trackyourpackage.config import Config


db = SQLAlchemy()
cors = CORS()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    cors.init_app(app)

    from . import errors, auth, package
    app.register_blueprint(errors.bp)
    app.register_blueprint(auth.bp, url_prefix='/api')
    app.register_blueprint(package.bp, url_prefix='/api')

    return app


application = create_app()
