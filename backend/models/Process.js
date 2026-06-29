import mongoose from 'mongoose'

const formSubmissionSchema = new mongoose.Schema({
  values: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  attachments: {
    type: [String],
    default: []
  }
}, { _id: false })

const processStepSchema = new mongoose.Schema({
  stepId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Step',
    required: true
  },
  name: String,
  order: Number,
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    default: null
  },
  status: {
    type: String,
    enum: ['PENDING', 'DONE', 'OVERDUE'],
    default: 'PENDING'
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  buddyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  slaMinutes: Number,
  plannedAt: Date,
  completedAt: {
    type: Date,
    default: null
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  formSubmission: {
    type: formSubmissionSchema,
    default: () => ({})
  }
})

const processSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  steps: [processStepSchema]
}, { timestamps: true })

const Process = mongoose.model('Process', processSchema)
export default Process