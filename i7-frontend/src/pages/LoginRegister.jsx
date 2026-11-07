import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiMail, FiLock } from 'react-icons/fi';
import axiosInstance from "../api/axiosInstance"; // Adjust path if needed

const LoginRegister = () => {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State to hold form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Inside handleSubmit in LoginRegister.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', formData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // CHECK ROLE HERE
      if (response.data.user.role === 'admin') {
        alert('Admin Login Successful!');
        navigate('/admin'); // Redirect to Admin Dashboard
      } else {
        alert('Login Successful!');
        navigate('/my-account'); // Redirect to normal User Account
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-[450px]">
        
        {/* Breadcrumb & Header remain unchanged */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#00E600]">Home</Link>
          <FiChevronRight />
          <span className="text-[#00E600]">Sign In</span>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black text-black mb-2">Sign In</h1>
            <p className="text-gray-600 text-[15px] mb-2 font-medium">Login to your i7NUTRITION account</p>
            <p className="text-gray-600 text-[13px] leading-relaxed max-w-[280px]">
              Access your orders, track shipments, manage your account and get exclusive offers.
            </p>
          </div>
          <div className="text-[#009e3e] mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-gray-500 text-lg" />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address" 
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e] focus:ring-1 focus:ring-[#009e3e] placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-500 text-lg" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password" 
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-[#009e3e] focus:ring-1 focus:ring-[#009e3e] placeholder-gray-400"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            <div className="flex justify-end mt-2">
             <Link to="/forgot-password" className="text-sm font-semibold text-[#009e3e] hover:underline">Forgot Password?</Link>
            </div>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white py-3.5 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 transition-colors mt-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#009e3e] hover:bg-[#008233]'}`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'} {!isLoading && <FiChevronRight size={18} />}
          </button>
        </form>

        {/* OR Divider & Social Buttons remain unchanged */}
        {/* ... keep your existing OR divider and Social buttons ... */}

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-600 font-medium mt-8">
          Don't have an account? <Link to="/register" className="text-[#009e3e] font-bold hover:underline">Create an Account</Link>
        </p>

      </div>
    </div>
  );
};

export default LoginRegister;