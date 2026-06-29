import express from 'express'
import {
  createOrder,
  getAllOrders,
  getOrderById,
  startWorkflow
} from '../controllers/orderController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.get('/',              getAllOrders)
router.post('/',             adminOnly, createOrder)
router.get('/:id',           getOrderById)
router.post('/:id/start',    adminOnly, startWorkflow)

export default router