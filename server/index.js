import express from 'express'
import cors from 'cors'
import todoRouter from './routers/todoRouter.js'
import userRouter from './routers/userRouter.js'
import { use } from 'react'
import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const port = process.env.PORT
const app = express()
const router = express.Router();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', todoRouter)
app.use('/user', userRouter)

const openDb = () => {
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.NODE_ENV === "development"
        ? process.env.DB_NAME 
        : process.env.TEST_DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })
    return pool
}

const pool = openDb()

export { pool }

router.get('/', (req, res, next) => {
  pool.query('SELECT * FROM task', (err, result) => {
    if(err) {
        return next(err)
    }
    res.status(200).json(result.rows || [])
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

router.post('/create', (req, res) => {
    const { task } = req.body

    if (!task) {
        return res.status(400).json({error: 'Task is required'})
    }

    pool.query('insert into task (description) values ($1) returning *', [task.description],
        (err, result) => {
            if (err) {
                return res.status(500).json({error: err.message})
            }
            res.status(201).json({id: result.rows[0].id, description: task.description})
        })
})

router.delete('/delete/:id', (req, res, next) => {
    const { id } = req.params

    pool.query('delete from task WHERE id = $1',
        [id], (err, result) => {
            if (err) {
                return next(err)
            }
            if (result.rowCount === 0) {
                const error = new Error('Task now found')
                error.status = 404
                return next(error)
            }
            return res.status(200).json({id:id})
        })
})

app.use((err,req,res,next) => {
    const statusCode = err.status || 500
    res.status(statusCode).json({
        error: {
            message: err.message,
            status: statusCode
        }
    })
})