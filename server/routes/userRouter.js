import { pool } from '../index.js'
import { Router } from 'express'
import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken';

const router = Router()

router.post('/signup', (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    const error = new Error('Email and password are required')
    error.status = 400
    return next(error)
  }

  hash(password, 10, (err, hashedPassword) => {
    if (err) return next(err)

    pool.query(
      'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword],
      (err, result) => {
        if (err) {
          return next(err)
        }
        res.status(201).json({
          id: result.rows[0].id,
          email: result.rows[0].email,
        })
      }
    )
  })
})

router.post('/signin', (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        const error = new Error('Email and password are required')
        error.status = 400
        return next(error)
    }

    pool.query('SELECT * FROM account WHERE email = $1', [email], (err, result) => {
        if (err) return next(err)

        if (result.rows.length === 0) {
            const error = new Error('User not found')
            error.status = 404
            return next(error)
        }

        const dbUser = result.rows[0]

        compare(password, dbUser.password, (err, isMatch) => {
            if (err) return next(err)

            if (!isMatch) {
                const error = new Error('Invalid password')
                error.status = 401
                return next(error)
            }

            const token = jwt.sign({ user: dbUser.email }, process.env.JWT_SECRET_KEY)
            res.status(200).json({
                id: dbUser.id,
                email: dbUser.email,
                token
            })
        })
    })
})
export default router
