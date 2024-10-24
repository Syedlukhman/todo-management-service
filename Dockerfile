# 1. Use an official Node.js runtime as the parent image
FROM node:18-alpine

# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy package.json and package-lock.json to install dependencies separately
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the entire project into the container
COPY . .

# 6. Build the TypeScript code
RUN npm run build

# 7. Expose the port your app will run on
EXPOSE 9000

# 8. Use the 'npm start' command defined in package.json
CMD ["npm", "start"]