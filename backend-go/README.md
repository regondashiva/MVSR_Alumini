# MVSR Alumni Network - Go Backend

This is the Go backend for the MVSR Engineering College Alumni Network. It provides a RESTful API for the alumni portal with features like user authentication, event management, news, and more.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (admin, alumni, student)
  - OAuth integration (Google, LinkedIn, Facebook)
  - Password hashing with bcrypt

- **User Management**
  - User registration and login
  - Profile management
  - Alumni verification
  - Multi-college support

- **Event Management**
  - Create, read, update, delete events
  - Event registration
  - Event statistics
  - Event filtering and search

- **Content Management**
  - News articles with categories
  - Comments and likes
  - Gallery management
  - Job postings

- **Security**
  - Rate limiting
  - CORS configuration
  - Input validation
  - SQL injection prevention

## Tech Stack

- **Go 1.21** - Programming language
- **Gin** - HTTP web framework
- **MongoDB** - Database
- **Redis** - Caching
- **JWT** - Authentication tokens
- **Docker** - Containerization

## Getting Started

### Prerequisites
- Go 1.21+
- Node.js 16+
- MongoDB
- Redis (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend-go
```

2. Install dependencies:
```bash
go mod tidy
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=8081
MONGODB_URI=mongodb://localhost:27017/mvsr_alumni
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

5. Run the application:
```bash
go run main.go
```

The server will start on `http://localhost:8081`

## API Documentation

### Authentication

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "1234567890",
  "rollNumber": "123456",
  "batch": "2020",
  "branch": "CSE",
  "college": "MVSR",
  "passoutYear": "2024",
  "role": "alumni"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Events

#### Get Events
```http
GET /api/v1/events?page=1&limit=10&category=academic&status=upcoming
Authorization: Bearer <token>
```

#### Create Event
```http
POST /api/v1/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tech Talk",
  "description": "A talk about latest technology trends",
  "date": "2024-06-15T10:00:00Z",
  "time": "10:00 AM",
  "location": "Auditorium",
  "category": "academic",
  "type": "offline",
  "maxAttendees": 100,
  "organizer": {
    "name": "Computer Science Department",
    "email": "cse@mvsr.edu",
    "phone": "1234567890",
    "department": "CSE"
  }
}
```

### News

#### Get News
```http
GET /api/v1/news?page=1&limit=10&category=news&status=published
```

#### Create News
```http
POST /api/v1/news
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "College Rankings",
  "excerpt": "MVSR ranks among top colleges",
  "content": "Full article content...",
  "category": "news",
  "status": "published",
  "author": {
    "name": "Admin",
    "email": "admin@mvsr.edu"
  }
}
```

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t mvsr-backend .
```

2. Run the container:
```bash
docker run -p 8080:8080 --env-file .env mvsr-backend
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/mvsr_alumni` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT secret key | - |
| `FRONTEND_URL` | Frontend URL | `http://localhost:3000` |
| `MYSQL_URI` | MySQL connection string | `root:root@tcp(localhost:3306)/mvsr_alumni?parseTime=true` |
| `SKIP_DB` | Skip DB/Redis connections for local frontend dev | `false` |

| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID | - |
| `LINKEDIN_SECRET` | LinkedIn OAuth client secret | - |
| `FACEBOOK_CLIENT_ID` | Facebook OAuth client ID | - |
| `FACEBOOK_SECRET` | Facebook OAuth client secret | - |

## Project Structure

```
backend-go/
├── config/          # Configuration
├── controllers/      # HTTP handlers
├── middleware/       # Middleware functions
├── models/          # Data models
├── routes/          # Route definitions
├── main.go          # Application entry point
├── go.mod           # Go module file
├── Dockerfile       # Docker configuration
└── README.md        # This file
```

## Development

### Running Tests
```bash
go test ./...
```

### Building
```bash
go build -o mvsr-backend main.go
```

### Linting
```bash
go fmt ./...
go vet ./...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.
