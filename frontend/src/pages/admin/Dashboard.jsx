import { useSelector } from 'react-redux'
import { useGetOrdersQuery }      from '../../features/api/ordersApi.js'
import { useGetStepsQuery }       from '../../features/api/stepsApi.js'
import { useGetFormsQuery }       from '../../features/api/formsApi.js'
import { useGetAllProcessesQuery } from '../../features/api/processApi.js'
import Layout from '../../components/Layout.jsx'
import { PackageOpen, ListChecks, AlertTriangle, Clock, CheckCircle2, Circle } from 'lucide-react'

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '12px',
      border: '1px solid #e2e8f0', padding: '20px',
      minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={16} color="white" />
        </div>
      </div>
      <p style={{ fontSize: '28px', fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>
        {value ?? '—'}
      </p>
    </div>
  )
}

function Dashboard() {
  const { user } = useSelector((state) => state.auth)
  const { data: orders    = [] } = useGetOrdersQuery()
  const { data: steps     = [] } = useGetStepsQuery()
  const { data: forms     = [] } = useGetFormsQuery()
  const { data: processes = [] } = useGetAllProcessesQuery()

  const overdueCount = processes.reduce((acc, p) =>
    acc + p.steps.filter((s) => s.status === 'OVERDUE').length, 0)

  const completedCount = processes.reduce((acc, p) =>
    acc + p.steps.filter((s) => s.status === 'DONE').length, 0)

  return (
    <Layout title="Dashboard" subtitle={`Welcome back, ${user?.name}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <StatCard label="Total orders"    value={orders.length}   icon={PackageOpen}   color="#3b82f6" />
          <StatCard label="Workflow steps"  value={steps.length}    icon={ListChecks}    color="#8b5cf6" />
          <StatCard label="Steps completed" value={completedCount}  icon={CheckCircle2}  color="#22c55e" />
          <StatCard label="Overdue tasks"   value={overdueCount}    icon={AlertTriangle} color="#ef4444" />
        </div>

        {/* Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

          {/* Recent orders */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: 0 }}>Recent orders</h2>
            </div>
            <div>
              {orders.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <PackageOpen size={28} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '13px', color: '#94a3b8' }}>No orders yet</p>
                </div>
              ) : (
                orders.slice(0, 5).map((order) => {
                  const process = processes.find(
                    (p) => p.orderId?._id === order._id || p.orderId === order._id
                  )
                  const done  = process?.steps.filter((s) => s.status === 'DONE').length || 0
                  const total = process?.steps.length || 0
                  return (
                    <div key={order._id} style={{
                      padding: '12px 20px', display: 'flex',
                      alignItems: 'center', justifyContent: 'space-between',
                      borderBottom: '1px solid #f8fafc'
                    }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151', margin: 0 }}>{order.orderNo}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>{order.partyName}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {process ? (
                          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{done}/{total} steps done</p>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '500' }}>Not started</span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Configured steps */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: 0 }}>Configured steps</h2>
            </div>
            <div>
              {steps.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <ListChecks size={28} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '13px', color: '#94a3b8' }}>No steps configured yet</p>
                </div>
              ) : (
                steps.map((step) => (
                  <div key={step._id} style={{
                    padding: '12px 20px', display: 'flex',
                    alignItems: 'center', gap: '12px',
                    borderBottom: '1px solid #f8fafc'
                  }}>
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      backgroundColor: '#f1f5f9', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: '600', color: '#64748b', flexShrink: 0
                    }}>
                      {step.order}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {step.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>
                        {step.assigneeId?.name} · {step.slaMinutes} min SLA
                      </p>
                    </div>
                    <Circle size={8} color="#cbd5e1" style={{ flexShrink: 0 }} />
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