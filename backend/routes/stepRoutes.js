import express from 'express'
import {
  createStep,
  getAllSteps,
  getStepById,
  updateStep,
  deleteStep
} from '../controllers/stepController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.get('/',     getAllSteps)
router.post('/',    adminOnly, createStep)
router.get('/:id',  getStepById)
router.put('/:id',  adminOnly, updateStep)
router.delete('/:id', adminOnly, deleteStep)

export default router