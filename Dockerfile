# # Use an official Node.js runtime as the base image
# FROM node:14

# # Set the working directory in the container
# WORKDIR /app

# # Copy package.json and package-lock.json to the container
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy all application files to the container
# COPY . .

# # Build your React application
# RUN npm run build

# # Set the working directory in the container for backend
# WORKDIR /app/backend

# # Install backend dependencies
# RUN npm install

# # Expose the port your app will run on (typically 3000)
# EXPOSE 8081
# EXPOSE 4000

# # Start your React app when the container starts
# CMD ["sh", "-c", "cd /app && npm run preview & cd /app/backend && npm start"]

# FRONTEND
FROM node:14 as frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8081
CMD ["npm", "run", "preview"]

# BACKEND
FROM node:14 as backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
EXPOSE 3066
CMD ["npm", "start"]
