import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';

const App = () => {
  return (
    <Router basename="/admin">
      <Routes>
        {/* Default route ko login par bhej dein */}
        <Route path="/" element={<Navigate to="/admin/login" />} />
        
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;