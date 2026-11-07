const TrustBadges = () => {
  return (
    <div className="hidden md:flex justify-center items-center gap-8 py-2 text-[10px] font-bold text-gray-600 border-b bg-gray-50 uppercase tracking-wider">
      <div className="flex items-center gap-1">
        <span className="text-i7green text-lg">✔</span> ISO 9001:2015 CERTIFIED
      </div>
      <div className="flex items-center gap-1">
        <span className="text-i7green text-lg">✔</span> FDA REGISTERED FACILITY
      </div>
      <div className="flex items-center gap-1">
        <span className="text-i7green text-lg">✔</span> 3rd Party Tested
      </div>
      <div className="flex items-center gap-1">
        <span className="text-i7green text-lg">✔</span> GMP CERTIFIED
      </div>
      <div className="flex items-center gap-1">
        <span className="text-i7green text-lg">✔</span> HACCP
      </div>
    </div>
  );
};

export default TrustBadges;