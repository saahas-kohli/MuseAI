# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g nodemon

# Copy the backend code to the container
COPY . .

# Expose the port that the app runs on
EXPOSE 9000

# Command to run your application
CMD ["nodemon", "index"]