# FRONTEND
FROM node:14 as frontend
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# BACKEND
FROM node:14 as backend
WORKDIR /app/backend
# Copy the frontend build artifacts
COPY --from=frontend /app/frontend/ /app/frontend/

COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
EXPOSE 3066
CMD ["npm", "start"]
