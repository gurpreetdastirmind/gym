import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; 
import {
  FiUser, FiPhone, FiMail, FiMapPin, FiHome, FiChevronDown,
  FiCheck, FiChevronUp, FiLock, FiTag, FiShield, FiTruck, FiBox, FiHeadphones, FiArrowRight, FiLogIn, FiX
} from 'react-icons/fi';

const stateCityData = {
  AP: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore", "Kurnool", "Rajahmundry", "Kakinada"],
  AR: ["Itanagar", "Naharlagun", "Tawang", "Pasighat", "Ziro"],
  AS: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur", "Nagaon"],
  BR: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia"],
  CG: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Jagdalpur"],
  GA: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  GJ: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar"],
  HR: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Karnal", "Rohtak", "Sonipat"],
  HP: ["Shimla", "Dharamshala", "Manali", "Solan", "Mandi", "Kullu", "Hamirpur"],
  JH: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar"],
  KA: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Davangere", "Ballari"],
  KL: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Palakkad"],
  MP: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Rewa"],
  MH: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Navi Mumbai", "Aurangabad (Chhatrapati Sambhajinagar)", "Kolhapur", "Solapur"],
  MN: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
  ML: ["Shillong", "Tura", "Jowai", "Nongpoh"],
  MZ: ["Aizawl", "Lunglei", "Champhai", "Kolasib"],
  NL: ["Kohima", "Dimapur", "Mokokchung", "Wokha"],
  OD: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Puri", "Balasore"],
  PB: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Moga", "Firozpur", "Kapurthala"],
  RJ: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur"],
  SK: ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  TN: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore"],
  TS: ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam", "Mahbubnagar"],
  TR: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"],
  UP: ["Lucknow", "Noida", "Greater Noida", "Ghaziabad", "Agra", "Kanpur", "Varanasi", "Prayagraj", "Meerut", "Gorakhpur", "Mathura", "Bareilly"],
  UK: ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee", "Nainital", "Rudrapur"],
  WB: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Darjeeling", "Kharagpur"],

  AN: ["Port Blair", "Diglipur", "Rangat"],
  CH: ["Chandigarh"],
  DH: ["Daman", "Silvassa", "Diu"],
  DL: ["New Delhi", "Delhi"],
  JK: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
  LA: ["Leh", "Kargil"],
  LD: ["Kavaratti", "Agatti", "Minicoy", "Andrott"],
  PY: ["Puducherry", "Karaikal", "Mahe", "Yanam"]
};


const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [saveAddress, setSaveAddress] = useState(true);
  const [pincode, setPincode] = useState('');
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  
  // Dynamic Settings State
  const [storeSettings, setStoreSettings] = useState({ shippingCharge: 110, codCharge: 55 });

  // Coupon States
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', flat: '', area: '', city: '', state: ''
  });

  const getImageUrl = (imgPath) => {
    if (!imgPath) return 'https://via.placeholder.com/300?text=No+Image';
    return imgPath.startsWith('http') ? imgPath : `https://i7-backend.onrender.com${imgPath}`;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    if (token && userString) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userString);
        setFormData(prev => ({
          ...prev,
          name: user.fullName || '',
          mobile: user.phone || '',
          email: user.email || '',
          area: user.address || ''
        }));
      } catch (error) { console.error(error); }
    } else {
      setIsAuthenticated(false);
    }

    // Fetch Admin Settings
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get('/coupons/settings');
        setStoreSettings({
          shippingCharge: Number(res.data.shippingCharge) || 110,
          codCharge: Number(res.data.codCharge) || 55
        });
      } catch (error) { console.error("Failed to load settings", error); }
    };
    fetchSettings();
  }, []);

  const handleStateChange = (e) => setFormData({ ...formData, state: e.target.value, city: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ DYNAMIC CALCULATIONS
  const shippingCharges = cartTotal >= 500 || cartTotal === 0 ? 0 : storeSettings.shippingCharge;
const codCharges = paymentMethod === 'cod' ? Number(storeSettings.codCharge) : 0;
  
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  
  // Final Total = Subtotal + Shipping + COD - Coupon
  const finalTotal = cartTotal + shippingCharges + codCharges - couponDiscount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return setCouponError('Please enter a code');
    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      const response = await axiosInstance.post('/coupons/validate', {
        code: couponCode,
        cartTotal,
        email: formData.email
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

   const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Cart is empty");

    const orderNumber = "17N" + Math.floor(Math.random() * 10000000);
    
    // Prepare order data
    const orderData = {
      orderNumber,
      userEmail: formData.email,
      userPhone: formData.mobile,
      shippingAddress: {
        name: formData.name,
        flat: formData.flat,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        pincode: pincode
      },
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0] || item.image
      })),
      subtotal: cartTotal,
      shippingCharge: shippingCharges,
      codCharge: codCharges,
      discount: couponDiscount,
      totalAmount: finalTotal,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      couponCode: appliedCoupon ? appliedCoupon.code : null
    };

    try {
      await axiosInstance.post('/orders/create', orderData);
      clearCart();
      navigate('/order-success', { state: { orderNumber, total: finalTotal, orderData } });
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen py-20 flex flex-col items-center justify-center font-sans">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLock className="text-[#009e3e] text-4xl" />
          </div>
          <h2 className="text-2xl font-black text-black mb-3">Sign In Required</h2>
          <p className="text-gray-500 mb-6 text-sm">You need to sign in to proceed to checkout.</p>
          <Link to="/login" className="inline-flex items-center justify-center gap-2 w-full bg-[#009e3e] hover:bg-[#008233] text-white px-8 py-3 rounded-lg font-bold transition-colors">
            <FiLogIn size={18} /> Sign In to Continue
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
          <div className="absolute top-4 left-0 w-1/2 h-[2px] bg-[#009e3e] z-0"></div>
          <div className="flex flex-col items-center z-10 w-1/3">
            <div className="w-8 h-8 rounded-full bg-[#009e3e] text-white flex items-center justify-center font-bold text-sm border-4 border-[#f8f9fa]">1</div>
            <span className="text-xs font-bold text-black mt-2">Cart</span>
          </div>
          <div className="flex flex-col items-center z-10 w-1/3">
            <div className="w-8 h-8 rounded-full bg-[#009e3e] text-white flex items-center justify-center font-bold text-sm border-4 border-[#f8f9fa]">2</div>
            <span className="text-xs font-bold text-black mt-2">Checkout</span>
          </div>
          <div className="flex flex-col items-center z-10 w-1/3">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-sm border-4 border-[#f8f9fa]">3</div>
            <span className="text-xs font-bold text-gray-400 mt-2">Order Placed</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-6">
            
            {/* SHIPPING DETAILS */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-1">
                <div className="bg-[#009e3e] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="text-xl font-bold text-black">Shipping Details</h2>
              </div>
              <p className="text-gray-500 text-sm mb-6 ml-10">Enter your delivery address</p>

              <div className="space-y-4">
                <div className="relative">
                  <FiUser className="absolute left-4 top-3.5 text-gray-500 text-lg" />
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Full Name *" className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]" />
                </div>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-3.5 text-gray-500 text-lg" />
                  <input required name="mobile" value={formData.mobile} onChange={handleChange} type="tel" placeholder="Mobile Number *" className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]" />
                </div>
                <div className="relative">
                  <FiMail className="absolute left-4 top-3.5 text-gray-500 text-lg" />
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email Address *" className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]" />
                </div>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-3.5 text-gray-500 text-lg" />
                  <input required value={pincode} onChange={(e) => setPincode(e.target.value)} type="text" placeholder="Pincode *" className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]" />
                </div>
                <div className="relative">
                  <FiHome className="absolute left-4 top-3.5 text-gray-500 text-lg" />
                  <input required name="flat" value={formData.flat} onChange={handleChange} type="text" placeholder="Flat / House No. *" className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]" />
                </div>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-3.5 text-gray-500 text-lg" />
                  <input required name="area" value={formData.area} onChange={handleChange} type="text" placeholder="Area / Street / Locality *" className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#009e3e]" />
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <select required name="state" value={formData.state} onChange={handleStateChange} className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm text-gray-700 appearance-none focus:outline-none focus:border-[#009e3e]">
                      <option value="">Select State *</option>
                      {Object.keys(stateCityData).map((stateCode) => (
                        <option key={stateCode} value={stateCode}>
                          {{
                            AP: "Andhra Pradesh",
                            AR: "Arunachal Pradesh",
                            AS: "Assam",
                            BR: "Bihar",
                            CG: "Chhattisgarh",
                            GA: "Goa",
                            GJ: "Gujarat",
                            HR: "Haryana",
                            HP: "Himachal Pradesh",
                            JH: "Jharkhand",
                            KA: "Karnataka",
                            KL: "Kerala",
                            MP: "Madhya Pradesh",
                            MH: "Maharashtra",
                            MN: "Manipur",
                            ML: "Meghalaya",
                            MZ: "Mizoram",
                            NL: "Nagaland",
                            OD: "Odisha",
                            PB: "Punjab",
                            RJ: "Rajasthan",
                            SK: "Sikkim",
                            TN: "Tamil Nadu",
                            TS: "Telangana",
                            TR: "Tripura",
                            UP: "Uttar Pradesh",
                            UK: "Uttarakhand",
                            WB: "West Bengal",
                            AN: "Andaman and Nicobar Islands",
                            CH: "Chandigarh",
                            DH: "Dadra and Nagar Haveli and Daman and Diu",
                            DL: "Delhi",
                            JK: "Jammu and Kashmir",
                            LA: "Ladakh",
                            LD: "Lakshadweep",
                            PY: "Puducherry"
                          }[stateCode]}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-4 top-4 text-gray-500 pointer-events-none" />
                  </div>

                  {/* CITY DROPDOWN */}
    <div className="relative flex-1">
                    <select required name="city" value={formData.city} onChange={handleChange} disabled={!formData.state} className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm text-gray-700 appearance-none focus:outline-none focus:border-[#009e3e] disabled:bg-gray-100">
                      <option value="">Select City *</option>
                      {formData.state && stateCityData[formData.state]?.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-4 top-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${saveAddress ? 'bg-[#009e3e]' : 'border border-gray-400'}`}>
                    {saveAddress && <FiCheck className="text-white text-xs" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={saveAddress} onChange={() => setSaveAddress(!saveAddress)} />
                  <span className="text-sm text-gray-600">Save this address for future orders</span>
                </label>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-1">
                <div className="bg-[#009e3e] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="text-xl font-bold text-black">Select Payment Method</h2>
              </div>
              <p className="text-gray-500 text-sm mb-6 ml-10">100% Secure & Encrypted Payments</p>

              <div className="space-y-3">
                <label className={`flex items-start justify-between p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-[#009e3e] bg-[#f0fdf4]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-start gap-3">
                    <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-[#009e3e] w-4 h-4 mt-1" />
                    <div>
                      <span className="font-bold text-[15px] text-black">Online Payment</span>
                      <p className="text-xs text-gray-500 mt-1">Pay using UPI, Debit Card, Credit Card & more</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-[#009e3e]">Shipping</span><br />
                    <span className="text-[13px] font-bold text-[#009e3e]">FREE</span>
                  </div>
                </label>

                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#009e3e] bg-[#f0fdf4]' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-[#009e3e] w-4 h-4" />
                    <div>
                      <span className="font-bold text-[15px] text-black block">Cash on Delivery (COD)</span>
                      <p className="text-xs text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-red-500">₹{storeSettings.codCharge}</span><br />
                    <span className="text-[10px] font-bold text-red-500">Extra Charges</span>
                  </div>
                </label>
              </div>
            </div>

            {/* BILLING DETAILS */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#009e3e] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <h2 className="text-xl font-bold text-black">Billing Details</h2>
              </div>
              <label className="flex items-center gap-2 ml-10 cursor-pointer">
                <div className={`w-5 h-5 rounded flex items-center justify-center ${billingSameAsShipping ? 'bg-[#009e3e]' : 'border border-gray-400'}`}>
                  {billingSameAsShipping && <FiCheck className="text-white text-xs" />}
                </div>
                <input type="checkbox" className="hidden" checked={billingSameAsShipping} onChange={() => setBillingSameAsShipping(!billingSameAsShipping)} />
                <span className="text-sm font-medium text-gray-800">Same as shipping address</span>
              </label>
            </div>

            {/* ORDER NOTES */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#009e3e] text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <h2 className="text-xl font-bold text-black">Order Notes <span className="text-sm font-normal text-gray-500">(Optional)</span></h2>
              </div>
              <textarea rows="2" placeholder="Any special delivery instructions?" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#009e3e] ml-10 max-w-[calc(100%-2.5rem)]"></textarea>
            </div>
          </div>

          {/* RIGHT COLUMN (ORDER SUMMARY) */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Order Summary</h2>
                <Link to="/cart" className="text-sm font-bold text-[#009e3e] hover:underline">Edit Cart</Link>
              </div>

              <div className="space-y-4 mb-6 border-b pb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-[#f4f7f6] rounded-lg p-2 flex-shrink-0">
                      <img src={getImageUrl(item.images?.[0] || item.image)} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[15px] text-black leading-tight">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.servings || 'N/A'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded px-2 py-1">
                          <span className="text-xs mr-2">Qty:</span>
                          <span className="text-xs font-bold">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-[15px] text-black">₹{item.price}</span>
                        <span className="text-xs text-gray-400 line-through">₹{Math.round(item.price * 1.5)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* COUPON SECTION */}
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
                            placeholder="Enter code (e.g. WELCOME10)" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="border p-2 rounded w-full text-sm outline-none focus:border-[#009e3e] uppercase" 
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
                      <p className="text-sm font-bold text-[#009e3e] flex items-center gap-1"><FiCheck/> {appliedCoupon.code} Applied!</p>
                      <p className="text-xs text-gray-600">You saved ₹{appliedCoupon.discountAmount}</p>
                    </div>
                    <button type="button" onClick={removeCoupon} className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1"><FiX/> Remove</button>
                  </div>
                )}
              </div>

              {/* PRICE BREAKDOWN */}
              <div className="space-y-3 text-[14px] mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">Shipping <FiTruck className="text-gray-400"/></span>
                  {shippingCharges === 0 ? (
                    <span className="font-bold text-[#009e3e]">FREE</span>
                  ) : (
                    <span className="font-bold text-black">₹{shippingCharges}</span>
                  )}
                </div>
                
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-gray-600">
                    <span>COD Charges</span>
                    <span className="font-bold text-black">₹{codCharges}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-[#009e3e]">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-bold">- ₹{couponDiscount}</span>
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
            </div>
          </div>
        </form>

        {/* BOTTOM BUTTON */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="flex-1"></div>
          <div className="w-full lg:w-[380px] flex-shrink-0">
             <button 
                type="submit" 
                onClick={handlePlaceOrder}
                className="w-full bg-[#009e3e] hover:bg-[#008233] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
             >
                <FiLock /> PLACE ORDER ₹{finalTotal} <FiArrowRight />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;