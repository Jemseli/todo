import express from 'express'
import cors from 'cors'
import todoRouter from './routers/todoRouter.js'
import userRouter from './routers/userRouter.js'
import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const port = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.NODE_ENV === "development"
    ? process.env.DB_NAME 
    : process.env.TEST_DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

export { pool }

app.use('/todos', todoRouter)
app.use('/user', userRouter)

app.use((err, req, res, next) => {
  const statusCode = err.status || 500
  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode
    }
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})