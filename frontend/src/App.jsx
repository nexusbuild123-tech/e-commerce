import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetails'; 
import ProductTypes from './components/ProductTypes';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Profile from './components/Profile';
import AllProducts from './Pages/AllProducts';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product-types/:productId" element={<ProductTypes />} />
              <Route path="/product-detail/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/products" element={<AllProducts />} />
              {/* 404 Fallback */}
              <Route path="*" element={<div className="text-center py-20"><h2 className="text-2xl font-bold">Page Not Found</h2><p className="text-gray-500">The page you are looking for does not exist.</p></div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;