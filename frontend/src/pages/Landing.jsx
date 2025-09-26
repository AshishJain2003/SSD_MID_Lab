import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing(){
  const nav = useNavigate()
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-6">
      <h1 className="text-3xl font-bold">VidyaVichar</h1>
      <div className="flex gap-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={()=>nav('/student')}>Join as Student</button>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={()=>nav('/teacher/login')}>Teacher Login</button>
      </div>
    </div>
  )
}
