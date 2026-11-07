import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiUser, FiMail, FiLock, FiPhone, FiMapPin } from 'react-icons/fi';
// Make sure this path correctly points to your axiosInstance file
import axiosInstance from '../api/axiosInstance'; 

const Register = () => {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State to hold form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic frontend validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);

    try {
      // Send data to backend
      const response = await axiosInstance.post('/auth/register', formData);
      
      // Save token and user info to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      alert('Registration Successful!');
      
      // Redirect to home or account page
      navigate('/my-account'); 
      
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-[450px]">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#009e3e]">Home</Link>
          <FiChevronRight />
          <span className="text-[#009e3e]">Create Account</span>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black text-black mb-2">Create Account</h1>
            <p className="text-gray-600 text-[15px] mb-2 font-medium">Join i7NUTRITION today</p>
            <p className="text-gray-600 text-[13px] leading-relaxed max-w-[280px]">
              Create an account to track orders, save addresses, and get exclusive offers.
            </p>
          </div>
          
          {/* User Icon */}
          <div className="text-[#009e3e] mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-3.5 text-gray-500 text-lg" />
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name" 
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e] focus:ring-1 focus:ring-[#009e3e] placeholder-gray-400"
              />
            </div>
          </div>

          {/* Email Address */}
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

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-3.5 text-gray-500 text-lg" />
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number" 
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e] focus:ring-1 focus:ring-[#009e3e] placeholder-gray-400"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">Address</label>
            <div className="relative">
              <FiMapPin className="absolute left-4 top-3.5 text-gray-500 text-lg" />
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="2"
                placeholder="Enter your full address" 
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e] focus:ring-1 focus:ring-[#009e3e] placeholder-gray-400 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Password */}
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
                placeholder="Create a password" 
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
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-500 text-lg" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password" 
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-[#009e3e] focus:ring-1 focus:ring-[#009e3e] placeholder-gray-400"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700">
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white py-3.5 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 transition-colors mt-4 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#009e3e] hover:bg-[#008233]'}`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'} {!isLoading && <FiChevronRight size={18} />}
          </button>
        </form>

        {/* OR Divider & Social Buttons remain unchanged */}
        {/* ... keep your existing OR divider and Social buttons ... */}
        
        {/* Footer Link */}
        <p className="text-center text-sm text-gray-600 font-medium mt-8">
          Already have an account? <Link to="/login" className="text-[#009e3e] font-bold hover:underline">Sign In</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;