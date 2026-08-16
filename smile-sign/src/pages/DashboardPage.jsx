import { Link } from 'react-router-dom'
import { Plus, ArrowRight } from 'lucide-react'
import { LevelCard } from '../components/LevelCard'
import CouponSection from '../components/CouponSection'
import OrderStatusBadge from '../components/OrderStatusBadge'
import './DashboardPage.css'

function StatBlock({ label, value, sub, color }) {
  return (
    <div className="impeccable-stat">
      <p className="impeccable-stat__label">{label}</p>
      <p className="impeccable-stat__value">{value}</p>
      {sub && <p className="impeccable-stat__sub" style={{ color: color || 'var(--ink-muted)' }}>{sub}</p>}
    </div>
  )
}

export default function DashboardPage({ user, orders }) {
  const recentOrders = orders.slice(0, 3)
  const thisMonthProfit = orders
    .filter(o => o.date.startsWith('2026-08'))
    .reduce((sum, o) => sum + o.profit, 0)

  return (
    <div className="impeccable-dashboard">
      <div className="container" style={{ paddingBlock: 'var(--sp-8)' }}>
        
        {/* Header Section */}
        <div className="impeccable-dashboard__header animate-fade-up">
          <div>
            <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: 6 }}>
              ภาพรวม
            </h1>
            <p className="text-sm text-muted">
              {user.name.split(' ')[0]} • Code: <span className="font-mono" style={{ background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>{user._id ? user._id.slice(-6).toUpperCase() : 'NEW'}</span>
            </p>
          </div>
          <Link to="/order/new" className="btn btn-primary btn-lg" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={18} /> สร้างออเดอร์
          </Link>
        </div>

        {/* Top Grid: Level & Stats side-by-side */}
        <div className="impeccable-dashboard__top-grid animate-fade-up" style={{ animationDelay: '50ms' }}>
          <div className="impeccable-dashboard__level-col">
            <LevelCard user={user} />
          </div>
          
          <div className="impeccable-dashboard__stats-col">
            <div className="impeccable-stats-grid">
              <StatBlock
                label="ยอดขาย (ส.ค.)" 
                value={`฿${(user.currentSales || 0).toLocaleString()}`}
                sub="เป้าหมาย: ฿250,000"
              />
              <StatBlock
                label="กำไร (ส.ค.)"
                value={`฿${thisMonthProfit.toLocaleString()}`}
                color="var(--accent-dark)"
                sub="+12% จากเดือนก่อน"
              />
              <StatBlock
                label="ออเดอร์ทั้งหมด"
                value={user.totalOrders || 0}
                sub="ตลอดอายุการใช้งาน"
              />
              <StatBlock
                label="ออเดอร์ที่ดำเนินการ"
                value={user.thisMonthOrders || 0}
                sub="รอดำเนินการ"
              />
            </div>
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '100ms', marginBottom: 'var(--sp-8)' }}>
          <CouponSection />
        </div>

        {/* Lower Section: Orders Table */}
        <div className="impeccable-dashboard__section animate-fade-up" style={{ animationDelay: '150ms' }}>
          <div className="impeccable-dashboard__section-head">
            <h3 className="font-display" style={{ fontSize: '1.125rem' }}>ออเดอร์ล่าสุด</h3>
            <Link to="/orders" className="btn btn-ghost btn-sm text-brand">
              ดูทั้งหมด <ArrowRight size={14} />
            </Link>
          </div>

          <div className="impeccable-table-wrap" style={{ borderRadius: 0, border: 'none', boxShadow: 'none' }}>
            {recentOrders.length === 0 ? (
              <div style={{ padding: 'var(--sp-10)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-3)', opacity: 0.4 }}>📦</div>
                <p className="font-600" style={{ marginBottom: 4 }}>ยังไม่มีออเดอร์</p>
                <p className="text-sm text-muted" style={{ marginBottom: 'var(--sp-4)' }}>เริ่มสร้างออเดอร์แรกของคุณเลย!</p>
                <Link to="/order/new" className="btn btn-primary btn-sm"><Plus size={14} /> สร้างออเดอร์</Link>
              </div>
            ) : (
            <table className="impeccable-table">
              <thead>
                <tr>
                  <th>สินค้า</th>
                  <th>ลูกค้า</th>
                  <th>สถานะ</th>
                  <th className="text-right">กำไร</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id || order._id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span className="font-500 text-sm" style={{ color: 'var(--ink)' }}>{order.product}</span>
                        <span className="font-mono text-xs text-muted">ID: {order.id ? order.id.slice(-6).toUpperCase() : 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm" style={{ color: 'var(--ink-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                        {order.customer}
                      </div>
                    </td>
                    <td><OrderStatusBadge statusKey={order.statusKey} /></td>
                    <td className="text-right">
                      <span className="font-mono font-600 text-sm">
                        ฿{order.profit.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
