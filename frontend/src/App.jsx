import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import StepBuilder from './pages/admin/StepBuilder.jsx'
import FormBuilder from './pages/admin/FormBuilder.jsx'
import Orders from './pages/admin/Orders.jsx'
import MyTasks from './pages/doer/MyTasks.jsx'
import FMSTracker from './pages/tracker/FMSTracker.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/"          element={<Navigate to="/login" />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/dashboard"    element={<Dashboard />} />
            <Route path="/steps"        element={<StepBuilder />} />
            <Route path="/forms"        element={<FormBuilder />} />
            <Route path="/orders"       element={<Orders />} />
          </Route>
          <Route path="/my-tasks"     element={<MyTasks />} />
          <Route path="/tracker"      element={<FMSTracker />} />
          <Route path="/tracker/:orderId" element={<FMSTracker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App