
# To-Do Application API

A simple REST API for managing To-Dos, built with TypeScript and Express. This API allows clients to create, read, update, and delete To-Dos, ensuring that each client can only access their own data.

---

## Table of Contents

- **Technologies**(#technologies)
- **Installation**(#installation)
- **API Endpoints**(#api-endpoints)
- **Authorization**(#authorization)
- **Error Handling**(#error-handling)

---

## Technologies

- **Node.js**: Server-side JavaScript runtime
- **Express**: Web framework for building APIs
- **TypeScript**: Superset of JavaScript for static typing
- **MongoDB**: NoSQL database for persistent data storage
- **Mongoose**: ODM for MongoDB
- **Lodash**: Utility library for easier manipulation of arrays and objects
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing
- **http-status**: Library for managing HTTP status codes

---

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Syedlukhman/todo-management-service.git
   cd todo-management-service
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Application** (choose one of the following options):

   ### a. Running Locally

   - Update the MongoDB URI in the `conn.ts` file to match your local database URI.
   - Start the server:

     ```bash
     npm start
     ```

   - The server will be running at `http://localhost:9000`.

   ### b. Running with Docker

   - Start the Docker container with the following command:

     ```bash
     docker-compose up --build
     ```

   - The server will be accessible at `http://localhost:9000`.

   ### c. Pull Docker Images

   1. **Pull MongoDB Image**:

      ```bash
      docker pull syedlukhman64/rest:mongo
      ```

   2. **Run MongoDB Container**:

      ```bash
      docker run --name mongo_db -d -p 27017:27017 syedlukhman64/rest:mongo
      ```

   3. **Pull Node API Image**:

      ```bash
      docker pull syedlukhman64/rest:latest
      ```

   4. **Run To-Do API Container** (linking it with MongoDB):

      ```bash
      docker run --name todo-app -d -p 9000:9000 --link mongo_db:mongo syedlukhman64/rest:latest
      ```

---

## API Endpoints

1. **GET `/getTodosList`**: Retrieve all To-Dos for the authenticated client.

2. **GET `/getTodo/:id`**: Retrieve a specific To-Do by its ID.

3. **POST `/addTodo`**: Add a new To-Do. The request body should include `status` and `title`.

4. **PUT `/updateTodo/:id`**: Update a specific To-Do by ID. The request body can include updated `status` and/or `title`.

5. **DELETE `/deleteTodo/:id`**: Delete a specific To-Do by ID.

6. **DELETE `/deleteTodos`**: Delete all To-Dos for the authenticated client.

---

## Authorization

Each request must include an `Authorization` header specifying the client identifier:

```http
Authorization: client=123
```


## Error Handling

Custom error-handling middleware converts generic errors into structured API errors, responding with appropriate HTTP status codes and messages.


