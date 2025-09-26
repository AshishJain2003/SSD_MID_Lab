import React, { useState } from 'react'

export default function NoteForm({ onSubmit }){
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')

  const submit = e => {
    e.preventDefault()
    if(!text.trim()) return
    onSubmit({ text, author })
    setText('')
    setAuthor('')
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Ask a question..." className="w-full border rounded p-2" />
      <input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Your name" className="w-full border rounded p-2" />
      <button className="bg-blue-600 text-white px-3 py-1 rounded">Post</button>
    </form>
  )
}
