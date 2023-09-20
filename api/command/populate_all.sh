#!/bin/bash

python manage.py populateproducts
python manage.py populatesellers
python manage.py populateproductsellers
python manage.py populateconsumers
python manage.py populateanalytics