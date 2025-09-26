import axios from 'axios'
const API = 'http://localhost:5000/'

export async function loginTeacher(email, password){
  const res = await axios.post(`${API}/login`, { email, password })
  return res.data
}

export async function signupTeacher(username, password) {
  try {
    const res = await axios.post(`${API}teachers`, { username, password })
    return res.data
  } catch (err) {
    // Return error message in a consistent format
    return { error: err.response?.data?.error || 'Signup failed' }
  }
}
