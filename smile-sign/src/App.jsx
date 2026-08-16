import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CatalogPage from './pages/CatalogPage'
import OrderFormPage from './pages/OrderFormPage'
import OrdersPage from './pages/OrdersPage'
import QuotationPage from './pages/QuotationPage'
import ProfilePage from './pages/ProfilePage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminCouponsPage from './pages/AdminCouponsPage'
import MyCouponsPage from './pages/MyCouponsPage'
import { Toaster } from 'react-hot-toast'
import { getMyOrders } from './api'
import './App.css'

// ─── Route guards ─────────────────────────────────────────────────────────────
function RequireAuth({ user, children }) {
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

function RequireAdmin({ user, children }) {
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.role !== 'Admin') return <Navigate to="/dashboard" replace />
  return children
}

// ─── App shell with navbar ────────────────────────────────────────────────────
function AppShell({ user, onLogin, onLogout, orders, addOrder }) {
  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={onLogout} />
      <div className="app-main">
        <Toaster />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={onLogin} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage onLogin={onLogin} />}
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth user={user}>
                <DashboardPage user={user} orders={orders} />
              </RequireAuth>
            }
          />
          <Route
            path="/catalog"
            element={
              <RequireAuth user={user}>
                <CatalogPage />
              </RequireAuth>
            }
          />
          <Route
            path="/order/new"
            element={
              <RequireAuth user={user}>
                <OrderFormPage user={user} addOrder={addOrder} />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth user={user}>
                <OrdersPage orders={orders} />
              </RequireAuth>
            }
          />
          <Route
            path="/quotation/:id"
            element={
              <RequireAuth user={user}>
                <QuotationPage user={user} orders={orders} />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth user={user}>
                <ProfilePage user={user} onLogin={onLogin} />
              </RequireAuth>
            }
          />
          <Route
            path="/my-coupons"
            element={
              <RequireAuth user={user}>
                <MyCouponsPage />
              </RequireAuth>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin/orders"
            element={
              <RequireAdmin user={user}>
                <AdminOrdersPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/products"
            element={
              <RequireAdmin user={user}>
                <AdminProductsPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireAdmin user={user}>
                <AdminUsersPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <RequireAdmin user={user}>
                <AdminCouponsPage />
              </RequireAdmin>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
        </Routes>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('smilesign_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const [orders, setOrders] = useState([])

  // Helper to map backend DB structure to the format UI components expect
  function formatOrderForUI(o) {
    const statusMap = {
      'Pending': 'pending',
      'Confirm Artwork': 'pending',
      'Producing': 'progress',
      'Ready to Ship': 'deliver',
      'Completed': 'installed',
      'Cancelled': 'cancelled'
    };
    return {
      ...o,
      id: o._id,
      date: o.createdAt || '',
      statusKey: statusMap[o.status] || 'pending',
      product: o.product?.name || 'Custom Order',
      specs: o.specs ? `${o.specs.width}x${o.specs.height}m (${o.specs.quantity}pcs)` : '',
      customer: o.logistics?.shippingAddress || 'No Address', // fallback for customer name
      profit: o.financials?.sellerProfit || 0,
      costPrice: o.financials?.sellerCost || 0,
      sellPrice: o.financials?.clientSellingPrice || 0,
      delivery: o.logistics?.deliveryMethod || 'pickup'
    }
  }

  // Fetch real orders from backend whenever user logs in
  useEffect(() => {
    if (user) {
      getMyOrders()
        .then(data => setOrders(data.map(formatOrderForUI)))
        .catch(() => setOrders([])) // silent fail — show empty list
    } else {
      setOrders([])
    }
  }, [user])

  function handleLogin(userData) {
    setUser(userData)
    localStorage.setItem('smilesign_user', JSON.stringify(userData))
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('smilesign_user')
  }

  // Optimistically prepend newly created order, then re-fetch from backend
  function addOrder(newOrder) {
    setOrders(prev => [formatOrderForUI(newOrder), ...prev])
    // Refresh after short delay to sync with real DB
    setTimeout(() => {
      getMyOrders()
        .then(data => setOrders(data.map(formatOrderForUI)))
        .catch(() => {})
    }, 1000)
  }

  return (
    <BrowserRouter>
      <AppShell 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        orders={orders}
        addOrder={addOrder}
      />
    </BrowserRouter>
  )
}
