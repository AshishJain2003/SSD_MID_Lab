import React, { useState } from 'react'
import { loginTeacher } from '../api/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function TeacherLogin(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    const data = await loginTeacher(email,password)
    login({ role:'teacher', token: data.token })
    nav('/teacher/dashboard')
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={submit} className="p-6 bg-white rounded shadow space-y-4">
        <h2 className="text-xl font-bold">Teacher Login</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded w-full" />
        <input value={password} type="password" onChange={e=>setPassword(e.target.value)} placeholder="Password" className="border p-2 rounded w-full" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
        <p className="text-sm">New teacher? <Link to="/teacher/signup" className="text-blue-600">Signup</Link></p>
      </form>
    </div>
  )
}
