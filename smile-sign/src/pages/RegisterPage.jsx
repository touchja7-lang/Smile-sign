import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerUser } from '../api'
import './AuthPage.css'

const sellerPerks = [
  'ราคาต้นทุนพิเศษ ต่ำกว่าท้องตลาด',
  'ใบเสนอราคา White-label ในชื่อร้านคุณ',
  'ระบบคำนวณกำไรแบบ Real-time',
  'Level System ยิ่งขาย ยิ่งได้ส่วนลดมาก',
  'คูปองพิเศษประจำเดือน',
  'ติดตามสถานะงานได้ตลอด 24 ชม.',
]

export default function RegisterPage({ onLogin }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', shopName: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true)
    setError('')
    try {
      const data = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        shopDetails: { shopName: form.shopName }
      })
      onLogin(data) // pass response
      toast.success('สมัครสมาชิกสำเร็จ')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'การสมัครสมาชิกผิดพลาด')
      toast.error('การสมัครสมาชิกผิดพลาด')
      setStep(1) // go back to show error maybe
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__split">
        {/* Left panel */}
        <div className="auth-page__brand">
          <div className="auth-brand__content">
            <div className="auth-brand__logo">
              <img src="/logo.jpg" alt="Smile Logo" style={{ width: 52, height: 52, borderRadius: '12px', objectFit: 'cover' }} />
              <span className="auth-brand__name">Smile Sign</span>
            </div>
            <h2 className="auth-brand__headline">ใครๆ ก็เป็น<br/>เซลล์ป้ายได้</h2>
            <p style={{ color: 'oklch(0.85 0.04 145)', fontSize: '0.9375rem', marginBottom: 'var(--sp-6)' }}>
              ไม่ต้องมีทุน ไม่ต้องมีหน้าร้าน สมัครฟรีภายใน 2 นาที
            </p>
            <ul className="auth-brand__perks">
              {sellerPerks.map(p => (
                <li key={p} className="auth-brand__perk">
                  <span className="auth-brand__check">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-page__form-panel">
          <div className="auth-form-box animate-fade-up">
            {/* Step indicator */}
            <div className="auth-steps">
              <div className={`auth-step ${step >= 1 ? 'auth-step--active' : ''}`}>
                <div className="auth-step__dot">{step > 1 ? '✓' : '1'}</div>
                <span>ข้อมูลบัญชี</span>
              </div>
              <div className="auth-step__line" />
              <div className={`auth-step ${step >= 2 ? 'auth-step--active' : ''}`}>
                <div className="auth-step__dot">2</div>
                <span>ข้อมูลร้านค้า</span>
              </div>
            </div>

            <h1 className="auth-form-box__title">
              {step === 1 ? 'สมัครเป็นเซลล์' : 'ข้อมูลร้านค้า (ไม่บังคับ)'}
            </h1>
            <p className="text-muted text-sm auth-form-box__sub">
              มีบัญชีอยู่แล้ว?{' '}
              <Link to="/login" className="text-brand font-500">เข้าสู่ระบบ</Link>
            </p>

            {error && (
              <div className="auth-form-box__error" role="alert" style={{ color: 'red', marginBottom: '1rem', background: '#ffebee', padding: '0.5rem', borderRadius: '4px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form-box__form" noValidate>
              {step === 1 ? (
                <>
                  <div className="form-group">
                    <label htmlFor="reg-name" className="form-label">ชื่อ-นามสกุล <span>*</span></label>
                    <input id="reg-name" name="name" type="text" className="form-input"
                      placeholder="ธนภัทร วงศ์สุวรรณ" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-phone" className="form-label">เบอร์โทรศัพท์ <span>*</span></label>
                    <input id="reg-phone" name="phone" type="tel" className="form-input"
                      placeholder="08X-XXX-XXXX" value={form.phone} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-email" className="form-label">อีเมล <span>*</span></label>
                    <input id="reg-email" name="email" type="email" className="form-input"
                      placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-password" className="form-label">รหัสผ่าน <span>*</span></label>
                    <div className="auth-form-box__password-wrap">
                      <input id="reg-password" name="password" type={showPass ? 'text' : 'password'}
                        className="form-input" placeholder="อย่างน้อย 8 ตัวอักษร"
                        value={form.password} onChange={handleChange} required />
                      <button type="button" className="auth-form-box__toggle-pass"
                        onClick={() => setShowPass(!showPass)}
                        aria-label={showPass ? 'ซ่อน' : 'แสดง'}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button id="btn-register-step1" type="submit" className="btn btn-primary btn-full" style={{ marginTop: 'var(--sp-2)' }}>
                    ถัดไป <ArrowRight size={16} />
                  </button>
                </>
              ) : (
                <>
                  <div className="auth-form-box__optional-notice">
                    <CheckCircle size={14} style={{ color: 'var(--brand)', flexShrink: 0 }} />
                    <p className="text-sm text-muted">
                      ข้อมูลนี้ใช้สำหรับแสดงในใบเสนอราคา White-label ของคุณ สามารถแก้ไขได้ภายหลัง
                    </p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-shopname" className="form-label">ชื่อร้าน / ชื่อทีม</label>
                    <input id="reg-shopname" name="shopName" type="text" className="form-input"
                      placeholder="เช่น สื่อโฆษณา ธนภัทร" value={form.shopName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">โลโก้ร้าน (ถ้ามี)</label>
                    <div className="auth-upload-box">
                      <span>📁</span>
                      <p className="text-sm text-muted">คลิกเพื่ออัปโหลด PNG/JPG ขนาดไม่เกิน 2MB</p>
                    </div>
                  </div>
                  <label className="auth-agree">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                    <span className="text-sm text-muted">
                      ยอมรับ{' '}
                      <a href="#" className="text-brand">ข้อกำหนดการใช้งาน</a>
                      {' '}และ{' '}
                      <a href="#" className="text-brand">นโยบายความเป็นส่วนตัว</a>
                    </span>
                  </label>
                  <div className="flex gap-2" style={{ marginTop: 'var(--sp-2)' }}>
                    <button type="button" className="btn btn-ghost btn-full" onClick={() => setStep(1)}>
                      ย้อนกลับ
                    </button>
                    <button
                      id="btn-register-submit"
                      type="submit"
                      className="btn btn-primary btn-full"
                      disabled={loading || !agreed}
                    >
                      {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
