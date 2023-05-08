# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install the Angular CLI and the project's dependencies
RUN npm install -g @angular/cli && npm install

# Copy the rest of the project files into the container
COPY . .

# Expose port 4200 for the Angular development server
EXPOSE 4200

# Start the Angular development server
CMD ["ng", "serve", "--host", "0.0.0.0","--poll=500"]