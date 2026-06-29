import { useSelector } from 'react-redux'
import { useGetOrdersQuery }      from '../../features/api/ordersApi.js'
import { useGetStepsQuery }       from '../../features/api/stepsApi.js'
import { useGetFormsQuery }       from '../../features/api/formsApi.js'
import { useGetAllProcessesQuery } from '../../features/api/processApi.js'
import Layout from '../../components/Layout.jsx'
import { PackageOpen, ListChecks, FormInput, AlertTriangle, Clock, CheckCircle2, Circle } from 'lucide-react'

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-slate-800">{value ?? '—'}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: 'bg-amber-50 text-amber-600 border border-amber-200',
    DONE:    'bg-green-50 text-green-600 border border-green-200',
    OVERDUE: 'bg-red-50 text-red-600 border border-red-200',
  }
  const icons = {
    PENDING: <Clock size={11} />,
    DONE:    <CheckCircle2 size={11} />,
    OVERDUE: <AlertTriangle size={11} />,
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.PENDING}`}>
      {icons[status]}
      {status}
    </span>
  )
}

function Dashboard() {
  const { user } = useSelector((state) => state.auth)
  const { data: orders    = [] } = useGetOrdersQuery()
  const { data: steps     = [] } = useGetStepsQuery()
  const { data: forms     = [] } = useGetFormsQuery()
  const { data: processes = [] } = useGetAllProcessesQuery()

  const overdueCount = processes.reduce((acc, p) => {
    return acc + p.steps.filter((s) => s.status === 'OVERDUE').length
  }, 0)

  const completedCount = processes.reduce((acc, p) => {
    return acc + p.steps.filter((s) => s.status === 'DONE').length
  }, 0)

  return (
    <Layout
      title="Dashboard"
      subtitle={`Welcome back, ${user?.name}`}
    >
      <div className="space-y-4">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total orders"     value={orders.length}    icon={PackageOpen}   color="bg-blue-500"   />
          <StatCard label="Workflow steps"   value={steps.length}     icon={ListChecks}    color="bg-violet-500" />
          <StatCard label="Steps completed"  value={completedCount}   icon={CheckCircle2}  color="bg-green-500"  />
          <StatCard label="Overdue tasks"    value={overdueCount}     icon={AlertTriangle} color="bg-red-500"    />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">

          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Recent orders</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <PackageOpen size={28} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No orders yet</p>
                </div>
              ) : (
                orders.slice(0, 5).map((order) => {
                  const process = processes.find(
                    (p) => p.orderId?._id === order._id || p.orderId === order._id
                  )
                  const done    = process?.steps.filter((s) => s.status === 'DONE').length    || 0
                  const total   = process?.steps.length || 0

                  return (
                    <div key={order._id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{order.orderNo}</p>
                        <p className="text-xs text-slate-400">{order.partyName}</p>
                      </div>
                      <div className="text-right">
                        {process ? (
                          <p className="text-xs text-slate-500">{done}/{total} steps done</p>
                        ) : (
                          <span className="text-xs text-amber-500 font-medium">Not started</span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Configured steps</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {steps.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <ListChecks size={28} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No steps configured yet</p>
                </div>
              ) : (
                steps.map((step) => (
                  <div key={step._id} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500">
                      {step.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{step.name}</p>
                      <p className="text-xs text-slate-400">{step.assigneeId?.name} · {step.slaMinutes} min SLA</p>
                    </div>
                    <Circle size={8} className="text-slate-300 flex-shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </Layout>
  )
}

export default Dashboard