import { useState, useEffect } from 'react'
import { Ticket, Copy, Check, ChevronDown, ChevronUp, Clock, Package } from 'lucide-react'
import { getCoupons } from '../api'
import './CouponSection.css'

export function CouponCard({ coupon, onRefresh }) {
  const [copied, setCopied] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [claiming, setClaiming] = useState(false)

  const isExpiringSoon = () => {
    const diff = new Date(coupon.validUntil) - new Date()
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000 // within 3 days
  }

  async function handleClaim() {
    try {
      setClaiming(true)
      await import('../api').then(m => m.claimCoupon(coupon._id))
      import('react-hot-toast').then(m => m.toast.success('เก็บคูปองสำเร็จ!'))
      if (onRefresh) onRefresh()
    } catch (err) {
      import('react-hot-toast').then(m => m.toast.error(err.message))
    } finally {
      setClaiming(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const expiryLabel = new Date(coupon.validUntil).toLocaleDateString('th-TH', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  const discountLabel = coupon.discountType === 'percent'
    ? `ลด ${coupon.discountValue}%`
    : `ลด ฿${coupon.discountValue.toLocaleString()}`

  return (
    <div className={`coupon-card ${coupon.usedByMe ? 'coupon-card--used' : ''}`}>
      {/* Left deco stripe */}
      <div className="coupon-card__stripe" />

      <div className="coupon-card__body">
        <div className="coupon-card__top">
          <div className="coupon-card__info">
            <div className="coupon-card__header">
              <Ticket size={15} className="text-brand" />
              <span className="coupon-card__name">{coupon.name}</span>
              <span className="coupon-card__discount-badge">{discountLabel}</span>
            </div>
            <p className="coupon-card__desc">{coupon.description}</p>

            <div className="coupon-card__meta">
              {coupon.applicableProducts?.length > 0 && (
                <span className="coupon-card__meta-item">
                  <Package size={12} />
                  {coupon.applicableProducts.map(p => p.name).join(', ')}
                </span>
              )}
              <span className={`coupon-card__meta-item ${isExpiringSoon() ? 'text-warn' : ''}`}>
                <Clock size={12} />
                หมดอายุ {expiryLabel}
                {isExpiringSoon() && ' ⚡ ใกล้หมดอายุ!'}
              </span>
              {coupon.minOrderValue > 0 && (
                <span className="coupon-card__meta-item">
                  ยอดขั้นต่ำ ฿{coupon.minOrderValue.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="coupon-card__action">
            {coupon.usedByMe ? (
              <span className="coupon-card__used-label">ใช้แล้ว</span>
            ) : !coupon.claimedByMe ? (
              <button 
                className="btn btn-primary btn-sm" 
                onClick={handleClaim}
                disabled={claiming}
              >
                {claiming ? 'กำลังเก็บ...' : 'เก็บคูปอง'}
              </button>
            ) : !revealed ? (
              <button className="btn btn-outline btn-sm" onClick={() => setRevealed(true)}>
                เปิดรหัส
              </button>
            ) : (
              <div className="coupon-card__code-box">
                <span className="font-mono font-700" style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                  {coupon.code}
                </span>
                <button className="coupon-card__copy-btn" onClick={handleCopy} title="คัดลอก">
                  {copied ? <Check size={14} className="text-brand" /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CouponSection() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    getCoupons()
      .then(data => setCoupons(data || []))
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null
  if (coupons.length === 0) return null

  const displayed = showAll ? coupons : coupons.slice(0, 2)

  return (
    <div className="coupon-section">
      <div className="coupon-section__header">
        <div className="flex items-center gap-2">
          <Ticket size={16} className="text-brand" />
          <span className="font-600 text-sm">คูปองของฉัน</span>
          <span className="coupon-section__count">{coupons.length}</span>
        </div>
      </div>

      <div className="coupon-section__list">
        {displayed.map(c => (
          <CouponCard 
            key={c._id} 
            coupon={c} 
            onRefresh={() => getCoupons().then(data => setCoupons(data || []))}
          />
        ))}
      </div>

      {coupons.length > 2 && (
        <button
          className="coupon-section__toggle"
          onClick={() => setShowAll(v => !v)}
        >
          {showAll ? (
            <><ChevronUp size={14} /> แสดงน้อยลง</>
          ) : (
            <><ChevronDown size={14} /> ดูทั้งหมด {coupons.length} ใบ</>
          )}
        </button>
      )}
    </div>
  )
}
