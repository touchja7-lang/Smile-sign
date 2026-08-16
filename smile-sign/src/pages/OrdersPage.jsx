import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ChevronDown, Search, Plus } from 'lucide-react'
import OrderStatusBadge from '../components/OrderStatusBadge'
import { statusConfig } from '../data/mockData'
import './OrdersPage.css'

const STATUS_TABS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'pending', label: 'รอยืนยัน' },
  { key: 'progress', label: 'กำลังผลิต' },
  { key: 'deliver', label: 'พร้อมส่ง' },
  { key: 'installed', label: 'เสร็จสิ้น' },
]

export default function OrdersPage({ orders }) {
  const [expandedId, setExpandedId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.statusKey === filterStatus
    const q = search.toLowerCase()
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  // Summary stats
  const totalProfit = orders.reduce((s, o) => s + o.profit, 0)
  const byStatus = (key) => orders.filter(o => o.statusKey === key).length

  return (
    <div className="impeccable-orders-page">
      <div className="container" style={{ paddingBlock: 'var(--sp-8)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--sp-6)' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: 6 }}>รายการออเดอร์</h1>
            <p className="text-sm text-muted">{orders.length} รายการทั้งหมด</p>
          </div>
          <Link to="/order/new" className="btn btn-primary btn-lg" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={18} /> สร้างออเดอร์
          </Link>
        </div>

        {/* Summary strip */}
        <div className="orders-summary animate-fade-up">
          <div className="orders-summary__block">
            <span className="text-xs text-muted uppercase tracking-wide">ออเดอร์ทั้งหมด</span>
            <span className="font-mono font-600 text-xl">{orders.length}</span>
          </div>
          <div className="orders-summary__block">
            <span className="text-xs text-muted uppercase tracking-wide">กำลังผลิต</span>
            <span className="font-mono font-600 text-xl">{byStatus('progress')}</span>
          </div>
          <div className="orders-summary__block">
            <span className="text-xs text-muted uppercase tracking-wide">พร้อมส่ง</span>
            <span className="font-mono font-600 text-xl">{byStatus('deliver')}</span>
          </div>
          <div className="orders-summary__block orders-summary__block--accent">
            <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--brand)' }}>กำไรรวม</span>
            <span className="font-mono font-600 text-xl text-brand">฿{totalProfit.toLocaleString()}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="orders-filters animate-fade-up" style={{ animationDelay: '50ms', marginBottom: 'var(--sp-5)' }}>
          <div className="orders-filter-tabs">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                className={`orders-filter-tab ${filterStatus === tab.key ? 'orders-filter-tab--active' : ''}`}
                onClick={() => setFilterStatus(tab.key)}
              >
                {tab.label}
                {tab.key !== 'all' && (
                  <span className="orders-filter-tab__count">{byStatus(tab.key)}</span>
                )}
              </button>
            ))}
          </div>

          <div className="admin-search-wrap" style={{ flex: '0 0 260px' }}>
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              className="admin-search-input"
              placeholder="ค้นหา Order ID, ลูกค้า, สินค้า..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Orders list */}
        <div className="impeccable-orders-list animate-fade-up" style={{ animationDelay: '100ms', background: 'var(--surface)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-xs)' }}>
          <div className="impeccable-orders-list__header">
            <div>สินค้า</div>
            <div>ลูกค้า</div>
            <div>สถานะ</div>
            <div className="text-right" style={{ paddingRight: '22px' }}>กำไร</div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--sp-10)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-3)', opacity: 0.4 }}>📦</div>
              <p className="font-600" style={{ marginBottom: 4 }}>ไม่พบออเดอร์</p>
              <p className="text-sm text-muted" style={{ marginBottom: 'var(--sp-4)' }}>ไม่มีออเดอร์ที่ตรงกับเงื่อนไขการค้นหาของคุณ</p>
            </div>
          ) : filtered.map(order => {
            const isExpanded = expandedId === order.id
            return (
              <div key={order.id} className="impeccable-order-row-wrap">
                <div
                  className="impeccable-order-row"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span className="font-500 text-sm" style={{ color: 'var(--ink)' }}>{order.product}</span>
                    <span className="font-mono text-xs text-muted">ID: {order.id ? order.id.slice(-6).toUpperCase() : 'N/A'}</span>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--ink-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '12px' }}>
                    {order.customer}
                  </div>
                  <div><OrderStatusBadge statusKey={order.statusKey} /></div>
                  <div className="text-right flex items-center justify-end gap-2">
                    <span className="font-mono font-600">฿{order.profit.toLocaleString()}</span>
                    <ChevronDown size={14} className="text-muted" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="impeccable-order-detail animate-fade-in">
                    <div className="impeccable-order-detail__grid">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="text-xs text-muted font-600 tracking-wide">สเปกสินค้า (Specs)</span>
                        <span className="text-sm font-500">{order.specs}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="text-xs text-muted font-600 tracking-wide">ต้นทุนโรงงาน</span>
                        <span className="font-mono font-500">฿{order.costPrice.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="text-xs text-muted font-600 tracking-wide">ราคาขายลูกค้า</span>
                        <span className="font-mono font-500 text-brand">฿{order.sellPrice.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="text-xs text-muted font-600 tracking-wide">การจัดส่ง</span>
                        <span className="text-sm font-500" style={{ textTransform: 'capitalize' }}>
                          {{ pickup: 'รับเองหน้าร้าน', delivery: 'จัดส่งพัสดุ', install: 'เข้าติดตั้งหน้างาน' }[order.delivery.toLowerCase()] || order.delivery}
                        </span>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        <Link to={`/quotation/${order.id}`} className="btn btn-outline btn-sm">
                          <FileText size={14} /> เปิดใบเสนอราคา
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
