from flask import request
from trackyourpackage.errors import BadRequestException
from functools import wraps


def data_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not request.get_json():
            raise BadRequestException('Data is missing')
        return f(*args, **kwargs)
    return decorated
