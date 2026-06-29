import Process from '../models/Process.js'

export const getProcessByOrder = async (req, res) => {
  try {
    const process = await Process.findOne({ orderId: req.params.orderId })
      .populate('orderId',            'orderNo partyName')
      .populate('steps.assigneeId',   'name email')
      .populate('steps.buddyId',      'name email')
      .populate('steps.completedBy',  'name email')
      .populate('steps.formId',       'title fields')

    if (!process) {
      return res.status(404).json({ message: 'No workflow found for this order' })
    }

    const now = new Date()

    const stepsWithSLA = process.steps.map((step) => {
      let slaStatus = 'ON_TIME'
      let delayMinutes = 0

      if (step.status === 'DONE') {
        const diff = new Date(step.completedAt) - new Date(step.plannedAt)
        if (diff > 0) {
          slaStatus    = 'DELAYED'
          delayMinutes = Math.round(diff / 60000)
        }
      } else if (step.status === 'PENDING') {
        const diff = now - new Date(step.plannedAt)
        if (diff > 0) {
          slaStatus    = 'OVERDUE'
          delayMinutes = Math.round(diff / 60000)
        }
      }

      return {
        ...step.toObject(),
        slaStatus,
        delayMinutes
      }
    })

    res.json({ ...process.toObject(), steps: stepsWithSLA })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllProcesses = async (req, res) => {
  try {
    const processes = await Process.find()
      .populate('orderId',          'orderNo partyName')
      .populate('steps.assigneeId', 'name email')
      .sort({ createdAt: -1 })

    res.json(processes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const completeStep = async (req, res) => {
  try {
    const { processId, stepId } = req.params
    const { values, attachments } = req.body

    const process = await Process.findById(processId)
      .populate('steps.formId', 'fields')

    if (!process) {
      return res.status(404).json({ message: 'Process not found' })
    }

    const step = process.steps.find((s) => s._id.toString() === stepId)

    if (!step) {
      return res.status(404).json({ message: 'Step not found in this process' })
    }

    if (step.status === 'DONE') {
      return res.status(400).json({ message: 'Step already completed' })
    }

    const isAssigned =
      step.assigneeId?.toString() === req.user._id.toString() ||
      step.buddyId?.toString()    === req.user._id.toString()

    if (!isAssigned && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not assigned to this step' })
    }

    if (step.formId && step.formId.fields) {
      const requiredFields = step.formId.fields.filter((f) => f.required)
      for (const field of requiredFields) {
        if (!values || values[field.key] === undefined || values[field.key] === '') {
          return res.status(400).json({
            message: `Required field missing: ${field.label}`
          })
        }
      }
    }

    const now = new Date()

    step.status           = 'DONE'
    step.completedAt      = now
    step.completedBy      = req.user._id
    step.formSubmission   = {
      values:      values      || {},
      attachments: attachments || []
    }

    if (now > new Date(step.plannedAt)) {
      step.status = 'DONE'
    }

    await process.save()

    res.json({ message: 'Step completed successfully', step })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyTasks = async (req, res) => {
  try {
    const processes = await Process.find({
      'steps.assigneeId': req.user._id
    })
      .populate('orderId',          'orderNo partyName')
      .populate('steps.assigneeId', 'name email')
      .populate('steps.formId',     'title fields')

    const myTasks = []

    processes.forEach((process) => {
      process.steps.forEach((step) => {
        if (step.assigneeId?._id?.toString() === req.user._id.toString()) {
          myTasks.push({
            processId: process._id,
            orderId:   process.orderId,
            step
          })
        }
      })
    })

    res.json(myTasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getNotifications = async (req, res) => {
  try {
    const processes = await Process.find()
      .populate('orderId', 'orderNo partyName')
      .populate('steps.assigneeId', 'name')

    const notifications = []
    const now = new Date()

    processes.forEach((process) => {
      process.steps.forEach((step) => {

        if (
          step.status === 'PENDING' &&
          new Date(step.plannedAt) < now
        ) {
          notifications.push({
            id:      `${process._id}-${step._id}-overdue`,
            type:    'OVERDUE',
            title:   'Step overdue',
            message: `${step.name} for ${process.orderId?.orderNo} is overdue`,
            orderId: process.orderId?._id,
            time:    step.plannedAt,
          })
        }

        if (step.status === 'DONE') {
          notifications.push({
            id:      `${process._id}-${step._id}-done`,
            type:    'DONE',
            title:   'Step completed',
            message: `${step.name} for ${process.orderId?.orderNo} was completed`,
            orderId: process.orderId?._id,
            time:    step.completedAt,
          })
        }

      })
    })

    notifications.sort((a, b) => new Date(b.time) - new Date(a.time))

    res.json(notifications.slice(0, 20))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}