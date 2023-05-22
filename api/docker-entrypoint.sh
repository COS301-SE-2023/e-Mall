#!/bin/bash

echo "Flush the manage.py command if any"

while ! python manage.py flush --no-input 2>&1; do
  echo "Flusing django manage command"
  sleep 1
done

echo "Migrate the Database at startup of project"

# Wait for few minute and run db migraiton
while ! python manage.py makemigrations  2>&1; do
   echo "'makemigrations' is in progress status"
   sleep 1
done
# Wait for few minute and run db migraiton
while ! python manage.py migrate  2>&1; do
   echo "'migration' is in progress status"
   sleep 1
done

echo "Django is fully configured successfully."

exec "$@"