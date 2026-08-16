import { Link } from 'react-router-dom'
import { ArrowRight, Box, FileText, CheckCircle2, TrendingUp, ShieldCheck, Zap, Users, Star, ChevronRight } from 'lucide-react'
import { sellerLevels } from '../data/mockData'
import './LandingPage.css'

// ─── Section: Hero ─────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="landing-hero">
      <div className="container">
        <div className="landing-hero__inner">
          <div className="landing-hero__content animate-fade-up">
            <div className="landing-hero__badge">
              <span className="landing-hero__badge-dot" />
              เปิดรับสมัครเซลล์ทั่วประเทศ — ไม่มีค่าสมัคร
            </div>
            <h1 className="landing-hero__title">
              แพลตฟอร์มสำหรับ<br />
              <span className="text-brand">เซลล์ป้ายมืออาชีพ</span>
            </h1>
            <p className="landing-hero__subtitle">
              เข้าถึงราคาต้นทุนจากโรงพิมพ์โดยตรง คำนวณกำไรทันที
              ออกใบเสนอราคา White-label ในชื่อร้านคุณ ใน 60 วินาที
            </p>
            <div className="landing-hero__actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                เริ่มต้นฟรี <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                เข้าสู่ระบบ
              </Link>
            </div>
            <div className="landing-hero__trust">
              <span className="text-xs text-muted">✓ ไม่ต้องใช้บัตรเครดิต</span>
              <span className="text-xs text-muted">✓ ไม่มีค่าสมัคร</span>
              <span className="text-xs text-muted">✓ ยกเลิกได้ทุกเมื่อ</span>
            </div>
          </div>

          {/* Live Quotation Preview */}
          <div className="landing-hero__preview animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div className="preview-terminal">
              <div className="preview-terminal__header">
                <div className="preview-terminal__dots">
                  <div />
                  <div />
                  <div />
                </div>
                <span className="text-xs font-mono text-muted">ใบเสนอราคา — ออกทันที</span>
              </div>
              <div className="preview-terminal__body">
                <div className="preview-row">
                  <div>
                    <p className="font-500 text-sm">ป้ายไวนิล 3×6 เมตร</p>
                    <p className="text-xs text-muted">ไวนิลธรรมดา 440gsm • 2 ผืน</p>
                  </div>
                </div>
                <div className="preview-divider" />
                <div className="preview-row">
                  <span className="text-sm text-muted">ต้นทุนของคุณ</span>
                  <span className="font-mono text-sm">฿1,260</span>
                </div>
                <div className="preview-row">
                  <span className="text-sm text-muted">Markup ของคุณ</span>
                  <span className="font-mono text-sm">฿740</span>
                </div>
                <div className="preview-row preview-row--total">
                  <span className="font-600 text-sm">ราคาที่เสนอลูกค้า</span>
                  <span className="font-mono font-600">฿2,000</span>
                </div>
                <div className="preview-profit-tag">
                  <TrendingUp size={13} />
                  <span className="font-mono font-600">กำไรสุทธิ ฿740 (37%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="landing-stats animate-fade-up" style={{ animationDelay: '200ms' }}>
          {[
            { val: '1,200+', label: 'เซลล์ที่ใช้งาน' },
            { val: '48,000+', label: 'งานที่ผลิตแล้ว' },
            { val: '฿12M+', label: 'กำไรรวมที่เซลล์ได้รับ' },
            { val: '99.2%', label: 'งานส่งตรงเวลา' },
          ].map(s => (
            <div key={s.label} className="landing-stat">
              <span className="landing-stat__val">{s.val}</span>
              <span className="landing-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: How It Works ──────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: <Users size={24} />,
      title: 'สมัครเป็นเซลล์',
      desc: 'สมัครฟรีภายใน 2 นาที ไม่ต้องใช้เงินทุน ไม่ต้องมีหน้าร้าน เพียงแค่มีโทรศัพท์มือถือ',
    },
    {
      num: '02',
      icon: <Box size={24} />,
      title: 'รับราคาต้นทุน',
      desc: 'เข้าถึงราคาจากโรงพิมพ์โดยตรง ลดราคาตาม Level ตั้งแต่ 10–25% ต่ำกว่าราคาตลาด',
    },
    {
      num: '03',
      icon: <TrendingUp size={24} />,
      title: 'คำนวณกำไร',
      desc: 'ตั้งราคาขายของคุณเอง ระบบคำนวณกำไรแบบ Real-time ก่อนยืนยันออเดอร์ทุกครั้ง',
    },
    {
      num: '04',
      icon: <FileText size={24} />,
      title: 'ส่งใบเสนอราคา',
      desc: 'ออกใบเสนอราคา PDF ในชื่อร้านของคุณ ลูกค้าไม่รู้ว่าคุณใช้ Smile Sign เลย',
    },
  ]

  return (
    <section className="landing-section landing-section--alt">
      <div className="container">
        <div className="landing-section__header">
          <p className="landing-section__eyebrow">HOW IT WORKS</p>
          <h2>ทำงาน 4 ขั้นตอน<br />เริ่มหาเงินได้ทันที</h2>
        </div>

        <div className="landing-steps">
          {steps.map((step, i) => (
            <div key={step.num} className="landing-step">
              <div className="landing-step__header">
                <div className="landing-step__num font-mono">{step.num}</div>
                <div className="landing-step__icon text-brand">{step.icon}</div>
              </div>
              <h3 className="landing-step__title">{step.title}</h3>
              <p className="landing-step__desc text-muted text-sm">{step.desc}</p>
              {i < steps.length - 1 && <div className="landing-step__arrow"><ChevronRight size={20} /></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Features ──────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: <Zap size={20} />,
      title: 'ราคา Real-time',
      desc: 'ราคาต้นทุนอัพเดทจากโรงพิมพ์โดยตรง ไม่มีการบวกกำไรแฝง',
    },
    {
      icon: <FileText size={20} />,
      title: 'White-label PDF',
      desc: 'ใบเสนอราคาแสดงชื่อร้านและโลโก้ของคุณ 100% ลูกค้าไม่รู้ว่าผ่านแพลตฟอร์ม',
    },
    {
      icon: <ShieldCheck size={20} />,
      title: 'Level System',
      desc: 'ยิ่งขายมาก ยิ่งได้ส่วนลดเพิ่ม สูงสุด 25% สำหรับระดับ Platinum',
    },
    {
      icon: <TrendingUp size={20} />,
      title: 'Profit Calculator',
      desc: 'คำนวณกำไรและ Margin ก่อนยืนยันออเดอร์ทุกครั้ง ไม่มีความเสี่ยง',
    },
    {
      icon: <Box size={20} />,
      title: 'ติดตามงาน Real-time',
      desc: 'เห็นสถานะงานตั้งแต่รับออเดอร์ ผลิต พร้อมส่ง จนถึงติดตั้งเสร็จ',
    },
    {
      icon: <Users size={20} />,
      title: 'คูปองรายเดือน',
      desc: 'รับคูปองส่วนลดพิเศษทุกเดือน ลดเพิ่มอีกบนราคาต้นทุนที่ถูกอยู่แล้ว',
    },
  ]

  return (
    <section className="landing-section">
      <div className="container">
        <div className="landing-section__header">
          <p className="landing-section__eyebrow">FEATURES</p>
          <h2>ทุกอย่างที่เซลล์ป้าย<br />ต้องการ ในที่เดียว</h2>
        </div>

        <div className="landing-features-grid">
          {features.map(f => (
            <div key={f.title} className="landing-feature">
              <div className="landing-feature__icon">{f.icon}</div>
              <h4 className="landing-feature__title">{f.title}</h4>
              <p className="landing-feature__desc text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Level Pricing ─────────────────────────────────────────────────
function LevelPricing() {
  const levels = [
    { name: 'Bronze', discount: 10, target: '฿0 – ฿30k', perks: ['ส่วนลดจากต้นทุน 10%', 'ใบเสนอราคา White-label', 'คูปองพิเศษ', 'ติดตามงาน Real-time'], popular: false },
    { name: 'Silver', discount: 15, target: '฿30k – ฿100k', perks: ['ส่วนลดจากต้นทุน 15%', 'ใบเสนอราคา White-label', 'คูปองพิเศษ Priority', 'ติดตามงาน Real-time', 'Support เร่งด่วน'], popular: true },
    { name: 'Gold', discount: 20, target: '฿100k – ฿300k', perks: ['ส่วนลดจากต้นทุน 20%', 'ใบเสนอราคา White-label', 'คูปองพิเศษ Priority', 'ติดตามงาน Real-time', 'Dedicated Account Manager'], popular: false },
    { name: 'Platinum', discount: 25, target: '฿300k+', perks: ['ส่วนลดจากต้นทุน 25%', 'ทุกสิทธิ์ข้างต้น', 'เข้าถึงสินค้า Pre-release', 'ราคาพิเศษสำหรับงานใหญ่', 'Priority Production Queue'], popular: false },
  ]

  return (
    <section className="landing-section landing-section--alt">
      <div className="container">
        <div className="landing-section__header">
          <p className="landing-section__eyebrow">LEVEL SYSTEM</p>
          <h2>ยิ่งขายมาก<br />ยิ่งได้ส่วนลดมาก</h2>
          <p className="landing-section__sub text-muted">
            เริ่มต้นที่ Bronze ฟรี ยอดขายสะสมของคุณจะอัพเกรด Level โดยอัตโนมัติ
          </p>
        </div>

        <div className="landing-levels-grid">
          {levels.map(lvl => (
            <div key={lvl.name} className={`landing-level ${lvl.popular ? 'landing-level--popular' : ''}`}>
              {lvl.popular && <div className="landing-level__popular-tag">Most Popular</div>}
              <div className="landing-level__header">
                <h3 className="font-display landing-level__name">{lvl.name}</h3>
                <div>
                  <span className="landing-level__discount">{lvl.discount}%</span>
                  <span className="text-xs text-muted"> ส่วนลด</span>
                </div>
              </div>
              <p className="text-xs text-muted landing-level__range">ยอดขาย {lvl.target} / เดือน</p>
              <div className="landing-level__divider" />
              <ul className="landing-level__perks">
                {lvl.perks.map(p => (
                  <li key={p}>
                    <CheckCircle2 size={13} className="text-brand" style={{ flexShrink: 0 }} />
                    <span className="text-sm">{p}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`btn ${lvl.popular ? 'btn-primary' : 'btn-outline'} btn-full`} style={{ marginTop: 'auto', display: 'flex' }}>
                เริ่มต้นฟรี <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Products Teaser ───────────────────────────────────────────────
function ProductsTeaser() {
  const items = [
    { emoji: '🪧', name: 'ป้ายไวนิล', price: '35', unit: 'ตร.ม.' },
    { emoji: '💡', name: 'ป้ายตู้ไฟ LED', price: '2,800', unit: 'ชิ้น' },
    { emoji: '🏷️', name: 'สติกเกอร์ PVC', price: '45', unit: 'ตร.ม.' },
    { emoji: '🔷', name: 'ป้ายอะคริลิก', price: '380', unit: 'ตร.ม.' },
    { emoji: '🎌', name: 'ป้ายผ้า Dye-Sub', price: '55', unit: 'ตร.ม.' },
    { emoji: '📋', name: 'โฟมบอร์ด/PVC', price: '85', unit: 'ตร.ม.' },
  ]

  return (
    <section className="landing-section">
      <div className="container">
        <div className="landing-section__header">
          <p className="landing-section__eyebrow">PRODUCTS</p>
          <h2>สินค้าครบ ตอบโจทย์<br />ลูกค้าทุกประเภท</h2>
          <p className="landing-section__sub text-muted">
            ราคาต้นทุนที่แสดงคือก่อนส่วนลด Level ของคุณ — สมาชิกจะเห็นราคาจริงเมื่อ Login
          </p>
        </div>

        <div className="landing-products-grid">
          {items.map(item => (
            <div key={item.name} className="landing-product">
              <span className="landing-product__emoji">{item.emoji}</span>
              <div className="landing-product__info">
                <p className="font-500 text-sm">{item.name}</p>
                <p className="text-xs text-muted">เริ่มต้น</p>
              </div>
              <div className="landing-product__price">
                <span className="font-mono font-600">฿{item.price}</span>
                <span className="text-xs text-muted">/{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: 'var(--sp-6)' }}>
          <Link to="/register" className="btn btn-outline">
            ดูสินค้าทั้งหมดหลัง Login <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Section: Testimonials ──────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    {
      name: 'สมชาย ก.',
      role: 'เซลล์อิสระ, กรุงเทพฯ',
      level: 'Gold',
      quote: 'ก่อนหน้านี้ต้องโทรถามราคาโรงพิมพ์ทีละเจ้า ตอนนี้เข้าระบบเดียว กดออกใบเสนอราคาให้ลูกค้าได้เลย ประหยัดเวลาไปมาก',
      profit: '฿28,000 / เดือน',
    },
    {
      name: 'วิภา ร.',
      role: 'เจ้าของร้านโฆษณา, เชียงใหม่',
      level: 'Silver',
      quote: 'ส่วนลด 15% จากต้นทุนทำให้แข่งราคาได้สบาย และระบบช่วยให้คำนวณกำไรได้ก่อนเสนอ ไม่เคยขาดทุนเลย',
      profit: '฿15,500 / เดือน',
    },
    {
      name: 'ธีระ พ.',
      role: 'นักศึกษาทำงาน Part-time',
      level: 'Bronze',
      quote: 'เพิ่งเริ่มสมัครเดือนที่แล้ว ยังไม่มีประสบการณ์เลย แต่ระบบใช้งานง่ายมาก ออกใบเสนอราคาได้เองโดยไม่ต้องพึ่งใคร',
      profit: '฿6,200 / เดือน',
    },
  ]

  return (
    <section className="landing-section landing-section--alt">
      <div className="container">
        <div className="landing-section__header">
          <p className="landing-section__eyebrow">TESTIMONIALS</p>
          <h2>เซลล์ของเราพูดว่าอะไร</h2>
        </div>

        <div className="landing-testimonials-grid">
          {reviews.map(r => (
            <div key={r.name} className="landing-testimonial">
              <div className="flex gap-1" style={{ marginBottom: 'var(--sp-3)' }}>
                {[1,2,3,4,5].map(n => <Star key={n} size={13} style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />)}
              </div>
              <p className="text-sm landing-testimonial__quote">"{r.quote}"</p>
              <div className="landing-testimonial__footer">
                <div>
                  <p className="font-600 text-sm">{r.name}</p>
                  <p className="text-xs text-muted">{r.role} • Level {r.level}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-600 text-sm text-brand">{r.profit}</p>
                  <p className="text-xs text-muted">กำไรสุทธิ</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Final CTA ─────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="landing-cta">
      <div className="container">
        <div className="landing-cta__inner">
          <h2 className="landing-cta__title">พร้อมเริ่มหาเงิน<br />จากการขายป้าย?</h2>
          <p className="landing-cta__sub text-muted">
            สมัครฟรี ใช้งานได้ทันที ไม่มีค่าใช้จ่ายรายเดือน
          </p>
          <div className="landing-hero__actions" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              สมัครเป็นเซลล์ฟรี <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="landing-footer__inner">
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: 'var(--sp-2)' }}>
              <div style={{ width: 28, height: 28, background: 'var(--brand)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>S</span>
              </div>
              <span className="font-display font-600">Smile Sign</span>
            </div>
            <p className="text-xs text-muted">แพลตฟอร์ม B2B2C สำหรับธุรกิจป้ายมืออาชีพ</p>
          </div>
          <div className="landing-footer__links">
            <Link to="/register" className="text-sm text-muted">สมัครสมาชิก</Link>
            <Link to="/login" className="text-sm text-muted">เข้าสู่ระบบ</Link>
          </div>
          <p className="text-xs text-muted">© 2026 Smile Sign. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="impeccable-landing">
      <Hero />
      <HowItWorks />
      <Features />
      <ProductsTeaser />
      <LevelPricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  )
}
