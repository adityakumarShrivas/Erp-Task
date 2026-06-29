import Step from '../models/Step.js'

export const createStep = async (req, res) => {
  try {
    const { name, order, description, assigneeId, buddyId, slaMinutes, formId } = req.body

    if (!name || !order || !assigneeId || !slaMinutes) {
      return res.status(400).json({ message: 'Name, order, assignee and SLA are required' })
    }

    const step = await Step.create({
      name,
      order,
      description,
      assigneeId,
      buddyId: buddyId || null,
      slaMinutes,
      formId: formId || null
    })

    const populated = await step.populate([
      { path: 'assigneeId', select: 'name email' },
      { path: 'buddyId',    select: 'name email' },
      { path: 'formId',     select: 'title' }
    ])

    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllSteps = async (req, res) => {
  try {
    const steps = await Step.find()
      .populate('assigneeId', 'name email')
      .populate('buddyId',    'name email')
      .populate('formId',     'title')
      .sort({ order: 1 })

    res.json(steps)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getStepById = async (req, res) => {
  try {
    const step = await Step.findById(req.params.id)
      .populate('assigneeId', 'name email')
      .populate('buddyId',    'name email')
      .populate('formId',     'title fields')

    if (!step) {
      return res.status(404).json({ message: 'Step not found' })
    }

    res.json(step)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateStep = async (req, res) => {
  try {
    const step = await Step.findById(req.params.id)

    if (!step) {
      return res.status(404).json({ message: 'Step not found' })
    }

    const { name, order, description, assigneeId, buddyId, slaMinutes, formId } = req.body

    step.name        = name        ?? step.name
    step.order       = order       ?? step.order
    step.description = description ?? step.description
    step.assigneeId  = assigneeId  ?? step.assigneeId
    step.buddyId     = buddyId     ?? step.buddyId
    step.slaMinutes  = slaMinutes  ?? step.slaMinutes
    step.formId      = formId      ?? step.formId

    await step.save()

    const populated = await step.populate([
      { path: 'assigneeId', select: 'name email' },
      { path: 'buddyId',    select: 'name email' },
      { path: 'formId',     select: 'title' }
    ])

    res.json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteStep = async (req, res) => {
  try {
    const step = await Step.findById(req.params.id)

    if (!step) {
      return res.status(404).json({ message: 'Step not found' })
    }

    await step.deleteOne()
    res.json({ message: 'Step deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}