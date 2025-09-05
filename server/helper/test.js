import fs from 'fs'
import path from 'path'
import { pool } from './db.js'
import { hash } from 'bcrypt'

const__dirname = import.meta.dirname

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname, '../db.sql'), 'utf8')

    pool.query(sql, (err) => {
        if(err) {
            console.error('Error initializing test database:', err)
        } else {
            console.log('Test database initialized successfully')
        }
    })
}

const insertTestUser = async (user) => {
    try {
      const hashedPassword = await hash(user.password, 10)
  
      await pool.query(
        'INSERT INTO account (email, password) VALUES ($1, $2)',
        [user.email, hashedPassword]
      )
  
      console.log('Test user inserted successfully')
    } catch (err) {
      console.error('Error inserting test user:', err)
    }
  }

const getToken = (email) => {
    return JsonWebTokenError.sign({ email }, process.env.JWT_SECRET)
}

export { initializeTestDb, insertTestUser,getToken }