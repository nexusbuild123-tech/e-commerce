import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // React Router ka hook, login hone ke baad doosre page par bhejne ke liye
  const navigate = useNavigate(); 

  // Form inputs handle karne ke liye
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Login API Call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "nexusBuild@123+!" // Aapki Secret API Key
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        // Login Success
        setStatus({ type: 'success', message: "Login Successful! Redirecting..." });
        
        // (Optional) User data ko LocalStorage mein save karna
        localStorage.setItem("user", JSON.stringify(result.user));
        window.dispatchEvent(new Event("authChange"));

        // 2 second baad Home page par redirect kar dena
        setTimeout(() => {
          navigate("/"); 
        }, 2000);

      } else {
        // Backend se aayi error (Invalid credentials)
        setStatus({ type: 'error', message: result.message || "Invalid email or password!" });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Server unreachable. Please try again later.", error});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            {/* Brand Logo Icon */}
            <svg className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to your <span className="font-bold text-blue-600">ELECTRA.</span> account
          </p>
        </div>

        {/* Status Messages (Error/Success) */}
        {status.message && (
          <div className={`p-4 rounded-xl text-sm font-medium ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status.message}
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 shadow-sm">
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                {/* Forgot Password Link (Placeholder) */}
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline">Forgot password?</a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p className="mt-4 text-center text-sm text-slate-600 font-medium">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-500 font-bold hover:underline transition-all">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;