import json  # module for converting Python objects to JSON
# decimal module support correctly-rounded decimal floating point arithmetic.
from decimal import Decimal
import boto3  # import Boto3
# import api
from pathlib import Path
from environ import Env

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# env settings
env = Env()
env_path = BASE_DIR/"api/.env"
if env_path.exists():
    with env_path.open("rt", encoding="utf8") as f:
        env.read_env(f, overwrite=True)
dynamodb = boto3.resource(
    # 'dynamodb', endpoint_url=DATABASE, region_name=AWS_REGION)
    'dynamodb', endpoint_url=env('DATABASE'), region_name=env('AWS_REGION'), aws_access_key_id=env('AWS_ACCESS_KEY'), aws_secret_access_key=env('AWS_SECRET_KEY'))


def load_data(devices):
    # dynamodb = boto3.resource(
    #     'dynamodb', endpoint_url=DATABASE, region_name=AWS_REGION)
    # # 'dynamodb', endpoint_url=DATABASE, region_name=AWS_REGION, aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)

    devices_table = dynamodb.Table('Devices')
    # Loop through all the items and load each
    for device in devices:
        device_id = (device['device_id'])
        datacount = device['datacount']
        # Print device info
        print("Loading Devices Data:", device_id, datacount)
        devices_table.put_item(Item=device)


if __name__ == '__main__':
    # open file and read all the data in it
    with open("data/data.json") as json_file:
        device_list = json.load(json_file, parse_float=Decimal)
    load_data(device_list)
