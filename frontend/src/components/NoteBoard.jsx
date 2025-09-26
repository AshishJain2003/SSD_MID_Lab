import React from 'react'
import StickyNote from './StickyNote'

export default function NoteBoard({ notes }){
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {notes.map(n => <StickyNote key={n._id} note={n} />)}
    </div>
  )
}
