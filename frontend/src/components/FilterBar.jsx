import React from 'react'

export default function FilterBar({ filter, setFilter }){
  return (
    <div className="flex gap-2">
      {['all','unanswered','answered','important'].map(f=>(
        <button key={f}
          onClick={()=>setFilter(f)}
          className={`px-3 py-1 rounded ${filter===f ? 'bg-blue-600 text-white':'bg-gray-200'}`}>
          {f}
        </button>
      ))}
    </div>
  )
}
