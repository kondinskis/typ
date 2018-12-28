from flask import current_app
import jwt
from jwt.exceptions import InvalidTokenError
import datetime
from passlib.hash import bcrypt
from trackyourpackage import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    username = db.Column(db.String(32), index=True)
    password = db.Column(db.String(128))
    packages = db.relationship('Package', backref='users', lazy=True)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def hash_password(self, password):
        self.password = bcrypt.hash(password)

    def verify_password(self, password):
        return bcrypt.verify(password, self.password)

    def generate_token(self, expiration=60 * 24):
        payload = {
            'user_id': self.id,
            'exp': datetime.datetime.utcnow() +
            datetime.timedelta(minutes=expiration)
        }
        token = jwt.encode(
            payload, current_app.config['SECRET_KEY'], algorithm='HS256')
        return {'token': token.decode('UTF-8')}

    @staticmethod
    def verify_token(token):
        try:
            data = jwt.decode(
                token, current_app.config['SECRET_KEY'], algorithm='HS256')
        except InvalidTokenError:
            return None

        user = User.query.get(data['user_id'])
        return user


class Package(db.Model):
    __tablename__ = 'packages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    trackingNumber = db.Column(db.String(80))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return '<Package {}'.format(self.name)
