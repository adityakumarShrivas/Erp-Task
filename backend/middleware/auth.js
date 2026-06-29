import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-passwordHash')

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' })
    }

    next()
  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied — admins only' })
  }
  next()
}

export const doerOnly = (req, res, next) => {
  if (req.user?.role !== 'DOER') {
    return res.status(403).json({ message: 'Access denied — doers only' })
  }
  next()
}