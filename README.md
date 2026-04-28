# MVSR Engineering College Alumni Network

A comprehensive alumni and college management website for MVSR Engineering College built with **Go backend** and React frontend.

## 🏗️ Technology Stack

### Backend (Go)
- **Go 1.21** - Programming language
- **Gin Framework** - HTTP web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Docker** - Containerization

### Frontend (React)
- **React** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

## 🚀 Quick Start

### Prerequisites
- Go 1.21+
- Node.js 16+
- MongoDB
- Docker (optional)

### Backend Setup
```bash
cd backend-go
cp .env.example .env
go mod tidy
go run main.go
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Docker Setup
```bash
docker-compose up -d
```

```
MVSR-Alumni/
├── backend-go/           # Go backend API
│   ├── controllers/       # HTTP handlers
│   ├── middleware/        # Middleware functions
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── config/           # Configuration
│   └── main.go           # Application entry point
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── utils/        # Utility functions
│   └── package.json
├── docker-compose.yml    # Docker configuration
└── README.md
```

## 🎓 Alumni Network
- Alumni registration and profiles
- Alumni directory with advanced search
- Success stories and achievements
- Mentorship programs
- Batch-wise organization

### 📚 Academics
- Department information
- Course catalog
- Academic calendar
- Faculty profiles
- Examination schedules

### 🎯 Student Life
- Student clubs and organizations
- Events and activities
- Sports facilities
- Campus tour
- Hostel information

### 💼 Career & Placement
- Job portal
- Company partnerships
- Internship opportunities
- Career guidance
- Placement statistics

### 📰 News & Events
- College news
- Event calendar
- Photo/video galleries
- Press releases
- Newsletter

### 🛠️ Technical Stack
- **Frontend**: React.js, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Deployment**: Docker, AWS/Heroku

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd MVSR
```

2. Install dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Setup environment variables
```bash
# Backend .env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

4. Start the development servers
```bash
# Backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm start
```

## Project Structure

```
MVSR/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── services/       # API services
│   │   └── styles/         # Global styles
│   ├── public/
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   └── package.json
├── docs/                    # Documentation
├── docker-compose.yml       # Docker configuration
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
"# MVSR_Alumini" 
