import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Upload, Check, ChevronLeft, ChevronRight, FileText, Link2, Loader2, X, FileImage } from 'lucide-react'
import toast from 'react-hot-toast'
import { getProducts, createOrder } from '../api'
import './OrderFormPage.css'

const STEPS = [
  { id: 1, label: 'รายละเอียดสินค้า',  sub: 'ประเภท · ขนาด · จำนวน' },
  { id: 2, label: 'ไฟล์งาน / อาร์ตเวิร์ก', sub: 'อัปโหลดหรือลิงก์' },
  { id: 3, label: 'การจัดส่ง',        sub: 'วิธีรับ · ที่อยู่ · ลูกค้า' },
  { id: 4, label: 'ราคาขาย & กำไร',   sub: 'ต้นทุน · ราคาขาย · margin' },
]

const DELIVERY_OPTIONS = [
  { value: 'Pickup',   icon: '🏪', label: 'รับสินค้าเอง',  sub: 'รับที่ร้านสไมล์ไซน์' },
  { value: 'Delivery', icon: '🚚', label: 'จัดส่งพัสดุ',   sub: 'ส่งไปตามที่อยู่ที่ระบุ' },
  { value: 'Install',  icon: '🔧', label: 'ติดตั้งพร้อมส่ง', sub: 'ช่างไปติดตั้งให้ที่หน้างาน' },
]

function Step1({ form, onChange, products, product }) {
  return (
    <div className="impeccable-step animate-fade-in">

      {/* ── Row 1: ประเภทสินค้า ── */}
      <div className="step-field-row">
        <div className="step-field-label">
          <span className="step-field-label__main">ประเภทสินค้า</span>
          <span className="step-field-label__sub">เลือกสินค้าที่ต้องการสั่งผลิต</span>
        </div>
        <div className="step-field-control">
          <select className="form-select" value={form.productId} onChange={e => onChange('productId', e.target.value)} required>
            <option value="">-- เลือกสินค้า --</option>
            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* ── Row 2: Finishing Options (conditional) ── */}
      {product && (
        <div className="step-field-row">
          <div className="step-field-label">
            <span className="step-field-label__main">การตกแต่งพิเศษ</span>
            <span className="step-field-label__sub">Finishing Options (ถ้ามี)</span>
          </div>
          <div className="step-field-control">
            <select className="form-select" value={form.material} onChange={e => onChange('material', e.target.value)}>
              <option value="">ไม่มีการตกแต่งพิเศษ</option>
              {(product.options || []).map(o => (
                <option key={o.name} value={o.name}>
                  {o.name}{o.addOnPrice > 0 ? `  (+฿${o.addOnPrice}/ชิ้น)` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ── Row 3: ขนาด (per_sqm เท่านั้น) ── */}
      {product?.pricingType === 'per_sqm' && (
        <div className="step-field-row">
          <div className="step-field-label">
            <span className="step-field-label__main">ขนาด (เมตร)</span>
            <span className="step-field-label__sub">กว้าง × สูง — ใช้ทศนิยมได้</span>
          </div>
          <div className="step-field-control step-field-control--inline">
            <div className="step-inline-field">
              <label className="step-inline-label">กว้าง (ม.)</label>
              <input type="number" className="form-input font-mono" placeholder="0.00"
                value={form.width} onChange={e => onChange('width', e.target.value)} />
            </div>
            <span className="step-inline-sep">×</span>
            <div className="step-inline-field">
              <label className="step-inline-label">สูง (ม.)</label>
              <input type="number" className="form-input font-mono" placeholder="0.00"
                value={form.height} onChange={e => onChange('height', e.target.value)} />
            </div>
            {form.width && form.height && (
              <div className="step-inline-result">
                <span className="text-xs text-muted">พื้นที่</span>
                <span className="font-mono font-600">
                  {(parseFloat(form.width||0)*parseFloat(form.height||0)).toFixed(2)} ตร.ม.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Row 4: จำนวน ── */}
      <div className="step-field-row">
        <div className="step-field-label">
          <span className="step-field-label__main">จำนวน (ชิ้น)</span>
          <span className="step-field-label__sub">Quantity</span>
        </div>
        <div className="step-field-control step-field-control--narrow">
          <input type="number" className="form-input font-mono" placeholder="1" min="1"
            value={form.qty} onChange={e => onChange('qty', e.target.value)} />
        </div>
      </div>

      {/* ── Row 5: หมายเหตุ ── */}
      <div className="step-field-row step-field-row--last">
        <div className="step-field-label">
          <span className="step-field-label__main">หมายเหตุการผลิต</span>
          <span className="step-field-label__sub">Production Notes (ถ้ามี)</span>
        </div>
        <div className="step-field-control">
          <textarea className="form-textarea" rows={2}
            placeholder="คำแนะนำพิเศษ เช่น สี font ขอบ..."
            value={form.specsNote} onChange={e => onChange('specsNote', e.target.value)} />
        </div>
      </div>

    </div>
  )
}

function Step2({ form, onChange }) {
  const fileInputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      onChange('artworkFile', file.name)
      onChange('artworkFileObj', file)
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      onChange('artworkFile', file.name)
      onChange('artworkFileObj', file)
    }
  }

  function clearFile() {
    onChange('artworkFile', '')
    onChange('artworkFileObj', null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const hasFile = !!form.artworkFile

  return (
    <div className="impeccable-step animate-fade-in">

      {/* ── Drop Zone ── */}
      <div
        className={`artwork-dropzone ${dragging ? 'artwork-dropzone--drag' : ''} ${hasFile ? 'artwork-dropzone--done' : ''}`}
        onClick={() => !hasFile && fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.ai,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {hasFile ? (
          <div className="artwork-dropzone__file-chip">
            <FileImage size={20} className="artwork-dropzone__file-icon" />
            <span className="artwork-dropzone__filename">{form.artworkFile}</span>
            <button
              type="button"
              className="artwork-dropzone__clear"
              onClick={e => { e.stopPropagation(); clearFile() }}
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="artwork-dropzone__icon-wrap">
              <Upload size={22} />
            </div>
            <p className="artwork-dropzone__title">
              {dragging ? 'ปล่อยไฟล์ที่นี่เลย!' : 'ลากไฟล์มาวางที่นี่'}
            </p>
            <p className="artwork-dropzone__sub">PDF, AI, หรือ JPG ความละเอียดสูง · <span className="artwork-dropzone__browse">เลือกไฟล์</span></p>
          </>
        )}
      </div>

      <div className="step-separator">
        <span className="text-xs text-faint uppercase tracking-wide">หรือ</span>
      </div>

      <div className="form-group">
        <label className="form-label flex items-center gap-1"><Link2 size={14} /> ลิงก์ดาวน์โหลด (Google Drive, WeTransfer ฯลฯ)</label>
        <input type="url" className="form-input" placeholder="https://" value={form.artworkLink} onChange={e => onChange('artworkLink', e.target.value)} />
      </div>

      <div className="form-group" style={{ marginTop: 'var(--sp-4)' }}>
        <label className="form-label">บรีฟงานออกแบบ (กรณีไม่มีไฟล์)</label>
        <textarea className="form-textarea" rows={3} placeholder="อธิบายรายละเอียดงาน โทนสี ข้อความ และสไตล์ที่ต้องการ..." value={form.artworkNote} onChange={e => onChange('artworkNote', e.target.value)} />
      </div>
    </div>
  )
}

function Step3({ form, onChange }) {
  return (
    <div className="impeccable-step animate-fade-in">

      {/* ── Row 1: วิธีรับสินค้า ── */}
      <div className="step-field-row">
        <div className="step-field-label">
          <span className="step-field-label__main">วิธีรับสินค้า</span>
          <span className="step-field-label__sub">Delivery Method</span>
        </div>
        <div className="step-field-control">
          <div className="delivery-card-group">
            {DELIVERY_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className={`delivery-card ${form.delivery === opt.value ? 'delivery-card--active' : ''}`}
              >
                <input
                  type="radio" name="delivery" value={opt.value}
                  checked={form.delivery === opt.value}
                  onChange={e => onChange('delivery', e.target.value)}
                  style={{ display: 'none' }}
                />
                <span className="delivery-card__icon">{opt.icon}</span>
                <span className="delivery-card__label">{opt.label}</span>
                <span className="delivery-card__sub">{opt.sub}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: ที่อยู่จัดส่ง (conditional) ── */}
      {(form.delivery === 'Delivery' || form.delivery === 'Install') && (
        <div className="step-field-row">
          <div className="step-field-label">
            <span className="step-field-label__main">ที่อยู่จัดส่ง</span>
            <span className="step-field-label__sub">Full Delivery Address</span>
          </div>
          <div className="step-field-control">
            <textarea
              className="form-textarea" rows={3}
              placeholder="เลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
              value={form.address}
              onChange={e => onChange('address', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ── Row 3: ชื่อลูกค้าปลายทาง ── */}
      <div className="step-field-row step-field-row--last">
        <div className="step-field-label">
          <span className="step-field-label__main">ชื่อลูกค้าปลายทาง</span>
          <span className="step-field-label__sub">Client Name / Company</span>
        </div>
        <div className="step-field-control">
          <input
            type="text" className="form-input"
            placeholder="เช่น บริษัท ABC จำกัด หรือ คุณสมชาย"
            value={form.customer}
            onChange={e => onChange('customer', e.target.value)}
          />
        </div>
      </div>

    </div>
  )
}

function Step4({ form, onChange, product, estimatedCost, onApplyCoupon, applyingCoupon, couponDiscount, couponError, myCoupons }) {
  const sellPrice = parseInt(form.sellPrice || 0)
  // กำจัดเงื่อนไข isBelowCost ให้ตั้งราคาได้อิสระ
  const profit = sellPrice > 0 ? sellPrice - estimatedCost : 0
  const margin = (sellPrice > 0 && profit !== 0) ? ((profit / sellPrice) * 100).toFixed(1) : 0
  const isLoss = profit < 0

  return (
    <div className="impeccable-step animate-fade-in">
      {product ? (
        <>
          {/* ── Coupon picker ── */}
          {myCoupons.length > 0 && (
            <div className="step4-coupon-row" style={{ marginBottom: 'var(--sp-4)' }}>
              <label className="step4-field-label">คูปองส่วนลด</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  className="form-input"
                  value={form.couponCodeInput || ''}
                  onChange={e => onChange('couponCodeInput', e.target.value)}
                  style={{ flex: 1 }}
                  disabled={form.couponApplied}
                >
                  <option value="">ไม่ใช้คูปอง</option>
                  {myCoupons.map(c => {
                    const ok = c.applicableProducts?.length === 0 || c.applicableProducts?.some(p => p._id === form.productId);
                    const disc = c.discountType === 'percent' ? `ลด ${c.discountValue}%` : `ลด ฿${c.discountValue}`;
                    return (
                      <option key={c.code} value={c.code} disabled={!ok}>
                        {c.name} — {disc}{!ok ? ' (ไม่รองรับสินค้านี้)' : ''}
                      </option>
                    );
                  })}
                </select>
                {!form.couponApplied ? (
                  <button
                    className="btn btn-outline"
                    onClick={() => onApplyCoupon(form.couponCodeInput)}
                    disabled={!form.couponCodeInput || applyingCoupon}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {applyingCoupon ? 'กำลังตรวจสอบ…' : 'ใช้คูปอง'}
                  </button>
                ) : (
                  <button
                    className="btn btn-ghost"
                    style={{ whiteSpace: 'nowrap', color: 'var(--ink-muted)' }}
                    onClick={() => { onChange('couponApplied', false); onChange('couponCodeInput', ''); }}
                  >
                    ยกเลิก
                  </button>
                )}
              </div>
              {couponError && <p className="step4-feedback step4-feedback--error">{couponError}</p>}
              {form.couponApplied && <p className="step4-feedback step4-feedback--ok">✓ ใช้คูปองแล้ว — ลด ฿{couponDiscount.toLocaleString()}</p>}
            </div>
          )}

          {/* ── Pricing summary ── */}
          <div className="step4-summary">
            <div className="step4-summary__row">
              <div>
                <span className="step4-summary__label">ราคาต้นทุน</span>
                <span className="step4-summary__sub">หักส่วนลด Level{form.couponApplied ? ' + คูปอง' : ''} แล้ว</span>
              </div>
              <span className="step4-summary__val">฿{estimatedCost.toLocaleString()}</span>
            </div>

            <div className="step4-summary__divider" />

            <div className="step4-summary__row step4-summary__row--sell">
              <div>
                <span className="step4-summary__label">ราคาขายให้ลูกค้า</span>
                <span className="step4-summary__sub">กำหนดเองได้อย่างอิสระ</span>
              </div>
              <div className="cost-input-wrap">
                <span className="cost-input-prefix">฿</span>
                <input
                  type="number"
                  className="form-input font-mono font-600 cost-input"
                  placeholder="0"
                  value={form.sellPrice}
                  onChange={e => onChange('sellPrice', e.target.value)}
                />
              </div>
            </div>

            <div className="step4-summary__divider" />

            <div className={`step4-summary__row step4-summary__row--profit${isLoss ? ' step4-summary__row--loss' : ''}`}>
              <div>
                <span className="step4-summary__label">กำไรสุทธิ (ประมาณการ)</span>
                <span className="step4-summary__sub">ราคาขาย − ต้นทุน</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`step4-summary__profit-val ${isLoss ? 'step4-summary__profit-val--loss' : ''}`}>
                  {isLoss ? '-' : ''}฿{Math.abs(profit).toLocaleString()}
                </span>
                <span className={`step4-summary__margin ${isLoss ? 'step4-summary__profit-val--loss' : ''}`}>
                  {margin}% margin
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="step-empty-hint">
          <span>⬅️</span>
          <p>กลับไปกรอก <strong>ขั้นตอนที่ 1</strong> เพื่อคำนวณราคาต้นทุน</p>
        </div>
      )}
    </div>
  )
}

const INITIAL_FORM = {
  productId: '', material: '', width: '', height: '', qty: '1', specsNote: '',
  artworkFile: '', artworkFileObj: null, artworkLink: '', artworkNote: '',
  delivery: '', address: '', customer: '',
  sellPrice: '', couponCodeInput: '', couponApplied: false
}

export default function OrderFormPage({ user, addOrder }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...INITIAL_FORM, productId: searchParams.get('product') || '' })
  const [products, setProducts] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [doneId, setDoneId] = useState(null)
  
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [myCoupons, setMyCoupons] = useState([])

  useEffect(() => {
    getProducts().then(setProducts).catch(() => {})
    
    // Fetch user's claimed coupons
    import('../api').then(({ getCoupons }) => {
      getCoupons().then(data => {
        if (data) {
          setMyCoupons(data.filter(c => c.claimedByMe && !c.usedByMe));
        }
      }).catch(() => {})
    })
  }, [])

  const product = products.find(p => p._id === form.productId)

  // Mirror the backend cost calculation EXACTLY
  const sqm = parseFloat(form.width || 0) * parseFloat(form.height || 0)
  const qty = parseInt(form.qty || 1)
  
  let baseShopCost = 0
  let estimatedCost = 0
  if (product) {
    if (product.pricingType === 'per_sqm') {
      baseShopCost = sqm * product.basePrice * qty
    } else {
      baseShopCost = product.basePrice * qty
    }

    if (form.material) {
      const option = product.options?.find(o => o.name === form.material)
      if (option) {
        baseShopCost += (option.addOnPrice * qty)
      }
    }

    const discountRate = user?.sellerData?.discountRate || user?.discountRate || 0
    const tierDiscountAmount = Math.floor(baseShopCost * (discountRate / 100))
    estimatedCost = baseShopCost - tierDiscountAmount
    
    if (form.couponApplied) {
      estimatedCost -= couponDiscount
    }
  }

  async function handleApplyCoupon(code) {
    setApplyingCoupon(true)
    setCouponError('')
    try {
      // Calculate order value BEFORE coupon for minOrderValue check
      const discountRate = user?.sellerData?.discountRate || user?.discountRate || 0
      const tierDiscountAmount = Math.floor(baseShopCost * (discountRate / 100))
      const orderValueBeforeCoupon = baseShopCost - tierDiscountAmount

      // validateCoupon needs to be imported from api.js!
      const { validateCoupon } = await import('../api')
      const couponData = await validateCoupon(code, form.productId, orderValueBeforeCoupon)
      
      setCouponDiscount(couponData.discountAmount)
      setForm(f => ({ ...f, couponApplied: true, couponCodeInput: code }))
    } catch (err) {
      setCouponError(err.message || 'คูปองไม่ถูกต้อง')
      setForm(f => ({ ...f, couponApplied: false }))
      setCouponDiscount(0)
    } finally {
      setApplyingCoupon(false)
    }
  }

  function canProceed() {
    if (step === 1) return form.productId && (product?.pricingType !== 'per_sqm' || (form.width && form.height))
    if (step === 3) return form.delivery && form.customer
    if (step === 4) {
      const sp = parseInt(form.sellPrice || 0)
      return sp > 0 // แค่กรอกราคามากกว่า 0 ก็ผ่านได้เลย
    }
    return true
  }

  async function handleConfirm() {
    setSubmitting(true)
    setError('')
    try {
      // 1. Upload file to Supabase if it exists
      let uploadedFileUrl = ''
      if (form.artworkFileObj) {
        const { uploadArtwork } = await import('../supabaseClient')
        uploadedFileUrl = await uploadArtwork(form.artworkFileObj, {
          customerName: form.customer || 'ไม่ระบุชื่อ',
          productName: product?.name || 'custom-order'
        })
      }

      // ป้องกัน Error จาก State เก่าที่ค้างอยู่ในบราวเซอร์ (เช่น 'pickup' เป็น 'Pickup')
      const formattedDelivery = form.delivery 
        ? form.delivery.charAt(0).toUpperCase() + form.delivery.slice(1).toLowerCase()
        : '';

      const orderData = {
        productId: form.productId,
        width: parseFloat(form.width) || 1,
        height: parseFloat(form.height) || 1,
        quantity: parseInt(form.qty) || 1,
        finishingOptions: form.material ? [form.material] : [],
        fileUrl: uploadedFileUrl || form.artworkLink || '',
        designStatus: (uploadedFileUrl || form.artworkLink) ? 'Ready to Print' : 'Need Draft',
        note: form.artworkNote || form.specsNote || '',
        deliveryMethod: formattedDelivery,
        shippingAddress: form.address || '',
        clientSellingPrice: parseInt(form.sellPrice),
        couponCode: form.couponApplied ? form.couponCodeInput : undefined,
      }

      const created = await createOrder(orderData)
      addOrder(created)
      toast.success('ส่งออเดอร์สำเร็จ')
      setDoneId(created._id)
    } catch (err) {
      toast.error(err.message || 'ไม่สามารถสร้างออเดอร์ได้ กรุณาลองใหม่')
      setError(err.message || 'ไม่สามารถสร้างออเดอร์ได้ กรุณาลองใหม่')
    } finally {
      setSubmitting(false)
    }
  }

  if (doneId) {
    return (
      <div className="order-success-screen">
        <div className="order-success-screen__icon">✅</div>
        <h2 className="font-display">ส่งออเดอร์สำเร็จ!</h2>
        <p className="text-muted">Order ID</p>
        <p className="font-mono font-600" style={{ marginBottom: 'var(--sp-6)', fontSize: '0.9rem' }}>{doneId}</p>
        <button className="btn btn-primary" onClick={() => navigate(`/quotation/${doneId}`)}>
          <FileText size={16} /> สร้างใบเสนอราคา (White-Label)
        </button>
      </div>
    )
  }

  return (
    <div className="impeccable-wizard-page">
      <div className="container--narrow">

        {/* ── Page Title ── */}
        <div className="wizard-page-header">
          <h1 className="font-display wizard-page-header__title">สร้างออเดอร์ใหม่</h1>
          <p className="wizard-page-header__sub">กรอกข้อมูล 4 ขั้นตอนให้ครบก่อนยืนยัน</p>
        </div>

        {/* ── Step Nav ── */}
        <div className="impeccable-wizard-nav">
          {STEPS.map(s => (
            <div key={s.id} className={`impeccable-wizard-tab ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}>
              <span className="wizard-tab-num">{step > s.id ? '✓' : `0${s.id}`}</span>
              <span className="wizard-tab-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="form-error-banner">
            ⚠️ {error}
          </div>
        )}

        {/* ── Step Content ── */}
        <div className="impeccable-wizard-body">
          {step === 1 && <Step1 form={form} onChange={(k,v) => setForm(f => ({...f, [k]: v}))} products={products} product={product} />}
          {step === 2 && <Step2 form={form} onChange={(k,v) => setForm(f => ({...f, [k]: v}))} />}
          {step === 3 && <Step3 form={form} onChange={(k,v) => setForm(f => ({...f, [k]: v}))} />}
          {step === 4 && <Step4 
            form={form} 
            onChange={(k,v) => setForm(f => ({...f, [k]: v}))} 
            product={product} 
            estimatedCost={estimatedCost} 
            onApplyCoupon={handleApplyCoupon}
            applyingCoupon={applyingCoupon}
            couponDiscount={couponDiscount}
            couponError={couponError}
            myCoupons={myCoupons}
          />}
        </div>

        {/* ── Footer Nav ── */}
        <div className="impeccable-wizard-footer">
          <button className="btn btn-ghost" disabled={step === 1} onClick={() => setStep(s => s - 1)}>
            <ChevronLeft size={16} /> ย้อนกลับ
          </button>

          <span className="wizard-step-indicator">ขั้นตอน {step} / {STEPS.length}</span>

          {step < 4 ? (
            <button className="btn btn-primary" disabled={!canProceed()} onClick={() => setStep(s => s + 1)}>
              ถัดไป <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" disabled={!canProceed() || submitting} onClick={handleConfirm}>
              {submitting
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> กำลังส่ง...</>
                : <>✓ ยืนยันออเดอร์</>}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
