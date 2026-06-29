import express from 'express'
import {
  registerUser,
  loginUser,
  getMe,
  getAllDoers
} from '../controllers/authController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login',    loginUser)
router.get('/me',        protect, getMe)
router.get('/doers',     protect, adminOnly, getAllDoers)

export default router