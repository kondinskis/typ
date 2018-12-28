import xml.etree.ElementTree as ET
import urllib.request
from urllib.error import HTTPError
from trackyourpackage.errors import RecordNotFoundException


def create_tracking_data(tracking_data):
    return {
        'id': tracking_data.findtext('ID', '').strip(),
        'begin': tracking_data.findtext('Begining').strip(),
        'end': tracking_data.findtext('End').strip(),
        'date': tracking_data.findtext('Date').strip(),
        'note': tracking_data.findtext('Notice').strip()
    }


def get_tracking_details(tracking_number):

    tracking_details = []

    try:
        with urllib.request.urlopen('http://www.posta.com.mk/tnt/api/query?id={}'
                                    .format(tracking_number), timeout=5) as f:
            data = f.read().decode('utf-8')
            root = ET.fromstring(data)
            for data in root:
                tracking_details.append(create_tracking_data(data))
    except HTTPError:
        raise RecordNotFoundException('Unable to fetch tracking data')

    return tracking_details
