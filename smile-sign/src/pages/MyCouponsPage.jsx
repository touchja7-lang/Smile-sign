import { useState, useEffect } from 'react'
import { Ticket } from 'lucide-react'
import { getCoupons } from '../api'
import { CouponCard } from '../components/CouponSection'

export default function MyCouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('available') // 'available' | 'collected'

  const fetchCoupons = () => {
    getCoupons()
      .then(data => setCoupons(data || []))
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const availableCoupons = coupons.filter(c => !c.claimedByMe && !c.usedByMe)
  const collectedCoupons = coupons.filter(c => c.claimedByMe && !c.usedByMe)

  return (
    <div className="impeccable-dashboard" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ paddingBlock: 'var(--sp-8)', flex: 1 }}>
        <div className="animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--sp-6)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--r-lg)', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ticket size={24} />
            </div>
            <div>
              <h1 className="font-display" style={{ fontSize: '2rem', margin: 0 }}>คูปองของฉัน</h1>
              <p className="text-sm text-muted" style={{ margin: 0 }}>รวมคูปองส่วนลดทั้งหมดที่คุณสามารถใช้งานได้</p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-muted)' }}>
              กำลังโหลดข้อมูลคูปอง...
            </div>
          ) : (
            <>
              <div className="animate-fade-up" style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-6)', borderBottom: '1px solid var(--border)' }}>
                <button
                  className={`orders-filter-tab ${activeTab === 'available' ? 'orders-filter-tab--active' : ''}`}
                  onClick={() => setActiveTab('available')}
                >
                  คูปองที่เก็บได้
                  <span className="orders-filter-tab__count">{availableCoupons.length}</span>
                </button>
                <button
                  className={`orders-filter-tab ${activeTab === 'collected' ? 'orders-filter-tab--active' : ''}`}
                  onClick={() => setActiveTab('collected')}
                >
                  คูปองที่เก็บแล้ว
                  <span className="orders-filter-tab__count">{collectedCoupons.length}</span>
                </button>
              </div>

              {(activeTab === 'available' ? availableCoupons : collectedCoupons).length === 0 ? (
                <div className="animate-fade-up" style={{ animationDelay: '50ms', padding: '80px 20px', textAlign: 'center', background: 'var(--surface-2)', borderRadius: 'var(--r-xl)', border: '1px dashed var(--border)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'var(--surface)', marginBottom: 'var(--sp-4)', boxShadow: 'var(--shadow-sm)' }}>
                    <Ticket size={28} className="text-muted" style={{ opacity: 0.6 }} />
                  </div>
                  <h3 className="font-600" style={{ marginBottom: '8px' }}>ไม่มีคูปองในหมวดหมู่นี้</h3>
                  <p className="text-sm text-muted">ติดตามโปรโมชั่นและคูปองใหม่ๆ ได้ที่นี่</p>
                </div>
              ) : (
                <div className="animate-fade-up" style={{ animationDelay: '50ms', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--sp-4)' }}>
                  {(activeTab === 'available' ? availableCoupons : collectedCoupons).map(c => (
                    <CouponCard key={c._id} coupon={c} onRefresh={fetchCoupons} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
