import Order from '../models/Order.js'
import Step from '../models/Step.js'
import Process from '../models/Process.js'

export const createOrder = async (req, res) => {
  try {
    const { orderNo, partyName } = req.body

    if (!orderNo || !partyName) {
      return res.status(400).json({ message: 'Order number and party name are required' })
    }

    const orderExists = await Order.findOne({ orderNo })
    if (orderExists) {
      return res.status(400).json({ message: 'Order number already exists' })
    }

    const order = await Order.create({
      orderNo,
      partyName,
      createdBy: req.user._id
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('createdBy', 'name email')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const startWorkflow = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const existingProcess = await Process.findOne({ orderId: order._id })
    if (existingProcess) {
      return res.status(400).json({ message: 'Workflow already started for this order' })
    }

    const steps = await Step.find().sort({ order: 1 })

    if (steps.length === 0) {
      return res.status(400).json({ message: 'No steps configured. Please create steps first' })
    }

    let cumulativeMinutes = 0

    const processSteps = steps.map((step) => {
      cumulativeMinutes += step.slaMinutes
      const plannedAt = new Date(Date.now() + cumulativeMinutes * 60 * 1000)

      return {
        stepId:     step._id,
        name:       step.name,
        order:      step.order,
        formId:     step.formId,
        status:     'PENDING',
        assigneeId: step.assigneeId,
        buddyId:    step.buddyId,
        slaMinutes: step.slaMinutes,
        plannedAt,
      }
    })

    const process = await Process.create({
      orderId: order._id,
      steps:   processSteps
    })

    res.status(201).json({
      message: 'Workflow started successfully',
      process
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}