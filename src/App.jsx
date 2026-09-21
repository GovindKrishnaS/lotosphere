import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'

// Layout
import Layout from '@/layouts/Layout'

// Route Guards
import AdminRoute from '@/components/auth/AdminRoute'

// Pages
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetails from '@/pages/ProductDetails'
import PlantCarePage from '@/pages/PlantCarePage'
import About from '@/pages/About'
import OurStory from '@/pages/OurStory'
import Checkout from '@/pages/Checkout'
import OrderSuccess from '@/pages/OrderSuccess'
import NotFound from '@/pages/NotFound'

// Admin Pages
import AdminLogin from '@/pages/admin/AdminLogin'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminFeedback from '@/pages/admin/AdminFeedback'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--color-forest)',
                color: 'var(--color-cream)',
                borderRadius: '12px',
                padding: '12px 18px',
                fontSize: '14px',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="products/:slug" element={<ProductDetails />} />
              <Route path="plant-care" element={<PlantCarePage />} />
              <Route path="about" element={<About />} />
              <Route path="our-story" element={<OurStory />} />

              {/* Redirect Customer Auth/Account paths */}
              <Route path="auth/*" element={<Navigate to="/" replace />} />
              <Route path="account/*" element={<Navigate to="/" replace />} />

              {/* Checkout & Order Success */}
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success/:id" element={<OrderSuccess />} />

              {/* Admin Login Route */}
              <Route path="admin/login" element={<AdminLogin />} />

              {/* Admin Portal (Protected Admin) */}
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/feedback"
                element={
                  <AdminRoute>
                    <AdminFeedback />
                  </AdminRoute>
                }
              />

              {/* Fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
