import { useState, useEffect, useRef } from 'react'
import { User, Mail, Phone, Store, MapPin, Lock, Save, CheckCircle, Loader2, Camera } from 'lucide-react'
import toast from 'react-hot-toast'
import { getProfile, updateProfile } from '../api'
import { uploadAvatar } from '../supabaseClient'
import './ProfilePage.css'

function Avatar({ name, avatarUrl, size = 72, onClick, uploading }) {
  return (
    <div
      className="profile-avatar-wrapper"
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="profile-avatar-img" />
      ) : (
        <div className="profile-avatar-fallback" style={{ fontSize: size * 0.4 }}>
          {name?.charAt(0)?.toUpperCase() || '?'}
        </div>
      )}
      <div className="profile-avatar-overlay">
        {uploading ? <Loader2 className="spin" size={24} /> : <Camera size={24} />}
      </div>
    </div>
  )
}

const LEVEL_CONFIG = {
  Bronze:   { icon: '🥉', color: '#cd7f32', bg: '#fdf3e7' },
  Silver:   { icon: '🥈', color: '#6b7280', bg: '#f3f4f6' },
  Gold:     { icon: '🥇', color: '#d97706', bg: '#fffbeb' },
  Platinum: { icon: '💎', color: '#7c3aed', bg: '#f5f3ff' },
}

export default function ProfilePage({ user, onLogin }) {
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving,  setSaving]    = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error,   setError]     = useState('')
  const fileInputRef = useRef(null)

  // form state
  const [form, setForm] = useState({
    name: '', phone: '', shopName: '', address: '', password: '', confirmPassword: '', avatar: ''
  })

  useEffect(() => {
    getProfile()
      .then(data => {
        setProfile(data)
        setForm({
          name:     data.name     || '',
          phone:    data.phone    || '',
          avatar:   data.avatar   || '',
          shopName: data.sellerData?.shopDetails?.shopName || '',
          address:  data.sellerData?.shopDetails?.address  || '',
          password: '', confirmPassword: '',
        })
      })
      .catch(() => setError('ไม่สามารถดึงข้อมูลโปรไฟล์ได้'))
      .finally(() => setLoading(false))
  }, [])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSuccess(false)
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    setError('')
    try {
      // Create object URL for immediate preview (optimistic UI)
      const previewUrl = URL.createObjectURL(file)
      setForm(prev => ({ ...prev, avatar: previewUrl }))
      
      const publicUrl = await uploadAvatar(file, profile._id)
      setForm(prev => ({ ...prev, avatar: publicUrl }))
      
      // Auto save after upload
      const updated = await updateProfile({ avatar: publicUrl })
      onLogin(updated) // Update session
      toast.success('อัปเดตรูปโปรไฟล์เรียบร้อย')
    } catch (err) {
      setError(err.message || 'อัปโหลดรูปไม่สำเร็จ')
      toast.error(err.message || 'อัปโหลดรูปไม่สำเร็จ')
      // Revert preview
      setForm(prev => ({ ...prev, avatar: profile.avatar }))
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    if (form.password && form.password !== form.confirmPassword) {
      setError('รหัสผ่านใหม่ไม่ตรงกัน')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        name:     form.name,
        phone:    form.phone,
        avatar:   form.avatar,
        shopName: form.shopName,
        address:  form.address,
      }
      if (form.password) payload.password = form.password

      const updated = await updateProfile(payload)
      // re-issue session with fresh token
      onLogin(updated)
      setSuccess(true)
      toast.success('บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว')
      setForm(prev => ({ ...prev, password: '', confirmPassword: '' }))
    } catch (err) {
      setError(err.message || 'บันทึกไม่สำเร็จ')
      toast.error(err.message || 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  const level = profile?.sellerData?.sellerLevel || 'Bronze'
  const lvlCfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.Bronze

  if (loading) {
    return (
      <div className="profile-loading">
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} className="text-brand" />
        <p className="text-muted text-sm" style={{ marginTop: 12 }}>กำลังโหลดโปรไฟล์...</p>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="container profile-container">

        {/* ── Left card: identity ──────────────────────── */}
        <aside className="profile-sidebar animate-fade-up">
          <div className="profile-sidebar__top">
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
            <Avatar 
              name={form.name || profile?.name} 
              avatarUrl={form.avatar} 
              size={100} 
              uploading={uploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
            />
            <h2 className="profile-sidebar__name">{profile?.name}</h2>
            <p className="profile-sidebar__email">{profile?.email}</p>

            <div className="profile-level-badge" style={{ background: lvlCfg.bg, color: lvlCfg.color }}>
              <span>{lvlCfg.icon}</span>
              <span className="font-600">{level}</span>
              <span className="text-xs">Seller</span>
            </div>
          </div>

          <ul className="profile-sidebar__stats">
            <li>
              <span className="text-xs text-muted">ยอดขายสะสม</span>
              <span className="font-mono font-600">฿{(profile?.sellerData?.totalSalesVolume || 0).toLocaleString()}</span>
            </li>
            <li>
              <span className="text-xs text-muted">ส่วนลดต้นทุน</span>
              <span className="font-mono font-600">{profile?.sellerData?.discountRate || 0}%</span>
            </li>
            <li>
              <span className="text-xs text-muted">สมัครเมื่อ</span>
              <span className="font-mono text-sm">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '-'}
              </span>
            </li>
          </ul>
        </aside>

        {/* ── Right card: edit form ────────────────────── */}
        <main className="profile-main animate-fade-up" style={{ animationDelay: '60ms' }}>
          <h1 className="profile-main__title">แก้ไขโปรไฟล์</h1>

          {error && (
            <div className="profile-alert profile-alert--error" role="alert">{error}</div>
          )}
          {success && (
            <div className="profile-alert profile-alert--success" role="status">
              <CheckCircle size={15} /> บันทึกข้อมูลสำเร็จแล้วครับ!
            </div>
          )}

          <form onSubmit={handleSave} noValidate>

            {/* ── Section: บัญชี ── */}
            <div className="profile-section">
              <h3 className="profile-section__heading">
                <User size={15} /> ข้อมูลส่วนตัว
              </h3>
              <div className="profile-form-grid">
                <div className="form-group">
                  <label htmlFor="profile-name" className="form-label">ชื่อ-นามสกุล</label>
                  <input id="profile-name" name="name" type="text" className="form-input"
                    value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-email" className="form-label">อีเมล</label>
                  <input id="profile-email" type="email" className="form-input"
                    value={profile?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                  <p className="form-hint">ไม่สามารถเปลี่ยนอีเมลได้</p>
                </div>
                <div className="form-group">
                  <label htmlFor="profile-phone" className="form-label">
                    เบอร์โทรศัพท์
                  </label>
                  <input id="profile-phone" name="phone" type="tel" className="form-input"
                    placeholder="08X-XXX-XXXX" value={form.phone} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ── Section: ร้านค้า ── */}
            <div className="profile-section">
              <h3 className="profile-section__heading">
                <Store size={15} /> ข้อมูลร้านค้า (White-Label)
              </h3>
              <div className="profile-form-grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="profile-shopname" className="form-label">ชื่อร้าน / ชื่อทีม</label>
                  <input id="profile-shopname" name="shopName" type="text" className="form-input"
                    placeholder="เช่น สื่อโฆษณา วัชรพงศ์" value={form.shopName} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="profile-address" className="form-label">
                    ที่อยู่ร้าน (สำหรับใบเสนอราคา)
                  </label>
                  <textarea id="profile-address" name="address" className="form-textarea" rows={2}
                    placeholder="เลขที่ ถนน แขวง เขต จังหวัด รหัสไปรษณีย์"
                    value={form.address} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ── Section: รหัสผ่าน ── */}
            <div className="profile-section">
              <h3 className="profile-section__heading">
                <Lock size={15} /> เปลี่ยนรหัสผ่าน
              </h3>
              <p className="text-xs text-muted" style={{ marginBottom: 'var(--sp-4)' }}>
                ทิ้งว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน
              </p>
              <div className="profile-form-grid">
                <div className="form-group">
                  <label htmlFor="profile-pw" className="form-label">รหัสผ่านใหม่</label>
                  <input id="profile-pw" name="password" type="password" className="form-input"
                    placeholder="อย่างน้อย 8 ตัวอักษร" value={form.password} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-pw2" className="form-label">ยืนยันรหัสผ่านใหม่</label>
                  <input id="profile-pw2" name="confirmPassword" type="password" className="form-input"
                    placeholder="พิมพ์อีกครั้ง" value={form.confirmPassword} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="profile-form-footer">
              <button id="btn-save-profile" type="submit" className="btn btn-primary" disabled={saving}>
                {saving
                  ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> กำลังบันทึก...</>
                  : <><Save size={15} /> บันทึกการเปลี่ยนแปลง</>}
              </button>
            </div>

          </form>
        </main>

      </div>
    </div>
  )
}
