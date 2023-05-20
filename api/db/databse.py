import psycopg2
engine = psycopg2.connect(
    database="postgres",
    user="my_user_name",
    password="abc123def345",
    host="my-rds-table-name.123456.us-east-1.rds.amazonaws.com",
    port='5432'
)