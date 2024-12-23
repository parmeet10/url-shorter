# Use Node.js v23.0.0
FROM node:23.0.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code into the container
COPY . .

# Expose the port your app runs on (change 3000 if your app uses a different port)
EXPOSE 3000

# Set the command to start your application
CMD ["npm", "start"]

