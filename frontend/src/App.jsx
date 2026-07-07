import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { RefreshProvider } from './context/RefreshContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ Import
import Home from './Pages/Home';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import ProductDetail from './Pages/ProductDetails';
import ProductTypes from './components/ProductTypes';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Profile from './components/Profile';
import AllProducts from './Pages/AllProducts';
import TrackOrder from './Pages/TrackOrders';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <RefreshProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product-types/:productId" element={<ProductTypes />} />
                <Route path="/product-detail/:id" element={<ProductDetail />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* ✅ Protected Routes */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/track-order" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />

                {/* 404 Fallback */}
                <Route path="*" element={
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold">Page Not Found</h2>
                    <p className="text-gray-500">The page you are looking for does not exist.</p>
                  </div>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </RefreshProvider>
  );
}

export default App;