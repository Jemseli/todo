import pkg from 'pg'
import dotenv from 'dotenv'

const environment = process.env.NODE_ENV || 'development'

dotenv.config()

const port = process.env.port