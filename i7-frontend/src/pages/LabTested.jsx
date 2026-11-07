import { FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

const LabTested = () => {
  const products = [
    {
      name: "Vitamin D3 K2 MK-7",
      image: "https://i.imgur.com/8Q5wX6p.png", // Replace with your actual image path
    },
    {
      name: "Creatine Monohydrate",
      image: "https://i.imgur.com/8Q5wX6p.png",
    },
    {
      name: "Whey Protein Isolate",
      image: "https://i.imgur.com/8Q5wX6p.png",
    },
    {
      name: "Magnesium Glycinate",
      image: "https://i.imgur.com/8Q5wX6p.png",
    },
    {
      name: "Calcium Citrate + D3 + K2",
      image: "https://i.imgur.com/8Q5wX6p.png",
    },
    {
      name: "Pea Protein Isolate",
      image: "https://i.imgur.com/8Q5wX6p.png",
    }
  ];

  return (
    <div className="bg-white min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-[700px]">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <a href="/" className="hover:text-[#009e3e]">Home</a>
          <FiChevronRight />
          <span className="text-[#009e3e]">Lab Tested</span>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-black text-black mb-2">Lab Tested</h1>
            <h2 className="text-xl font-bold text-[#009e3e] mb-3">Safety. Quality. Transparency.</h2>
            <p className="text-gray-600 text-sm max-w-md leading-relaxed">
              At i7 Nutrition, every product goes through strict quality checks and is tested in NABL-accredited, independent third-party labs to ensure purity, safety and accurate nutrition.
            </p>
          </div>
          
          {/* Custom Flask Icon */}
          <div className="hidden md:block text-[#009e3e]">
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3h6M10 3v6l-5.3 9.3c-.7 1.2.2 2.7 1.6 2.7h11.4c1.4 0 2.3-1.5 1.6-2.7L14 9V3" />
              <path d="M8 14h8" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </div>
        </div>

        {/* 4 Badges Row */}
        <div className="bg-[#eaf5ee] rounded-xl p-4 flex justify-between items-center mb-8 border border-[#d0ebd9]">
          
          <div className="flex flex-col items-center text-center w-1/4">
            <div className="w-12 h-12 rounded-full border-2 border-[#009e3e] flex items-center justify-center mb-2 bg-white">
              <MdVerified className="text-[#009e3e] text-2xl" />
            </div>
            <span className="text-[10px] font-bold text-black uppercase leading-tight">NO MELAMINE<br/>SPIKING</span>
          </div>

          <div className="flex flex-col items-center text-center w-1/4">
            <div className="w-12 h-12 rounded-full border-2 border-[#009e3e] flex items-center justify-center mb-2 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#009e3e]"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <span className="text-[10px] font-bold text-black uppercase leading-tight">NO AFLATOXINS</span>
          </div>

          <div className="flex flex-col items-center text-center w-1/4">
            <div className="w-12 h-12 rounded-full border-2 border-[#009e3e] flex items-center justify-center mb-2 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#009e3e]"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="m2 2 20 20"/></svg>
            </div>
            <span className="text-[10px] font-bold text-black uppercase leading-tight">NO PESTICIDES</span>
          </div>

          <div className="flex flex-col items-center text-center w-1/4">
            <div className="w-12 h-12 rounded-full border-2 border-[#009e3e] flex items-center justify-center mb-2 bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#009e3e]"><path d="M9 3h6M10 3v6l-5.3 9.3c-.7 1.2.2 2.7 1.6 2.7h11.4c1.4 0 2.3-1.5 1.6-2.7L14 9V3"/><path d="M8 14h8"/></svg>
            </div>
            <span className="text-[10px] font-bold text-black uppercase leading-tight">3RD PARTY<br/>LAB TESTED</span>
          </div>

        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button className="w-1/2 text-left pb-3 font-bold text-lg text-[#009e3e] border-b-4 border-[#009e3e]">
            Lab Test Reports
          </button>
          <button className="w-1/2 text-right pb-3 font-semibold text-lg text-gray-500 flex items-center justify-end gap-1 hover:text-black">
            Our Testing Process <FiChevronRight />
          </button>
        </div>

        {/* Product List */}
        <div className="flex flex-col gap-4 mb-8">
          {products.map((prod, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
              
              <div className="flex items-center gap-4">
                {/* Product Image */}
                <div className="w-16 h-16 bg-[#f4f7f6] rounded-lg flex items-center justify-center p-1">
                   <img src={prod.image} alt={prod.name} className="max-h-full object-contain mix-blend-multiply" />
                </div>
                
                {/* Product Details */}
                <div>
                  <h4 className="font-bold text-[15px] text-black mb-1">{prod.name}</h4>
                  <p className="text-[13px] text-[#009e3e] font-medium flex items-center gap-1">
                    <FiCheckCircle className="fill-[#009e3e] text-white" /> Lab Tested
                  </p>
                </div>
              </div>

              {/* Button */}
              <button className="text-sm border-2 border-[#009e3e] text-[#009e3e] px-4 py-2 rounded-lg font-bold hover:bg-[#009e3e] hover:text-white transition-colors flex items-center gap-1">
                View Lab Report <FiChevronRight />
              </button>

            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#eaf5ee] rounded-xl p-6 flex items-start md:items-center gap-5 border border-[#d0ebd9]">
          {/* Document Icon */}
          <div className="text-[#009e3e] flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-black mb-1">Transparent & Verified</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Our lab test reports are from NABL-accredited independent labs. We believe in complete transparency so you can use our products with confidence.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LabTested;