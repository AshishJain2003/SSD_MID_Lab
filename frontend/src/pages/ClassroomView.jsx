import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { listNotes, createNote } from '../api/notes'
import NoteBoard from '../components/NoteBoard'
import NoteForm from '../components/NoteForm'
import FilterBar from '../components/FilterBar'

export default function ClassroomView(){
  const { id } = useParams()
  const [notes,setNotes] = useState([])
  const [filter,setFilter] = useState('all')

  const fetchNotes = async ()=>{
    const data = await listNotes(id,filter)
    setNotes(data)
  }

  useEffect(()=>{ fetchNotes() },[id,filter])

  const addNote = async (note)=>{
    await createNote(id,note)
    fetchNotes()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Classroom</h1>
      <FilterBar filter={filter} setFilter={setFilter} />
      <div className="mt-4 grid md:grid-cols-[300px_1fr] gap-6">
        <div>
          <NoteForm onSubmit={addNote} />
        </div>
        <NoteBoard notes={notes} />
      </div>
    </div>
  )
}
