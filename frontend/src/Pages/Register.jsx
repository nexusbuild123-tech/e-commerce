import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    email_otp: '',
    mobile_otp: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.mobile) {
      return setStatus({ type: 'error', message: 'All registration fields are required to send OTP!' });
    }
    
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Dono Email aur Mobile OTP parallel request se trigger honge
      const [emailRes, mobileRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": "nexusBuild@123+!" },
          body: JSON.stringify({ target: formData.email, type: "email" })
        }),
        fetch("http://127.0.0.1:5000/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": "nexusBuild@123+!" },
          body: JSON.stringify({ target: formData.mobile, type: "mobile" })
        })
      ]);

      if (emailRes.ok && mobileRes.ok) {
        setOtpSent(true);
        setStatus({ type: 'success', message: 'OTPs sent successfully! Check your Python terminal console.' });
      } else {
        setStatus({ type: 'error', message: 'Failed to send verification OTPs. Please check credentials.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Server connection failed while sending OTP.' },error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "nexusBuild@123+!"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: "Registration successful! Redirecting..." });
        setFormData({ name: '', email: '', password: '', mobile: '', email_otp: '', mobile_otp: '' }); 
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Server error, please try again." ,error});
    } finally {
      setIsLoading(false);
    }
  };

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
            <input name="mobile" type="tel" required disabled={otpSent} value={formData.mobile} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl disabled:bg-slate-50" placeholder="Mobile" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <input name="email" type="email" required disabled={otpSent} value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl disabled:bg-slate-50" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <input name="password" type="password" required disabled={otpSent} value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl disabled:bg-slate-50" placeholder="••••••••" />
          </div>

          {/* OTP CONDITIONAL INPUTS */}
          {otpSent && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed">
              <div>
                <label className="block text-sm font-bold text-blue-600">Email OTP</label>
                <input name="email_otp" type="text" required value={formData.email_otp} onChange={handleChange} className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500" placeholder="6-Digit" />
              </div>
              <div>
                <label className="block text-sm font-bold text-emerald-600">Mobile OTP</label>
                <input name="mobile_otp" type="text" required value={formData.mobile_otp} onChange={handleChange} className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500" placeholder="6-Digit" />
              </div>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
            {isLoading ? 'Processing...' : otpSent ? 'Verify & Register' : 'Send Verification OTPs'}
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