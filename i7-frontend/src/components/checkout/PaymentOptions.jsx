const PaymentOptions = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Select Payment Method</h2>
      <div className="space-y-4">
        <label className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-i7green bg-green-50' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-i7green w-4 h-4" />
            <div>
              <span className="font-semibold block text-gray-800">Online Payment (Recommended)</span>
              <span className="text-xs text-gray-500">UPI, PhonePe, GPay, Paytm, Cards</span>
            </div>
          </div>
        </label>
        
        <label className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-i7green bg-green-50' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-i7green w-4 h-4" />
            <div>
              <span className="font-semibold block text-gray-800">Cash on Delivery (COD)</span>
              <span className="text-xs text-gray-500">Pay when you receive your order (+₹55)</span>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default PaymentOptions;