import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Loader2 } from 'lucide-react'
import { getProducts } from '../api'
import './CatalogPage.css'

const PRODUCT_EMOJI = {
  'ป้ายไวนิล': '🪧',
  'สติกเกอร์ PVC': '🏷️',
  'ป้ายตู้ไฟ': '💡',
  'ป้ายอะคริลิก': '🔷',
  'ป้ายผ้า': '🎌',
}

function ProductRow({ product }) {
  const unit = product.pricingType === 'per_sqm' ? 'ตร.ม.' : 'ชิ้น'
  return (
    <div className="impeccable-catalog-row">
      {/* Col 1: Image or Emoji */}
      <div className="impeccable-catalog-row__lead">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="catalog-product-img" />
        ) : (
          <span className="catalog-emoji">{PRODUCT_EMOJI[product.category] || '📦'}</span>
        )}
      </div>

      {/* Col 2: Name + badges */}
      <div className="impeccable-catalog-row__info">
        <h4>{product.name}</h4>
        <div className="impeccable-catalog-row__badges">
          {(product.options || []).map(o => (
            <span key={o.name} className="impeccable-catalog-row__badge">
              {o.name}{o.addOnPrice > 0 ? ` +฿${o.addOnPrice}` : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Col 3: Price block */}
      <div className="impeccable-catalog-row__pricing-block">
        <span className="price-unit-label">ราคาต้นทุน / {unit}</span>
        <span className="price-value">฿{(product.basePrice || 0).toLocaleString()}</span>
        <span className="price-per">ต่อ {unit}</span>
      </div>

      <div className="impeccable-catalog-row__action">
        <Link to={`/order/new?product=${product._id}`} className="btn btn-primary btn-sm">
          <Plus size={14} /> สั่งซื้อ
        </Link>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    return !q || p.name.toLowerCase().includes(q)
  })

  const groupedProducts = filtered.reduce((acc, p) => {
    const cat = p.category || 'ทั่วไป'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})

  return (
    <div className="impeccable-catalog-page">
      <div className="container" style={{ paddingBlock: 'var(--sp-8)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--sp-6)' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: 6 }}>สินค้าป้าย</h1>
            <p className="text-sm text-muted">
              {loading ? 'กำลังโหลด...' : `${products.length} รายการ · ราคาต้นทุนสำหรับเซลล์เท่านั้น`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <div className="admin-search-wrap" style={{ maxWidth: 260 }}>
              <Search size={16} className="admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="ค้นหาชื่อสินค้า..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Link to="/order/new" className="btn btn-primary btn-lg" style={{ whiteSpace: 'nowrap' }}>
              <Plus size={18} /> สร้างออเดอร์
            </Link>
          </div>
        </div>

        {/* Product list */}
        <div className="impeccable-catalog-list">
          {loading ? (
            <div style={{ padding: 'var(--sp-10)', textAlign: 'center', color: 'var(--ink-muted)' }}>
              <Loader2 size={24} style={{ margin: '0 auto var(--sp-3)', animation: 'spin 1s linear infinite' }} />
              <p className="text-sm">กำลังดึงข้อมูลสินค้า...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 'var(--sp-10)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-3)', opacity: 0.4 }}>🪧</div>
              <p className="font-600" style={{ marginBottom: 4 }}>ไม่พบสินค้า</p>
              <p className="text-sm text-muted">ไม่มีสินค้าที่ตรงกับการค้นหาของคุณ</p>
            </div>
          ) : (
            Object.entries(groupedProducts).map(([category, items]) => (
              <div key={category} className="catalog-category-group">
                <h2 className="catalog-category-title">
                  {category}
                </h2>
                <div className="catalog-product-list">
                  {items.map(p => <ProductRow key={p._id} product={p} />)}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
