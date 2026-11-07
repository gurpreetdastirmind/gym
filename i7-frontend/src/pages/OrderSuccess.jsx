import { useLocation, Link } from 'react-router-dom';
import { 
  FiCheck, FiCopy, FiCalendar, FiCreditCard, 
  FiMapPin, FiTruck, FiBox, FiFileText, FiShoppingBag, FiTool, FiHome, FiHeadphones
} from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

const OrderSuccess = () => {
  const location = useLocation();
  
  const orderNumber = location.state?.orderNumber || "17N0000000";
  const total = location.state?.total || "0";
  const orderData = location.state?.orderData; 

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Order Data Found</h1>
          <Link to="/" className="text-[#009e3e] font-bold hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(orderData.createdAt || Date.now());
  const formattedDate = orderDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const formattedTime = orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // ✅ DYNAMIC ESTIMATED DELIVERY DATE CALCULATION (Adds 3 to 5 days)
  const estStartDate = new Date(orderDate);
  estStartDate.setDate(estStartDate.getDate() + 3);
  const estEndDate = new Date(orderDate);
  estEndDate.setDate(estEndDate.getDate() + 5);

  const formatEstStart = estStartDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const formatEstEnd = estEndDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const estimatedDeliveryString = `${formatEstStart} - ${formatEstEnd}`;

  // ✅ FORMAT ADDRESS TO AVOID EMPTY COMMAS
  const address = orderData.shippingAddress;
  const addressParts = [
    address.flat,
    address.area,
    address.city,
    address.state
  ].filter(part => part && part.trim() !== ""); // Filter out empty strings
  
  const formattedAddress = addressParts.join(', ');
  const finalAddress = formattedAddress ? `${formattedAddress} - ${address.pincode}` : `Pincode: ${address.pincode}`;

  const getImageUrl = (imgPath) => {
    if (!imgPath) return 'https://via.placeholder.com/300?text=No+Image';
    return imgPath.startsWith('http') ? imgPath : `http://localhost:5000${imgPath}`;
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-[900px]">
        
        {/* ================= PROGRESS BAR ================= */}
        <div className="flex justify-center items-center mb-10 w-full max-w-lg mx-auto relative">
          <div className="absolute top-4 left-0 w-full h-[3px] bg-[#009e3e] z-0"></div>
          <div className="flex flex-col items-center z-10 w-1/3">
            <div className="w-8 h-8 rounded-full bg-[#009e3e] text-white flex items-center justify-center font-bold text-sm"><FiCheck size={18} /></div>
            <span className="text-xs font-bold text-black mt-2">Cart</span>
          </div>
          <div className="flex flex-col items-center z-10 w-1/3">
            <div className="w-8 h-8 rounded-full bg-[#009e3e] text-white flex items-center justify-center font-bold text-sm"><FiCheck size={18} /></div>
            <span className="text-xs font-bold text-black mt-2">Checkout</span>
          </div>
          <div className="flex flex-col items-center z-10 w-1/3">
            <div className="w-8 h-8 rounded-full bg-[#009e3e] text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">3</div>
            <span className="text-xs font-bold text-black mt-2">Order Placed</span>
          </div>
        </div>

        {/* ================= HERO SECTION ================= */}
        <div className="text-center mb-10 relative">
          <div className="w-24 h-24 bg-[#009e3e] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
            <FiCheck className="text-white text-5xl stroke-[3]" />
          </div>
          <h1 className="text-4xl font-black text-black mb-3">
            Order Placed <span className="text-[#009e3e]">Successfully!</span>
          </h1>
          <p className="text-gray-600 text-[15px]">
            Thank you for choosing <span className="font-bold text-[#009e3e]">i7NUTRITION</span><br/>
            Your order has been confirmed and is being processed.
          </p>
        </div>

        {/* ================= ORDER INFO CARDS ================= */}
        <div className="bg-[#f0fdf4] rounded-xl p-4 flex flex-col md:flex-row justify-between items-center mb-6 border border-green-100">
          
          <div className="flex items-center gap-4 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-green-200 pb-4 md:pb-0 mb-4 md:mb-0">
            <div className="bg-white p-2 rounded-full shadow-sm"><FiFileText className="text-black" size={20}/></div>
            <div>
              <p className="text-xs text-gray-500">Order Number</p>
              <div className="flex items-center gap-2">
                <p className="font-bold text-black text-[15px]">#{orderNumber}</p>
                <FiCopy className="text-gray-400 cursor-pointer hover:text-black" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-1/3 md:pl-6 border-b md:border-b-0 md:border-r border-green-200 pb-4 md:pb-0 mb-4 md:mb-0">
             <div className="bg-white p-2 rounded-full shadow-sm"><FiCalendar className="text-black" size={20}/></div>
             <div>
              <p className="text-xs text-gray-500">Order Date</p>
              <p className="font-bold text-black text-[15px]">{formattedDate}</p>
              <p className="text-[10px] text-gray-500">{formattedTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-1/3 md:pl-6">
             <div className="bg-white p-2 rounded-full shadow-sm"><FiCreditCard className="text-black" size={20}/></div>
             <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="font-bold text-black text-[15px]">{orderData.paymentMethod}</p>
              {orderData.paymentMethod === 'Cash on Delivery' && (
                <p className="text-[10px] text-gray-500">₹{orderData.codCharge} COD Charges</p>
              )}
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-6">
            
            {/* Order Items Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#009e3e] p-1.5 rounded-full text-white"><FiShoppingBag size={14}/></div>
                <h2 className="font-bold text-lg text-black">Order Items ({orderData.items.length})</h2>
              </div>
              
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="w-24 h-28 bg-[#f4f7f6] rounded-lg p-2 flex-shrink-0">
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[16px] text-black leading-tight">{item.name}</h3>
                      
                      <div className="flex items-end justify-between mt-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-black">₹{item.price}</span>
                            <span className="text-sm text-gray-400 line-through">₹{Math.round(item.price * 1.5)}</span>
                            <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">43% OFF</span>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-black">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[#009e3e] p-1.5 rounded-full text-white"><FiMapPin size={14}/></div>
                <h2 className="font-bold text-lg text-black">Delivery Details</h2>
              </div>
              <div className="ml-8">
                <p className="font-bold text-black text-[15px]">{address.name}</p>
                {/* ✅ FIXED ADDRESS FORMATTING */}
                <p className="text-sm text-gray-600 mt-1">{finalAddress}</p>
                <p className="text-sm text-gray-600 mt-1">Mobile: {orderData.userPhone}</p>
              </div>
            </div>

            {/* Estimated Delivery Tracker */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-[#009e3e] p-1.5 rounded-full text-white"><FiTruck size={14}/></div>
                  <h2 className="font-bold text-lg text-black">Estimated Delivery</h2>
                </div>
                <span className="bg-[#eaf5ee] text-[#009e3e] text-xs font-bold px-3 py-1 rounded-md">3-5 Days</span>
              </div>
              
              {/* ✅ DYNAMIC ESTIMATED DELIVERY STRING */}
              <p className="text-xl font-bold text-[#009e3e] mb-1 ml-8">{estimatedDeliveryString}</p>
              <p className="text-xs text-gray-500 mb-8 ml-8">We will notify you via SMS/Email once your order is shipped.</p>

              {/* Progress Tracker */}
              <div className="relative flex justify-between items-center ml-4 mr-4">
                <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 z-0"></div>
                <div className="absolute top-4 left-0 w-1/4 h-[2px] bg-[#009e3e] z-0"></div>

                <div className="flex flex-col items-center z-10 w-1/4">
                  <div className="w-8 h-8 rounded-full bg-[#009e3e] text-white flex items-center justify-center font-bold text-sm border-2 border-white">
                    <FiCheck size={16} />
                  </div>
                  <span className="text-[11px] font-bold text-black mt-2 text-center">Order<br/>Confirmed</span>
                  <span className="text-[10px] text-gray-500 mt-1 text-center">{formattedDate}<br/>{formattedTime}</span>
                </div>

                <div className="flex flex-col items-center z-10 w-1/4">
                  <div className="w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center font-bold text-sm border-2 border-gray-200">
                    <FiTool size={14} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 mt-2 text-center">Processing</span>
                </div>

                <div className="flex flex-col items-center z-10 w-1/4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm border-2 border-white">
                    <FiBox size={14} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 mt-2 text-center">Shipped</span>
                </div>

                <div className="flex flex-col items-center z-10 w-1/4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm border-2 border-white">
                    <FiHome size={14} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 mt-2 text-center">Out for Delivery</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-[320px] space-y-6">
            
            {/* Order Summary Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h2 className="font-bold text-lg text-black mb-4 border-b pb-3">Order Summary</h2>
              
              <div className="space-y-3 text-[14px]">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">₹{orderData.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">Shipping <FiTool className="text-gray-400 text-xs"/></span>
                  {orderData.shippingCharge === 0 ? (
                    <span className="font-bold text-[#009e3e]">FREE</span>
                  ) : (
                    <span className="font-bold text-black">₹{orderData.shippingCharge}</span>
                  )}
                </div>
                {orderData.codCharge > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>COD Charges</span>
                    <span className="font-bold text-black">₹{orderData.codCharge}</span>
                  </div>
                )}
                {orderData.discount > 0 && (
                  <div className="flex justify-between text-[#009e3e]">
                    <span>Coupon Discount</span>
                    <span className="font-bold">- ₹{orderData.discount}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-black">Total Amount</span>
                  <span className="font-black text-xl text-black">₹{total}</span>
                </div>
                <p className="text-[11px] text-gray-500 text-right mt-1">(Inclusive of all taxes)</p>
              </div>
            </div>

            {/* Logo & Trust Banner */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center">
               <div className="flex items-center gap-1 mb-6">
                 <span className="text-2xl font-black italic text-black"><span className="text-[#009e3e]">i7</span> NUTRITION</span>
               </div>
               
               <div className="grid grid-cols-4 gap-2 w-full text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#f0fdf4] text-[#009e3e] flex items-center justify-center mb-2"><MdVerified size={20}/></div>
                    <span className="text-[9px] font-bold text-black leading-tight">100%<br/>Authentic</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#f0fdf4] text-[#009e3e] flex items-center justify-center mb-2"><FiTruck size={20}/></div>
                    <span className="text-[9px] font-bold text-black leading-tight">Fast<br/>Delivery</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#f0fdf4] text-[#009e3e] flex items-center justify-center mb-2"><FiTool size={20}/></div>
                    <span className="text-[9px] font-bold text-black leading-tight">Lab<br/>Tested</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#f0fdf4] text-[#009e3e] flex items-center justify-center mb-2"><FiHeadphones size={20}/></div>
                    <span className="text-[9px] font-bold text-black leading-tight">24/7<br/>Support</span>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* ================= BOTTOM ACTION BUTTONS ================= */}
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <Link to="/track-order" className="flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-[#009e3e] text-black px-4 py-2.5 rounded-lg font-bold text-sm transition-colors">
            <FiBox /> Track Order
          </Link>
          <Link to="/" className="flex items-center gap-2 bg-[#009e3e] hover:bg-[#008233] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
            <FiShoppingBag /> Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;