# VidyaVichar - Interactive Classroom Questions Platform

A comprehensive web application that facilitates interactive classroom discussions between teachers, students, and teaching assistants. The platform allows students to post questions, teachers to manage classrooms and questions, and teaching assistants to provide answers with file attachments.

## 🎯 Project Overview

**VidyaVichar** is a full-stack application designed to enhance classroom interaction and learning. It provides a digital space where students can ask questions, teachers can manage multiple classrooms and questions, and teaching assistants can provide detailed answers with supporting materials.

## ✨ Key Features

### For Students
- **Join Classrooms**: Enter classroom using unique classroom codes
- **Post Questions**: Submit questions with categories and color coding
- **View Questions**: See all questions in the classroom with real-time updates
- **Anonymous Posting**: Option to post questions anonymously

### For Teachers
- **Account Management**: Sign up and login with secure authentication
- **Classroom Management**: Create and manage multiple classrooms
- **Question Management**: 
  - View all questions in their classrooms
  - Filter questions by status, author, and date
  - Update question status (answered/unanswered/important)
  - Delete questions
- **Real-time Dashboard**: Monitor classroom activity in real-time

### For Teaching Assistants (TAs)
- **Account Management**: Separate registration and login system
- **Answer Questions**: Provide detailed answers to student questions
- **File Attachments**: Upload supporting materials (images, documents, etc.)
- **Classroom Access**: Access multiple classrooms to answer questions
- **Answer Management**: Edit and update their answers

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **Express-session** - Session management
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Radix UI** - Component library
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **Lucide React** - Icon library

## 📁 Project Structure

```
SSD_MID_Lab/
├── backend/
│   ├── app.js                 # Main server file
│   ├── config/
│   │   ├── db.js             # Database connection
│   │   └── passport.js       # Passport configuration
│   ├── controllers/
│   │   ├── questionController.js
│   │   ├── teacherController.js
│   │   └── teachingAssistantController.js
│   ├── middleware/
│   │   ├── auth.js           # Authentication middleware
│   │   ├── taAuth.js         # TA authentication middleware
│   │   └── upload.js         # File upload middleware
│   ├── models/
│   │   ├── Classroom.js      # Classroom schema
│   │   ├── Question.js       # Question schema
│   │   ├── Teacher.js        # Teacher schema
│   │   └── TeachingAssistant.js # TA schema
│   ├── routes/
│   │   ├── questionRoutes.js
│   │   ├── teacherRoutes.js
│   │   └── teachingAssistantRoutes.js
│   └── uploads/              # File storage directory
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/           # Page components
    │   ├── context/         # React context providers
    │   ├── api/             # API service functions
    │   ├── hooks/           # Custom React hooks
    │   └── lib/             # Utility functions
    ├── public/              # Static assets
    └── dist/                # Build output
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables in `.env`:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/vidyavichar
   PORT=5000
   SESSION_SECRET=your_super_secret_session_key
   REACT_URL=http://localhost:8081
   ```

4. **Start MongoDB service:**
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:8081`

## 🔧 Configuration

### Database Configuration
The application uses MongoDB with the following collections:
- `teachers` - Teacher accounts and classroom associations
- `teachingassistants` - TA accounts and authentication
- `classrooms` - Classroom information and student lists
- `questions` - Student questions and TA answers

### File Upload Configuration
- Supported file types: Images, documents, PDFs
- Maximum file size: 10MB per file
- Storage location: `backend/uploads/`
- Files are served statically at `/uploads/` endpoint

## 📚 API Endpoints

### Authentication
- `POST /teacher/signup` - Create teacher account
- `POST /teacher/login` - Teacher login
- `POST /teacher/logout` - Teacher logout
- `POST /ta/signup` - Create TA account
- `POST /ta/login` - TA login
- `POST /ta/logout` - TA logout

### Classrooms
- `GET /teacher/classrooms` - Get teacher's classrooms
- `POST /teacher/classrooms` - Create new classroom
- `GET /teacher/classrooms/:id` - Get classroom details

### Questions
- `POST /question` - Create new question
- `GET /question/:classroomId` - Get questions for classroom
- `PUT /question/:id/status` - Update question status
- `DELETE /question/:id` - Delete question
- `POST /question/:id/answer` - Add TA answer to question

## 🎨 User Interface

The application features a modern, responsive design with:
- **Landing Page**: Welcome screen with role selection
- **Student Interface**: Clean, intuitive question posting and viewing
- **Teacher Dashboard**: Comprehensive classroom and question management
- **TA Interface**: Answer management with file upload capabilities
- **Real-time Updates**: Live question updates and status changes

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: Express-session for user sessions
- **Authentication Middleware**: Protected routes for teachers and TAs
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Restricted file types and size limits

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Ensure file upload directory has proper permissions

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to platforms like Vercel, Netlify, or AWS S3
3. Configure environment variables for API endpoints

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 📝 Assumptions Made

1. **Classroom Codes**: 6-character alphanumeric codes are sufficient for classroom identification
2. **File Storage**: Local file system storage is adequate for file uploads
3. **Session Management**: Server-side sessions are preferred over JWT tokens
4. **Real-time Updates**: Polling mechanism is sufficient for real-time updates
5. **User Roles**: Three distinct user types (Student, Teacher, TA) cover all use cases
6. **Question Categories**: Basic categorization system meets requirements
7. **Anonymous Posting**: Students can post questions without creating accounts
8. **Classroom Size**: No specific limits on classroom size or question count
9. **File Types**: Common file types (images, documents, PDFs) are sufficient
10. **Database**: MongoDB provides adequate performance for the expected user load

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Sai Anirudh Karre** - Project Creator
- **Development Team** - Full-stack implementation

## 🙏 Acknowledgments

- React and Node.js communities for excellent documentation
- MongoDB for robust database solutions
- Tailwind CSS for beautiful styling framework
- Radix UI for accessible component library

---

**Note**: This project was developed as part of the SSD (Software System Design) MID Lab assignment. The application demonstrates modern full-stack development practices with React, Node.js, and MongoDB.
