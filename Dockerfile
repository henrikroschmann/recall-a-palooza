# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files to the container
COPY . .

# Build your React application
RUN npm run build

# Expose the port your app will run on (typically 3000)
EXPOSE 3000

# Start your React app when the container starts
CMD ["npm", "start"]
