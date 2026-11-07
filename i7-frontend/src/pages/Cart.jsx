import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiChevronRight, FiTag, FiChevronDown, FiShield, FiChevronUp, FiCheck, FiX } from 'react-icons/fi';
import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  // ✅ ADD THESE NEW STATES FOR COUPON
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return 'https://via.placeholder.com/300?text=No+Image';
    return imgPath.startsWith('http') ? imgPath : `http://localhost:5000${imgPath}`;
  };

  // ✅ UPDATE CALCULATIONS TO INCLUDE COUPON DISCOUNT
  const shippingCharges = 0;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = cartTotal + shippingCharges - discount;

  // ✅ ADD THIS FUNCTION
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return setCouponError('Please enter a code');
    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const response = await axiosInstance.post('/coupons/validate', {
        code: couponCode,
        cartTotal,
        email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : ''
      });
      setAppliedCoupon(response.data);
      setIsCouponOpen(false);
      setCouponCode('');
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen py-20 flex flex-col items-center justify-center font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full mx-4">
          <h2 className="text-2xl font-black text-black mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-6 text-sm">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="inline-block bg-[#009e3e] hover:bg-[#008233] text-white px-8 py-3 rounded-lg font-bold transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* PROGRESS BAR */}
        <div className="flex justify-center items-center mb-10 w-full max-w-md mx-auto relative">
          <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 z-0"></div>
          <div className="absolute top-4 left-0 w-1/3 h-[2px] bg-[#009e3e] z-0"></div>
          <div className="flex flex-col items-center z-10 w-1/3">
            <div className="w-8 h-8 rounded-full bg-[#009e3e] text-white flex items-center justify-center font-bold text-sm border-4 border-[#f8f9fa]">1</div>
            <span className="text-xs font-bold text-black mt-2">Cart</span>
          </div>
          <div className="flex flex-col items-center z-10 w-1/3">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-sm border-4 border-[#f8f9fa]">2</div>
            <span className="text-xs font-bold text-gray-400 mt-2">Checkout</span>
          </div>
          <div className="flex flex-col items-center z-10 w-1/3">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-sm border-4 border-[#f8f9fa]">3</div>
            <span className="text-xs font-bold text-gray-400 mt-2">Order Placed</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT COLUMN (Cart Items) */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h1 className="text-xl font-bold text-black mb-4 border-b pb-3">Shopping Cart <span className="text-sm font-normal text-gray-500">({cart.length} Items)</span></h1>

              <div className="space-y-6">
                {cart.map((item) => (
                  // ✅ FIX: Use cartItemId as the key
                  <div key={item.cartItemId} className="flex flex-col md:flex-row gap-4 border-b pb-6 last:border-b-0 last:pb-0">

                    <div className="w-24 h-28 bg-[#f4f7f6] rounded-lg p-2 flex-shrink-0">
                      <img
                        src={getImageUrl(item.images?.[0] || item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-[16px] text-black leading-tight">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.servings || 'N/A'}</p>
                        <p className="text-sm text-gray-500">Flavour: {item.selectedFlavour || item.flavor || 'Standard'}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-lg text-black">₹{item.price}</span>
                          <span className="text-sm text-gray-400 line-through">₹{Math.round(item.price * 1.5)}</span>
                          <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">43% OFF</span>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          {/* ✅ FIX: Pass cartItemId */}
                          <button onClick={() => updateQuantity(item.cartItemId, -1)} className="px-3 py-1 hover:bg-gray-100 text-gray-600 transition-colors">-</button>
                          <span className="px-3 py-1 border-x text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, 1)} className="px-3 py-1 hover:bg-gray-100 text-gray-600 transition-colors">+</button>
                        </div>

                        {/* ✅ FIX: Pass cartItemId */}
                        <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium transition-colors">
                          <FiTrash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} Items)</span>
                  <span className="font-bold text-lg text-black">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-[#009e3e] font-bold">FREE</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Order Summary) */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">

              <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>

              {/* ✅ UPDATED COUPON SECTION */}
              <div className="border border-gray-200 rounded-lg mb-6">
                {!appliedCoupon ? (
                  <>
                    <button type="button" onClick={() => setIsCouponOpen(!isCouponOpen)} className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-2"><FiTag /> Have a coupon code?</div>
                      {isCouponOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {isCouponOpen && (
                      <div className="p-3 border-t">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="border p-2 rounded w-full text-sm outline-none focus:border-[#009e3e]"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon}
                            className="bg-gray-800 text-white px-4 rounded text-sm disabled:opacity-50"
                          >
                            {isApplyingCoupon ? '...' : 'Apply'}
                          </button>
                        </div>
                        {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 bg-green-50 flex items-center justify-between border-l-4 border-[#009e3e]">
                    <div>
                      <p className="text-sm font-bold text-[#009e3e] flex items-center gap-1"><FiCheck /> {appliedCoupon.code} Applied!</p>
                      <p className="text-xs text-gray-600">You saved ₹{appliedCoupon.discountAmount}</p>
                    </div>
                    <button type="button" onClick={removeCoupon} className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"><FiX /> Remove</button>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-[14px] mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">Shipping <FiShield className="text-gray-400" /></span>
                  <span className="font-bold text-[#009e3e]">FREE</span>
                </div>

                {/* ✅ ADD THIS - Show discount if coupon applied */}
                {appliedCoupon && (
                  <div className="flex justify-between text-[#009e3e]">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-bold">- ₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-black">Total Amount</span>
                  <span className="font-black text-xl text-black">₹{finalTotal}</span>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">(Inclusive of all taxes)</p>
              </div>

              <div className="bg-[#f0fdf4] border border-green-200 rounded-lg p-3 flex items-center justify-center gap-2 mb-6">
                <FiTag className="text-[#009e3e]" />
                {/* ✅ Dynamic savings based on coupon */}
                <span className="text-sm font-bold text-[#009e3e]">
                  {appliedCoupon ? `You are saving ₹${discount} with ${appliedCoupon.code}` : 'Apply a coupon to save more!'}
                </span>
                <span className="text-yellow-500">🎉</span>
              </div>

              <Link to="/checkout" className="w-full bg-[#009e3e] hover:bg-[#008233] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg">
                Proceed to Checkout <FiChevronRight />
              </Link>

              <div className="flex justify-center items-center gap-1 mt-4 text-xs text-gray-500 font-medium">
                <FiShield className="text-[#009e3e]" /> 100% Secure & Encrypted Payments
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;