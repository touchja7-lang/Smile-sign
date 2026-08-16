import { useState, useEffect, useCallback } from 'react'
import { Users, Search, Edit3, Shield, Percent, TrendingUp, X } from 'lucide-react'
import { getUsers, updateUser } from '../api'

const LEVEL_CONFIG = {
  Bronze:   { color: '#cd7f32', bg: '#fdf3e7' },
  Silver:   { color: '#6b7280', bg: '#f3f4f6' },
  Gold:     { color: '#d97706', bg: '#fffbeb' },
  Platinum: { color: '#7c3aed', bg: '#f5f3ff' },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    role: 'Seller',
    sellerLevel: 'Bronze',
    discountRate: 0,
  })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  // Helpers
  const openEditModal = (user) => {
    setEditingUser(user)
    setFormData({
      role: user.role,
      sellerLevel: user.sellerData?.sellerLevel || 'Bronze',
      discountRate: user.sellerData?.discountRate || 0,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        role: formData.role,
        sellerLevel: formData.sellerLevel,
        discountRate: Number(formData.discountRate)
      }
      await updateUser(editingUser._id, payload)
      closeModal()
      fetchUsers() // Refresh list
    } catch (err) {
      alert(`Error updating user: ${err.message}`)
    }
  }

  // Filter
  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-users-page" style={{ padding: 'var(--sp-6) 0' }}>
      <div className="container">
        
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)' }}>
              <Users size={24} />
            </div>
            <div>
              <h1 className="font-display font-600" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>จัดการเซลล์ (Users)</h1>
              <p className="text-muted text-sm">จัดการระดับของเซลล์ เปอร์เซ็นต์ส่วนลด และสิทธิ์ผู้ดูแลระบบ</p>
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="admin-filters" style={{ marginBottom: 'var(--sp-4)' }}>
          <div className="admin-search-wrap">
            <Search size={16} className="admin-search-icon" />
            <input 
              type="text" 
              className="admin-search-input"
              placeholder="ค้นหาชื่อ หรืออีเมล..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--ink-muted)' }}>กำลังโหลด...</div>
        ) : error ? (
          <div className="profile-alert profile-alert--error">เกิดข้อผิดพลาด: {error}</div>
        ) : (
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', backgroundColor: '#FFF' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 500, fontSize: '0.85rem', color: 'var(--ink-muted)' }}>ผู้ใช้งาน</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500, fontSize: '0.85rem', color: 'var(--ink-muted)' }}>ระดับเซลล์ (Tier)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500, fontSize: '0.85rem', color: 'var(--ink-muted)' }}>ยอดขายสะสม</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500, fontSize: '0.85rem', color: 'var(--ink-muted)', textAlign: 'right' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--ink-muted)' }}>ไม่พบข้อมูลผู้ใช้</td></tr>
                ) : filtered.map(user => {
                  const lvl = user.sellerData?.sellerLevel || 'Bronze'
                  const cfg = LEVEL_CONFIG[lvl] || LEVEL_CONFIG.Bronze
                  return (
                    <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-600 text-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {user.name}
                              {user.role === 'Admin' && <span style={{ backgroundColor: 'var(--ink)', color: '#FFF', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>ADMIN</span>}
                            </p>
                            <p className="text-xs text-muted" style={{ marginTop: 2 }}>{user.email}</p>
                            {user.sellerData?.shopDetails?.shopName && (
                              <p className="text-xs text-muted" style={{ marginTop: 2 }}>ร้าน: {user.sellerData.shopDetails.shopName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {user.role === 'Admin' ? (
                          <span className="text-xs text-muted">-</span>
                        ) : (
                          <div>
                            <span style={{ 
                              display: 'inline-flex', alignItems: 'center', gap: 4, 
                              backgroundColor: cfg.bg, color: cfg.color, 
                              padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 
                            }}>
                              {lvl}
                            </span>
                            <p className="text-xs text-muted" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Percent size={10} /> ส่วนลด {user.sellerData?.discountRate || 0}%
                            </p>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {user.role === 'Admin' ? (
                          <span className="text-xs text-muted">-</span>
                        ) : (
                          <div>
                            <p className="font-mono font-600 text-sm">฿{(user.sellerData?.totalSalesVolume || 0).toLocaleString()}</p>
                            <p className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                              <TrendingUp size={10} /> ยอดรวม
                            </p>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEditModal(user)}>
                          <Edit3 size={14} /> แก้ไข
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {isModalOpen && editingUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }} onClick={closeModal}>
          <div style={{ backgroundColor: '#FFF', borderRadius: 'var(--r-lg)', width: '100%', maxWidth: 450, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="font-display font-600" style={{ fontSize: '1.25rem' }}>แก้ไขสิทธิ์: {editingUser.name}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: 24 }}>
              
              <div style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={14}/> บทบาท (Role)</label>
                <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="Seller">เซลล์ (Seller)</option>
                  <option value="Admin">แอดมิน (Admin)</option>
                </select>
                <p className="text-xs text-muted" style={{ marginTop: 6 }}>แอดมินจะสามารถเข้ามาจัดการหลังบ้านได้</p>
              </div>

              {formData.role === 'Seller' && (
                <div style={{ backgroundColor: 'var(--surface-2)', padding: 16, borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                  <h3 className="font-600 text-sm" style={{ marginBottom: 12 }}>ตั้งค่าสิทธิประโยชน์เซลล์</h3>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">ระดับเซลล์ (Tier)</label>
                    <select className="form-select" value={formData.sellerLevel} onChange={e => setFormData({...formData, sellerLevel: e.target.value})}>
                      <option value="Bronze">Bronze (เริ่มต้น)</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">เปอร์เซ็นต์ส่วนลด (%)</label>
                    <div style={{ position: 'relative' }}>
                      <Percent size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#9ca3af' }} />
                      <input 
                        required 
                        type="number" min="0" max="100" 
                        className="form-input" 
                        style={{ paddingLeft: 30 }}
                        value={formData.discountRate} 
                        onChange={e => setFormData({...formData, discountRate: e.target.value})} 
                      />
                    </div>
                    <p className="text-xs text-muted" style={{ marginTop: 6 }}>ส่วนลดนี้จะถูกนำไปลดต้นทุน (Cost) ของการสั่งผลิต</p>
                  </div>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
                <button type="button" className="btn btn-outline" onClick={closeModal}>ยกเลิก</button>
                <button type="submit" className="btn btn-primary">บันทึกการแก้ไข</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
