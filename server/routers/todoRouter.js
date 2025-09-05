import { pool } from '../helper/db.js'
import { auth } from '../helper/auth.js'
import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    pool.query('SELECT * FROM task', (err, result) => {
        if(err) {
            return next(err)
        }
        res.status(200).json(result.rows || [])
    })
})

router.post('/create', auth,(req, res, next) => {
    const { task } = req.body

    if (!task) {
        return res.status(400).json({error: 'Task is required'})
    }

    pool.query('insert into task (description) values ($1) returning *', [task.description],
        (err, result) => {
            if(err) {
                return next(err)
            }
            res.status(201).json({id: result.rows[0].id, description: task.description})
        })
})

export default router