import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, LayoutDashboard, Package, LogOut, Menu, X, ChevronDown, UserCircle, Factory, ClipboardList, Users, Ticket } from 'lucide-react'
import { useState } from 'react'
import './Navbar.css'

// ─── เมนูสำหรับเซลล์ (Seller) ────────────────────────────────────────────────
const sellerLinks = [
  { to: '/catalog', label: 'สินค้าป้าย',  icon: Package },
  { to: '/orders',  label: 'ติดตามงาน',   icon: ShoppingBag },
  { to: '/my-coupons', label: 'คูปองของฉัน', icon: Ticket },
]

// ─── เมนูสำหรับแอดมินโรงงาน (Admin) ─────────────────────────────────────────
const adminLinks = [
  { to: '/admin/orders', label: 'จัดการออเดอร์', icon: ClipboardList },
  { to: '/admin/products', label: 'จัดการสินค้า', icon: Package },
  { to: '/admin/users', label: 'จัดการเซลล์', icon: Users },
  { to: '/admin/coupons', label: 'จัดการคูปอง', icon: Ticket },
]

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isAdmin = user?.role === 'Admin'

  // แอดมินจะเห็น Logo นำไปที่ /admin/orders ส่วนเซลล์จะไปที่ /dashboard
  const homeLink = isAdmin ? '/admin/orders' : (user ? '/dashboard' : '/')

  const links = isAdmin ? adminLinks : sellerLinks

  return (
    <header className={`navbar ${isAdmin ? 'navbar--admin' : ''}`}>
      <div className="navbar__inner container">

        {/* Logo */}
        <Link to={homeLink} className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <img src="/logo.jpg" alt="Smile Logo" style={{ height: 34, width: 34, borderRadius: '6px', objectFit: 'cover' }} />
          <div className="navbar__logo-text">
            <span className="navbar__logo-brand">Smile</span>
            <span className="navbar__logo-product">{isAdmin ? 'Admin' : 'Sign'}</span>
          </div>
          {isAdmin && (
            <span className="navbar__admin-badge" style={{ marginLeft: 8 }}>โรงงาน</span>
          )}
        </Link>

        {/* Desktop Nav */}
        {user && (
          <nav className="navbar__nav" aria-label="Main navigation">
            {/* แอดมินไม่เห็น Dashboard ของเซลล์ */}
            {!isAdmin && (
              <Link
                to="/dashboard"
                className={`navbar__link ${location.pathname === '/dashboard' ? 'navbar__link--active' : ''}`}
              >
                <LayoutDashboard size={16} />
                แดชบอร์ด
              </Link>
            )}
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`navbar__link ${isAdmin ? 'navbar__link--admin' : ''} ${location.pathname.startsWith(to) ? 'navbar__link--active' : ''}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="navbar__right">
          {user ? (
            <div className="navbar__user" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <div className={`navbar__avatar ${isAdmin ? 'navbar__avatar--admin' : ''}`} aria-label={user.name}>
                {user.name.charAt(0)}
              </div>
              <div className="navbar__user-info">
                <span className="navbar__user-name">{user.name.split(' ')[0]}</span>
                <span className="navbar__user-level" style={isAdmin ? { color: 'var(--brand)' } : {}}>
                  {isAdmin ? '🏭 โรงงาน' : user.level}
                </span>
              </div>
              <ChevronDown size={14} className={`navbar__chevron ${userMenuOpen ? 'open' : ''}`} />

              {userMenuOpen && (
                <div className="navbar__user-dropdown" onClick={e => e.stopPropagation()}>
                  <div className="navbar__dropdown-header">
                    <p className="font-600">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                    {isAdmin && (
                      <span className="navbar__dropdown-role-badge">Admin</span>
                    )}
                  </div>
                  <hr className="divider" style={{ margin: '8px 0' }} />

                  {/* เซลล์เห็นโปรไฟล์, แอดมินไม่ต้องมี */}
                  {!isAdmin && (
                    <Link
                      to="/profile"
                      className="navbar__dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserCircle size={15} />
                      โปรไฟล์
                    </Link>
                  )}

                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                    onClick={() => { onLogout(); setUserMenuOpen(false) }}
                  >
                    <LogOut size={15} />
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="btn btn-ghost btn-sm">เข้าสู่ระบบ</Link>
              <Link to="/register" className="btn btn-primary btn-sm">สมัครเป็นเซลล์</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu animate-fade-in">
          {user ? (
            <>
              {!isAdmin && (
                <Link to="/dashboard" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard size={18} /> แดชบอร์ด
                </Link>
              )}
              {links.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                  <Icon size={18} /> {label}
                </Link>
              ))}
              {!isAdmin && (
                <Link to="/profile" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                  <UserCircle size={18} /> โปรไฟล์
                </Link>
              )}
              <hr className="divider" />
              <button className="navbar__mobile-link" onClick={() => { onLogout(); setMenuOpen(false) }}>
                <LogOut size={18} /> ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>เข้าสู่ระบบ</Link>
              <Link to="/register" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>สมัครเป็นเซลล์</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
