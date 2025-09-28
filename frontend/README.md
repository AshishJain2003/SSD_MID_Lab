# VidyaVichar Frontend

A modern React-based frontend application for the VidyaVichar Interactive Classroom Questions Platform. Built with TypeScript, Vite, and Tailwind CSS, this application provides an intuitive interface for students, teachers, and teaching assistants to interact in a digital classroom environment.

## 🎯 Overview

The frontend is a single-page application (SPA) that provides three distinct user experiences:
- **Student Interface**: Join classrooms and post questions
- **Teacher Interface**: Manage classrooms and questions
- **Teaching Assistant Interface**: Answer student questions with file attachments

## ✨ Features

### 🎓 Student Features
- **Landing Page**: Welcome screen with clear navigation
- **Classroom Joining**: Enter classroom codes to join discussions
- **Question Posting**: Submit questions with categories and color coding
- **Real-time Updates**: Live question feed with automatic refresh
- **Anonymous Posting**: Option to post questions without revealing identity

### 👨‍🏫 Teacher Features
- **Authentication**: Secure login and registration system
- **Classroom Management**: Create and manage multiple classrooms
- **Question Dashboard**: View and filter all classroom questions
- **Question Management**: Update status, delete questions, and monitor activity
- **Real-time Monitoring**: Live updates of classroom activity

### 👨‍💼 Teaching Assistant Features
- **Separate Authentication**: Dedicated login system for TAs
- **Classroom Access**: Join multiple classrooms to answer questions
- **Answer Management**: Provide detailed answers with file attachments
- **Question Filtering**: View unanswered questions across classrooms

## 🛠️ Technology Stack

### Core Technologies
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.8.3** - Type safety and enhanced developer experience
- **Vite 5.4.19** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Lucide React 0.462.0** - Beautiful, customizable icons
- **Class Variance Authority** - Component variant management
- **Tailwind Merge** - Conditional class merging

### State Management & Data Fetching
- **React Query (TanStack Query) 5.83.0** - Server state management
- **React Context API** - Global state management for authentication
- **React Hook Form 7.61.1** - Form state management and validation

### Routing & Navigation
- **React Router DOM 6.30.1** - Client-side routing
- **React Resizable Panels 2.1.9** - Resizable UI panels

### Development Tools
- **ESLint 9.32.0** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing

## 📁 Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components (Radix UI)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (40+ components)
│   │   ├── FilterBar.jsx       # Question filtering component
│   │   ├── Loader.jsx          # Loading spinner component
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── NoteBoard.jsx       # Question display board
│   │   ├── NoteForm.jsx        # Question creation form
│   │   ├── StickyNote.jsx      # Individual question component
│   │   └── TAAnswerForm.jsx    # TA answer form
│   ├── pages/
│   │   ├── Landing.jsx         # Landing page
│   │   ├── StudentJoin.jsx     # Student classroom joining
│   │   ├── StudentDashboard.jsx # Student question view
│   │   ├── TeacherOptions.jsx  # Teacher role selection
│   │   ├── TeacherLogin.jsx    # Teacher authentication
│   │   ├── TeacherSignup.jsx   # Teacher registration
│   │   ├── TeacherDashboard.jsx # Teacher main dashboard
│   │   ├── ClassroomView.jsx   # Classroom management
│   │   ├── TALogin.jsx         # TA authentication
│   │   ├── TASignup.jsx        # TA registration
│   │   ├── TAClassroomAccess.jsx # TA classroom access
│   │   ├── TADashboard.jsx     # TA main dashboard
│   │   └── NotFound.tsx        # 404 error page
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context provider
│   ├── api/
│   │   ├── auth.js             # Authentication API calls
│   │   ├── classroom.js        # Classroom API calls
│   │   ├── notes.js            # Questions API calls
│   │   └── teachingAssistant.js # TA API calls
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Mobile detection hook
│   │   └── use-toast.ts        # Toast notification hook
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Application entry point
│   ├── router.jsx              # Route configuration
│   └── index.css               # Global styles
├── components.json             # Radix UI component configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see main README for setup)

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8081`

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient for main actions
- **Secondary**: Gray tones for secondary elements
- **Success**: Green for positive actions
- **Warning**: Yellow for important questions
- **Error**: Red for errors and deletions

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable font sizes and line heights
- **Code**: Monospace for technical content

### Components
- **Cards**: Clean, elevated design for content blocks
- **Buttons**: Consistent styling with hover states
- **Forms**: Accessible form controls with validation
- **Modals**: Overlay dialogs for important actions

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=VidyaVichar
```

### API Configuration
The frontend communicates with the backend through REST APIs:
- **Base URL**: `http://localhost:5000` (development)
- **Authentication**: Session-based with cookies
- **CORS**: Enabled for cross-origin requests

## 🔐 Authentication Flow

### Student Flow
1. Visit landing page
2. Click "Join as Student"
3. Enter classroom code
4. Start posting questions

### Teacher Flow
1. Visit landing page
2. Click "Join as Teacher"
3. Sign up or login
4. Access teacher dashboard
5. Manage classrooms and questions

### TA Flow
1. Visit landing page
2. Click "Join as Teaching Assistant"
3. Sign up or login
4. Access TA dashboard

## 🎯 Key Components

### NoteBoard Component
- Displays all questions in a classroom
- Real-time updates via polling
- Filtering and sorting capabilities
- Responsive grid layout

### NoteForm Component
- Question creation form
- Category and color selection
- Anonymous posting option
- Form validation and error handling

### StickyNote Component
- Individual question display
- Status indicators
- Action buttons (for teachers)

### FilterBar Component
- Question filtering by status, author, date
- Search functionality
- Clear filters option
- Responsive design

