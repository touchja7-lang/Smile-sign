import { useParams, useNavigate } from 'react-router-dom'
import { Printer, ArrowLeft } from 'lucide-react'
import './QuotationPage.css'

export default function QuotationPage({ user, orders }) {
  const { id } = useParams()
  const navigate = useNavigate()

  // Find from live orders state, fallback to a placeholder
  const order = orders?.find(o => o.id === id) || {
    id,
    product: 'Vinyl Banner',
    specs: '3m × 6m | Standard | 1 pc',
    customer: 'ลูกค้า',
    delivery: 'Delivery',
    sellPrice: 950,
    date: new Date().toISOString().split('T')[0],
  }

  const today = new Date()
  const expiryDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const fmtDate = (d) => d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
  const quoteNumber = `QT-${today.getFullYear()}-${id.split('-').pop()}`

  const shopName = user.shopName || user.name
  const subTotal = order.sellPrice
  const vat = Math.round(subTotal * 0.07)
  const total = subTotal + vat

  return (
    <div className="impeccable-quotation-page">
      <div className="quotation-toolbar no-print">
        <div className="container flex justify-between items-center">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingBlock: 'var(--sp-8)' }}>
        <div className="impeccable-doc">

          {/* Doc Header */}
          <div className="impeccable-doc__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--ink)', paddingBottom: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
              <img src="/logo.jpg" alt="Smile Sign Logo" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '8px' }} />
              <div>
                <h1 className="font-display" style={{ fontSize: '2rem', letterSpacing: '-0.02em', margin: 0, lineHeight: 1 }}>QUOTATION</h1>
                <p className="font-mono text-sm text-muted" style={{ margin: '4px 0 0 0' }}>{quoteNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="font-600 font-display" style={{ fontSize: '1.25rem' }}>{shopName}</h2>
              <p className="text-sm text-muted">Tel: {user.phone || '-'}</p>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="impeccable-doc__meta">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide" style={{ marginBottom: 4 }}>เรียน</p>
              <p className="font-500">{order.customer}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted uppercase tracking-wide" style={{ marginBottom: 2 }}>วันที่ออกเอกสาร</p>
              <p className="font-500 text-sm">{fmtDate(today)}</p>
              <p className="text-xs text-muted uppercase tracking-wide" style={{ marginTop: 8, marginBottom: 2 }}>ใช้ได้ถึง</p>
              <p className="font-500 text-sm">{fmtDate(expiryDate)}</p>
            </div>
          </div>

          {/* Line items */}
          <table className="impeccable-doc__table">
            <thead>
              <tr>
                <th>รายการ</th>
                <th className="text-right" style={{ width: 160 }}>จำนวนเงิน (THB)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p className="font-500">{order.product}</p>
                  <p className="text-sm text-muted">{order.specs}</p>
                  <p className="text-sm text-muted">การจัดส่ง: {order.delivery}</p>
                </td>
                <td className="text-right font-mono font-600">
                  {subTotal.toLocaleString()}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="text-right text-sm">ราคารวม</td>
                <td className="text-right font-mono">{subTotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="text-right text-sm text-muted">ภาษีมูลค่าเพิ่ม 7%</td>
                <td className="text-right font-mono text-muted">{vat.toLocaleString()}</td>
              </tr>
              <tr className="impeccable-doc__total">
                <td className="text-right font-600">ยอดรวมทั้งสิ้น</td>
                <td className="text-right font-mono font-600 text-lg">฿{total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="impeccable-doc__footer">
            <div className="impeccable-doc__notes">
              <p className="font-500 text-sm" style={{ marginBottom: 'var(--sp-2)' }}>เงื่อนไข</p>
              <ul className="text-xs text-muted">
                <li>ใบเสนอราคานี้มีอายุ 7 วันนับจากวันที่ออก</li>
                <li>วางมัดจำ 50% เพื่อเริ่มผลิตงาน</li>
                <li>ระยะเวลาผลิตขึ้นอยู่กับคิวงานในขณะนั้น</li>
                <li>ราคานี้ยังไม่รวมค่าติดตั้ง (ถ้ามี)</li>
              </ul>
            </div>
            <div className="impeccable-doc__signature">
              <div className="line"></div>
              <p className="text-sm text-center">ลายเซ็นผู้มีอำนาจ</p>
              <p className="text-xs text-muted text-center" style={{ marginTop: 2 }}>{shopName}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
