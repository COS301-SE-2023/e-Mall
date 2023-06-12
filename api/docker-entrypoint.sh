#!/bin/bash

# echo "Waiting for db.."
# python manage.py check --database default > /dev/null 2> /dev/null
# until [ $? -eq 0 ];
# do
#   sleep 2
#   python manage.py check --database default > /dev/null 2> /dev/null
# done
# echo "Connected."

# echo "Reset the database"
# #reset db
# while ! python manage.py reset_db --noinput 2>&1; do
#   echo "Resetting the database"
#   sleep 1
# done
echo "Flush the database record"
#reset db
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
