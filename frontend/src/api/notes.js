import axios from 'axios'
const API = 'http://localhost:5000/'

export async function listNotes(classroomId, filter){
  const res = await axios.get(`${API}/classrooms/${classroomId}/notes`, { params: { filter } })
  return res.data
}

export async function createNote(classroomId, note){
  const res = await axios.post(`${API}/classrooms/${classroomId}/notes`, note)
  return res.data
}
