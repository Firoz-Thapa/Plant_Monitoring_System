# Use Node.js base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the backend port (e.g., 5000)
EXPOSE 5000

# Command to start the backend server
CMD ["node", "server.js"]
