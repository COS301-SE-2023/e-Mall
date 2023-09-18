#!/bin/bash
echo "Reset the database"
python manage.py reset_db --noinput

echo "Flush the database record"
python manage.py flush --no-input

python manage.py makemigrations
python manage.py migrate --no-input
python manage.py collectstatic --no-input

bash /command/populate_all.sh

gunicorn api.wsgi:application --bind 0.0.0.0:3000 --daemon

nginx -g 'daemon off;'
#run celery
celery -A api.celery worker --loglevel=info

exec "$@"
