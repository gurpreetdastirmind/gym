import { FiCheck } from 'react-icons/fi';
// Import your logo image
import logo from '../../images/logoi7.png'; 

const Footer = () => {
  return (
    <footer className="bg-[#0b100c] text-white pt-16 pb-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* ================= TOP SECTION (Logo & Tagline) ================= */}
        <div className="flex flex-col items-center mb-10">
          
          {/* Main Logo Row */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {/* The i7 Image Logo */}
            <img src={logo} alt="i7" className="h-10 md:h-12 object-contain" />
            
            {/* The Text Logo with Registered Symbol */}
            <h2 className="text-3xl md:text-[38px] font-black tracking-tight text-white flex items-start leading-none">
              NUTRITION
              <span className="text-sm md:text-lg font-bold ml-1 mt-0.5 md:mt-1">®</span>
            </h2>
          </div>

          {/* Tagline */}
          <p className="text-[10px] md:text-[11px] font-bold tracking-[0.25em] mt-1 uppercase text-gray-400">
            FUEL YOUR <span className="text-[#00E600]">WELLNESS</span>
          </p>
        </div>

        {/* ================= MIDDLE SECTION (3 Columns) ================= */}
        <div className="w-full border-t border-[#1f2e22] border-b border-[#1f2e22] py-12 mb-8">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
            
            {/* Column 1: Description Text (Left) */}
            <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left w-full md:w-[30%]">
              <p className="text-[14px] md:text-[15px] text-gray-200 leading-relaxed font-medium">
                Premium supplements for a stronger,<br className="hidden md:block" /> healthier, better you.
              </p>
            </div>

            {/* Column 2: Disclaimer (Center with Vertical Lines) */}
            <div className="flex flex-col justify-center items-center text-center md:border-x border-[#1f2e22] py-6 md:py-0 px-8 w-full md:w-[40%] h-full">
              <h3 className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.1em] text-[#00E600] leading-[1.8]">
                OUR BRAND DOESN'T PROMOTE ANY <br className="hidden md:block" />
                INFLUENCER OR CELEBRITY <br className="hidden md:block" />
                ENDORSEMENTS.
              </h3>
            </div>

            {/* Column 3: Checkmarks (Right) */}
            <div className="flex flex-col justify-center items-center md:items-start gap-4 w-full md:w-[25%] md:pl-10">
              <span className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold tracking-wider text-white uppercase">
                <FiCheck className="text-[#00E600] stroke-[3] text-lg" /> TOP QUALITY
              </span>
              <span className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold tracking-wider text-white uppercase">
                <FiCheck className="text-[#00E600] stroke-[3] text-lg" /> YOUR SAFETY
              </span>
              <span className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold tracking-wider text-white uppercase">
                <FiCheck className="text-[#00E600] stroke-[3] text-lg" /> YOUR TRUST
              </span>
            </div>

          </div>
        </div>

        {/* ================= BOTTOM SECTION (Links & Copyright) ================= */}
        <div className="w-full flex flex-col items-center gap-6">
          
          {/* Links Row */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[11px] md:text-[13px] text-gray-400 font-medium">
            <a href="#" className="hover:text-[#00E600] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#00E600] transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-[#00E600] transition-colors">Shipping Policy</a>
            <a href="#" className="hover:text-[#00E600] transition-colors">Refund Policy</a>
            <a href="/contact-support" className="hover:text-[#00E600] transition-colors">Contact Us</a>
            
          </div>

          {/* Copyright Text */}
          <p className="text-[10px] text-gray-500 text-center">
            © {new Date().getFullYear()} i7 NUTRITION. All rights reserved AstiMind Software Solutions.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;