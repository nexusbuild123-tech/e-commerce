import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/Logo1.png"

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStep, setResetStep] = useState('email'); // 'email' | 'otp' | 'password'
  const [resetStatus, setResetStatus] = useState({ type: '', message: '' });
  const [resetLoading, setResetLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "nexusBuild@123+!"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: "Login Successful! Redirecting..." });
        localStorage.setItem("user", JSON.stringify(result.user));
        window.dispatchEvent(new Event("authChange"));
        setTimeout(() => navigate("/"), 2000);
      } else {
        setStatus({ type: 'error', message: result.message || "Invalid email or password!" });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Server unreachable. Please try again later.",error });
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Forgot Password Handlers ----
  const handleSendResetOtp = async () => {
    if (!resetEmail) {
      setResetStatus({ type: 'error', message: 'Please enter your email.' });
      return;
    }
    setResetLoading(true);
    setResetStatus({ type: '', message: '' });
    try {
      const res = await fetch(`${apiUrl}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'nexusBuild@123+!'
        },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setResetStatus({ type: 'success', message: 'OTP sent to your email. Check inbox/spam.' });
        setResetStep('otp');
      } else {
        setResetStatus({ type: 'error', message: data.message || 'Failed to send OTP.' });
      }
    } catch (error) {
      setResetStatus({ type: 'error', message: 'Server error. Try again.',error
       });
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOtpAndReset = async () => {
    if (!resetOtp || !newPassword || !confirmPassword) {
      setResetStatus({ type: 'error', message: 'Please fill all fields.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setResetStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    setResetLoading(true);
    setResetStatus({ type: '', message: '' });
    try {
      const res = await fetch(`${apiUrl}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'nexusBuild@123+!'
        },
        body: JSON.stringify({
          email: resetEmail,
          otp: resetOtp,
          newPassword: newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setResetStatus({ type: 'success', message: 'Password reset successful! Please login.' });
        setTimeout(() => {
          setShowForgotModal(false);
          setResetStep('email');
          setResetEmail('');
          setResetOtp('');
          setNewPassword('');
          setConfirmPassword('');
          setResetStatus({ type: '', message: '' });
        }, 2000);
      } else {
        setResetStatus({ type: 'error', message: data.message || 'Failed to reset password.' });
      }
    } catch (error) {
      setResetStatus({ type: 'error', message: 'Server error. Try again.',error });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center py-12">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100">
          {/* ... (login form – same as before) ... */}
          <div className="text-center">
            <div className="flex justify-center mb-2">
             <img src={Logo} alt="" className='h-[100px]' />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to your <span className="font-bold text-blue-600">CRM TRADERS</span> account</p>
          </div>

          {status.message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {status.message}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 shadow-sm">
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

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 sm:text-sm pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.24-3.82" />
                        <path d="M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

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

          <p className="mt-4 text-center text-sm text-slate-600 font-medium">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-500 font-bold hover:underline transition-all">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* ========== FORGOT PASSWORD MODAL ========== */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setResetStep('email');
                setResetEmail('');
                setResetOtp('');
                setNewPassword('');
                setConfirmPassword('');
                setResetStatus({ type: '', message: '' });
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              {resetStep === 'email' && 'Enter your registered email to receive OTP.'}
              {resetStep === 'otp' && 'Enter the OTP sent to your email and set a new password.'}
            </p>

            {resetStatus.message && (
              <div className={`p-3 rounded-xl text-sm mb-4 ${resetStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {resetStatus.message}
              </div>
            )}

            <div className="space-y-3">
              {resetStep === 'email' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  <button
                    onClick={handleSendResetOtp}
                    disabled={resetLoading}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {resetLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </>
              )}

              {resetStep === 'otp' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">OTP</label>
                    <input
                      type="text"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="6-digit OTP"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    onClick={handleVerifyOtpAndReset}
                    disabled={resetLoading}
                    className="w-full py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {resetLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                  <button
                    onClick={() => {
                      setResetStep('email');
                      setResetStatus({ type: '', message: '' });
                    }}
                    className="w-full text-sm text-blue-600 hover:underline mt-2"
                  >
                    ← Back to email
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;