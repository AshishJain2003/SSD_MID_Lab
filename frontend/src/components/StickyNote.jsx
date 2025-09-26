import React from 'react'

export default function StickyNote({ note }){
  return (
    <div className="p-4 rounded-xl shadow bg-yellow-100 min-h-[120px] flex flex-col justify-between">
      <div>
        <h4 className="font-semibold">{note.text}</h4>
        <p className="text-sm text-gray-700">{note.author}</p>
      </div>
      <span className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleString()}</span>
    </div>
  )
}
