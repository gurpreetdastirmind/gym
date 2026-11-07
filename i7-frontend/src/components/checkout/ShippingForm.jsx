const ShippingForm = ({ formData, setFormData }) => {
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Shipping Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Full Name *" className="border p-3 rounded-lg focus:border-i7green focus:outline-none" />
        <input required name="mobile" value={formData.mobile} onChange={handleChange} type="tel" placeholder="Mobile Number *" className="border p-3 rounded-lg focus:border-i7green focus:outline-none" />
        <input required name="pincode" value={formData.pincode} onChange={handleChange} type="text" placeholder="Pincode *" className="border p-3 rounded-lg focus:border-i7green focus:outline-none" />
        <input required name="flat" value={formData.flat} onChange={handleChange} type="text" placeholder="Flat / House No. *" className="border p-3 rounded-lg focus:border-i7green focus:outline-none" />
        <input required name="area" value={formData.area} onChange={handleChange} type="text" placeholder="Area / Street / Locality *" className="border p-3 rounded-lg focus:border-i7green focus:outline-none md:col-span-2" />
        <input required name="city" value={formData.city} onChange={handleChange} type="text" placeholder="City *" className="border p-3 rounded-lg focus:border-i7green focus:outline-none" />
        <input required name="state" value={formData.state} onChange={handleChange} type="text" placeholder="State *" className="border p-3 rounded-lg focus:border-i7green focus:outline-none" />
      </div>
    </div>
  );
};

export default ShippingForm;