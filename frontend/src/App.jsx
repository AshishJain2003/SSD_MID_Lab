import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import StudentJoin from './pages/StudentJoin'
import TeacherLogin from './pages/TeacherLogin'
import TeacherSignup from './pages/TeacherSignup'
import TeacherDashboard from './pages/TeacherDashboard'
import ClassroomView from './pages/ClassroomView'
import { AuthProvider } from './context/AuthContext'

export default function App(){
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/student" element={<StudentJoin />} />
      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route path="/teacher/signup" element={<TeacherSignup />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/classroom/:id" element={<ClassroomView />} />
    </Routes>
    </AuthProvider>
  )
}
