import express from 'express'
import {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm
} from '../controllers/formController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.get('/',       getAllForms)
router.post('/',      adminOnly, createForm)
router.get('/:id',    getFormById)
router.put('/:id',    adminOnly, updateForm)
router.delete('/:id', adminOnly, deleteForm)

export default router