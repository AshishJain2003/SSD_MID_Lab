import React, { useState } from 'react'
import { signupTeacher } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export default function TeacherSignup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setError('')
    try {
      const response = await signupTeacher(username, password)
      if (response.error) {
        setError(response.error)
      } else {
        nav('/teacher/login')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={submit} className="p-6 bg-white rounded shadow space-y-4">
        <h2 className="text-xl font-bold">Teacher Signup</h2>
        {error && <p className="text-red-600">{error}</p>}
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          className="border p-2 rounded w-full"
        />
        <input
          value={password}
          type="password"
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 rounded w-full"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Signup</button>
      </form>
    </div>
  )
}
