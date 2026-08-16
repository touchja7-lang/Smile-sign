import { useState, useEffect } from 'react'
import { Ticket, Plus, Search, Edit3, Trash2, Calendar, Package, Clock } from 'lucide-react'
import { getCouponsAdmin, createCouponAdmin, updateCouponAdmin, deleteCouponAdmin, getProducts } from '../api'
import './AdminCouponsPage.css'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [form, setForm] = useState({
    code: '', name: '', description: '', discountType: 'percent', discountValue: '',
    minOrderValue: 0, validUntil: '', usageLimit: '', isActive: true,
    applicableProducts: [] // array of IDs
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const prods = await getProducts().catch(() => [])
      setProducts(prods || [])
      
      const cpns = await getCouponsAdmin().catch(() => [])
      setCoupons(cpns || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({
      code: '', name: '', description: '', discountType: 'percent', discountValue: '',
      minOrderValue: 0, validUntil: '', usageLimit: '', isActive: true, applicableProducts: []
    })
    setProductSearch('')
    setIsModalOpen(true)
  }

  const openEdit = (c) => {
    setEditingId(c._id)
    setForm({
      code: c.code, name: c.name, description: c.description, discountType: c.discountType,
      discountValue: c.discountValue, minOrderValue: c.minOrderValue,
      validUntil: new Date(c.validUntil).toISOString().split('T')[0],
      usageLimit: c.usageLimit || '', isActive: c.isActive,
      applicableProducts: c.applicableProducts.map(p => p._id)
    })
    setProductSearch('')
    setIsModalOpen(true)
  }

  const handleDelete = async (id, code) => {
    if (!window.confirm(`ยืนยันการลบคูปอง ${code} ?`)) return
    try {
      await deleteCouponAdmin(id)
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue),
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        applicableProducts: form.applicableProducts.filter(Boolean)
      }
      if (editingId) {
        await updateCouponAdmin(editingId, payload)
      } else {
        await createCouponAdmin(payload)
      }
      setIsModalOpen(false)
      fetchData()
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleProduct = (pid) => {
    setForm(prev => {
      const exists = prev.applicableProducts.includes(pid)
      if (exists) return { ...prev, applicableProducts: prev.applicableProducts.filter(id => id !== pid) }
      return { ...prev, applicableProducts: [...prev.applicableProducts, pid] }
    })
  }

  const filtered = coupons.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-coupons-page" style={{ padding: 'var(--sp-6) 0' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.75rem', marginBottom: 4 }}>จัดการคูปอง (Coupons)</h1>
            <p className="text-sm text-muted">ระบบคูปองส่วนลดสำหรับตัวแทนจำหน่าย</p>
          </div>
          <button onClick={openCreate} className="btn btn-primary">
            <Plus size={16} /> สร้างคูปอง
          </button>
        </div>

        {/* Filters */}
        <div className="admin-filters" style={{ marginBottom: 'var(--sp-6)' }}>
          <div className="admin-search-wrap">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              className="admin-search-input"
              placeholder="ค้นหารหัสคูปอง หรือชื่อ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="impeccable-table-wrap">
          <table className="impeccable-table">
            <thead>
              <tr>
                <th>รหัสคูปอง & ชื่อ</th>
                <th>ส่วนลด</th>
                <th>ข้อกำหนด</th>
                <th>สถานะ & การใช้งาน</th>
                <th style={{ width: 100 }} className="text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center" style={{ padding: 'var(--sp-8)' }}>กำลังโหลด...</td></tr>
              ) : filtered.map(c => (
                <tr key={c._id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="font-mono font-700 text-brand" style={{ fontSize: '1.1rem' }}>{c.code}</span>
                      <span className="font-500 text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-600" style={{ fontSize: '1.1rem', color: 'var(--accent-dark)' }}>
                      {c.discountType === 'percent' ? `${c.discountValue}%` : `฿${c.discountValue.toLocaleString()}`}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                      <span className="flex items-center gap-1"><Package size={12}/> {c.applicableProducts?.length > 0 ? `${c.applicableProducts.length} สินค้าเฉพาะ` : 'ทุกสินค้า'}</span>
                      <span className="flex items-center gap-1"><Ticket size={12}/> {c.minOrderValue > 0 ? `ขั้นต่ำ ฿${c.minOrderValue}` : 'ไม่มีขั้นต่ำ'}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span className="badge" style={{ 
                        background: c.isActive ? 'var(--status-done-bg)' : 'var(--surface-3)', 
                        color: c.isActive ? 'var(--status-done)' : 'var(--ink-muted)', alignSelf: 'flex-start' 
                      }}>
                        {c.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                      <span className="text-xs flex items-center gap-1 text-faint">
                        <Clock size={12}/> {new Date(c.validUntil).toLocaleDateString('th-TH')}
                      </span>
                      <span className="text-xs text-muted">เก็บแล้ว: {c.totalClaimed || 0} คน</span>
                      <span className="text-xs text-muted">ใช้แล้ว: {c.totalUsed} / {c.usageLimit || '∞'}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}><Edit3 size={16} /></button>
                    <button className="btn btn-ghost btn-sm text-warn" onClick={() => handleDelete(c._id, c.code)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 700 }}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">{editingId ? 'แก้ไขคูปอง' : 'สร้างคูปองใหม่'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="admin-modal__close">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-modal__body">
              <div className="form-section">
                <h3 className="form-section__title">ข้อมูลคูปอง</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">รหัสคูปอง (Code) <span>*</span></label>
                    <input className="form-input font-mono uppercase" required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ชื่อคูปอง <span>*</span></label>
                    <input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="เช่น ลด 10% เดือนสิงหา" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">คำอธิบาย</label>
                  <input className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="สำหรับยอดสั่งซื้อขั้นต่ำ 500 บาท..." />
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section__title">ส่วนลด & ข้อกำหนด</h3>
                <div className="form-row" style={{ gridTemplateColumns: '1fr 2fr' }}>
                  <div className="form-group">
                    <label className="form-label">ประเภทส่วนลด</label>
                    <select className="form-select" value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})}>
                      <option value="percent">เปอร์เซ็นต์ (%)</option>
                      <option value="fixed">จำนวนเงิน (฿)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">มูลค่าส่วนลด <span>*</span></label>
                    <input type="number" min="0" step="1" className="form-input" required value={form.discountValue} onChange={e => setForm({...form, discountValue: e.target.value})} />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">ยอดขั้นต่ำ (Min Order)</label>
                    <input type="number" min="0" className="form-input" value={form.minOrderValue} onChange={e => setForm({...form, minOrderValue: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ใช้ได้สูงสุด (ครั้งรวม)</label>
                    <input type="number" min="1" className="form-input" placeholder="ไม่จำกัด" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">วันหมดอายุ <span>*</span></label>
                    <input type="date" className="form-input" required value={form.validUntil} onChange={e => setForm({...form, validUntil: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: 24 }}>
                    <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} style={{ width: 18, height: 18 }} />
                    <label htmlFor="isActive" className="font-600">เปิดใช้งาน (Active)</label>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section__title">สินค้าที่ร่วมรายการ</h3>
                <p className="text-xs text-muted" style={{ marginBottom: 12 }}>* หากไม่เลือกสินค้าใดเลย จะถือว่า <strong>ใช้ได้กับทุกสินค้า</strong></p>
                
                {/* Searchable Checkbox List */}
                <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                  {/* Search Header */}
                  <div style={{ padding: '8px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <div className="admin-search-wrap" style={{ maxWidth: '100%', background: 'var(--surface-2)' }}>
                      <Search size={14} className="admin-search-icon" />
                      <input
                        type="text"
                        className="admin-search-input"
                        placeholder="ค้นหาชื่อสินค้า..."
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                        style={{ fontSize: '0.8125rem', padding: '6px 8px 6px 32px' }}
                      />
                    </div>
                  </div>

                  {/* Scrollable List */}
                  <div style={{ maxHeight: '180px', overflowY: 'auto', padding: '8px' }}>
                    {products
                      .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                      .map(p => {
                        const isSelected = form.applicableProducts.includes(p._id);
                        return (
                          <label 
                            key={p._id} 
                            style={{ 
                              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                              padding: '6px 8px', borderRadius: 'var(--r-sm)',
                              background: isSelected ? 'var(--brand-lighter)' : 'transparent',
                              color: isSelected ? 'var(--brand-dark)' : 'var(--ink)'
                            }}
                            onMouseEnter={e => { if(!isSelected) e.currentTarget.style.background = 'var(--surface-3)' }}
                            onMouseLeave={e => { if(!isSelected) e.currentTarget.style.background = 'transparent' }}
                          >
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => toggleProduct(p._id)}
                            />
                            <span className="text-sm font-500">{p.name}</span>
                          </label>
                        )
                    })}
                    {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                      <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>
                        ไม่พบสินค้าที่ค้นหา
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Selected Count Summary */}
                {form.applicableProducts.length > 0 && (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--brand)', fontWeight: 500, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Package size={14} /> เลือกแล้ว {form.applicableProducts.length} สินค้า
                  </div>
                )}
              </div>
              
              <div className="admin-modal__footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">ยกเลิก</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'กำลังบันทึก...' : 'บันทึกคูปอง'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
