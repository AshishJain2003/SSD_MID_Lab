import React, { useState } from 'react'
import { joinClassroom } from '../api/classroom'
import { useNavigate } from 'react-router-dom'

export default function StudentJoin(){
  const [code,setCode] = useState('')
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    const data = await joinClassroom(code)
    nav(`/classroom/${data.classroomId}`)
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={submit} className="p-6 bg-white rounded shadow space-y-4">
        <h2 className="text-xl font-bold">Join Classroom</h2>
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter classroom code" className="border p-2 rounded w-full" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Join</button>
      </form>
    </div>
  )
}
