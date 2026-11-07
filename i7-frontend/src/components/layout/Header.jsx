import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiMapPin, FiMenu, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import MobileSidebar from './MobileSidebar';

import logo from '../../images/logoi7.png'; 
import fda from '../../images/fda.png';
import iso from '../../images/iso.png';
import party from '../../images/3rdparty.png';
import gmp from '../../images/gmp.png';
import hccp from '../../images/hccp.png';

const Header = () => {
  const { cartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-40 font-sans">
      
      {/* ================= TOP BAR (Black Background) ================= */}
      <div className="bg-black text-white border-b border-gray-800">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center gap-4">
          
          {/* Left Side: Hamburger Menu & Logo Text */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* REMOVED md:hidden so it shows on web too */}
            <FiMenu 
              className="text-2xl md:text-3xl cursor-pointer text-white hover:text-[#00E600] transition-colors" 
              onClick={() => setIsSidebarOpen(true)} 
            />
            
            <Link to="/" className="flex items-center gap-2">
               <img src={logo} alt="i7" className="h-8 md:h-10 object-contain" />
               <div className="hidden sm:flex flex-col justify-center mt-0.5">
                 <span className="text-lg md:text-[20px] font-black tracking-wide leading-none text-white">
                   NUTRITION<sup className="text-[8px] ml-0.5">®</sup>
                 </span>
                 <span className="text-[7px] md:text-[8px] text-gray-300 font-bold tracking-[0.15em] mt-1">
                   FUEL YOUR WELLNESS
                 </span>
               </div>
            </Link>
          </div>

          {/* Middle: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl relative mx-6">
            <input 
              type="text" 
              placeholder="Search supplements, wellness & more..." 
              className="w-full bg-white text-black rounded-full py-2 px-5 pr-12 text-sm focus:outline-none placeholder-gray-400"
            />
            <FiSearch className="absolute right-5 top-2.5 text-black text-lg" />
          </div>

          {/* Right Side: Location & Cart */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-white cursor-pointer">
              <FiMapPin className="text-[#2e8b57] text-2xl" />
              <span className="leading-tight text-[10px] text-gray-300">Deliver to<br/>
                <strong className="text-white text-[12px]">India</strong>
              </span>
              <FiChevronDown className="ml-1 text-white text-xs" />
            </div>
            
            <FiSearch className="md:hidden text-xl text-white" />

            <Link to="/cart" className="relative cursor-pointer text-white mr-2">
              <FiShoppingCart className="text-[26px]" />
              <span className="absolute -top-1.5 -right-2 bg-[#00E600] text-white text-[9px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center border-2 border-black">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= CERTIFICATION BAR ================= */}
      <div className="bg-black text-white py-3 border-b border-gray-800">
        <div className="container mx-auto px-4 flex items-center justify-start md:justify-center overflow-x-auto hide-scrollbar">
          
          <div className="flex items-center gap-2 px-4 md:px-6 border-r border-[#333] min-w-max">
             <img src={logo} alt="i7" className="h-7 md:h-8 object-contain" />
             <span className="leading-tight text-[10px] md:text-[11px] font-bold tracking-wide">
                NUTRITION<sup className="text-[6px]">®</sup><br/>
                <span className="text-[#d4af37]">Trusted Brand</span>
             </span>
          </div>

          <div className="flex items-center px-4 md:px-6 border-r border-[#333] min-w-max">
             <img src={iso} alt="ISO" className="h-8 md:h-10 w-auto object-contain" />
          </div>

          <div className="flex items-center px-4 md:px-6 border-r border-[#333] min-w-max">
             <img src={fda} alt="FDA" className="h-8 md:h-10 w-auto object-contain" />
          </div>

          <div className="flex items-center px-4 md:px-6 border-r border-[#333] min-w-max">
             <img src={party} alt="3rd Party" className="h-8 md:h-10 w-auto object-contain" />
          </div>

          <div className="flex items-center px-4 md:px-6 border-r border-[#333] min-w-max">
             <img src={gmp} alt="GMP" className="h-8 md:h-10 w-auto object-contain" />
          </div>

          <div className="flex items-center px-4 md:px-6 min-w-max">
             <img src={hccp} alt="HACCP" className="h-8 md:h-10 w-auto object-contain" />
          </div>

        </div>
      </div>

      <MobileSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </header>
  );
};

export default Header;