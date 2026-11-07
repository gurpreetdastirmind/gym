import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; 
import { 
  FiChevronRight, FiBox, FiMail, FiArrowRight, FiSearch, 
  FiFileText, FiCheckCircle, FiTruck, FiHome, FiPackage, FiXCircle
} from 'react-icons/fi';

// Import your custom images
import headphoneIcon from '../images/headphone-icon.png';
import trackBoxIcon from '../images/track-box-icon.png'; 

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [emailPhone, setEmailPhone] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ NEW STATES FOR CANCELLATION
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!orderId.trim() || !emailPhone.trim()) {
      return setError("Please enter both Order Number and Email/Phone.");
    }

    setLoading(true);
    setError('');
    // Don't clear orderData immediately so the screen doesn't flicker on refresh
    // setOrderData(null);

    try {
      const res = await axiosInstance.post('/orders/track', {
        orderNumber: orderId.trim(),
        email: emailPhone.trim()
      });
      setOrderData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please check your details.');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ HANDLE CANCEL SUBMISSION
  const handleCancelRequest = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) return alert("Please provide a reason for cancellation.");
    
    setCancelLoading(true);
    try {
      await axiosInstance.post('/orders/cancel-request', {
        orderNumber: orderData.orderNumber,
        email: orderData.userEmail,
        reason: cancelReason
      });
      alert('Cancellation requested successfully. Admin will review it shortly.');
      setIsCancelModalOpen(false);
      setCancelReason('');
      // Refresh the order data to show "Requested" status
      handleTrack(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request cancellation.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Helper to calculate progress percentage
  const getProgressWidth = (status) => {
    switch (status) {
      case 'Processing': return '25%';
      case 'Shipped': return '50%';
      case 'Out for Delivery': return '75%';
      case 'Delivered': return '100%';
      default: return '0%';
    }
  };

  const getStatusIndex = (status) => {
    const statuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    return statuses.indexOf(status);
  };

  return (
    <div className="bg-white min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-[600px]">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link to="/" className="hover:text-[#009e3e]">Home</Link>
          <FiChevronRight />
          <span className="text-[#009e3e]">Track Order</span>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black text-black mb-1">Track Order</h1>
            <h2 className="text-lg font-bold text-black mb-2">Track your order easily</h2>
            <p className="text-gray-600 text-sm max-w-[280px] leading-relaxed">
              Enter your order number and email/phone number to get real-time updates on your order status.
            </p>
          </div>
          <div className="hidden md:block">
             <img src={trackBoxIcon} alt="Track Box" className="w-24 h-auto object-contain" />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-gray-100 mb-8">
          <form onSubmit={handleTrack} className="space-y-6">
            
            <div>
              <label className="block text-[15px] font-bold text-black mb-2">Order Number</label>
              <div className="relative">
                <FiBox className="absolute left-4 top-3.5 text-gray-500 text-xl" />
                <input 
                  type="text" 
                  placeholder="e.g. 17N2845692" 
                  className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-[15px] focus:outline-none focus:border-[#009e3e] placeholder-gray-400"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[15px] font-bold text-black mb-2">Email or Phone Number</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-500 text-xl" />
                <input 
                  type="text" 
                  placeholder="Enter your email or phone number" 
                  className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-[15px] focus:outline-none focus:border-[#009e3e] placeholder-gray-400"
                  value={emailPhone}
                  onChange={(e) => setEmailPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#009e3e] hover:bg-[#008233] text-white py-3.5 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 transition-colors mt-2 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track Order'} <FiArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* DYNAMIC ORDER STATUS DISPLAY */}
        {orderData && (
          <div className={`mb-8 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 border ${
            orderData.status === 'Cancelled' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className={`font-bold text-xl flex items-center gap-2 ${
                  orderData.status === 'Cancelled' ? 'text-red-600' : 'text-[#009e3e]'
                }`}>
                  {orderData.status === 'Cancelled' ? <FiXCircle /> : <FiCheckCircle />} 
                  Status: {orderData.status}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Order ID: <strong>{orderData.orderNumber}</strong></p>
                <p className="text-sm text-gray-600">Placed on: {new Date(orderData.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold text-lg text-black">₹{orderData.totalAmount}</p>
              </div>
            </div>

            {/* ✅ CANCELLATION STATUS BANNERS */}
            {orderData.cancelStatus === 'Requested' && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-6 text-sm text-yellow-800 flex items-start gap-2">
                <span className="font-bold">⏳ Cancellation Pending:</span> Your request is under review by admin. Reason: "{orderData.cancelReason}"
              </div>
            )}
            {orderData.cancelStatus === 'Rejected' && (
              <div className="bg-red-100 border border-red-300 p-3 rounded-lg mb-6 text-sm text-red-800 flex items-start gap-2">
                <span className="font-bold">❌ Cancellation Rejected:</span> Admin did not approve your cancellation request.
              </div>
            )}

            {/* Horizontal Progress Tracker (Hide if Cancelled) */}
            {orderData.status !== 'Cancelled' && (
              <div className="relative mt-8">
                <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded z-0"></div>
                <div 
                  className="absolute top-4 left-0 h-1 bg-[#009e3e] rounded z-0 transition-all duration-500 ease-in-out" 
                  style={{ width: getProgressWidth(orderData.status) }}
                ></div>

                <div className="flex justify-between relative z-10">
                  <div className="flex flex-col items-center w-1/4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStatusIndex(orderData.status) >= 0 ? 'bg-[#009e3e] border-[#009e3e] text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                      <FiPackage size={14} />
                    </div>
                    <span className="text-[11px] font-bold text-black mt-2 text-center">Processing</span>
                  </div>
                  <div className="flex flex-col items-center w-1/4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStatusIndex(orderData.status) >= 1 ? 'bg-[#009e3e] border-[#009e3e] text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                      <FiBox size={14} />
                    </div>
                    <span className="text-[11px] font-bold text-black mt-2 text-center">Shipped</span>
                  </div>
                  <div className="flex flex-col items-center w-1/4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStatusIndex(orderData.status) >= 2 ? 'bg-[#009e3e] border-[#009e3e] text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                      <FiTruck size={14} />
                    </div>
                    <span className="text-[11px] font-bold text-black mt-2 text-center leading-tight">Out for<br/>Delivery</span>
                  </div>
                  <div className="flex flex-col items-center w-1/4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStatusIndex(orderData.status) >= 3 ? 'bg-[#009e3e] border-[#009e3e] text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                      <FiHome size={14} />
                    </div>
                    <span className="text-[11px] font-bold text-black mt-2 text-center">Delivered</span>
                  </div>
                </div>
              </div>
            )}

            <p className={`text-sm text-center mt-6 ${orderData.status === 'Cancelled' ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
              {orderData.status === 'Delivered' && 'Your order has been delivered successfully!'}
              {orderData.status === 'Cancelled' && 'This order has been cancelled.'}
              {orderData.status !== 'Delivered' && orderData.status !== 'Cancelled' && 'We will notify you via SMS/Email once your order updates.'}
            </p>

            {/* ✅ CANCEL BUTTON (Only show if Processing & Not already requested) */}
            {orderData.status === 'Processing' && orderData.cancelStatus === 'None' && (
              <div className="mt-6 text-center pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setIsCancelModalOpen(true)} 
                  className="text-red-500 font-bold text-sm hover:underline border border-red-500 px-6 py-2.5 rounded-lg transition-colors hover:bg-red-50"
                >
                  Cancel This Order
                </button>
              </div>
            )}

          </div>
        )}

        {/* Info Cards */}
        <div className="flex flex-col gap-4 mb-10">
          <div className="bg-[#f4f7f6] rounded-xl p-4 flex items-center gap-4">
            <div className="text-[#009e3e] flex-shrink-0">
              <FiFileText size={40} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-bold text-black text-[15px] mb-1">Where to find your Order Number?</h3>
              <p className="text-[13px] text-gray-600 leading-snug">
                Your order number is mentioned in the order confirmation email or SMS sent after purchase.
              </p>
            </div>
          </div>

          <div className="bg-[#eaf5ee] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#d0ebd9]">
            <div className="flex items-center gap-4">
              <img src={headphoneIcon} alt="Help" className="w-12 h-auto object-contain flex-shrink-0" />
              <div>
                <h3 className="font-bold text-black text-[15px] mb-1">Need Help?</h3>
                <p className="text-[13px] text-gray-600 leading-snug max-w-[250px]">
                  If you're unable to track your order or facing any issues, our support team is here to help.
                </p>
              </div>
            </div>
            <Link 
              to="/contact-support" 
              className="border-2 border-[#009e3e] text-[#009e3e] hover:bg-[#009e3e] hover:text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors flex-shrink-0"
            >
              Contact & Support <FiChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* 4 Easy Steps Banner */}
        <div className="bg-[#eaf5ee] rounded-2xl p-6 md:p-8 border border-[#d0ebd9]">
          <h2 className="text-xl font-black text-black mb-8">Track Your Order in 4 Easy Steps</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                <FiBox className="text-3xl text-[#009e3e]" strokeWidth={1.5} />
              </div>
              <div className="bg-[#009e3e] text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center mb-3">1</div>
              <p className="text-[13px] font-medium text-black leading-snug">Enter your<br/>order number</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                <FiMail className="text-3xl text-[#009e3e]" strokeWidth={1.5} />
              </div>
              <div className="bg-[#009e3e] text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center mb-3">2</div>
              <p className="text-[13px] font-medium text-black leading-snug">Enter your<br/>email/phone</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                <FiSearch className="text-3xl text-[#009e3e]" strokeWidth={1.5} />
              </div>
              <div className="bg-[#009e3e] text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center mb-3">3</div>
              <p className="text-[13px] font-medium text-black leading-snug">Click on<br/>Track Order</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                <FiFileText className="text-3xl text-[#009e3e]" strokeWidth={1.5} />
              </div>
              <div className="bg-[#009e3e] text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center mb-3">4</div>
              <p className="text-[13px] font-medium text-black leading-snug">View your<br/>order status</p>
            </div>
          </div>
        </div>

      </div>

      {/* ✅ CANCELLATION MODAL */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsCancelModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <FiXCircle size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2 text-black">Cancel Order</h2>
            <p className="text-sm text-gray-600 mb-6">
              Please tell us why you want to cancel this order. The admin will review your request.
            </p>
            
            <form onSubmit={handleCancelRequest}>
              <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Cancellation</label>
              <textarea 
                required 
                rows="4" 
                placeholder="E.g. I ordered the wrong flavour, found a better price, changed my mind..." 
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:border-red-500 outline-none mb-6"
              ></textarea>
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsCancelModalOpen(false)} 
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  Keep Order
                </button>
                <button 
                  type="submit" 
                  disabled={cancelLoading} 
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {cancelLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrackOrder;