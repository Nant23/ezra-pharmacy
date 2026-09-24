import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Medicines from './pages/Medicines';
import MedicineDetails from './pages/MedicineDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import HealthArticles from './pages/HealthArticles';
import ArticleDetail from './pages/ArticleDetail';
import PrescriptionUpload from './pages/PrescriptionUpload';
import Categories from './pages/Categories';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMedicines from './pages/admin/AdminMedicines';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPrescriptions from './pages/admin/AdminPrescriptions';

// Admin pages use their own layout (with AdminSidebar), so no Footer
const ADMIN_PATHS = ['/admin'];
const NO_FOOTER_PATHS = ['/login', '/register', '/forgot-password'];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const hideFooter = NO_FOOTER_PATHS.some(p => pathname.startsWith(p)) || isAdmin;

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/medicines/:id" element={<MedicineDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/articles" element={<HealthArticles />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/prescription" element={<PrescriptionUpload />} />

        {/* Cart & Checkout */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/medicines" element={<AdminMedicines />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/prescriptions" element={<AdminPrescriptions />} />

        {/* 404 */}
        <Route path="*" element={
          <div className="page-wrapper">
            <div className="container" style={{ textAlign: 'center', padding: '80px 24px' }}>
              <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🔍</div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--gray-900)' }}>
                404 — Page Not Found
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.05rem' }}>
                The page you're looking for doesn't exist or has been moved.
              </p>
              <a href="/" className="btn btn-primary btn-lg">
                Go to Home
              </a>
            </div>
          </div>
        } />
      </Routes>
      {!hideFooter && <Footer />}
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
