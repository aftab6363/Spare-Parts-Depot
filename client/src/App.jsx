import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import PartDetails from './pages/PartDetails';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import AdminPartEdit from './pages/AdminPartEdit';
import OrderDetails from './pages/OrderDetails';
import ScrollToTop from './components/ScrollToTop';


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 font-['Outfit'] flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </div>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            <Route path="/inventory" element={
              <Layout>
                <Inventory />
              </Layout>
            } />
            <Route path="/part/:id" element={
              <Layout>
                <PartDetails />
              </Layout>
            } />
            <Route path="/cart" element={
              <Layout>
                <Cart />
              </Layout>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/part/new" element={
              <ProtectedRoute>
                <Layout>
                  <AdminPartEdit />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/order/:id" element={
              <ProtectedRoute>
                <Layout>
                  <OrderDetails />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/part/:id/edit" element={
              <ProtectedRoute>
                <Layout>
                  <AdminPartEdit />
                </Layout>
              </ProtectedRoute>
            } />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
