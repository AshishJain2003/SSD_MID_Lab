import React, { useEffect, useState } from 'react'
import { listClassrooms, createClassroom } from '../api/classroom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function TeacherDashboard(){
  const { user } = useAuth()
  const [classrooms,setClassrooms] = useState([])
  const [newName,setNewName] = useState('')
  const nav = useNavigate()

  useEffect(()=>{
    if(user) listClassrooms(user.token).then(setClassrooms)
  },[user])

  const create = async e => {
    e.preventDefault()
    const data = await createClassroom(user.token,newName)
    setClassrooms([...classrooms,data])
    setNewName('')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Classrooms</h1>
      <form onSubmit={create} className="flex gap-2 mb-4">
        <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="New classroom name" className="border rounded p-2" />
        <button className="bg-green-600 text-white px-3 py-1 rounded">Create</button>
      </form>
      <ul className="space-y-2">
        {classrooms.map(c=>(
          <li key={c._id} className="p-3 border rounded flex justify-between items-center">
            <span>{c.name}</span>
            <button className="text-blue-600" onClick={()=>nav(`/classroom/${c._id}`)}>Open</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
