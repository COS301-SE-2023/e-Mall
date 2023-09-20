#!/bin/bash

#reset db
# echo "Reset the database"
# python manage.py reset_db --noinput

# echo "Flush the database record"
# python manage.py flush --no-input


echo "Migrate the Database at startup of project"
python manage.py makemigrations
python manage.py migrate

# dont use below commented lines
# echo "Reset the database"
# #reset db
# while ! python manage.py reset_db --noinput 2>&1; do
#   echo "Resetting the database"
#   sleep 1
# done
# echo "Flush the database record"
# #reset db
# while ! python manage.py flush --no-input 2>&1; do
#   echo "Flusing django manage command"
#   sleep 1
# done

# echo "Migrate the Database at startup of project"

# # Wait for few minute and run db migraiton
# while ! python manage.py makemigrations  2>&1; do
#    echo "'makemigrations' is in progress status"
#    sleep 1
# done
# # Wait for few minute and run db migraiton
# while ! python manage.py migrate  2>&1; do
#    echo "'migration' is in progress status"
#    sleep 1
# done

echo "Django is fully configured successfully."
celery -A api.celery worker --loglevel=info &
exec "$@"
