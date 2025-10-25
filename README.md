# Task Manager API

A full-stack task management application with RESTful API, built with Node.js, Express, and SQLite.

## Features

- ✅ RESTful API for task management (CRUD operations)
- ✅ Clean, responsive web interface
- ✅ SQLite database with proper schema
- ✅ Input validation and error handling
- ✅ Filter tasks by status (pending/completed)
- ✅ Search functionality
- ✅ Professional code structure

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Architecture**: MVC pattern

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task-manager-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm start
   ```

4. **Access the application**
   - Web Interface: `http://localhost:3000`
   - API Endpoint: `http://localhost:3000/api/tasks`

## API Documentation

### Endpoints

#### Get All Tasks
```
GET /api/tasks
Query params: ?status=pending|completed&search=keyword
```

#### Get Single Task
```
GET /api/tasks/:id
```

#### Create Task
```
POST /api/tasks
Body: { "title": "Task title", "description": "Task description" }
```

#### Update Task
```
PUT /api/tasks/:id
Body: { "title": "New title", "description": "New description", "completed": true }
```

#### Delete Task
```
DELETE /api/tasks/:id
```

## Project Structure

```
task-manager-api/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/
│   ├── database.js
│   ├── routes.js
│   └── server.js
├── package.json
└── README.md
```

## Interview Talking Points

1. **RESTful Design**: Follows REST principles with proper HTTP methods
2. **Database Management**: Implemented with prepared statements to prevent SQL injection
3. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
4. **Code Organization**: Clean separation of concerns (routes, database, server)
5. **User Experience**: Responsive design with real-time updates
6. **Scalability**: Easy to extend with authentication, additional features

## Future Enhancements

- User authentication with JWT
- Task categories and tags
- Due dates and reminders
- Unit and integration tests
- Deployment to cloud (Heroku, AWS, etc.)

