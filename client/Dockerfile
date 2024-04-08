# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy client code, including package.json & package-lock.json to the container
COPY . .

# Install dependencies
RUN npm install

# Expose the port that the app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]