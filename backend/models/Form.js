import mongoose from 'mongoose'

const fieldSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['TEXT', 'NUMBER', 'DATE', 'SELECT', 'CHECKBOX', 'FILE'],
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  options: {
    type: [String],
    default: []
  }
})

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  fields: [fieldSchema]
}, { timestamps: true })

const Form = mongoose.model('Form', formSchema)
export default Form