import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import ReactDOM from 'react-dom'
import { Package, Clock, CheckCircle, Truck, Wrench, XCircle, ChevronDown, RefreshCw, AlertTriangle, Factory } from 'lucide-react'
import { getAllOrdersAdmin, updateOrderStatus } from '../api'
import './AdminOrdersPage.css'

const STATUS_LIST = [
  { key: 'Pending',          labelTh: 'รอดำเนินการ',   icon: <Clock size={13} />,        color: '#f59e0b' },
  { key: 'Confirm Artwork',  labelTh: 'ยืนยันงานพิมพ์', icon: <CheckCircle size={13} />,  color: '#3b82f6' },
  { key: 'Producing',        labelTh: 'กำลังผลิต',     icon: <Wrench size={13} />,       color: '#8b5cf6' },
  { key: 'Ready to Ship',    labelTh: 'พร้อมส่ง',      icon: <Truck size={13} />,        color: '#10b981' },
  { key: 'Completed',        labelTh: 'เสร็จสมบูรณ์',  icon: <CheckCircle size={13} />,  color: '#059669' },
  { key: 'Cancelled',        labelTh: 'ยกเลิก',        icon: <XCircle size={13} />,      color: '#ef4444' },
]

function StatusBadge({ statusKey }) {
  const s = STATUS_LIST.find(s => s.key === statusKey) || STATUS_LIST[0]
  return (
    <span className="admin-status-badge" style={{ '--badge-color': s.color }}>
      {s.icon}
      {s.labelTh}
    </span>
  )
}

function StatusDropdown({ orderId, currentStatus, onUpdate }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [coords, setCoords] = useState(null)
  const btnRef = useRef(null)

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      // Basic positioning logic
      let top = rect.bottom + 4
      let left = rect.left

      // Simple viewport overflow protection
      if (top + 250 > window.innerHeight) {
        top = rect.top - 250 - 4
      }
      
      setCoords({ top, left })
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const handleChange = async (newStatus) => {
    if (newStatus === currentStatus) { setOpen(false); return }
    setLoading(true)
    setOpen(false)
    try {
      await onUpdate(orderId, newStatus)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-status-dropdown-wrap">
      <button
        ref={btnRef}
        className="admin-status-btn"
        onClick={handleToggle}
        disabled={loading}
      >
        {loading
          ? <span className="admin-spinner" />
          : <><StatusBadge statusKey={currentStatus} /> <ChevronDown size={12} /></>
        }
      </button>
      {open && coords && ReactDOM.createPortal(
        <>
          <div className="admin-dropdown-backdrop" onClick={() => setOpen(false)} />
          <div 
            className="admin-dropdown-menu" 
            style={{ 
              top: `${coords.top}px`, 
              left: `${coords.left}px`,
              animation: 'fade-in 150ms forwards'
            }}
          >
            <p className="admin-dropdown-title">เปลี่ยนสถานะเป็น</p>
            {STATUS_LIST.map(s => (
              <button
                key={s.key}
                className={`admin-dropdown-item ${s.key === currentStatus ? 'admin-dropdown-item--active' : ''}`}
                onClick={() => handleChange(s.key)}
                style={{ '--item-color': s.color }}
              >
                {s.icon} {s.labelTh}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    setError('')
    try {
      const data = await getAllOrdersAdmin()
      setOrders(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: updated.status } : o))
    } catch (e) {
      alert(`เกิดข้อผิดพลาด: ${e.message}`)
    }
  }

  // Summary counts
  const countByStatus = (key) => orders.filter(o => o.status === key).length
  const totalRevenue = orders.reduce((s, o) => s + (o.financials?.shopCost || 0), 0)

  // Filters
  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    const q = search.toLowerCase()
    const sellerName = o.seller?.name || ''
    const productName = o.product?.name || ''
    const matchSearch = !q
      || o._id.toLowerCase().includes(q)
      || sellerName.toLowerCase().includes(q)
      || productName.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  return (
    <div className="admin-page">
      <div className="admin-container">

        {/* ── Header ── */}
        <div className="admin-header animate-fade-up">
          <div className="admin-header__left">
            <div className="admin-header__icon-wrap">
              <Factory size={24} color="#1a1a00" />
            </div>
            <div>
              <h1 className="admin-header__title">แผงควบคุมโรงงาน</h1>
              <p className="admin-header__sub">Factory Admin Portal — จัดการออเดอร์ทั้งหมดในระบบ</p>
            </div>
          </div>
          <button
            className="btn btn-sm"
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            รีเฟรช
          </button>
        </div>

        {/* ── Summary Stats ── */}
        <div className="admin-stats animate-fade-up" style={{ animationDelay: '50ms' }}>
          <div className="admin-stat-card admin-stat-card--total">
            <div className="admin-stat-card__icon-wrap"><Package size={20} /></div>
            <div>
              <p className="admin-stat-card__label">ออเดอร์ทั้งหมด</p>
              <p className="admin-stat-card__value">{orders.length}</p>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-card--amber">
            <div className="admin-stat-card__icon-wrap"><Clock size={20} /></div>
            <div>
              <p className="admin-stat-card__label">รอดำเนินการ</p>
              <p className="admin-stat-card__value">{countByStatus('Pending')}</p>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-card--purple">
            <div className="admin-stat-card__icon-wrap"><Wrench size={20} /></div>
            <div>
              <p className="admin-stat-card__label">กำลังผลิต</p>
              <p className="admin-stat-card__value">{countByStatus('Producing')}</p>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-card--teal">
            <div className="admin-stat-card__icon-wrap"><Truck size={20} /></div>
            <div>
              <p className="admin-stat-card__label">พร้อมส่ง</p>
              <p className="admin-stat-card__value">{countByStatus('Ready to Ship')}</p>
            </div>
          </div>
          <div className="admin-stat-card admin-stat-card--yellow">
            <div className="admin-stat-card__icon-wrap"><CheckCircle size={20} /></div>
            <div>
              <p className="admin-stat-card__label">ยอดราคาทุนรวม</p>
              <p className="admin-stat-card__value font-mono">฿{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="admin-filters animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="admin-filter-tabs">
            <button
              className={`admin-filter-tab ${filterStatus === 'all' ? 'admin-filter-tab--active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >ทั้งหมด ({orders.length})</button>
            {STATUS_LIST.map(s => (
              <button
                key={s.key}
                className={`admin-filter-tab ${filterStatus === s.key ? 'admin-filter-tab--active' : ''}`}
                onClick={() => setFilterStatus(s.key)}
                style={filterStatus === s.key ? { '--tab-color': s.color } : {}}
              >
                {s.labelTh} ({countByStatus(s.key)})
              </button>
            ))}
          </div>
          <input
            type="text"
            className="form-input admin-search"
            placeholder="🔍 ค้นหา Order ID, ชื่อเซลล์, สินค้า..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ── Orders Table ── */}
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner admin-spinner--lg" />
            <p>กำลังโหลดข้อมูลออเดอร์...</p>
          </div>
        ) : error ? (
          <div className="admin-error">
            <AlertTriangle size={32} />
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => fetchOrders()}>ลองใหม่</button>
          </div>
        ) : (
          <div className="admin-table-wrap animate-fade-up" style={{ animationDelay: '150ms' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ออเดอร์ & สินค้า</th>
                  <th>ตัวแทน (Seller)</th>
                  <th>ไฟล์งาน & Artwork</th>
                  <th>ราคาทุน</th>
                  <th>การจัดส่ง</th>
                  <th>ดำเนินการด่วน</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-table__empty">
                      ไม่พบออเดอร์ที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                ) : filtered.map(order => {
                  const isPending         = order.status === 'Pending'
                  const isArtworkPending  = order.status === 'Pending' || order.status === 'Confirm Artwork'
                  const isConfirmed       = order.status === 'Confirm Artwork'
                  const isProducing       = order.status === 'Producing'
                  return (
                  <tr key={order._id} className="admin-table__row">
                    <td>
                      <p className="font-500 text-sm">{order.product?.name || 'Custom Order'}</p>
                      <p className="font-mono text-xs text-muted" style={{ marginTop: '2px' }}>
                        ID: {order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
                        {new Date(order.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td>
                      <p className="font-500 text-sm">{order.seller?.name || '-'}</p>
                      <p className="text-xs text-muted">{order.seller?.email || '-'}</p>
                    </td>
                    <td>
                      <p className="text-sm">
                        {order.specs?.width}×{order.specs?.height} ม. × {order.specs?.quantity} ชิ้น
                      </p>
                      {/* Artwork status */}
                      <div className="admin-artwork-status">
                        {order.artwork?.fileUrl ? (
                          <a href={order.artwork.fileUrl} target="_blank" rel="noreferrer" className="admin-file-link">
                            📎 ดาวน์โหลดไฟล์งาน
                          </a>
                        ) : (
                          <span className="admin-artwork-badge admin-artwork-badge--waiting">⏳ รอไฟล์งาน</span>
                        )}
                        {/* Artwork approval status pill */}
                        {order.artwork?.designStatus && (
                          <span className={`admin-artwork-badge ${
                            order.artwork.designStatus === 'Approved' ? 'admin-artwork-badge--approved'
                            : order.artwork.designStatus === 'Ready to Print' ? 'admin-artwork-badge--ready'
                            : 'admin-artwork-badge--draft'
                          }`}>
                            {order.artwork.designStatus === 'Approved' ? '✅ อนุมัติแล้ว'
                            : order.artwork.designStatus === 'Ready to Print' ? '🖨️ พร้อมพิมพ์'
                            : '✏️ กำลังออกแบบ'}
                          </span>
                        )}
                      </div>
                      {order.artwork?.note && (
                        <p className="text-xs text-muted" style={{ marginTop: '4px', fontStyle: 'italic' }}>
                          💬 "{order.artwork.note}"
                        </p>
                      )}
                    </td>
                    <td>
                      <p className="font-mono font-600">฿{(order.financials?.shopCost || 0).toLocaleString()}</p>
                      <p className="text-xs text-muted">ราคาขาย: ฿{(order.financials?.clientSellingPrice || 0).toLocaleString()}</p>
                    </td>
                    <td>
                      <span className="text-sm" style={{ textTransform: 'capitalize' }}>
                        {order.logistics?.deliveryMethod || '-'}
                      </span>
                      {order.logistics?.shippingAddress && (
                        <p className="text-xs text-muted admin-address-wrap">{order.logistics.shippingAddress}</p>
                      )}
                    </td>
                    {/* ── Quick Action Buttons ── */}
                    <td>
                      <div className="admin-quick-actions">
                        {/* อนุมัติแบบ: Pending -> Confirm Artwork */}
                        {isPending && (
                          <button
                            className="admin-action-btn admin-action-btn--approve"
                            onClick={() => handleStatusUpdate(order._id, 'Confirm Artwork')}
                            title="อนุมัติแบบให้เซลล์"
                          >
                            ✅ อนุมัติแบบ
                          </button>
                        )}
                        {/* เริ่มผลิต: Confirm Artwork -> Producing */}
                        {isConfirmed && (
                          <button
                            className="admin-action-btn admin-action-btn--produce"
                            onClick={() => handleStatusUpdate(order._id, 'Producing')}
                            title="เริ่มผลิตงาน"
                          >
                            ⚙️ เริ่มผลิต
                          </button>
                        )}
                        {/* พร้อมส่ง: Producing -> Ready to Ship */}
                        {isProducing && (
                          <button
                            className="admin-action-btn admin-action-btn--ship"
                            onClick={() => handleStatusUpdate(order._id, 'Ready to Ship')}
                            title="สินค้าพร้อมส่ง"
                          >
                            🚚 พร้อมส่ง
                          </button>
                        )}
                        {/* Status dropdown for full control */}
                        <StatusDropdown
                          orderId={order._id}
                          currentStatus={order.status}
                          onUpdate={handleStatusUpdate}
                        />
                      </div>
                    </td>
                    <td>
                      <StatusBadge statusKey={order.status} />
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
