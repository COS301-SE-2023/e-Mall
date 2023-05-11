# Use an official Python runtime as the base image
FROM python:latest

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container to /api

WORKDIR /api

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install the project's dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt 
# && export DJANGO_SETTINGS_MODULE=api.settings


# Copy the rest of the project files into the container
COPY . .

# Expose port 8000 for the Django development server
EXPOSE 8000
# RUN python manage.py migrate
# Start the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:3000"]

# FROM python:3.11

# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1
# WORKDIR /api

# RUN pip install --upgrade pip
# COPY requirements.txt /api/
# RUN pip install -r requirements.txt

# COPY . /api/

# # EXPOSE 8000
