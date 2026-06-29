import mongoose from 'mongoose'

const stepSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buddyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  slaMinutes: {
    type: Number,
    required: true,
    default: 60
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    default: null
  }
}, { timestamps: true })

const Step = mongoose.model('Step', stepSchema)
export default Step