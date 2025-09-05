import pkg from 'pg'
import dotenv from 'dotenv'

console.log('Current environment: ${process.env.NODE_ENV');
dotenv.config()
console.log('Current environment: ${process.env.NODE_ENV');

const environment = process.env.NODE_ENV || 'development'


const port = process.env.port