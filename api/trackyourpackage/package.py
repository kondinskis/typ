from flask import Blueprint, request, jsonify
from trackyourpackage.models import Package
from trackyourpackage.auth import token_required
from trackyourpackage.posta_api import get_tracking_details
from trackyourpackage.errors import BadRequestException, \
    RecordNotFoundException
from trackyourpackage.utils import data_required

bp = Blueprint('package', __name__)


@bp.route('/packages', methods=['POST'])
@data_required
@token_required
def create_package(user):
    request_package = request.get_json()

    if request_package.get('name') is None:
        raise BadRequestException('name is missing.')
    if request_package.get('trackingNumber') is None:
        raise BadRequestException('trackingNumber is missing')

    package = Package(
        name=request_package.get('name'),
        trackingNumber=request_package.get('trackingNumber'),
        user_id=user.id
    )

    package.save()

    return jsonify(), 201


@bp.route('/packages/<int:package_id>', methods=['PUT'])
@data_required
@token_required
def update_package(user, package_id):
    request_package = request.get_json()

    if request_package.get('name') is None:
        raise BadRequestException('name is missing.')
    if request_package.get('trackingNumber') is None:
        raise BadRequestException('trackingNumber is missing')

    package = Package(
        name=request_package.get('name'),
        trackingNumber=request_package.get('trackingNumber'),
        user_id=user.id
    )

    package = Package.query.filter_by(
        id=package_id).first()
    if package is None:
        raise BadRequestException(
            'Package with {} id is not found'.format(package_id))
    package.name = request_package.get('name')
    package.trackingNumber = request_package.get('trackingNumber')
    package.update()

    return jsonify(), 204


@bp.route('/packages/<int:package_id>', methods=['GET'])
@token_required
def get_package(user, package_id):

    package = Package.query.filter_by(id=package_id, user_id=user.id).first()

    if package is None:
        raise RecordNotFoundException('Package doesn\'t exists')

    package = package.as_dict()

    package['tracking_details'] = get_tracking_details(
        package.get('trackingNumber'))

    return jsonify(package)


@bp.route('/packages', methods=['GET'])
@token_required
def get_packages(user):
    packages = [p.as_dict()
                for p in Package.query.filter_by(user_id=user.id)]

    return jsonify(packages)


@bp.route('/packages/<int:package_id>', methods=['DELETE'])
@token_required
def delete_package(user, package_id):

    package = Package.query.filter_by(id=package_id, user_id=user.id).first()

    if package is None:
        raise RecordNotFoundException('Package doesn\'t exists')

    package.delete()

    return jsonify(), 204
