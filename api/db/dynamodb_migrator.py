import boto3 

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

def create_devices_table():
    # if not dynamodb:
    #     dynamodb = boto3.resource(
    #         # 'dynamodb', endpoint_url=DATABASE, region_name=AWS_REGION)
    #         'dynamodb', endpoint_url=env('DATABASE'), region_name=env('AWS_REGION'), aws_access_key_id=env('AWS_ACCESS_KEY'), aws_secret_access_key=env('AWS_SECRET_KEY')) 
    # Table defination
    table = dynamodb.create_table(
        TableName='Devicess',
        KeySchema=[
            {
                'AttributeName': 'device_id',
                'KeyType': 'HASH'  # Partition key
            },
            {
                'AttributeName': 'datacount',
                'KeyType': 'RANGE'  # Sort key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'device_id',
                # AttributeType defines the data type. 'S' is string type and 'N' is number type
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'datacount',
                'AttributeType': 'N'
            },
        ],
        ProvisionedThroughput={
            # ReadCapacityUnits set to 10 strongly consistent reads per second
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10  # WriteCapacityUnits set to 10 writes per second
        }
    )
    return table


if __name__ == '__main__':
    print('DATABASE: '+ env('DATABASE'))
    # print(api.settings.DATABASE)
    device_table = create_devices_table()
    # Print tablle status
    print("Status:", device_table.table_status)
