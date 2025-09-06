import { useEffect, useState } from 'react'
import { useUser } from '../context/useUser'
import './App.css'
import axios from 'axios'
import Row from '../components/Row'

const url = "http://localhost:3001/todos"

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const {user} = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')

  useEffect(() => {
    axios.get(url + "/")
      .then(response => setTasks(response.data))
      .catch(error => alert(error.response?.data?.message || error))
  }, [])

  const signin = () => {
  axios.post("http://localhost:3001/user/signin", { email, password })
    .then(response => setToken(response.data.token))
    .catch(error => alert(error.response?.data?.message || "Signin failed"))
}

  const addTask = () => {
    const headers = {headers: {Authorization: user.token}}
    const newTask = { description: task }

    axios.post(url + "/create", {task: newTask},headers)
    .then(response => {
      setTasks([...tasks, response.data])
      setTask('')
    })
  }

  const deleteTask = (deleted) => {
    const headers = {headers: {Authorization: user.token}}
    console.log(headers)
    axios.delete(url + "/delete/" + deleted,headers)
      .then(response => {
        setTasks(tasks.filter(item => item.id !== deleted))
      })
  }

return (
  <div id="container">
    <h3>Sign In</h3>
    <form onSubmit={e => { e.preventDefault(); signin(); }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Sign In</button>
    </form>

    <h3>Todos</h3>
    <form onSubmit={e => { e.preventDefault(); addTask(); }}>
      <input
        placeholder="Add new task"
        value={task}
        onChange={e => setTask(e.target.value)}
      />
    </form>

    <ul>
      {tasks.map(item => (
        <Row key={item.id} item={item} deleteTask={deleteTask} />
      ))}
    </ul>
  </div>
)
}

export default App