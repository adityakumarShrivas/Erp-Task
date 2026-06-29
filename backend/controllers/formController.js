import Form from '../models/Form.js'

export const createForm = async (req, res) => {
  try {
    const { title, fields } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Form title is required' })
    }

    const form = await Form.create({ title, fields: fields || [] })
    res.status(201).json(form)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 })
    res.json(forms)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)

    if (!form) {
      return res.status(404).json({ message: 'Form not found' })
    }

    res.json(form)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)

    if (!form) {
      return res.status(404).json({ message: 'Form not found' })
    }

    const { title, fields } = req.body

    form.title  = title  ?? form.title
    form.fields = fields ?? form.fields

    await form.save()
    res.json(form)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)

    if (!form) {
      return res.status(404).json({ message: 'Form not found' })
    }

    await form.deleteOne()
    res.json({ message: 'Form deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}