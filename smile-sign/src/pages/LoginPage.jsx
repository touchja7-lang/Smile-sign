import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginUser } from '../api'
import './AuthPage.css'

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }
    setLoading(true)
    try {
      const data = await loginUser(form.email, form.password)
      onLogin(data) // pass the whole response which contains token and user info
      toast.success('เข้าสู่ระบบสำเร็จ')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'รหัสผ่านหรืออีเมลไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__split">
        {/* Left branding panel */}
        <div className="auth-page__brand">
          <div className="auth-brand__content">
            <div className="auth-brand__logo">
              <img src="/logo.jpg" alt="Smile Logo" style={{ width: 52, height: 52, borderRadius: '12px', objectFit: 'cover' }} />
              <span className="auth-brand__name">Smile Sign</span>
            </div>
            <h2 className="auth-brand__headline">แพลตฟอร์มสำหรับ<br/>เซลล์ป้ายมืออาชีพ</h2>
            <ul className="auth-brand__perks">
              {['ราคาต้นทุนพิเศษตาม Level', 'ใบเสนอราคา White-label', 'ติดตามงานแบบ Real-time', 'ระบบคำนวณกำไรทันที'].map(p => (
                <li key={p} className="auth-brand__perk">
                  <span className="auth-brand__check">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-page__form-panel">
          <div className="auth-form-box animate-fade-up">
            <h1 className="auth-form-box__title">เข้าสู่ระบบ</h1>
            <p className="text-muted text-sm auth-form-box__sub">
              ยังไม่มีบัญชี?{' '}
              <Link to="/register" className="text-brand font-500">สมัครฟรีเลย</Link>
            </p>

            {error && (
              <div className="auth-form-box__error" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form-box__form" noValidate>
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">อีเมล</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password" className="form-label">รหัสผ่าน</label>
                <div className="auth-form-box__password-wrap">
                  <input
                    id="login-password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="รหัสผ่านของคุณ"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-form-box__toggle-pass"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                id="btn-login"
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
                style={{ marginTop: 'var(--sp-2)' }}
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : (
                  <><span>เข้าสู่ระบบ</span> <ArrowRight size={16} /></>
                )}
              </button>

              {/* Demo shortcut */}
              <div className="auth-form-box__demo">
                <p className="text-xs text-muted" style={{ textAlign: 'center' }}>
                  ทดลองใช้งาน: กรอกอีเมลและรหัสผ่านอะไรก็ได้
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
