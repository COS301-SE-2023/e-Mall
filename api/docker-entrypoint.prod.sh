#!/bin/bash

python manage.py makemigrations
python manage.py migrate --no-input
python manage.py collectstatic --no-input

gunicorn api.wsgi:application --bind 0.0.0.0:3000 --daemon

nginx -g 'daemon off;'

exec "$@"
