# Use the official Node.js image as the base image
FROM node:18.19.1

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Install TypeScript and ts-node globally (in case it's not installed)
RUN npm install -g typescript ts-node

# Expose the application port
EXPOSE 3000

# Build TypeScript into JavaScript
RUN tsc

# Command to run your application (run the transpiled JavaScript file)
CMD ["node", "dist/app.js"]
