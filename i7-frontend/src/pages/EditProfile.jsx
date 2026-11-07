import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiUser, FiMail, FiPhone, FiMapPin, FiSave } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', userId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load current user data into the form
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData({
        userId: user.id,
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axiosInstance.put('/auth/profile', formData);
      
      // Update localStorage with the new user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setMessage('Profile updated successfully!');
      
      // Redirect back to account page after 2 seconds
      setTimeout(() => {
        navigate('/my-account');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-[600px]">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link to="/my-account" className="hover:text-[#009e3e]">My Account</Link>
          <FiChevronRight />
          <span className="text-[#009e3e]">Edit Profile</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-black mb-1">Personal Information</h1>
            <p className="text-gray-600 text-sm">Update your personal details below.</p>
          </div>
          <div className="bg-[#009e3e] text-white p-3 rounded-full flex items-center justify-center">
            <FiUser size={32} />
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6 text-sm font-medium border border-green-200">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
          
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
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]"
              />
            </div>
          </div>

          {/* Email */}
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
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]"
              />
            </div>
          </div>

          {/* Phone */}
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
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]"
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
                rows="3"
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e] resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3.5 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 transition-colors mt-4 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#009e3e] hover:bg-[#008233] text-white'}`}
          >
            {isLoading ? 'Saving...' : <><FiSave /> Save Changes</>}
          </button>
        </form>

      </div>
    </div>
  );
};

export default EditProfile;