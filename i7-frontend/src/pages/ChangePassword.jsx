import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiLock, FiSave } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      return setError('New passwords do not match');
    }

    setIsLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) return navigate('/login');

      // Send request to backend
      await axiosInstance.put('/auth/change-password', {
        userId: storedUser.id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setMessage('Password changed successfully!');
      
      // Clear form
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });

      // Redirect back to account page after 2 seconds
      setTimeout(() => {
        navigate('/my-account');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Check your current password.');
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
          <span className="text-[#009e3e]">Change Password</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-black mb-1">Change Password</h1>
            <p className="text-gray-600 text-sm">Update your account password to stay secure.</p>
          </div>
          <div className="bg-[#009e3e] text-white p-3 rounded-full flex items-center justify-center">
            <FiLock size={32} />
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
          
          {/* Current Password */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">Current Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-500 text-lg" />
              <input 
                type="password" 
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]"
                placeholder="Enter current password"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-500 text-lg" />
              <input 
                type="password" 
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]"
                placeholder="Enter new password"
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">Confirm New Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-500 text-lg" />
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3.5 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 transition-colors mt-4 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#009e3e] hover:bg-[#008233] text-white'}`}
          >
            {isLoading ? 'Saving...' : <><FiSave /> Update Password</>}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChangePassword;