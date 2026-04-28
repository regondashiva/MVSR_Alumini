# MVSR Alumni Portal - Database Integration Setup

This guide will help you set up the complete database integration for the MVSR Alumni Portal, including seeding data and connecting the frontend to the backend API.

## 🚀 Quick Start

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For Windows users with MongoDB installed
net start MongoDB

# Or if using MongoDB Atlas
# Update the MONGODB_URI in .env file
```

### 2. Seed the Database
Run the database seeding script to populate with sample data:
```bash
# Navigate to project root
cd c:\Users\shiva\OneDrive\Desktop\project\MVSR

# Run the seeder script
seed-database.bat
```

### 3. Start the Backend Server
```bash
# Navigate to backend directory
cd backend-go

# Start the server
go run main.go
```

### 4. Start the Frontend
```bash
# Navigate to frontend directory
cd frontend

# Start the development server
npm start
```

## 📊 Database Collections

The system creates the following collections with sample data:

### Users/Alumni Collection
- **6 Sample Alumni** with complete profiles
- **Fields**: name, email, profile, social, skills, experience, education
- **Companies**: Microsoft, Google, Amazon, Apple, Netflix, Meta
- **Skills**: JavaScript, React, Python, AI/ML, DevOps, UX Design

### Events Collection
- **4 Sample Events** with different categories
- **Categories**: alumni, workshop, cultural, career
- **Features**: registration, attendees, organizers, images

### News Collection
- **3 Sample News Articles**
- **Categories**: announcements, achievements, research
- **Features**: likes, comments, views, author info

### Gallery Collection
- **3 Sample Gallery Albums**
- **Categories**: events, campus, graduation
- **Features**: multiple images, likes, comments, views

### Jobs Collection
- **3 Sample Job Postings**
- **Companies**: TechCorp, InnovateTech, DataDriven
- **Features**: requirements, benefits, applications

## 🔌 API Integration

### Frontend API Configuration
The frontend uses a comprehensive API configuration system located at:
```
frontend/src/config/api.js
```

### API Endpoints Structure
```
/api/v1/ - New versioned endpoints
/api/     - Legacy endpoints (fallback)
```

### Authentication
All protected endpoints require JWT authentication:
```javascript
// Headers automatically include Authorization token
{
  'Authorization': 'Bearer <JWT_TOKEN>',
  'Content-Type': 'application/json'
}
```

## 🎯 Features Integration

### 1. Alumni Directory
- **Real Data**: Fetches from MongoDB users collection
- **Search**: Filter by name, company, location, skills
- **Profile View**: Detailed alumni information
- **Fallback**: Mock data if API fails

### 2. User Profiles
- **Complete CRUD**: Create, Read, Update profiles
- **Image Upload**: Profile and cover images
- **Social Links**: LinkedIn, GitHub, Twitter
- **Skills Management**: Dynamic skill tags

### 3. Events System
- **Event Listings**: Upcoming and past events
- **Registration**: User event registration
- **Management**: Create, update, delete events
- **Categories**: Academic, cultural, sports, workshop

### 4. Job Portal
- **Job Postings**: Company job listings
- **Applications**: User job applications
- **Search**: Filter by skills, location, company
- **Management**: CRUD operations for jobs

### 5. News & Articles
- **News Feed**: Latest news and updates
- **Interactions**: Likes, comments, shares
- **Categories**: Announcements, achievements, research
- **Rich Content**: Images, summaries, full articles

### 6. Photo Gallery
- **Gallery Albums**: Organized photo collections
- **Image Management**: Upload, organize images
- **Interactions**: Likes, comments on albums
- **Categories**: Events, campus, activities

## 🔧 Configuration Files

### Backend Configuration
```bash
# backend-go/.env
NODE_ENV=development
PORT=8082
MONGODB_URI=mongodb://localhost:27017/mvsr_alumni
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration
```javascript
// frontend/src/config/api.js
const API_CONFIG = {
  BASE_URL: 'http://localhost:8082',
  ENDPOINTS: { /* All API endpoints */ }
};
```

## 📱 Frontend Components Updated

### 1. AlumniDashboard.js
- **Real Statistics**: Connections, applications, events
- **API Integration**: Fetches from backend endpoints
- **Error Handling**: Graceful fallbacks and loading states

### 2. AlumniDirectoryEnhanced.js
- **Real Alumni Data**: Fetches from users collection
- **Search & Filter**: Backend-powered search functionality
- **Profile Access**: Navigate to detailed profiles

### 3. Profile.js
- **Complete Profile Management**: Full CRUD operations
- **Real-time Updates**: Save changes to database
- **Data Validation**: Form validation and error handling

### 4. AlumniDiscovery.js
- **Advanced Search**: Multi-category alumni search
- **Mock Data Fallback**: Works without backend
- **Professional UI**: Modern card-based design

## 🛠 Development Workflow

### 1. Database Operations
```bash
# Seed fresh data
go run seed/seed.go

# Clear all data (optional)
# Edit seed.go to remove Drop() calls

# Add new data
# Update seed.go with new data structures
```

### 2. API Development
```bash
# Test API endpoints
curl -X GET http://localhost:8082/api/v1/alumni/directory

# Test with authentication
curl -X GET http://localhost:8082/api/v1/users/profile \
  -H "Authorization: Bearer <TOKEN>"
```

### 3. Frontend Development
```javascript
// Use the API configuration
import API_CONFIG from '../config/api';

// Example: Fetch alumni directory
const alumni = await API_CONFIG.api.alumni.getDirectory();
```

## 🔍 Testing the Integration

### 1. Test Authentication
1. Register a new user at `/register`
2. Login at `/login`
3. Check profile at `/profile`

### 2. Test Alumni Directory
1. Visit `/alumni-enhanced`
2. Search for alumni by name/company
3. Click on alumni profiles

### 3. Test Dashboard
1. Visit `/dashboard`
2. Check statistics (connections, applications)
3. Verify data is from database

### 4. Test Profile Management
1. Visit `/profile`
2. Click "Edit Profile"
3. Make changes and save
4. Verify data persists

## 🚨 Troubleshooting

### Common Issues

#### 1. MongoDB Connection
```bash
# Check if MongoDB is running
mongosh

# If using Atlas, check connection string
# Update .env file with correct URI
```

#### 2. API Errors
```bash
# Check backend server status
curl http://localhost:8082/api/health

# Check logs in backend terminal
# Look for connection errors
```

#### 3. Frontend Issues
```bash
# Clear browser cache
# Check network tab in dev tools
# Verify API endpoints are accessible
```

#### 4. Authentication Issues
```bash
# Check JWT token in localStorage
# Verify token is not expired
# Check API headers include Authorization
```

### Debug Mode

#### Backend Debugging
```bash
# Enable debug logging
export DEBUG=true
go run main.go
```

#### Frontend Debugging
```javascript
// Enable API debugging
localStorage.setItem('debug', 'true');

// Check API calls in Network tab
// Verify request/response data
```

## 📈 Performance Considerations

### 1. Database Indexing
```javascript
// Add indexes for better performance
db.users.createIndex({ "email": 1 })
db.users.createIndex({ "profile.company": 1 })
db.users.createIndex({ "profile.skills": 1 })
```

### 2. Caching
```bash
# Redis caching enabled by default
# Check Redis connection
redis-cli ping
```

### 3. API Optimization
```javascript
// Pagination for large datasets
// Lazy loading for images
// Debounced search inputs
```

## 🔐 Security Features

### 1. JWT Authentication
- Secure token-based authentication
- Automatic token refresh
- Protected routes middleware

### 2. Data Validation
- Input validation on all endpoints
- SQL injection prevention
- XSS protection

### 3. Rate Limiting
- API rate limiting enabled
- DDoS protection
- Request throttling

## 🚀 Production Deployment

### 1. Environment Setup
```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<production-jwt-secret>
```

### 2. Database Setup
```bash
# Production MongoDB setup
# Configure replica sets
# Set up backups
# Monitor performance
```

### 3. Frontend Build
```bash
# Production build
npm run build

# Environment-specific configuration
REACT_APP_API_URL=https://api.mvsr.edu.in
```

## 📞 Support

For any issues with the database integration:

1. Check the troubleshooting section above
2. Verify all services are running (MongoDB, Redis, Backend)
3. Check browser console for errors
4. Review backend logs for API issues

The system is designed to work with or without the backend - frontend components include fallback data for seamless development experience.
