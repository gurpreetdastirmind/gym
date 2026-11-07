import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiKey, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setSuccess('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally { setIsLoading(false); }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      await axiosInstance.post('/auth/verify-otp', { email, otp });
      setSuccess('OTP verified! Create your new password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally { setIsLoading(false); }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) return setError('Passwords do not match');
    
    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/reset-password', { email, otp, newPassword });
      alert('Password reset successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="bg-white min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-[450px]">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link to="/login" className="hover:text-[#009e3e]">Sign In</Link>
          <FiChevronRight />
          <span className="text-[#009e3e]">Forgot Password</span>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            {step === 1 && <FiMail className="text-[#009e3e] text-3xl" />}
            {step === 2 && <FiKey className="text-[#009e3e] text-3xl" />}
            {step === 3 && <FiLock className="text-[#009e3e] text-3xl" />}
          </div>
          <h1 className="text-3xl font-black text-black mb-2">
            {step === 1 && 'Forgot Password?'}
            {step === 2 && 'Enter OTP'}
            {step === 3 && 'Create New Password'}
          </h1>
          <p className="text-gray-600 text-sm">
            {step === 1 && "Enter your email to receive an OTP."}
            {step === 2 && `We sent a 6-digit code to ${email}`}
            {step === 3 && "Your new password must be strong."}
          </p>
        </div>

        {/* Messages */}
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-medium border border-green-200 flex items-center gap-2"><FiCheckCircle /> {success}</div>}

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-black mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-500 text-lg" />
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email" 
                  className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]"
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#009e3e] text-white py-3.5 rounded-lg font-bold">
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-black mb-2">6-Digit OTP</label>
              <div className="relative">
                <FiKey className="absolute left-4 top-3.5 text-gray-500 text-lg" />
                <input 
                  type="text" required maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP" 
                  className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-center tracking-[0.5em] font-bold text-lg focus:outline-none focus:border-[#009e3e]"
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#009e3e] text-white py-3.5 rounded-lg font-bold">
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Didn't receive code? <button type="button" onClick={handleSendOtp} className="text-[#009e3e] font-bold hover:underline">Resend</button>
            </p>
          </form>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-black mb-2">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-500 text-lg" />
                <input 
                  type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password" 
                  className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">Confirm New Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-500 text-lg" />
                <input 
                  type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password" 
                  className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]"
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#009e3e] text-white py-3.5 rounded-lg font-bold mt-2">
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;