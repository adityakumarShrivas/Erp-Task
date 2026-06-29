import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'

import authRoutes    from './routes/authRoutes.js'
import stepRoutes    from './routes/stepRoutes.js'
import formRoutes    from './routes/formRoutes.js'
import orderRoutes   from './routes/orderRoutes.js'
import processRoutes from './routes/processRoutes.js'

dotenv.config()
connectDB()

const app = express()

// app.use(cors())
app.use(cors({
  origin: 'https://erp-task-pi.vercel.app',
  credentials: true
}))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/auth',    authRoutes)
app.use('/api/steps',   stepRoutes)
app.use('/api/forms',   formRoutes)
app.use('/api/orders',  orderRoutes)
app.use('/api/process', processRoutes)

app.get('/', (req, res) => res.json({ message: 'FMS API running' }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))