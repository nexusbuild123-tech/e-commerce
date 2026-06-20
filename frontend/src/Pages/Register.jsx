import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Yahan Link define hai

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        setFormData({ name: '', email: '', password: '', mobile: '', address: '' }); 
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Server error, please try again.", error});
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
            <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Mobile Number</label>
            <input name="mobile" type="tel" required value={formData.mobile} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" placeholder="Mobile" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" placeholder="••••••••" />
          </div>
          

          <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">
            {isLoading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        {/* Yahan Link ka use ho raha hai, isliye error hat gaya */}
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