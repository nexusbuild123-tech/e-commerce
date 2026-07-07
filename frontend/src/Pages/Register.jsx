import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',  // ✅ confirm password
    mobile: '',
    email_otp: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // === SEND EMAIL OTP ===
  const handleSendOtp = async () => {
    // Check if password and confirm password match
    if (formData.password !== formData.passwordConfirm) {
      return setStatus({ type: 'error', message: 'Password and Confirm Password do not match!' });
    }

    if (!formData.name || !formData.email || !formData.password || !formData.mobile) {
      return setStatus({ type: 'error', message: 'All fields are required before sending OTP!' });
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch(`${apiUrl}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "nexusBuild@123+!" },
        body: JSON.stringify({ target: formData.email })
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setStatus({ type: 'success', message: 'OTP sent to your email! Check console.' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to send OTP.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Server error. Please try again.' ,error});
    } finally {
      setIsLoading(false);
    }
  };

  // === REGISTER ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    if (formData.password !== formData.passwordConfirm) {
      return setStatus({ type: 'error', message: 'Password and Confirm Password do not match!' });
    }

    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "nexusBuild@123+!"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
          email_otp: formData.email_otp
        })
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: "Registration successful! Redirecting..." });
        setFormData({ name: '', email: '', password: '', passwordConfirm: '', mobile: '', email_otp: '' });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Server error, please try again.",error });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex justify-center py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-slate-900 text-center">Create an Account</h2>

        {status.message && (
          <div className={`p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Full Name</label>
            <input name="name" type="text" required disabled={otpSent} value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl disabled:bg-slate-50" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Mobile Number</label>
            <input name="mobile" type="tel" required disabled={otpSent} value={formData.mobile} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl disabled:bg-slate-50" placeholder="9876543210" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <input name="email" type="email" required disabled={otpSent} value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl disabled:bg-slate-50" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} required disabled={otpSent} value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl disabled:bg-slate-50 pr-12" placeholder="••••••••" />
              <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
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
          <div>
            <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
            <div className="relative">
              <input name="passwordConfirm" type={showPassword ? "text" : "password"} required disabled={otpSent} value={formData.passwordConfirm} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl disabled:bg-slate-50 pr-12" placeholder="••••••••" />
              {/* Same toggle for confirm password – we reuse the same state */}
              <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
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

          {/* OTP Section */}
          {otpSent && (
            <div className="pt-2 border-t border-dashed">
              <div>
                <label className="block text-sm font-bold text-blue-600">Email OTP</label>
                <input name="email_otp" type="text" required value={formData.email_otp} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500" placeholder="6-Digit OTP" />
              </div>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
            {isLoading ? 'Processing...' : otpSent ? 'Verify & Register' : 'Send OTP'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;