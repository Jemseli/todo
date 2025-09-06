import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  const header = req.headers['authorization']
  if (!header) return res.status(401).json({ message: 'No token provided' })

  const token = header.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' })
    req.user = decoded.user
    next()
  })
}

export { auth }