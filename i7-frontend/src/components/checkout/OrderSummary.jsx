const OrderSummary = ({ cart, cartTotal, codCharges, igst, finalTotal }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-24">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Order Summary ({cart.length} Items)</h2>
      
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600 truncate mr-2">{item.name} <strong className="text-gray-800">x{item.quantity}</strong></span>
            <span className="font-medium text-gray-800">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm border-t pt-4">
        <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="text-gray-800">₹{cartTotal}</span></div>
        <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-i7green font-semibold">Free</span></div>
        {codCharges > 0 && (
           <div className="flex justify-between text-gray-600"><span>COD Charges</span><span className="text-gray-800">₹{codCharges}</span></div>
        )}
        <div className="flex justify-between text-gray-600"><span>IGST (5%)</span><span className="text-gray-800">₹{igst}</span></div>
      </div>

      <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg mb-6 text-gray-900">
        <span>Total Amount</span>
        <span>₹{finalTotal}</span>
      </div>

      <button type="submit" className="w-full bg-i7green text-white py-3 rounded-md font-bold hover:bg-green-800 flex justify-center items-center gap-2 shadow-md">
        PLACE ORDER ₹{finalTotal}
      </button>
      <p className="text-[10px] text-gray-500 text-center mt-3">Inclusive of all taxes. Secure & Encrypted Payments.</p>
    </div>
  );
};

export default OrderSummary;