from flask import Blueprint, jsonify

bp = Blueprint('errors', __name__)


class BaseException(Exception):
    status_code = 400

    def __init__(self, message, status_code, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


class BadRequestException(BaseException):
    def __init__(self, message):
        super().__init__(message, 400)


class UnauthorizedException(BaseException):
    def __init__(self, message):
        super().__init__(message, 401)


class RecordNotFoundException(BaseException):
    def __init__(self, message):
        super().__init__(message, 404)


class ConflictException(BaseException):
    def __init__(self, message):
        super().__init__(message, 409)


@bp.app_errorhandler(BaseException)
def handle_error(error):
    return jsonify(error.to_dict()), error.status_code
