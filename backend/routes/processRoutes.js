import express from 'express'
import {
  getProcessByOrder,
  getAllProcesses,
  completeStep,
  getMyTasks,
  getNotifications
} from '../controllers/processController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.get('/',                                   adminOnly, getAllProcesses)
router.get('/my-tasks',                           getMyTasks)
router.get('/order/:orderId',                     getProcessByOrder)
router.put('/:processId/steps/:stepId/complete',  completeStep)
router.get('/notifications',                      getNotifications)

export default router