# Task Master

Task Master is a project management application that allows users to create projects, invite members, assign tasks, and manage project roles. This application is built using Node.js, Express, and MongoDB.

## Features

- User registration and authentication
- Project creation and management
- Task creation, assignment, and status updates
- Role-based access control (Owner, Manager, Member)
- User profile management
- JWT-based authentication
- Logging and error handling

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-master.git
   cd task-master
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=your_mongodb_uri
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Run tests:
   ```bash
   npm test
   ```

## API Endpoints

### User Routes

- **POST /api/user/register**: Register a new user
- **POST /api/user/login**: Log in a user and return a token
- **GET /api/user/profile**: Fetch the user profile (requires authentication)
- **PUT /api/user/profile**: Update the user profile (requires authentication)
- **POST /api/user/logout**: Log out the user and blacklist the token (requires authentication)

### Project Routes

- **POST /api/project**: Create a new project (requires authentication)
- **POST /api/project/invite**: Invite a member to the project (requires authentication and owner/manager role)
- **POST /api/project/make-manager**: Promote a member to manager (requires authentication and owner role)

### Task Routes

- **POST /api/task/create**: Create a new task (requires authentication and owner/manager role)
- **GET /api/task**: Get all tasks (requires authentication)
- **PUT /api/task/status**: Update task status (requires authentication)
- **PUT /api/task/assign**: Assign a task to a member (requires authentication)
- **GET /api/task/filter**: Filter tasks (requires authentication)
- **GET /api/task/search**: Search tasks (requires authentication)
- **POST /api/task/comment**: Add a comment to a task (requires authentication)
- **POST /api/task/attachment**: Add an attachment to a task (requires authentication)

## Middleware

- **authenticate**: Middleware to authenticate users using JWT
- **authorizeRole**: Middleware to authorize users based on roles
- **validateRequest**: Middleware to validate request bodies using Celebrate

## Logging

The application uses a custom logger to log API requests and errors. Logs are stored in the `logs` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
