import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Layouts
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import MyAccount from './pages/MyAccount';
import LabTested from './pages/LabTested';
import LoginRegister from './pages/LoginRegister';
import ContactSupport from './pages/ContactSupport';
import Shop from './pages/Shop';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import ProductDetails from './pages/ProductDetails';

// 1. Create an inner component to check the URL
const AppLayout = () => {
  const location = useLocation();
  
  // Check if the current URL starts with '/admin'
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hide Header if it's the Admin route */}
      {!isAdminRoute && <Header />}
      
      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/lab-tested" element={<LabTested />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center py-32">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
              <a href="/" className="text-i7green font-semibold hover:underline">Return to Home</a>
            </div>
          } />
        </Routes>
      </main>

      {/* Hide Footer if it's the Admin route */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

// 2. Main App Component
function App() {
  return (
    <CartProvider>
      <Router>
        <AppLayout />
      </Router>
    </CartProvider>
  );
}

export default App;