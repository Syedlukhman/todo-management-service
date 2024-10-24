# To-Do Application API

A simple REST API for managing To-Dos, built with TypeScript and Express. This API allows clients to create, read, update, and delete To-Dos, ensuring that each client can only access their own data.

## Table of Contents

- [Technologies](#technologies)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)

## Technologies

- **Node.js**: Server-side JavaScript runtime
- **Express**: Web framework for building APIs
- **TypeScript**: Superset of JavaScript for static typing
- **MongoDB**: NoSQL database for persistent data storage
- **Mongoose**: ODM for MongoDB
- **Lodash**: Utility library for easier manipulation of arrays and objects
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing
- **http-status**: Library for managing HTTP status codes

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Syedlukhman/todo-management-service.git
   cd your_repository_name
   ```

2. Install Dependencies:
   cd <your-repo-name>
   npm install

To run the application there are three way mentioned below, follow any one.

3.Running the Application locally
change mongodb uri to your local uri in conn.ts file
Start the Server:
npm start

The server will be running at http://localhost:9000.
(or) 4. Running the Application on docker
run the command docker-compose up --build
The server will be running at http://localhost:9000.

(or)

5. Pull docker images
   5.1. pull mongo image
   docker pull syedlukhman64/rest:mongo
   5.2. Run mongo db container
   docker run --name mongo_db -d -p 27017:27017 syedlukhman64/rest:mongo
   5.3 pull node api image
   docker pull syedlukhman64/rest:latest
   5.4 Run todo-api container and link with mongodb database
   docker run --name todo-app -d -p 9000:9000 --link mongo_db:mongo syedlukhman64/rest:latest

## API Endpoints

1. GET /getTodosList: Retrieve all To-Dos for the authenticated client.
2. GET /getTodo/:id : Retrieve a specific To-Do by ID.
3. POST /addTodo: Add a new To-Do. :Request body should include todo status and title.
4. PUT /updateTodo/:id : Update a specific To-Do by ID.
   Request body can include status and/or title for the To-Do.
5. DELETE /deleteTodo/:id : Delete a specific To-Do by ID.
6. DELETE /deleteTodos: Delete all To-Dos for the authenticated client.

## Authorization

Each request must include an Authorization header to specify the client:
Authorization: client=123

## Error Handling

Custom error handling middleware converts generic errors into structured API errors. Errors will respond with appropriate HTTP status codes and messages.
