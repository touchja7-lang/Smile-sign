import { useState, useEffect, useCallback, useRef } from 'react'
import { Package, Plus, Search, Edit3, Tag, Percent, Calendar, ImagePlus, X } from 'lucide-react'
import { getProducts, createProduct, updateProduct, uploadProductImage } from '../api'
import './AdminProductsPage.css'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'ทั่วไป',
    pricingType: 'per_sqm',
    basePrice: '',
    status: 'Active',
    options: [],
    promotion: {
      isActive: false,
      discountPercentage: 0,
      startDate: '',
      endDate: ''
    }
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Helpers
  const openCreateModal = () => {
    setEditingId(null)
    setImagePreview(null)
    setFormData({
      name: '', category: 'ทั่วไป', pricingType: 'per_sqm', basePrice: '', status: 'Active', options: [],
      promotion: { isActive: false, discountPercentage: 0, startDate: '', endDate: '' }
    })
    setIsModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingId(product._id)
    setImagePreview(product.imageUrl || null)
    setFormData({
      name: product.name,
      category: product.category || 'ทั่วไป',
      pricingType: product.pricingType,
      basePrice: product.basePrice,
      status: product.status || 'Active',
      options: product.options || [],
      promotion: {
        isActive: product.promotion?.isActive || false,
        discountPercentage: product.promotion?.discountPercentage || 0,
        startDate: product.promotion?.startDate ? new Date(product.promotion.startDate).toISOString().split('T')[0] : '',
        endDate: product.promotion?.endDate ? new Date(product.promotion.endDate).toISOString().split('T')[0] : ''
      }
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setImagePreview(null)
  }

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
    // If editing existing product, upload immediately
    if (editingId) {
      setUploadingImage(true)
      try {
        const updated = await uploadProductImage(editingId, file)
        setImagePreview(updated.imageUrl)
        fetchProducts()
      } catch (err) {
        alert(`Upload failed: ${err.message}`)
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options]
    newOptions[index][field] = value
    setFormData({ ...formData, options: newOptions })
  }
  const addOption = () => setFormData({ ...formData, options: [...formData.options, { name: '', addOnPrice: '' }] })
  const removeOption = (index) => setFormData({ ...formData, options: formData.options.filter((_, i) => i !== index) })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Format payload
      const payload = { ...formData }
      payload.basePrice = Number(payload.basePrice)
      payload.options = payload.options.map(o => ({ name: o.name, addOnPrice: Number(o.addOnPrice) }))
      payload.promotion.discountPercentage = Number(payload.promotion.discountPercentage)
      if (!payload.promotion.isActive) {
        payload.promotion.discountPercentage = 0;
      }
      // If dates are empty strings, pass null or omit to avoid casting errors
      if (!payload.promotion.startDate) payload.promotion.startDate = null;
      if (!payload.promotion.endDate) payload.promotion.endDate = null;

      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        // If creating, first create the product, then upload image if selected
        const newProduct = await createProduct(payload)
        if (fileInputRef.current?.files[0]) {
          try {
            await uploadProductImage(newProduct._id, fileInputRef.current.files[0])
          } catch (err) {
            console.warn('Image upload failed after create:', err.message)
          }
        }
      }
      
      closeModal()
      fetchProducts() // Refresh list
    } catch (err) {
      alert(`Error saving product: ${err.message}`)
    }
  }

  // Filter
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="admin-products-page">
      <div className="admin-container">
        
        {/* ── Header ── */}
        <div className="admin-header">
          <div className="admin-header__left">
            <div className="admin-header__icon-wrap">
              <Package size={24} />
            </div>
            <div>
              <h1 className="admin-header__title">จัดการสินค้า & โปรโมชั่น</h1>
              <p className="admin-header__sub">กำหนดราคาสินค้า เพิ่มออปชันเสริม และตั้งเวลาแคมเปญลดราคา</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={16} /> สร้างสินค้าใหม่
          </button>
        </div>

        {/* ── Filters ── */}
        <div className="admin-filters">
          <div className="admin-search-wrap">
            <Search size={16} className="admin-search-icon" />
            <input 
              type="text" 
              className="admin-search-input"
              placeholder="ค้นหาชื่อสินค้า หรือ หมวดหมู่..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="admin-loading"><div className="admin-spinner admin-spinner--lg" /> กำลังโหลด...</div>
        ) : error ? (
          <div className="admin-error">เกิดข้อผิดพลาด: {error}</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ชื่อสินค้า</th>
                  <th>ราคาฐาน</th>
                  <th>สถานะ</th>
                  <th>โปรโมชั่น</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="5" className="admin-table__empty">ไม่มีสินค้า</td></tr>
                ) : filtered.map(product => {
                  const hasPromo = product.promotion?.isActive;
                  const now = new Date();
                  const isPromoActiveNow = hasPromo && 
                    (!product.promotion.startDate || now >= new Date(product.promotion.startDate)) &&
                    (!product.promotion.endDate || now <= new Date(product.promotion.endDate));

                  return (
                    <tr key={product._id} className="admin-table__row">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)', flexShrink: 0 }}
                            />
                          ) : (
                            <div style={{ width: 40, height: 40, borderRadius: 6, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                              📦
                            </div>
                          )}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <p className="font-600 text-sm">{product.name}</p>
                              <span className="text-xs text-muted" style={{ padding: '2px 6px', backgroundColor: 'var(--surface-2)', borderRadius: '4px' }}>
                                {product.category || 'ทั่วไป'}
                              </span>
                            </div>
                            <p className="text-xs text-muted" style={{ marginTop: 2 }}>{product.options?.length || 0} ออปชันเสริม</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="font-mono font-600">฿{product.basePrice.toLocaleString()}</p>
                        <p className="text-xs text-muted">/{product.pricingType === 'per_sqm' ? 'ตร.ม.' : 'ชิ้น'}</p>
                      </td>
                      <td>
                        <span className={`status-badge ${
                          product.status === 'Sold out' ? 'status-badge--soldout'
                          : product.status === 'Hidden' ? 'status-badge--hidden'
                          : 'status-badge--active'
                        }`}>
                          {product.status === 'Sold out' ? 'หมดสต๊อก' 
                           : product.status === 'Hidden' ? 'ซ่อน' 
                           : 'เปิดขายปกติ'}
                        </span>
                      </td>
                      <td>
                        {hasPromo ? (
                          <div>
                            <span className={`status-badge ${isPromoActiveNow ? 'status-badge--promo' : 'status-badge--hidden'}`}>
                              <Percent size={10} /> ลด {product.promotion.discountPercentage}%
                            </span>
                            <p className="text-xs text-muted" style={{ marginTop: 4 }}>
                              {product.promotion.startDate ? new Date(product.promotion.startDate).toLocaleDateString('th-TH') : 'เริ่มเลย'} - 
                              {product.promotion.endDate ? new Date(product.promotion.endDate).toLocaleDateString('th-TH') : 'ไม่มีกำหนด'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => openEditModal(product)}>
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

      {/* ── CRUD Modal ── */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">{editingId ? 'แก้ไขสินค้า' : 'สร้างสินค้าใหม่'}</h2>
              <button className="admin-modal__close" onClick={closeModal}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-modal__body">
              
              {/* Image Upload Section */}
              <div className="form-section">
                <h3 className="form-section__title">รูปภาพสินค้า</h3>
                <div className="product-image-upload">
                  <div
                    className="product-image-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="preview" className="product-image-preview" />
                        {uploadingImage && (
                          <div className="product-image-uploading">
                            <div className="admin-spinner" />
                            <span>กำลังอัปโหลด...</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="product-image-placeholder">
                        <ImagePlus size={28} style={{ color: 'var(--ink-faint)', marginBottom: 8 }} />
                        <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>คลิกเพื่ออัปโหลดรูปภาพ</p>
                        <p className="text-xs" style={{ color: 'var(--ink-faint)', marginTop: 4 }}>JPG, PNG, WebP — สูงสุด 5MB</p>
                      </div>
                    )}
                  </div>
                  {imagePreview && (
                    <button
                      type="button"
                      className="product-image-remove"
                      onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    >
                      <X size={14} /> ลบรูป
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageFileChange}
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section__title">ข้อมูลทั่วไป</h3>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label className="form-label">ชื่อสินค้า</label>
                    <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">หมวดหมู่</label>
                    <input required type="text" className="form-input" placeholder="เช่น ป้ายตู้ไฟ" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">สถานะการขาย</label>
                    <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="Active">เปิดขายปกติ</option>
                      <option value="Sold out">หมดสต๊อก</option>
                      <option value="Hidden">ซ่อนจากหน้าร้าน</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">ราคาฐาน (Base Price)</label>
                    <input required type="number" min="0" className="form-input" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">รูปแบบราคา</label>
                    <select className="form-select" value={formData.pricingType} onChange={e => setFormData({...formData, pricingType: e.target.value})}>
                      <option value="per_sqm">ต่อตารางเมตร (Per SQM)</option>
                      <option value="per_unit">ต่อชิ้น (Per Unit)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section promo-card">
                <div className="promo-header">
                  <div>
                    <h3 className="form-section__title" style={{ border: 'none', padding: 0 }}>ตั้งโปรโมชั่นส่วนลด</h3>
                    <p className="text-xs text-muted" style={{ marginTop: 2 }}>ส่วนลดจะถูกคำนวณหักลบในตะกร้าโดยอัตโนมัติ</p>
                  </div>
                  <label className="promo-toggle">
                    <input 
                      type="checkbox" 
                      style={{ display: 'none' }} 
                      checked={formData.promotion.isActive} 
                      onChange={e => setFormData({...formData, promotion: {...formData.promotion, isActive: e.target.checked}})}
                    />
                    <div className="toggle-switch"></div>
                  </label>
                </div>

                {formData.promotion.isActive && (
                  <>
                    <div className="form-group">
                      <label className="form-label">เปอร์เซ็นต์ส่วนลด (%)</label>
                      <div style={{ position: 'relative' }}>
                        <Percent size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#9ca3af' }} />
                        <input 
                          required 
                          type="number" min="1" max="100" 
                          className="form-input" 
                          style={{ paddingLeft: 30 }}
                          value={formData.promotion.discountPercentage} 
                          onChange={e => setFormData({...formData, promotion: {...formData.promotion, discountPercentage: e.target.value}})} 
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">เริ่มโปรโมชั่น (ไม่บังคับ)</label>
                        <input type="date" className="form-input" value={formData.promotion.startDate} onChange={e => setFormData({...formData, promotion: {...formData.promotion, startDate: e.target.value}})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">สิ้นสุด (ไม่บังคับ)</label>
                        <input type="date" className="form-input" value={formData.promotion.endDate} onChange={e => setFormData({...formData, promotion: {...formData.promotion, endDate: e.target.value}})} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="form-section">
                <div className="promo-header" style={{ marginBottom: 0 }}>
                  <h3 className="form-section__title" style={{ border: 'none', margin: 0 }}>ออปชันเสริม (Add-ons)</h3>
                  <button type="button" className="btn btn-outline btn-sm" onClick={addOption}>
                    <Plus size={14} /> เพิ่มออปชัน
                  </button>
                </div>
                <div className="options-list">
                  {formData.options.length === 0 ? (
                    <p className="text-sm text-muted">ยังไม่มีออปชันเสริมสำหรับสินค้านี้</p>
                  ) : formData.options.map((opt, i) => (
                    <div key={i} className="option-row">
                      <input required type="text" placeholder="ชื่อออปชัน (เช่น เจาะตาไก่)" className="form-input" value={opt.name} onChange={e => handleOptionChange(i, 'name', e.target.value)} />
                      <input required type="number" placeholder="ราคา (+ บาท)" className="form-input" style={{ width: 120, flex: 'none' }} value={opt.addOnPrice} onChange={e => handleOptionChange(i, 'addOnPrice', e.target.value)} />
                      <button type="button" className="btn-remove" onClick={() => removeOption(i)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

            </form>
            
            <div className="admin-modal__footer">
              <button type="button" className="btn btn-outline" onClick={closeModal} disabled={loading}>ยกเลิก</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {editingId ? 'บันทึกการแก้ไข' : 'สร้างสินค้า'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
