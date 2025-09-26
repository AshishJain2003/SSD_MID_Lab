import axios from 'axios'
const API = 'http://localhost:5000/'

export async function createClassroom(token, name){
  const res = await axios.post(`${API}/classrooms`, { name }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export async function listClassrooms(token){
  const res = await axios.get(`${API}/classrooms`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export async function joinClassroom(code){
  const res = await axios.post(`${API}/classrooms/join`, { code })
  return res.data
}
