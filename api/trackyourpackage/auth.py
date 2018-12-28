from flask import Blueprint, request, jsonify
from functools import wraps
import uuid
from trackyourpackage.models import User
from trackyourpackage.errors import BadRequestException, \
    UnauthorizedException, ConflictException
from trackyourpackage.utils import data_required


bp = Blueprint('auth', __name__)


@bp.route('/auth/token', methods=['POST'])
@data_required
def login():
    req = request.get_json()

    username = req.get('username')
    password = req.get('password')

    if username is None or password is None:
        raise BadRequestException('username or password is missing')

    user = User.query.filter_by(username=username).first()

    if user is None:
        raise BadRequestException(
            'User with {} username doesn\'t exists'.format(username))

    if user.verify_password(password):
        return jsonify(user.generate_token())

    raise BadRequestException('Wrong username or password')


@bp.route('/auth/register', methods=['POST'])
@data_required
def register():
    req = request.get_json()
    username = req.get('username')
    password = req.get('password')

    if username is None or password is None:
        raise BadRequestException('username or password missing')

    if User.query.filter_by(username=username).first() is not None:
        raise ConflictException(
            'User with {} username already exists'.format(username))

    user = User(username=username, public_id=uuid.uuid4())
    user.hash_password(password)
    user.save()

    res = user.generate_token()
    return jsonify(res), 201


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        auth_header = request.headers.get('Authorization', None)

        if auth_header:
            token = auth_header.split(' ')[1]

        if token is None:
            raise UnauthorizedException('Token is missing')

        user = User.verify_token(token)

        if not user:
            raise UnauthorizedException('Invalid token')

        return f(user, *args, **kwargs)
    return decorated
