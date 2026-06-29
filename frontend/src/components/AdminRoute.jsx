import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function AdminRoute() {
  const { user } = useSelector((state) => state.auth)
  return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to="/my-tasks" replace />
}

export default AdminRoute