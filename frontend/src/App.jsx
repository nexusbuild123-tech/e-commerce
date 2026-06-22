import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetails'; 
import ProductTypes from './components/ProductTypes';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* FIXED: Path ko badal kar /product-types/:productId kiya taaki Home component ke links se match kare */}
            <Route path="/product-types/:productId" element={<ProductTypes />} />
            
            {/* Yeh detail page load karega jab ProductTypes me click hoga */}
            <Route path="/product-detail/:id" element={<ProductDetail />} />
            
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;